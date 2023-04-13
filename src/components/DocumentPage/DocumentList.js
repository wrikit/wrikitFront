import { useState, useEffect } from "react";
import axios from "axios";
//documentItem컴포넌트 문서 번호, 이름, 마지막업데이트날짜
import DocumentItem from "./DocumentItem";
import DocumentNew from "./DocumentNew";
import "../../styles/DocumentList.scss";

const DocumentList = () => {
  // 2초기다리는건 처음에 state에 빈값이여야... 2초후바꾸기
  const [documents, setDocuments] = useState([]);
  // 가짜 데이터

  const getDocuments = () => {
    axios
      .post(
        "http://localhost:8000/main/get-profile/",
        {},
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log("get-profiled", res.data.data.DocumentList);
        const TransDocuments = Object.entries(res.data.data.DocumentList).map(
          ([id, docName]) => ({
            id: parseInt(id),
            docName,
          })
        );
        setDocuments(TransDocuments);
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  // 컴포넌트가 Mount 된 시점에
  useEffect(() => {
    getDocuments();
  }, []);
  //document리스트 map
  const dataLoaded = documents.map((document) => {
    // console.log("dataLoaded", document.id);
    return <DocumentItem key={document.id} document={document} />;
  });

  return (
    <>
      <div>
        <DocumentNew />
      </div>
      <h2>내 문서</h2>
      <div className="documentList">
        <div className="documentList__header">
          <span></span>
          <span>문서번호</span>
          <span>문서이름</span>
        </div>
        <div className="documentList__contents">
          {documents.length < 1 ? <h2>"Loading..."</h2> : dataLoaded}
        </div>
      </div>
    </>
  );
};

export default DocumentList;
