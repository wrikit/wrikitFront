import { Link } from "react-router-dom";
import { HiDocumentText } from "react-icons/hi";
import "../../styles/DocumentItem.scss";
import axios from "axios";
import { useEffect, useState } from "react";
import CheckedList from "./CheckedList";
//documentItem컴포넌트 문서 번호, 이름, 마지막업데이트날짜
const DocumentItem = (props) => {
  //   console.log(props);
  const { document } = props;
  const [checkedDoc, setCheckeddoc] = useState([]);
  console.log("DocumentItem컴포넌트key", document);
  const checkedCheck = () => {
    setCheckeddoc(True);
    // check된 문서들모아둔 컴포넌트로 아이디 전송
    return <CheckedList props={document.id} />;
  };

  return (
    <div className="DocumentItem">
      <span className="DocumentItem__checkbox">
        <input type="checkbox" checked={checkedDoc} />
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
    </div>
  );
};

export default DocumentItem;
