//새문서 생성 버튼
// 새문서 생성api
import axios from "axios";
// 클릭 시 새문서 생성 후 생성된 문서 texteditor로 이동
import { FaPlus } from "react-icons/fa";
import { IconContext } from "react-icons";
import "../../styles/DocumentNew.scss";
import { useNavigate } from "react-router-dom";
const DocumentNew = () => {
  let navigate = useNavigate();
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
        // 생성한 새문서로 이동
        navigate(`/document/${newObjectData.id}/editor`);
      })
      .catch(function (err) {
        console.log(err);
      });
  };
  return (
    <div className="DocumentNew" onClick={onClickHandler}>
      <div className="DocumentNew__btnArea">
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
    </div>
  );
};

export default DocumentNew;
