import React from "react";
import { useNavigate } from "react-router-dom";

function LogoutBtn() {
  const navigate = useNavigate();

  // 로그아웃 함수
  const handleLogout = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/mindary/accounts/original/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          refresh_token: localStorage.getItem("refresh_token"),
        }),
      });
  
      if (response.ok) {
        alert("로그아웃 성공");
      } else {
        // 401 or 400이더라도 토큰 만료로 간주하고 클라이언트 상태 초기화
        alert("토큰 만료됨. 클라이언트 상태 초기화");
      }
    } catch (error) {
      alert("네트워크 오류. 클라이언트 상태 초기화");
    } finally {
      // ✅ 무조건 클라이언트 상태 정리
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.setItem("isLoggedIn", "false");
      
      // 초기화 <- 임시시
      localStorage.clear();
      window.location.href = "/";

      // navigate("/");
    }
  };

  return <button onClick={handleLogout}>로그아웃</button>;
}

export default LogoutBtn;
