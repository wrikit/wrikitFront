//새문서 생성 버튼
// 새문서 생성api
import axios from "axios";
// 클릭 시 새문서 생성 후 생성된 문서 texteditor로 이동
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { IconContext } from "react-icons";
import "../../styles/DocumentNew.scss";
import { useEffect, useState } from "react";
const DocumentNew = () => {
  // props
  const [documentId, setDocumentId] = useState([]);
  const onClickHandler = async (e) => {
    await axios({
      method: "POST",
      url: "http://localhost:8000/main/create-document/",
      data: {
        name: "제목없는문서",
        type: "text",
        key: "test11",
        editable: 1,
        public: 0,
      },
      withCredentials: true,
    })
      .then((res) => {
        const newObjectData = res.data;
        console.log("create-document axios True", newObjectData.id);
        setDocumentId(newObjectData.id);
      })
      .catch(function (err) {
        console.log(err);
      });
  };
  useEffect(() => {
    if (documentId) {
      // Use template literals to create the Link component's "to" prop
      // with the updated documentId value.
      document
        .getElementById("new-doc-link")
        .setAttribute("to", `/document/${documentId}`);
    }
  }, [documentId]);
  return (
    <Link onClick={onClickHandler} id="new-doc-link" to="#">
      <IconContext.Provider
        value={{
          color: "#00917C",
          className: "NewBtn",
          size: "2em",
        }}
      >
        <p className="NewText">새문서 만들기</p>
        <div className="NewBtndiv">
          <FaPlus />
        </div>
      </IconContext.Provider>
    </Link>
  );
};

export default DocumentNew;
