import { Link } from "react-router-dom";
import { HiDocumentText } from "react-icons/hi";
//documentItem컴포넌트 문서 번호, 이름, 마지막업데이트날짜
const DocumentItem = (props) => {
  // props
  // {post: {id: x, title: xxx, body: xxx}}
  //   console.log(props);
  const { document } = props;
  console.log("DocumentItem컴포넌트", document.id);
  //   post =>{id: x, title: xxx, body: xxx}
  return (
    <Link className="DocumentItem" to={"/document/" + document.id}>
      <div>
        <HiDocumentText />
        <span className="id">No. {document.id}</span>
        <span className="docName">- {document.docName}</span>
        <span className="lastUpdate">- {document.lastUpdate}</span>
      </div>
    </Link>
  );
};

export default DocumentItem;
