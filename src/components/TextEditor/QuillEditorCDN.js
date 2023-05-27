import React from "react";
import ReactDOM from "react-dom";

// Quill에디터 css 가져오기
const CSS_CDN = () => {
  return (
    <div>
      <link rel="stylesheet" href="https://cdn.quilljs.com/1.3.6/quill.snow.css" />
    </div>
  );
}

const QuillEditorCDN = () => {
  ReactDOM.render(<CSS_CDN />, document.getElementById('root'));
}

return QuillEditorCDN;