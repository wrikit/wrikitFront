import React from "react";
import { useState, useEffect, useRef } from "react";

const Information = (props) => {
  const [value, setValue] = useState(props.default);
  const [image, setImage] = useState("");
  const [imageSrc, setImageSrc] = useState(props.src);
  const isImage = props.type == "image";
  const tempRef = useRef(null);
  let inputRef;
  if (!props.inputRef) {
    inputRef = tempRef;
  } else {
    inputRef = props.inputRef;
  }

  if (value == null) {
    setValue("");
  }

  const valueHandler = (event) => {
    setValue(event.target.value);
    if (isImage) {
      imageHandler(event);
    }
  };
  const imageHandler = (event) => {
    setImage(event.target.files[0]);
    setImageSrc(URL.createObjectURL(event.target.files[0]));
  };

  useEffect(() => {
    if (!isImage) {
      value == props.default ? props.isChange(false) : props.isChange(true);
    } else {
      inputRef.current.value == ""
        ? props.isChange(false)
        : props.isChange(true);
    }
  }, [value]);

  const INPUT_ID = String(Math.floor(1000000 * Math.random()));
  const return_result = (
    <div>
      {isImage ? (
        <label htmlFor={INPUT_ID}>
          <div className="image-container">
            <img src={imageSrc} className="profile-image" />
          </div>
        </label>
      ) : (
        <div className="info_name">{props.infoName}</div>
      )}
      <input
        id={INPUT_ID}
        type={isImage ? "file" : props.type}
        className={isImage ? "image-input" : "text-input"}
        value={value}
        onChange={valueHandler}
        disabled={props.isDisabled}
        placeholder={props.placeHolder}
        ref={inputRef}
        name={props.formName}
      />
    </div>
  );

  return return_result;
};

Information.defaultProps = {
  default: "",
  isChange: () => {},
  isDisabled: false,
  type: "text",
  infoName: "",
  src: "",
  placeHolder: "",
  formName: "",
  inputRef: false
};

export default Information;
