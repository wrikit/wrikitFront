import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment/moment";
//documentItem컴포넌트 문서 번호, 이름, 마지막업데이트날짜
import DocumentItem from "./DocumentItem";
import DocumentNew from "./DocumentNew";
import "../../styles/DocumentList.scss";

const DocumentList = () => {
  // 2초기다리는건 처음에 state에 빈값이여야... 2초후바꾸기
  const [documents, setDocuments] = useState([]);
  // 가짜 데이터
  // const getDocuments = () => {
  //   axios
  //     .post(
  //       "http://localhost:8000/main/get-profile/",
  //       {},
  //       {
  //         withCredentials: true,
  //       }
  //     )
  //     .then((res) => {
  //       console.log("get-profiled", res.data.data.DocumentList);
  //       const TransDocuments = Object.entries(res.data.data.DocumentList).map(
  //         ([id, docName]) => ({
  //           id: parseInt(id),
  //           docName,
  //         })
  //       );
  //       setDocuments(TransDocuments);
  //     })
  //     .catch(function (err) {
  //       console.log(err);
  //     });
  // };
  const getDocuments = async () => {
    try {
      const res1 = await axios.post(
        "http://localhost:8000/main/get-profile/",
        {},
        { withCredentials: true }
      );

      const TransDocuments = Object.entries(res1.data.data.DocumentList).map(
        ([id, docName]) => ({
          id: parseInt(id),
          docName,
        })
      );

      const addDocumentDate = await Promise.all(
        TransDocuments.map(async (document) => {
          const res2 = await axios.post(
            "http://localhost:8000/main/get-document/",
            {
              documentid: document.id,
              documentkey: "",
            },
            { withCredentials: true }
          );
          const lastUpdate = moment(res2.data.result.lastUpdate).format(
            "YYYY.MM.DD"
          );
          return {
            ...document,
            date: lastUpdate,
          };
        })
      );

      setDocuments(addDocumentDate);
    } catch (err) {
      console.log(err);
    }
  };

  //삭제 버튼

  useEffect(() => {
    getDocuments();
  }, []);

  //document리스트 map
  const dataLoaded = documents.map((document) => {
    console.log("dataLoaded", document.id);
    const deleteDocument = () => {
      if (window.confirm("정말 삭제하시겠습니까?")) {
        axios
          .post(
            "http://localhost:8000/main/delete-document/",
            { documentid: document.id },
            { withCredentials: true }
          )
          .then((res) => {
            console.log(res.data);
            if (res.data.result) {
              alert("삭제되었습니다.");
              window.location.href = "/document";
            }
          });
      }
    };
    return (
      <DocumentItem
        key={document.id}
        document={document}
        deleteDocument={deleteDocument}
      />
    );
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
          <span>수정한 날짜</span>
        </div>
        <div className="documentList__contents">
          {documents.length < 1 ? <h4>문서함이 비어있습니다</h4> : dataLoaded}
        </div>
      </div>
    </>
  );
};

export default DocumentList;
