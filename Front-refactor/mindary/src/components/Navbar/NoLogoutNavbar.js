import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../styles/ThemeContext";
import moment from "moment";

const NoLogoutNavbar = ({ selectedDate }) => {
  const { theme, toggleTheme } = useTheme();
  const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

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
  font-size: 14px;
  font-weight: 400;
  width: 100%;
  height: 29px; /* Navbar 높이 */
  color: black;
  z-index: 1000; /* 다른 요소 위에 위치하도록 설정 */
  font-family: "PreVariable"; /* Apply "Pretendard Variable" to all letters in the header */
`;

const Section = styled.div`
  display: flex;
  align-items: center;
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
  height: 100%;
  cursor: pointer;
`;

const ArchiveSection = styled(RecordSection)``;

const SectionNull2 = styled(Section)`
  flex-grow: 1;
  border-right: none; /* 마지막 항목에는 오른쪽 경계선 없음 */
`;

export default NoLogoutNavbar;
