import axios from "axios";
import kakao_login_png from "../../img/kakao_login.png";
import { serverURL } from "../../settings";

const KakaoLogin = () => {
  // index.html <head>에서 스크립트 연결필요
  // <script src="https://developers.kakao.com/sdk/js/kakao.js"></script>
  const KakaoKey = '6d7d8e51b5a8fe5d22491601c0ab3f7a';
  const Kakao = window.Kakao;
  if (!Kakao.isInitialized()) {
    Kakao.init(KakaoKey);
  }

  const KakaoLogin = () => {
    Kakao.Auth.login({
      success: response => {
        Kakao.API.request({
          url: '/v2/user/me',
          success: response => {
            const ID = response['id'];
            const Properties = response['properties'];
            // 카카오 가입이아닌 로그인 함수로 대체, 회원가입이 필요한경우는 Django에서 예외처리
            axios.post(`http://${serverURL}/auth/kakao-login/`,
            {
              // Data here
              kakaoid: ID,
              profile: {
                name: Properties['nickname'],
                img: Properties['profile_image'],
              }
            },
            { withCredentials: true })
            .then(res => {
              document.location.href = "/";
            })
          },
          fail: error => {
            console.log(error);
            alert("카카오로그인 실패");
          }
        })
      },
      fail: error => {
        console.log(error);
      },
    });
    Kakao.Auth.setAccessToken(undefined);
  }

  return (
    <div className="kakao-login button" onClick={KakaoLogin}>
      <img src={kakao_login_png} alt="" />
    </div>
  );
}

export default KakaoLogin;
