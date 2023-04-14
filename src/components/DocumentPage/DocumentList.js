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
  const { recentDate, setrecentDate } = useState([]);
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

  // const getDocDates = (documents) => {
  //   axios
  //     .post(
  //       "http://localhost:8000/main/get-document/",
  //       {
  //         documentid: documents.id,
  //         documentkey: "",
  //       },
  //       { withCredentials: true }
  //     )
  //     .then((res) => {
  //       console.log(document.id, res.data.result.lastUpdate);
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
          <span>수정한 날짜</span>
        </div>
        <div className="documentList__contents">
          {documents.length < 1 ? <h2>"Loading..."</h2> : dataLoaded}
        </div>
      </div>
    </>
  );
};

export default DocumentList;
