import "../styles/NotFound.scss";
const NotFound = () => {
  return (
    <div className="NotFound">
      <div className="container">
        <h1>404</h1>
        <p>
          죄송합니다. <br /> 이 페이지는 존재하지 않는 페이지입니다.
        </p>
        <small>
          입력하신 주소를 다시 한 번 확인해 주시거나 <br></br>{" "}
          <a href="/" target="_blank">
            home page
          </a>{" "}
          로 이동해 서비스를 이용해 보세요!
          {/* or{" "}
          <a href="#" target="_blank">
            contact
          </a>{" "}
          me */}
        </small>
        <div className="circle small"></div>
        <div className="circle medium"></div>
        <div className="circle big"></div>
      </div>
    </div>
  );
};

export default NotFound;
