/**
 * Plate AI Markdown Editor Component
 *
 * A rich text editor with AI assistance powered by Plate.js and Google AI
 */

import {
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  StrikethroughPlugin,
  CodePlugin,
  H1Plugin,
  H2Plugin,
  H3Plugin,
  BlockquotePlugin,
} from '@platejs/basic-nodes/react';
import { CodeBlockPlugin } from '@platejs/code-block/react';
import {
  Plate,
  PlateContent,
  PlateElement,
  usePlateEditor,
  type PlateElementProps,
} from 'platejs/react';
import { useState } from 'react';
import * as slate from 'slate';

import type { Value } from 'platejs';

// Types
interface PlateEditorProps {
  initialValue?: Value;
  onChange?: (value: Value) => void;
  openAIApiKey?: string;
  placeholder?: string;
  className?: string;
}

// Custom element components
function H1Element(props: PlateElementProps) {
  return (
    <PlateElement
      as="h1"
      className="text-4xl font-bold mt-8 mb-4 text-zinc-900"
      {...props}
    />
  );
}

function H2Element(props: PlateElementProps) {
  return (
    <PlateElement
      as="h2"
      className="text-3xl font-bold mt-6 mb-3 text-zinc-900"
      {...props}
    />
  );
}

function H3Element(props: PlateElementProps) {
  return (
    <PlateElement
      as="h3"
      className="text-2xl font-bold mt-4 mb-2 text-zinc-900"
      {...props}
    />
  );
}

function BlockquoteElement(props: PlateElementProps) {
  return (
    <PlateElement
      as="blockquote"
      className="border-l-4 border-zinc-300 pl-4 py-1 my-4 text-zinc-600 italic"
      {...props}
    />
  );
}

function CodeBlockElement(props: PlateElementProps) {
  return (
    <PlateElement
      as="pre"
      className="bg-zinc-100 rounded-lg p-4 my-4 overflow-x-auto font-mono text-sm"
      {...props}
    />
  );
}

// Toolbar button component
interface ToolbarButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  tooltip?: string;
  isActive?: boolean;
  disabled?: boolean;
}

function ToolbarButton({
  onClick,
  children,
  tooltip,
  isActive,
  disabled,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
        isActive
          ? 'bg-zinc-900 text-white'
          : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {children}
    </button>
  );
}

// AI Assistant component
interface AIAssistantProps {
  onGenerate: (prompt: string) => void;
  isLoading?: boolean;
}

function AIAssistant({ onGenerate, isLoading }: AIAssistantProps) {
  const [prompt, setPrompt] = useState('');
  const [showPanel, setShowPanel] = useState(false);

  const aiActions = [
    {
      name: '继续写作',
      prompt: '继续写作，保持相同的风格和语调。',
      icon: '✍️',
    },
    {
      name: '润色内容',
      prompt: '改善写作质量、清晰度和流畅度，保持原意不变。',
      icon: '✨',
    },
    {
      name: '精简内容',
      prompt: '使内容更简洁，保留关键要点。',
      icon: '📝',
    },
    {
      name: '扩展内容',
      prompt: '用更多细节和示例扩展内容。',
      icon: '📄',
    },
    {
      name: '修正语法',
      prompt: '修正任何语法、拼写和标点符号错误。',
      icon: '🔧',
    },
    {
      name: '改变语气',
      prompt: '用更专业的语气重写这段内容。',
      icon: '🎭',
    },
    {
      name: '生成摘要',
      prompt: '总结这段内容的关键要点。',
      icon: '📋',
    },
  ];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowPanel(!showPanel)}
        disabled={isLoading}
        className="px-3 py-1.5 rounded text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors disabled:opacity-50 flex items-center gap-2"
      >
        <span>🤖</span>
        <span>AI 助手</span>
      </button>

      {showPanel && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-zinc-200 p-4 z-50">
          <h3 className="font-semibold text-zinc-900 mb-3">AI 操作</h3>

          <div className="grid grid-cols-2 gap-2 mb-3">
            {aiActions.map((action) => (
              <button
                key={action.name}
                type="button"
                onClick={() => {
                  onGenerate(action.prompt);
                  setShowPanel(false);
                }}
                disabled={isLoading}
                className="flex flex-col items-center gap-1 p-3 rounded-lg bg-zinc-50 hover:bg-zinc-100 transition-colors disabled:opacity-50"
              >
                <span className="text-2xl">{action.icon}</span>
                <span className="text-xs text-zinc-700">{action.name}</span>
              </button>
            ))}
          </div>

          <div className="space-y-3 border-t border-zinc-200 pt-3">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="描述你希望 AI 做什么..."
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              rows={3}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  onGenerate(prompt);
                  setShowPanel(false);
                }}
                disabled={isLoading || !prompt.trim()}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 text-sm"
              >
                {isLoading ? '生成中...' : '生成'}
              </button>
              <button
                type="button"
                onClick={() => setShowPanel(false)}
                className="px-4 py-2 bg-zinc-200 text-zinc-700 rounded-lg hover:bg-zinc-300 transition-colors text-sm"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Main editor component
