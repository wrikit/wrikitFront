//새문서 생성 버튼
// 새문서 생성api
import axios from "axios";
// 클릭 시 새문서 생성 후 생성된 문서 texteditor로 이동
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { IconContext } from "react-icons";
import "../../styles/DocumentNew.scss";
const DocumentNew = () => {
  // props
  // {post: {id: x, title: xxx, body: xxx}}
  //   console.log(props);
  // const { document } = props;
  const onClickHandler = (e) => {
    // console.log("clicked");
    axios({
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
        console.log("create-document axios True", res.data);

        // <Link className="DocumentNew" to={"/document/" + document.id}>
        // </Link>
      })
      .catch(function (err) {
        console.log(err);
      });
  };
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
        <p onClick={onClickHandler} className="NewText">
          새문서 만들기
        </p>
        <div className="NewBtndiv">
          <FaPlus onClick={onClickHandler} />
        </div>
      </IconContext.Provider>
    </div>
  );
};

export default DocumentNew;
