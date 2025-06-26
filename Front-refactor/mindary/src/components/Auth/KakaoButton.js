import React from "react";

const KakaoButton = () => {
  const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;
  const REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;

  const handleKakaoLogin = () => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    window.location.href = kakaoAuthUrl;
  };

  return <button onClick={handleKakaoLogin}>카카오 로그인</button>;
};

export default KakaoButton;