export default function PlateEditor({
  initialValue,
  onChange,
  openAIApiKey,
  placeholder = 'Type your amazing content here...',
  className = '',
}: PlateEditorProps) {
  const [isAILoading, setIsAILoading] = useState(false);

  const defaultInitialValue: Value = [
    {
      type: 'h1',
      children: [{ text: '欢迎使用 Astra 博客编辑器' }],
    },
    {
      type: 'p',
      children: [
        { text: '在这里开始创作你的内容。试试 ' },
        { text: '粗体', bold: true },
        { text: '、' },
        { text: '斜体', italic: true },
        { text: '和 ' },
        { text: '下划线', underline: true },
        { text: ' 格式。' },
      ],
    },
    {
      type: 'blockquote',
      children: [{ text: '使用 AI 助手来帮助你写作！' }],
    },
  ];

  const editor = usePlateEditor({
    plugins: [
      BoldPlugin,
      ItalicPlugin,
      UnderlinePlugin,
      StrikethroughPlugin,
      CodePlugin,
      H1Plugin.withComponent(H1Element),
      H2Plugin.withComponent(H2Element),
      H3Plugin.withComponent(H3Element),
      BlockquotePlugin.withComponent(BlockquoteElement),
      CodeBlockPlugin.withComponent(CodeBlockElement),
    ],
    value: initialValue || defaultInitialValue,
  });

  const handleAIGenerate = async (prompt: string) => {
    if (!openAIApiKey) {
      alert('Please provide a Google AI API key');
      return;
    }

    setIsAILoading(true);

    try {
      // Get selected text for context
      let selectedText = '';
      if (editor.selection) {
        // Use Plate's string API to get selected text
        selectedText = (editor as any).api.string.value({
          at: editor.selection
        }) || '';
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${openAIApiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${prompt}\n\n${selectedText ? `Selected text: ${selectedText}` : 'Continue from the current position.'}`,
                  },
                ],
                role: 'user',
              },
              {
                parts: [
                  {
                    text: 'You are a helpful writing assistant. Respond only with the improved/generated text without any additional commentary or markdown formatting.',
                  },
                ],
                role: 'model',
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1000,
            },
          }),
        },
      );

      if (!response.ok) {
        throw new Error('AI request failed');
      }

      const data = await response.json();
      const aiText = data.candidates[0]?.content?.parts[0]?.text || '';

      // Insert AI-generated text at cursor using slate API
      slate.Transforms.insertText(editor as any, aiText);
    } catch (error) {
      console.error('AI generation error:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setIsAILoading(false);
    }
  };

  return (
    <div className={`border border-zinc-300 rounded-lg overflow-hidden bg-white ${className}`}>
      {/* Toolbar */}
      <div className="bg-zinc-50 border-b border-zinc-200 px-4 py-2 flex flex-wrap items-center gap-2">
        {/* Headings */}
        <div className="flex gap-1">
          <ToolbarButton
            onClick={() => editor.tf.h1.toggle()}
            tooltip="Heading 1"
          >
            H1
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.tf.h2.toggle()}
            tooltip="Heading 2"
          >
            H2
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.tf.h3.toggle()}
            tooltip="Heading 3"
          >
            H3
          </ToolbarButton>
        </div>

        <div className="w-px h-6 bg-zinc-300 mx-1" />

        {/* Text formatting */}
        <div className="flex gap-1">
          <ToolbarButton
            onClick={() => editor.tf.bold.toggle()}
            tooltip="Bold (⌘+B)"
          >
            B
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.tf.italic.toggle()}
            tooltip="Italic (⌘+I)"
          >
            I
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.tf.underline.toggle()}
            tooltip="Underline (⌘+U)"
          >
            U
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.tf.strikethrough.toggle()}
            tooltip="Strikethrough"
          >
            S
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.tf.code.toggle()}
            tooltip="Code"
          >
            {'</>'}
          </ToolbarButton>
        </div>

        <div className="w-px h-6 bg-zinc-300 mx-1" />

        {/* Block elements */}
        <div className="flex gap-1">
          <ToolbarButton
            onClick={() => editor.tf.blockquote.toggle()}
            tooltip="Blockquote"
          >
            Quote
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.tf.code_block.toggle()}
            tooltip="Code Block"
          >
            {'{ }'}
          </ToolbarButton>
        </div>

        <div className="flex-1" />

        {/* AI Assistant */}
        <AIAssistant onGenerate={handleAIGenerate} isLoading={isAILoading} />
      </div>

      {/* Editor content */}
      <Plate
        editor={editor}
        onChange={({ value }) => {
          onChange?.(value);
        }}
      >
        <PlateContent
          className="prose prose-zinc max-w-none px-8 py-6 min-h-[400px] focus:outline-none"
          placeholder={placeholder}
        />
      </Plate>
    </div>
  );
}
