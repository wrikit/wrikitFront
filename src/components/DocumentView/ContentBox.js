import { useState, useRef, useEffect } from "react";

const ContentBox = props => {
  const contentRef = useRef(null);

  useEffect(() => {
    if (!props.editable) {
      contentRef.current.innerHTML = props.content;
    }

  }, []);

  return <div className={props.divClass}>
    {/* { props.editable ? (<CKEditor 
      editor={ClassicEditor}
      data={props.content}
      onReady={(editor) => {
        console.log("Editor is ready to use!", editor);
      }} />) : (<div ref={contentRef} ></div>)} */}
    <div ref={contentRef} ></div>
  </div>;
}

ContentBox.defaultProps = {
  content: '',
  contentClass: '',
  divClass: ''
};

export default ContentBox;