import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import Quill from "quill";
import ImageResize from "quill-image-resize";
import "react-quill/dist/quill.snow.css";

Quill.register("modules/ImageResize", ImageResize);

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
    ImageResize: {
      parchment: Quill.import("parchment"),
    },
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
  
  useEffect(() => {
    const editorDiv = document.querySelector(".quill .ql-editor");
    editorDiv.innerHTML=content
  
  }, [])

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
  contentRef: undefined,
};

export default QuillEditor;
