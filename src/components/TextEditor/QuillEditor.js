
import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import Quill from "quill";
import "react-quill/dist/quill.snow.css";

const QuillEditor = (props) => {
  const [content, setContent] = useState(props.data);

  const changeHandler = (value) => {
    setContent(value);
  };

  //텍스트 입력시 focus 감지
  const quillRef = useRef(null);
  const handleFocus = () => {
    props.setIsFocused(true);
  };
  const handleBlur = () => {
    props.setIsFocused(false);
  };
  useEffect(() => {
    const quill = quillRef.current.getEditor();
    quill.on("selection-change", (range, oldRange, source) => {
      if (range) {
        // props.onFocus();
        handleFocus();
      } else {
        // props.onBlur();
        handleBlur();
      }
    });

    return () => {
      quill.off("selection-change");
    };
  }, []);
  // console.log("isFocused?", isFocused);
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
        ref={quillRef}
        value={content}
        onChange={changeHandler}
        modules={modules}
        readOnly={props.type == "reader"}
        formats={formats}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
};

QuillEditor.defaultProps = {
  data: "",
};

export default QuillEditor;
