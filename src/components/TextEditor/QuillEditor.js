import React, {useState} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const QuillEditor = props => {
  const [content, setContent] = useState(props.data);

  const changeHandler = value => {
    setContent(value);
  }

  const modules = {
    toolbar: [
      [{ 'font': [] }, {size: []}, {color: []}, {'list': 'ordered'}, {'list': 'bullet'}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote', 'link', 'align', {'indent': '+1'}]
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    }
  };

  const formats = [
    'font', 'size', 'color', '',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent', 'align'
  ];

  return (
    <div>
      <ReactQuill 
        value={content} 
        onChange={changeHandler}
        modules={modules}
        formats={formats} />
    </div>
  );
};

QuillEditor.defaultProps = {
  data: '',
}

export default QuillEditor;