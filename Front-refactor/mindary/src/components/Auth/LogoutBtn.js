import React from "react";
import { useNavigate } from "react-router-dom";

function LogoutBtn() {
  const navigate = useNavigate();

  // 로그아웃 함수
  const handleLogout = async () => {
    try {
      // 백엔드로 로그아웃 요청 보내기
      const response = await fetch(
        "http://127.0.0.1:8000/mindary/accounts/original/logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // 보통 로그아웃 시 Authorization 헤더로 토큰을 보내서 서버에서 검증함
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({
            refresh_token: localStorage.getItem("refresh_token"),
          }),
        }
      );

      if (response.ok) {
        // 로그아웃 성공 처리
        alert("로그아웃 성공");

        // 로컬 스토리지에서 토큰 및 isLoggedIn 값 제거
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.setItem("isLoggedIn", "false");
        navigate("/");
      } else {
        // 로그아웃 실패 시 처리
        alert("로그아웃 실패. 다시 시도해주세요.");
      }
    } catch (error) {
      // 네트워크 에러 처리
      console.error("로그아웃 중 오류 발생:", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  return <button onClick={handleLogout}>로그아웃</button>;
}

export default LogoutBtn;
