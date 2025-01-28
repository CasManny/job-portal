"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./menu-bar";
import TextAlign from '@tiptap/extension-text-align'
import Typography from "@tiptap/extension-typography"

const JobDescriptionTextEditor = () => {
  const editor = useEditor({
    extensions: [StarterKit, TextAlign, Typography],
    immediatelyRender: false,
    content: "<p>Hello World! 🌎️</p>",
  });
  return (
    <div className="w-full border rounded-lg overflow-hidden bg-card">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default JobDescriptionTextEditor;
