import { Link } from "react-router-dom";
import { HiDocumentText } from "react-icons/hi";
import "../../styles/DocumentItem.scss";
import { MdDeleteForever } from "react-icons/md";
import axios from "axios";
import { useEffect, useState } from "react";
//documentItem컴포넌트 문서 번호, 이름, 마지막업데이트날짜
const DocumentItem = (props) => {
  //   console.log(props);
  const [isChecked, setIsChecked] = useState(props.checked);
  const onChange = props.onChange;
  const handleCheck = (e) => {
    const selectedValue = e.target.checked;
    setIsChecked(selectedValue);
    onChange(selectedValue, document);
  };

  // console.log(isChecked);
  const { document } = props;
  console.log("DocumentItem컴포넌트key", document);

  return (
    <div className="DocumentItem">
      <span className="DocumentItem__checkbox">
        <input type="checkbox" checked={isChecked} onChange={handleCheck} />
      </span>
      <Link
        className="DocumentItem__container"
        to={"/document/" + document.id + "/editor"}
      >
        <div className="DocumentItems">
          <span className="DocumentItems__icon">
            <HiDocumentText size={24} />
          </span>
          <span className="DocumentItems__id">No. {document.id}</span>
          <span className="DocumentItems__docName">{document.docName}</span>
          <span className="DocumentItems__docDate">{document.date}</span>
        </div>
      </Link>
      <button
        className="DocumentItem__button"
        onClick={props.deleteDocument}
        title="삭제하기"
      >
        <MdDeleteForever size={24} />
      </button>
    </div>
  );
};

export default DocumentItem;
