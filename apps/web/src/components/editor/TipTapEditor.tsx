"use client";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Quote, Heading2 } from 'lucide-react';

export function TipTapEditor({ content, onChange }: { content: string, onChange?: (html: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || '<p>Start typing your content here...</p>',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm prose-slate max-w-none focus:outline-none min-h-[150px] p-4 bg-white border border-slate-200 rounded-b-md',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const MenuBar = () => {
    return (
      <div className="flex flex-wrap gap-1 p-2 bg-slate-50 border border-slate-200 border-b-0 rounded-t-md">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded hover:bg-slate-200 ${editor.isActive('bold') ? 'bg-slate-200 text-navy-700' : 'text-slate-600'}`}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded hover:bg-slate-200 ${editor.isActive('italic') ? 'bg-slate-200 text-navy-700' : 'text-slate-600'}`}
        >
          <Italic className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-slate-300 mx-1 my-auto"></div>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded hover:bg-slate-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-slate-200 text-navy-700' : 'text-slate-600'}`}
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-slate-300 mx-1 my-auto"></div>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded hover:bg-slate-200 ${editor.isActive('bulletList') ? 'bg-slate-200 text-navy-700' : 'text-slate-600'}`}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded hover:bg-slate-200 ${editor.isActive('orderedList') ? 'bg-slate-200 text-navy-700' : 'text-slate-600'}`}
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded hover:bg-slate-200 ${editor.isActive('blockquote') ? 'bg-slate-200 text-navy-700' : 'text-slate-600'}`}
        >
          <Quote className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="w-full">
      <MenuBar />
      <EditorContent editor={editor} />
    </div>
  );
}
