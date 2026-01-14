'use client';


import { useAIChatEditor } from '@platejs/ai/react';
import { usePlateEditor } from 'platejs/react';
import * as React from 'react';


import { EditorStatic } from './editor-static';

import { BaseEditorKit } from '@/components/editor/editor-base-kit';

export const AIChatEditor = React.memo(function AIChatEditor({
  content,
}: {
  content: string;
}) {
  const aiEditor = usePlateEditor({
    plugins: BaseEditorKit,
  });

  const value = useAIChatEditor(aiEditor, content);

  return <EditorStatic variant="aiChat" editor={aiEditor} value={value} />;
});
