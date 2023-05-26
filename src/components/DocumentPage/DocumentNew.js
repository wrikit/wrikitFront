import axios from "axios";
import { FaPlus } from "react-icons/fa";
import { IconContext } from "react-icons";
import "../../styles/DocumentNew.scss";
import { useNavigate } from "react-router-dom";
import { serverURL } from "../../settings";
import { nanoid } from "nanoid";

//새문서 생성 버튼
// 새문서 생성api
// 클릭 시 새문서 생성 후 생성된 문서 texteditor로 이동
const DocumentNew = () => {
  let navigate = useNavigate();
  const onClickHandler = async (e) => {
    const randomPW = nanoid(6);
    console.log(randomPW);

    await axios({
      method: "POST",
      url: `http://${serverURL}/main/create-document/`,
      data: {
        name: "제목없는문서",
        type: "text",
        key: randomPW,
        editable: 1,
        public: 0,
      },
      withCredentials: true,
    })
      .then((res) => {
        const newObjectData = res.data;
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
