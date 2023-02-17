import { resolveTo } from "@remix-run/router";
import { type } from "@testing-library/user-event/dist/type";
import React from "react";
import { useState, useEffect } from "react";

const Information = props => {
  const [value, setValue] = useState(props.default);
  const [onChange, setOnChange] = useState();
  const [image, setImage] = useState('');
  const [imageSrc, setImageSrc] = useState(props.src);
  const isImage = (props.type == "image");
  const valueHandler = event => {
    setOnChange(event);
    setValue(event.target.value);
    if (isImage) {
      imageHandler(event);
    }
  }
  const imageHandler = (event) => {
    setImage(event.target.files[0]);
    setImageSrc(URL.createObjectURL(event.target.files[0]));
  }

  useEffect(() => {
    if (!isImage) {
      value==props.default ? props.isChange(false) : props.isChange(true);
    }
  }, [value]);

  const INPUT_ID = String(Math.floor(1000000*Math.random()));
  const return_result = <div>
    { isImage ?
      <label htmlFor={INPUT_ID}>
        <img src={imageSrc} />
      </label> :
      <div className="info_name">{props.infoName}</div>
    }
    <input 
      id={INPUT_ID}
      type={isImage ? "file" : props.type} 
      value={value} 
      onChange={valueHandler} 
      disabled={props.isDisabled}
      placeholder={props.placeHolder}
    />
  </div>

  return (return_result);
};

Information.defaultProps = {
  default: '',
  isChange: () => {},
  isDisabled: false,
  type: "text",
  infoName: '',
  src: '',
  placeHolder: ''
};

export default Information;