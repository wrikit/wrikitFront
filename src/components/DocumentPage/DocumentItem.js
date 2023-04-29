import { Link } from "react-router-dom";
import { HiDocumentText } from "react-icons/hi";
import "../../styles/DocumentItem.scss";
import { MdDeleteForever } from "react-icons/md";
import axios from "axios";
import { useEffect, useState } from "react";
//documentItem컴포넌트 문서 번호, 이름, 마지막업데이트날짜
const DocumentItem = (props) => {
  //   console.log(props);
  // const handleHover = () => {
  //   const delBtn = document.getElementsByClassName("DocumentItem__button");
  //   delBtn.style.display = "flex";
  // };
  // const handleMouseOut = () => {
  //   const delBtn = document.getElementsByClassName("DocumentItem__button");
  //   delBtn.style.display = "none";
  // };
  const { document } = props;
  console.log("DocumentItem컴포넌트key", document);
  // const deleteDocument = () => {
  //   axios
  //     .post(
  //       "http://localhost:8000/main/delete-document/",
  //       { documentid: document.id },
  //       { withCredentials: true }
  //     )
  //     .then((res) => {
  //       console.log(res.data);
  //       if (res.data.result) {
  //         alert("삭제완료");
  //         window.location.href = "/document";
  //       }
  //     });
  // };

  return (
    <div
      className="DocumentItem"
      // onMouseOver={handleHover}
      // onMouseOut={handleMouseOut}
    >
      <span className="DocumentItem__checkbox">
        <input type="checkbox" />
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
      <button className="DocumentItem__button">
        <MdDeleteForever size={24} />
      </button>
    </div>
  );
};

export default DocumentItem;
