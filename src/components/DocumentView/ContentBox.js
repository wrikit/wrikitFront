import { useState, useRef, useEffect } from "react";

const ContentBox = props => {
  const contentRef = useRef(null);

  useEffect(() => {
    contentRef.current.innerText = props.content;

  }, []);

  return <div className={props.divClass}>
    <p ref={contentRef} className={props.contentClass}></p>
  </div>;
}

ContentBox.defaultProps = {
  content: '',
  contentClass: '',
  divClass: ''
};

export default ContentBox;