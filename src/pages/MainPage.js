import { NavLink } from "react-router-dom";
import "../styles/MainPage.scss";
import Slider from 'react-slick';
import {VscFilePdf} from "react-icons/vsc";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

// 시작페이지
const MainPage = (props) => {

  // 로그인 여부
  const isLogin = props.isLogin;

  // 메인 시작화면 슬라이드 속성 설정
  const settings = {
    dots: true, // 화면 하단에 점으로 슬라이드 표시, 이동
    infinite: true, // 무한 순환
    speed: 3000, // 슬라이드가 넘어갈 때 속도
    slidesToShow: 1, // 한 화면에 보여지는 슬라이드 개수
    slidesToScroll: 1, 
    autoplay: false, // 자동 슬라이드 X
    arrows: true, // 화면 양 옆 화살표 표시
  }
  return (
    <main className="MainPage">
      <Slider {...settings} >
        {/* 첫번째 슬라이드 */}
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
          {/* 시작하기 버튼 */}
          <div className="main__textwrapper__btnArea">
            {isLogin ? (
              // 로그인 O -> 문서페이지로 이동
                <NavLink to="/document">
                <button className="runBtn">
                  <span>시작하기</span>
                </button>
              </NavLink>
            ) : (  
              // 로그인 X -> 로그인 페이지로 이동
            <NavLink to="/lgpage">
            <button className="runBtn">
              <span>시작하기</span>
            </button>
          </NavLink>)}
          </div>
        </div>
      </div>
      {/* 두번째 슬라이드 */}
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
      {/* 세번째 슬라이드 */}
      <div className="third-banner">
        <div className="third-img">
          <div className="third-textwrapper">
          <h1 className="third-textwrapper__title"> 효율적인 문서관리의 시작!
          </h1>
          <div className="third-textwrapper__desc">
            단순하면서 핵심적인 편집툴로 손쉽게 작성하고, 수정하고, 저장하세요.
            <br />
            <p>
            <VscFilePdf size="18"/>
            PDF 문서 다운로드 가능
            </p>
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
      </div>
      </Slider>
    </main>
  );
};

export default MainPage;
