import { useState, useRef, useEffect } from "react";

const ContentBox = props => {
  const contentRef = useRef(null);

  useEffect(() => {
    if (!props.editable) {
      contentRef.current.innerHTML = props.content;
    }
  }, []);

  return <div className={props.divClass}>
    <div ref={contentRef} ></div>
  </div>;
}

ContentBox.defaultProps = {
  content: '',
  contentClass: '',
  divClass: ''
};

export default ContentBox;