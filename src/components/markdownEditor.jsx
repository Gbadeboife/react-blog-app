import React from 'react';
import MDEditor from '@uiw/react-md-editor';

function MarkdownEditor({ content, setContent }) {
  return (
    <div className="markdown-editor">
      <MDEditor
        value={content}
        onChange={setContent}
        preview="live"
        height={400}
        toolbarCommands={[
          'bold', 'italic', 'strikethrough',
          'title', 'quote', 'code',
          'link', 'image',
          'unordered-list', 'ordered-list',
        ]}
      />
    </div>
  );
}

export default MarkdownEditor;