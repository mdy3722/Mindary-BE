import { useEffect, useState, useRef, useCallback } from "react";
import styled from "styled-components";

const DefaultExcel = () => {
  const [rows, setRows] = useState([]);
  const rowRefs = useRef([]);
  const lastVisibleRowIndex = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const rowCount = Math.floor(window.innerHeight / 30) - 2; // 2는 인덱스 행과 기타 여백을 고려
      setRows(Array.from({ length: rowCount }));
    };

    handleResize(); // 초기 계산
    window.addEventListener("resize", handleResize); // 창 크기 변경 시 재계산

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let visibleRows = [];
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleRows.push(entry.target);
          }
        });

        if (visibleRows.length > 0) {
          const lastRow = visibleRows[visibleRows.length - 1];
          const lastRowIndex = rowRefs.current.indexOf(lastRow);

          if (
            lastVisibleRowIndex.current !== null &&
            rowRefs.current[lastVisibleRowIndex.current]
          ) {
            rowRefs.current[lastVisibleRowIndex.current].style.backgroundColor =
              "";
          }

          lastRow.style.backgroundColor = "#e6e6e6";
          lastVisibleRowIndex.current = lastRowIndex;
        }
      },
      { threshold: 0 }
    );

    rowRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      if (
        lastVisibleRowIndex.current !== null &&
        rowRefs.current[lastVisibleRowIndex.current]
      ) {
        rowRefs.current[lastVisibleRowIndex.current].style.backgroundColor = "";
      }
      observer.disconnect();
    };
  }, [rows]);
  return (
    <ExcelBody>
      <Index>
        <Indexnum />
        <IndexA />
        <IndexB />
        <IndexC />
        <IndexD />
        <IndexE />
        <IndexRecord />
        <IndexArchieve />
        <IndexF />
        <IndexMode />
        <IndexLogout />
        <IndexNull3 />
      </Index>
      {rows.map((_, rowIndex) => (
        <ExcelRow key={rowIndex} ref={(el) => (rowRefs.current[rowIndex] = el)}>
          <Num>{rowIndex + 1}</Num>
          <SectionA />
          <SectionB />
          <SectionC />
          <SectionD />
          <SectionE />
          <SectionRecord />
          <SectionArchieve />
          <SectionF />
          <SectionMode />
          <SectionLogout />
          <SectionNull3 />
        </ExcelRow>
      ))}
    </ExcelBody>
  );
};
export default DefaultExcel;

const ExcelBody = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 52px;
  left: 0;
  font-family: 'PreVariable'; /* Apply "Pretendard Variable" to all letters in the body part of the excel background */
`;

const ExcelRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const Section = styled.div`
  display: flex;
  align-items: center;
  font-weight: 400;
  font-size: 14px;
  height: 29px; /* Adjust height */
  border-right: 1px solid rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
`;

const SectionA = styled(Section)`
  width: 121px;
`;

const SectionB = styled(Section)`
  width: 119px;
`;

const Num = styled(Section)`
  width: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e6e6e6;
`;

const SectionC = styled(Section)`
  width: 225px;
`;

const SectionD = styled(Section)`
  width: 119px;
`;

const SectionMode = styled(Section)`
  width: 119px;
`;

const SectionRecord = styled(Section)`
  width: 119px;
`;

const SectionArchieve = styled(Section)`
  width: 119px;
`;

const SectionNull3 = styled(Section)`
  flex-grow: 1;
`;

const SectionE = styled(Section)`
  width: 137px;
`;

const SectionF = styled(Section)`
  width: 225px;
`;

const SectionLogout = styled(Section)`
  width: 120px;
`;

const Indexnum = styled(Num)``;

const IndexA = styled(SectionA)`
  background-color: #e6e6e6;
`;
const IndexB = styled(SectionB)`
  background-color: #e6e6e6;
`;

const IndexC = styled(SectionC)`
  background-color: #e6e6e6;
`;

const IndexD = styled(SectionD)`
  background-color: #e6e6e6;
`;

const IndexMode = styled(SectionMode)`
  background-color: #e6e6e6;
`;
const IndexRecord = styled(SectionRecord)`
  background-color: #e6e6e6;
`;
const IndexArchieve = styled(SectionArchieve)`
  background-color: #e6e6e6;
`;
const IndexNull3 = styled(SectionNull3)`
  background-color: #e6e6e6;
`;

const Index = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const IndexE = styled(SectionE)`
  background-color: #e6e6e6;
`;

const IndexF = styled(SectionF)`
  background-color: #e6e6e6;
`;

const IndexLogout = styled(SectionLogout)`
  background-color: #e6e6e6;
`;
