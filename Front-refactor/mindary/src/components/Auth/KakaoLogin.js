import { useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { axiosInstance } from "../../api/api";
import moment from "moment-timezone";
import { TailSpin } from "react-loader-spinner";

const KakaoLogin = () => {
  const navigate = useNavigate();
  const code = new URL(window.location.href).searchParams.get("code");
  const [isLoading, setIsLoading] = useState(true);
  const calledRef = useRef(false); // ✅ 중복 호출 방지용 ref

  const handleLogin = async () => {
    try {
      if (!code) throw new Error("No code provided");

      console.log("✅ 프론트에서 받은 code:", code);

      const response = await axiosInstance.post("/mindary/accounts/kakao/login", {
        access_code: code,
      });

      if (response.status === 200) {
        if (response.data.message === "회원가입이 필요합니다.") {
          console.log("🟠 회원가입 필요, 자동 등록 시도");

          const registerResponse = await axiosInstance.post("/mindary/accounts/kakao/register", {
            kakao_id: response.data.kakao_id,
            nickname: response.data.nickname,
            email: response.data.email,
          });

          localStorage.setItem("access_token", registerResponse.data.access_token);
          localStorage.setItem("refresh_token", registerResponse.data.refresh_token);
        } else {
          console.log("🟢 로그인 완료");
          localStorage.setItem("access_token", response.data.access_token);
          localStorage.setItem("refresh_token", response.data.refresh_token);
        }

        const todayDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
        navigate(`/mindary?date=${todayDate}&mode=chat`);
      }
    } catch (error) {
      console.error("🚨 Login error:", error);
      if (error.response) {
        console.error("❗️ 백엔드 응답:", error.response.data);
        alert(`에러 발생: ${error.response.status}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (code && !calledRef.current) {
      calledRef.current = true; // ✅ 중복 실행 방지
      handleLogin();
    }
  }, [code]);

  return (
    <div>
      {isLoading && (
        <div className="spinner-container">
          <TailSpin height="80" width="80" color="#4fa94d" ariaLabel="tail-spin-loading" />
        </div>
      )}
    </div>
  );
};

export default KakaoLogin;
