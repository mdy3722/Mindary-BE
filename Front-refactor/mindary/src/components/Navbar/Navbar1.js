import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useTheme } from "../../styles/ThemeContext";
import { axiosInstance } from "../../api/api";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const Navbar1 = ({ selectedDate }) => {
  const { theme, toggleTheme } = useTheme();
  const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/mindary/accounts/original/logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({
            refresh_token: localStorage.getItem("refresh_token"),
          }),
        }
      );

      if (response.ok) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setIsLoggedIn(false);
        localStorage.setItem("isLoggedIn", "false");
        navigate("/");
      } else {
        alert("로그아웃 실패. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
    finally {
      localStorage.clear();         // 모든 토큰 제거
      window.location.href = "/";  // 강제 새로고침 → Landing 페이지 진입 시 상태 초기화됨
    }
  };

  const handleNavigate = (path) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      navigate("/login");
    }
  };

  return (
    <Bar>
      <SectionA>A</SectionA>
      <SectionB>B</SectionB>
      <SectionC>C</SectionC>
      <SectionD>D</SectionD>
      <SectionE>E</SectionE>
      <RecordSection
        onClick={() => handleNavigate(`/mindary?date=${formattedDate}`)}
      >
        <SectionRecord>Record</SectionRecord>
      </RecordSection>
      <ArchiveSection
        onClick={() => handleNavigate("/mindary/records/archive")}
      >
        <SectionArchive>Archive</SectionArchive>
      </ArchiveSection>
      <SectionF>F</SectionF>
      <SectionMode onClick={toggleTheme}>Mode : {theme.modeIcon}</SectionMode>
      <SectionLogout onClick={handleLogout}>Log Out</SectionLogout>
      <SectionNull2 />
    </Bar>
  );
};

const Bar = styled.div`
  display: flex;
  align-items: center;
  position: fixed;
  top: 52px; /* Navbar가 상단에 고정되도록 설정 */
  left: 0;
  font-family: "PreVariable";
  font-size: 14px;
  font-weight: 400;
  width: 100%;
  height: 29px; /* Navbar 높이 */
  color: black;
  z-index: 1000; /* 다른 요소 위에 위치하도록 설정 */
  font-family: "PreVariable";
`;

const Section = styled.div`
  display: flex;
  align-items: center;
  font-family: "PreVariable";
  justify-content: center;
  font-size: 14px;
  font-weight: 400;
  height: 100%;
  color: #333;
`;

const SectionA = styled(Section)`
  width: 122px;
  margin-left: 46px;
`;

const SectionB = styled(Section)`
  width: 120px;
`;

const SectionC = styled(Section)`
  width: 226px;
`;

const SectionD = styled(Section)`
  width: 119px;
`;

const SectionE = styled(Section)`
  width: 137px;
`;

const SectionF = styled(Section)`
  width: 225px;
`;

const SectionMode = styled(Section)`
  width: 119px;
  cursor: pointer;
  text-decoration: underline;
`;

const SectionRecord = styled(Section)`
  width: 119px;
`;

const SectionArchive = styled(Section)`
  width: 119px;
`;

const RecordSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-family: "PreVariable";
  height: 100%;
  cursor: pointer;
`;

const ArchiveSection = styled(RecordSection)``;

const SectionNull2 = styled(Section)`
  flex-grow: 1;
  border-right: none; /* 마지막 항목에는 오른쪽 경계선 없음 */
`;

const SectionLogout = styled(Section)`
  width: 120px;
  cursor: pointer;
  z-index: 1000;
`;

export default Navbar1;
