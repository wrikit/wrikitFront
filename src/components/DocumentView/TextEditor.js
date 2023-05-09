import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";

import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const TextEditor = (props) => {

  const editor = ClassicEditor.create(
    
  )

  return (
    <div>
      <CKEditor 
        editor={ClassicEditor}
        data={props.data}
        // config={editorConfiguration}
        onChange={(event, editor) => {
          const data = editor.getData();
          console.log(data);
        }}
      />
    </div>
  );
};

export default TextEditor;