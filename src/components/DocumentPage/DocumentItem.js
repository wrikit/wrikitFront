import { Link } from "react-router-dom";
import { HiDocumentText } from "react-icons/hi";
import "../../styles/DocumentItem.scss";
import { MdDeleteForever } from "react-icons/md";
import { useEffect, useState } from "react";

//DocumentItem Component에 들어가는 정보 => 문서 번호, 이름, 마지막업데이트날짜
const DocumentItem = (props) => {
  // 문서 개별 선택(상태)
  const [isChecked, setIsChecked] = useState(props.checked);
  //문서 선택 (이벤트_onChange Event)
  const onChange = props.onChange;

  //선택 문서 정보(이벤트_onClick Event)
  const handleCheck = (e) => {
    const selectedValue = e.target.checked;
    setIsChecked(selectedValue);
    onChange(selectedValue, document);
  };
  // 문서가 전체 [선택/해제] 됐을 경우, 개별 문서 전부 isChecked값 [true/false]로 변경.
  const isAllSelected = props.isAllSelected;
  useEffect(()=>{
    if(isAllSelected){
      setIsChecked(true);
    }
    else{
      setIsChecked(false)
    }
  },[isAllSelected]);

  const { document } = props;
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
