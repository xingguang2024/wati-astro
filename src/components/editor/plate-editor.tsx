'use client';

import { normalizeNodeId, type Value } from 'platejs';
import { Plate, usePlateEditor } from 'platejs/react';
import { useEffect, useState } from 'react';

import { EditorKit } from '@/components/editor/editor-kit';
import { SettingsDialog } from '@/components/editor/settings-dialog';
import { UploadProvider } from '@/components/editor/upload-provider';
import { Editor, EditorContainer } from '@/components/ui/editor';
import { TooltipProvider } from '@/components/ui/tooltip';

interface PlateEditorProps {
  documentId?: string;
  initialValue?: Value;
  onSave?: (value: Value) => Promise<void>;
  autoSaveInterval?: number;
  onUploadFile?: (file: File) => Promise<string>;
  useR2Upload?: boolean; // Use R2 for file uploads instead of UploadThing
}

export function PlateEditor({
  documentId: _documentId,
  initialValue,
  onSave,
  autoSaveInterval = 2000,
  useR2Upload = false,
}: PlateEditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Default value for demo/editor usage
  const defaultEditorValue = normalizeNodeId([
    {
      children: [{ text: 'Start writing your document...' }],
      type: 'h1',
    },
    {
      children: [{ text: 'Begin your content here.' }],
      type: 'p',
    },
  ]);

  const editor = usePlateEditor({
    plugins: EditorKit,
    value: initialValue ?? defaultEditorValue,
  });

  const handleChange = () => {
    setHasUnsavedChanges(true);
    // Get current editor value
    const currentValue = editor.children;
    // Dispatch event for parent page
    window.dispatchEvent(
      new CustomEvent('editor-content-change', {
        detail: { value: currentValue }
      })
    );
    // Make content available globally
    (window as any).editorContent = currentValue;
  };

  const handleSave = async () => {
    if (!onSave) return;
    setIsSaving(true);
    try {
      await onSave(editor.children as Value);
      setHasUnsavedChanges(false);
      setLastSaved(new Date());
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save with debounce
  useEffect(() => {
    if (!onSave || !hasUnsavedChanges) return;
    const timeout = setTimeout(() => handleSave(), autoSaveInterval);
    return () => clearTimeout(timeout);
  }, [editor.children, hasUnsavedChanges, autoSaveInterval, onSave]);

  // Unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        // returnValue is deprecated but required for some browsers
        (e as any).returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return (
    <TooltipProvider>
      <UploadProvider useR2={useR2Upload}>
        <div className="relative">
          {/* Save button toolbar */}
          {onSave && (
            <div className="sticky top-0 z-10 flex items-center justify-between bg-white border-b px-4 py-2 mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving || !hasUnsavedChanges}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                {hasUnsavedChanges && (
                  <span className="text-sm text-amber-600 font-medium">
                    Unsaved changes
                  </span>
                )}
              </div>
              {lastSaved && (
                <span className="text-sm text-gray-500">
                  Last saved: {lastSaved.toLocaleTimeString()}
                </span>
              )}
            </div>
          )}
          <Plate editor={editor} onChange={handleChange}>
            <EditorContainer>
              <Editor variant="demo" />
            </EditorContainer>

            <SettingsDialog />
          </Plate>
        </div>
      </UploadProvider>
    </TooltipProvider>
  );
}
