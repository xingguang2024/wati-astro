import { createGoogleGenerativeAI } from "@ai-sdk/google";
import {
  type LanguageModel,
  type UIMessageStreamWriter,
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateText,
  Output,
  streamText,
  tool,
} from "ai";
import { type SlateEditor, createSlateEditor, nanoid } from "platejs";
import { z } from "zod";

import type { ChatMessage, ToolName } from "@/components/editor/use-chat";
import type { APIRoute } from "astro";

import { BaseEditorKit } from "@/components/editor/editor-base-kit";
import {
  buildEditTableMultiCellPrompt,
  getChooseToolPrompt,
  getCommentPrompt,
  getEditPrompt,
  getGeneratePrompt,
} from "@/lib/command/prompt";
import { markdownJoinerTransform } from "@/lib/markdown-joiner-transform";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const {
    apiKey,
    ctx,
    messages: messagesRaw,
    model: modelName = "gemini-2.5-flash",
  } = await request.json();

  const { children, selection, toolName: toolNameParam } = ctx;

  const editor = createSlateEditor({
    plugins: BaseEditorKit,
    selection,
    value: children,
  });

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Missing Google API key." }),
      { status: 401, headers: { "Content-Type": "application/json" } },
    );
  }

  const isSelecting = editor.api.isExpanded();

  const google = createGoogleGenerativeAI({
    apiKey,
  });

  try {
    const stream = createUIMessageStream<ChatMessage>({
      execute: async ({ writer }) => {
        let toolName = toolNameParam;

        if (!toolName) {
          const prompt = getChooseToolPrompt({
            isSelecting,
            messages: messagesRaw,
          });

          const enumOptions = isSelecting
            ? ["generate", "edit", "comment"]
            : ["generate", "comment"];
          const modelId = modelName || "gemini-2.5-flash";

          const { output: AIToolName } = (await generateText({
            model: google(modelId) as any,
            output: (Output as any).choice({ options: enumOptions }),
            prompt,
          } as any)) as any;

          writer.write({
            data: AIToolName as ToolName,
            type: "data-toolName",
          });

          toolName = AIToolName;
        }

        const stream = streamText({
          experimental_transform: markdownJoinerTransform(),
          model: google(modelName || "gemini-2.5-flash") as any,
          // Not used
          prompt: "",
          tools: {
            comment: getCommentTool(editor, {
              messagesRaw,
              model: google(modelName || "gemini-2.5-flash") as any,
              writer,
            }),
            table: getTableTool(editor, {
              messagesRaw,
              model: google(modelName || "gemini-2.5-flash") as any,
              writer,
            }),
          },
          prepareStep: async (step) => {
            if (toolName === "comment") {
              return {
                ...step,
                toolChoice: { toolName: "comment", type: "tool" },
              };
            }

            if (toolName === "edit") {
              const [editPrompt, editType] = getEditPrompt(editor, {
                isSelecting,
                messages: messagesRaw,
              });

              // Table editing uses the table tool
              if (editType === "table") {
                return {
                  ...step,
                  toolChoice: { toolName: "table", type: "tool" },
                };
              }

              return {
                ...step,
                activeTools: [],
                model:
                  editType === "selection"
                    ? //The selection task is more challenging, so we chose to use Gemini 2.5 Flash.
                    google(modelName || "gemini-2.5-flash") as any
                    : google(modelName || "gemini-2.5-flash") as any,
                messages: [
                  {
                    content: editPrompt,
                    role: "user",
                  },
                ],
              };
            }

            if (toolName === "generate") {
              const generatePrompt = getGeneratePrompt(editor, {
                isSelecting,
                messages: messagesRaw,
              });

              return {
                ...step,
                activeTools: [],
                messages: [
                  {
                    content: generatePrompt,
                    role: "user",
                  },
                ],
                model: google(modelName || "gemini-2.5-flash") as any,
              };
            }
          },
        });

        writer.merge(stream.toUIMessageStream({ sendFinish: false }));
      },
    });

    return createUIMessageStreamResponse({ stream });
  } catch {
    return new Response(
      JSON.stringify({ error: "Failed to process AI request" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};

const getCommentTool = (
  editor: SlateEditor,
  {
    messagesRaw,
    model,
    writer,
  }: {
    messagesRaw: ChatMessage[];
    model: LanguageModel;
    writer: UIMessageStreamWriter<ChatMessage>;
  },
) =>
  (tool as any)({
    description: "Comment on the content",
    inputSchema: z.object({}) as any,
    strict: true,
    execute: async () => {
      const commentSchema = z.object({
        blockId: z
          .string()
          .describe(
            "The id of the starting block. If the comment spans multiple blocks, use the id of the first block.",
          ),
        comment: z
          .string()
          .describe("A brief comment or explanation for this fragment."),
        content: z
          .string()
          .describe(
            String.raw`The original document fragment to be commented on.It can be the entire block, a small part within a block, or span multiple blocks. If spanning multiple blocks, separate them with two \n\n.`,
          ),
      });

      const { experimental_partialOutputStream: partialOutputStream } =
        streamText({
          model,
          experimental_output: (Output as any).array({
            element: commentSchema,
          }),
          prompt: getCommentPrompt(editor, {
            messages: messagesRaw,
          }),
        }) as any;

      let lastLength = 0;

      for await (const partialArray of partialOutputStream) {
        for (let i = lastLength; i < partialArray.length; i++) {
          const comment = partialArray[i];
          const commentDataId = nanoid();

          writer.write({
            id: commentDataId,
            data: {
              comment,
              status: "streaming",
            },
            type: "data-comment",
          });
        }

        lastLength = partialArray.length;
      }

      writer.write({
        id: nanoid(),
        data: {
          comment: null,
          status: "finished",
        },
        type: "data-comment",
      });
    },
  });

const getTableTool = (
  editor: SlateEditor,
  {
    messagesRaw,
    model,
    writer,
  }: {
    messagesRaw: ChatMessage[];
    model: LanguageModel;
    writer: UIMessageStreamWriter<ChatMessage>;
  },
) =>
  (tool as any)({
    description: "Edit table cells",
    inputSchema: z.object({}) as any,
    strict: true,
    execute: async () => {
      const cellUpdateSchema = z.object({
        content: z
          .string()
          .describe(
            String.raw`The new content for the cell. Can contain multiple paragraphs separated by \n\n.`,
          ),
        id: z.string().describe("The id of the table cell to update."),
      });

      const { experimental_partialOutputStream: partialOutputStream } =
        streamText({
          model,
          experimental_output: (Output as any).array({
            element: cellUpdateSchema,
          }),
          prompt: buildEditTableMultiCellPrompt(editor, messagesRaw),
        }) as any;

      let lastLength = 0;

      for await (const partialArray of partialOutputStream) {
        for (let i = lastLength; i < partialArray.length; i++) {
          const cellUpdate = partialArray[i];

          writer.write({
            id: nanoid(),
            data: {
              cellUpdate,
              status: "streaming",
            },
            type: "data-table",
          });
        }

        lastLength = partialArray.length;
      }

      writer.write({
        id: nanoid(),
        data: {
          cellUpdate: null,
          status: "finished",
        },
        type: "data-table",
      });
    },
  });
