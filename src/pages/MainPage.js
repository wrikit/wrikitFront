import { NavLink } from "react-router-dom";
import "../styles/MainPage.scss";
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const MainPage = (isLogin) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 4000, // 이미지가 바뀌는 속도
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // 자동 슬라이드
    autoplaySpeed: 5000, // 다음 이미지로 넘어가는 시간
    pauseOnHover: false, // 마우스 호버시 자동 슬라이드 멈춤 여부
    arrows: true,
  }
  return (
    <main className="MainPage">
      <Slider {...settings} >
      <div className="banner index-img">
        <div className="main__textwrapper">
          <h1 className="main__textwrapper__title">어디든, 언제든!<br /> 간편한 문서공유</h1>
          <div className="main__textwrapper__desc">
            이메일 초대없이 링크하나로 협업
            <br />
            간단하고 직관적인 편집툴
            <br />
            작성한 문서를 PDF로 다운받아 보세요
            <br />
          </div>
          <div className="main__textwrapper__btnArea">
            {isLogin ? (
                <NavLink to="/document">
                <button className="runBtn">
                  <span>시작하기</span>
                </button>
              </NavLink>
            ) : (  <NavLink to="/lgpage">
            <button className="runBtn">
              <span>시작하기</span>
            </button>
          </NavLink>)}
          
          </div>
        </div>
      </div>
      <div className="second-banner">
        <div className="second-img">
          <div className="second-textwrapper">
            이메일 초대 없이 링크만으로 간편한 공유!
            <div className="main__textwrapper__btnArea">
            {isLogin ? (
                <NavLink to="/document">
                <button className="runBtn">
                  <span>시작하기</span>
                </button>
              </NavLink>
            ) : (  <NavLink to="/lgpage">
            <button className="runBtn">
              <span>시작하기</span>
            </button>
          </NavLink>)}
          
          </div>
          </div>
        </div>
      </div>
      </Slider>
    </main>
  );
};

export default MainPage;
