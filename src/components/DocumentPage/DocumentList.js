import { useState, useEffect } from "react";
import axios from "axios";
import DocumentItem from "./DocumentItem";

const DocumentList = () => {
  // 2초기다리는건 처음에 state에 빈값이여야... 2초후바꾸기
  const [documents, setDocuments] = useState([]);
  // 가짜 데이터
  const fakeDocuments = [
    {
      id: 1,
      docName: "test",
      createDate: "2023-01-10 03:41:06",
      lastUpdate: "2023-01-10 04:13:02",
      accessKey: "test11",
      content: "textkjk",
      public: 1,
      editable: 1,
    },
    {
      id: 2,
      docName: "testDocument",
      createDate: "2022-12-18 17:37:27",
      lastUpdate: "2023-01-10 04:13:02",
      accessKey: "test11",
      content: "<p>ffffgg</p>",
      public: 1,
      editable: 1,
    },
  ];

  const getDocuments = async () => {
    // API생성전 가짜데이터 사용
    setDocuments(fakeDocuments);
    // 서버에 API추가 필요 유저아이디별로문서리스트
    // const res = await axios.get("main/get-profile/");
    // console.log(res.data);
    axios
      .post("http://localhost:8000/main/get-profile/", {
        withCredentials: true,
      })
      .then((res) => {
        console.log("get-profiledd", res.data);
        return res.data;
      })
      .catch(function (err) {
        console.log(err);
      });

    // setDocuments(res.data.slice(0, 20));
  };

  // 컴포넌트가 Mount 된 시점에
  useEffect(() => {
    getDocuments();
  }, []);

  const dataLoaded = documents.map((document) => {
    console.log("dataLoaded", document.id);
    return <DocumentItem key={document.id} document={document} />;
  });

  return (
    <div className="documentList">
      <p>내 문서</p>
      {documents.length < 1 ? <h2>"Loading..."</h2> : dataLoaded}
    </div>
  );
};

export default DocumentList;
