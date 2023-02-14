
const URLSearch = new URLSearchParams(location.search);
let name = URLSearch.get('name');
console.log(name);

const KakaoKey = '6d7d8e51b5a8fe5d22491601c0ab3f7a';
Kakao.init(KakaoKey);
// console.log(Kakao.isInitialized());

const kakaoLogin = () => {
  Kakao.Auth.login({
    success: response => {
      Kakao.API.request({
        url: '/v2/user/me',
        success: response => {
          console.log(response);
          alert("logined");
        },
        fail: error => {
          console.log(error);
        },
      })
    },
    fail: error => {
      console.log(error);
    },
  })
  Kakao.Auth.setAccessToken(undefined);
}

const kakaoLogout = () => {
  if (Kakao.Auth.getAccessToken()) {
    Kakao.API.request({
      url: '/v1/user/unlink',
      success: response => {
        console.log(response);
      },
      fail: error => {
        console.log(error);
      },
    })
    Kakao.Auth.setAccessToken(undefined);
  }
}

const checkKakaoLogin = () => {
  console.log(Boolean(Kakao.Auth.getAccessToken()));
}

const getKakaoProfile = () => {
  if (Kakao.Auth.getAccessToken()) {
    Kakao.API.request({
      url: '/v2/user/me',
      success: response => {
        console.dir(response['properties']);
        const profile_data = response['properties'];
        document.querySelector("#kakao-profile img").src = profile_data['profile_image'];
        document.querySelector("#kakao-profile h3").innerText = profile_data['nickname'];
        document.querySelector("#kakao-profile").classList.remove('hide');
      },
      fail: error => {
        console.log(error);
      }
    })
  } else {
    kakaoLogin();
    
  }
}