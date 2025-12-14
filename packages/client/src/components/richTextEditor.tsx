import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinyMCEEditor } from 'tinymce';
import { useTheme } from 'next-themes';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface Props {
  "id": string;
  'aria-invalid'?: boolean;
  "height"?: number;
  "onBlur"?: (content: string) => void;
  "onChange"?: (content: string) => void;
  "value"?: string;
}

export const RichTextEditor: React.FC<Props> = ({
  id,
  'aria-invalid': ariaInvalid,
  height,
  onBlur,
  onChange,
  value,
}) => {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const publicUrl = new URL(window.location.href).origin;
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === `dark`;
  const isMobile = useIsMobile();

  return <>
    {isMobile && <style>{`
      .tox-toolbar {
        overflow-x: visible !important;
        flex-wrap: wrap !important;
        white-space: normal !important;
      }
      .tox-toolbar__group {
        flex-wrap: wrap !important;
      }
      .tox .tox-toolbar-overlord {
        overflow-x: visible !important;
      }
      .tox .tox-toolbar__overflow {
        overflow-x: visible !important;
      }
    `}</style>}
    <div className={cn(
      `rounded-md transition-colors`,
      { 'border-destructive ring-[3px] ring-destructive/20 dark:ring-destructive/40': ariaInvalid },
      { 'border-input': !ariaInvalid },
    )}
    >
      <Editor
        key={`rte-${id}-${isDark ? `dark` : `light`}-${isMobile ? `mobile` : `desktop`}`}
        id={`note-${id}`}
        tinymceScriptSrc={`${publicUrl}/tinymce/tinymce.min.js`}
        value={value ?? ``}
        onEditorChange={(content) => {
          if (onChange) {
            onChange(content);
          }
        }}
        init={{
          block_formats: `Paragraph=p;Header 1=h1;Header 2=h2;Header 3=h3`,
          branding: false,
          browser_spellcheck: true,
          content_css: isDark ? `dark` : `default`,
          content_style: `
          body {
            font-family: 'Inter', sans-serif;
            background: ${isDark ? `#1e1e22` : `#ffffff`};
            color: ${isDark ? `#f5f5f7` : `#1a1a1a`};
          }
          a { color: ${isDark ? `#89b4ff` : `#1d4ed8`}; }
          ::selection {
            background: ${isDark ? `#334155` : `#cbe3ff`};
          }
          .mce-content-readonly { background-color: ${isDark ? `#2a2d32` : `#d8dbe0`}; }
        `,
          font_size_formats: `8px 10px 12px 14px 16px 18px 20px 24px 28px 32px 36px`,
          height,
          invalid_elements: `img`,
          invalid_styles: `color background-color font-family`,
          menubar: false,
          paste_block_drop: true,
          plugins: [ `lists` ],
          setup: (editor: TinyMCEEditor) => {
            editorRef.current = editor;
            editor.on(`change`, () => editor.save());
            editor.on(`blur`, () => {
              if (onBlur) {
                onBlur(editor.getContent());
              }
            });
          },
          skin: isDark ? `oxide-dark` : `oxide`,
          toolbar: isMobile ?
            `bold italic underline | h1 h2 h3 | fontsize` :
            `undo redo | blocks | bold italic underline | bullist numlist outdent indent | removeformat`,
          toolbar_mode: isMobile ? `wrap` : `sliding`,
        }}
      />
    </div>
  </>;
};
