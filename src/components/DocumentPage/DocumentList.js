import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment/moment";
import DocumentItem from "./DocumentItem";
import DocumentNew from "./DocumentNew";
import "../../styles/DocumentList.scss";
import { serverURL } from "../../settings";

// DocumentList Component : 개별 문서(DocumentItem)의 목록
const DocumentList = () => {
  // 2초기다리는건 처음에 state에 빈값이여야... 2초후바꾸기
  const [documents, setDocuments] = useState([]);
  const getDocuments = async () => {
    try {
      const res1 = await axios.post(
        `http://${serverURL}/main/get-profile/`,
        {},
        { withCredentials: true }
      );

      const TransDocuments = Object.entries(res1.data.data.DocumentList).map(
        ([id, docName]) => ({
          id: parseInt(id),
          docName,
        })
      );
      // 문서에 마지막 수정날짜 추가
      // document id로 해당 문서 정보 요청
      const addDocumentDate = await Promise.all(
        TransDocuments.map(async (document) => {
          const res2 = await axios.post(
            `http://${serverURL}/main/get-document/`,
            {
              documentid: document.id,
              documentkey: "",
            },
            { withCredentials: true }
          );
          // 문서의 마지막 수정날짜 표시 형식 지정 => "년.월.일"
          const lastUpdate = moment(res2.data.result.lastUpdate).format(
            "YYYY.MM.DD"
          );
          // 기존 document 정보(문서id, 문서제목)에 'date'로 마지막 수정날짜 추가
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
  const [isSelected, setIsSelected] = useState([]); // 개별로 체크된 문서들(배열)
  const [isAllSelected, setIsAllSelected] = useState(false); // 문서 전체 선택 여부(상태)

  //개별 체크박스(이벤트_onChange Event)
  const handleCheckbox= (isChecked, document) => {
    // 개별 문서가 새로 체크될 때마다 isSelected에 추가
    if (isChecked) {
      setIsSelected((prevSelectedDocuments) => [
        ...prevSelectedDocuments,
        document,
      ]);
    } else {
      // 체크 해제시 isSelected 배열에서 제외
      setIsSelected((prevSelectedDocuments) =>
      prevSelectedDocuments.filter((item) => item.id !== document.id)
      );
    }
  };
  //문서 전체 선택한 경우(이벤트_onChange Event)
  const handleAllCheckboxes = (e) => {
    const isChecked= e.target.checked;
    setIsAllSelected(isChecked); //문서 전체 체크 여부(true / false)
    if(isChecked){ // true
      setIsSelected(documents); //문서 전체를 isSelected에 추가
    }else { // false
      setIsSelected([]);} //빈 배열(전체선택해제)
  };
  
  // 체크된 문서 일괄 삭제(문서리스트 헤더에 있는 삭제하기 버튼 이벤트_onClick Event)
  const handleDeleteButon = ()=>{
    // 선택된 문서 배열인 isSelected에서 각 문서들의 id를 하나씩 추출
    const docsToDelete = isSelected.map((document)=> document.id);
    if(window.confirm("정말 삭제하시겠습니까?")){
      //id별로 서버에 삭제 요청
    docsToDelete.forEach((id)=>{
      axios.post(`http://${serverURL}/main/delete-document/`, 
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
  const dataLoaded = documents.map((document) => {
    // 개별 문서 삭제 (각 문서에 hover시 나오는 삭제 아이콘 이벤트_onClick Event)
    const deleteDocument = () => {
      if (window.confirm("정말 삭제하시겠습니까?")) {
        axios
          .post(
            `http://${serverURL}/main/delete-document/`,
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
