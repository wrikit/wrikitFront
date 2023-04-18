import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import Quill from "quill";
import "react-quill/dist/quill.snow.css";

const QuillEditor = (props) => {
  const [content, setContent] = useState(props.data);

  const changeHandler = (value) => {
    setContent(value);
  };

  // const Link = Quill.import('formats/link');

  // Link.sanitize = function(url) {
  //   if (url.indexOf('http') !== 0) {
  //     url = 'http://' + url;
  //   }
  //   return url;
  // };

  // Quill.register(Link, true);
  const toolBar = [
    [
      { font: [] },
      { size: [] },
      { color: [] },
      { list: "ordered" },
      { list: "bullet" },
    ],
    [
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "link",
      "image",
      { align: [] },
      { indent: "+1" },
    ],
  ];
  const modules = {
    toolbar: toolBar,
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
  };

  const formats = [
    "font",
    "size",
    "color",
    "",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "image",
    "indent",
    "align",
  ];

  return (
    <div>
      <ReactQuill
        value={content}
        onChange={changeHandler}
        modules={modules}
        readOnly={props.type == "reader"}
        formats={formats}
      />
    </div>
  );
};

QuillEditor.defaultProps = {
  data: "",
};

export default QuillEditor;
