//새문서 생성 버튼
import { FaPlus } from "react-icons/fa";
import { IconContext } from "react-icons";
import "../../styles/DocumentNew.scss";
const DocumentNew = () => {
  // props
  // {post: {id: x, title: xxx, body: xxx}}
  //   console.log(props);
  // const { document } = props;
  console.log("DocumentNew컴포넌트", document.id);
  //   post =>{id: x, title: xxx, body: xxx}
  return (
    <div className="DocumentNew">
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
    </div>
  );
};

export default DocumentNew;
