import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment/moment";
//documentItem컴포넌트 문서 번호, 이름, 마지막업데이트날짜
import DocumentItem from "./DocumentItem";
import DocumentNew from "./DocumentNew";
import "../../styles/DocumentList.scss";
import { URL } from "../../settings";

const DocumentList = () => {
  // 2초기다리는건 처음에 state에 빈값이여야... 2초후바꾸기
  const [documents, setDocuments] = useState([]);
  const getDocuments = async () => {
    try {
      const res1 = await axios.post(
        `http://${URL}/main/get-profile/`,
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
            `http://${URL}/main/get-document/`,
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

  //체크 박스
  const [isSelected, setIsSelected] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);

  //개별 체크박스
  const handleCheckbox= (isChecked, document) => {
    if (isChecked) {
      setIsSelected((prevSelectedDocuments) => [
        ...prevSelectedDocuments,
        document,
      ]);
    } else {
      setIsSelected((prevSelectedDocuments) =>
      prevSelectedDocuments.filter((item) => item.id !== document.id)
      );
      // setIsAllSelected(false)
    }
  };
  //문서 전체 클릭
  const handleAllCheckboxes = (e) => {
    const isChecked= e.target.checked;
    setIsAllSelected(isChecked);
    if(isChecked){
      setIsSelected(documents);
    }else {
      setIsSelected([]);}
  };
  
  // 체크된 문서 삭제
  const handleDeleteButon = ()=>{
    const docsToDelete = isSelected.map((document)=> document.id);
    if(window.confirm("정말 삭제하시겠습니까?")){
    docsToDelete.forEach((id)=>{
      axios.post(`http://${URL}/main/delete-document/`, 
      {documentid : id},
      {withCredentials:true})
      .then((res)=>{
        if(res.data.result){
          alert("삭제되었습니다.");
          window.location.href = "/document";
        }
        return;
      })
    })}    
    
  }

  //document리스트 map
  //삭제 버튼
  const dataLoaded = documents.map((document) => {
    const deleteDocument = () => {
      if (window.confirm("정말 삭제하시겠습니까?")) {
        axios
          .post(
            `http://${URL}/main/delete-document/`,
            { documentid: document.id },
            { withCredentials: true }
          )
          .then((res) => {
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
        checked={isSelected.some((item) => item.id === document.id)}
        onChange={(isChecked) => handleCheckbox(isChecked, document)}
        isAllSelected={isAllSelected}
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
          <input type="checkbox"  checked={isAllSelected} 
          onChange={handleAllCheckboxes}/>
          <span></span>
          <span>문서번호</span>
          <span>문서이름</span>
          <span>수정한 날짜</span>
          <span></span>
          <button onClick={handleDeleteButon}>삭제하기</button>
        </div>
        <div className="documentList__contents">
          {documents.length < 1 ? <h4>문서함이 비어있습니다</h4> : dataLoaded}
        </div>
      </div>
    </>
  );
};

export default DocumentList;
