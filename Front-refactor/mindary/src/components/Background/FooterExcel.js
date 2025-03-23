import React, { useEffect, useState, useRef, useCallback } from "react";
import styled from "styled-components";

const FooterExcel = () => {
  const [rows, setRows] = useState([]);
  const rowRefs = useRef([]);
  const lastVisibleRowIndex = useRef(null);

  const handleResize = useCallback(() => {
    const rowCount = Math.floor(window.innerHeight / 30) - 2; // 2는 인덱스 행과 기타 여백을 고려
    setRows(Array.from({ length: rowCount }));
  }, []);

  useEffect(() => {
    handleResize(); // 초기 계산
    window.addEventListener("resize", handleResize); // 창 크기 변경 시 재계산

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

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
          {rowIndex === 22 && (
            <>
              <SectionA style={{ color: "#B3B3B3", fontWeight: 700 }}>
                &nbsp; 학교명
              </SectionA>
              <SectionB style={{ color: "#B3B3B3", fontWeight: 700 }}>
                &nbsp; 팀명
              </SectionB>
              <SectionC style={{ color: "#B3B3B3", fontWeight: 700 }}>
                &nbsp; 참여자
              </SectionC>
              <SectionD />
              <SectionE />
              <SectionRecord />
              <SectionArchieve />
              <SectionF />
              <SectionMode />
              <SectionLogout />
              <SectionNull3 />
            </>
          )}
          {rowIndex === 23 && (
            <>
              <SectionA style={{ color: "#B3B3B3", fontWeight: 700 }}>
                &nbsp; 홍익대학교
              </SectionA>
              <SectionB style={{ color: "#B3B3B3", fontWeight: 700 }}>
                &nbsp; mind on
              </SectionB>
              <SectionC style={{ color: "#B3B3B3", fontWeight: 700 }}>
                &nbsp; 진예원 박소은 강민석 원채영
              </SectionC>
              <SectionD style={{ color: "#B3B3B3", fontWeight: 700 }}>
                &nbsp; 김태경 문덕영
              </SectionD>
              <SectionE />
              <SectionRecord />
              <SectionArchieve />
              <SectionF />
              <SectionMode />
              <SectionLogout />
              <SectionNull3 />
            </>
          )}
          {rowIndex !== 22 && rowIndex !== 23 && (
            <>
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
            </>
          )}
        </ExcelRow>
      ))}
    </ExcelBody>
  );
};

export default FooterExcel;

const ExcelBody = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 52px; /* Positioned below the header */
  left: 0;
  width: 100%;
  height: 100%;
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
  color: #b3b3b3;
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
  display: flex;
  justify-content: center;
  align-items: center;
  width: 46px;
  color: black;
  background-color: #e6e6e6;
`;

const SectionC = styled(Section)`
  width: 225px;
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
`;

const SectionRecord = styled(Section)`
  width: 119px;
`;

const SectionArchieve = styled(Section)`
  width: 119px;
`;

const SectionLogout = styled(Section)`
  width: 120px;
`;

const SectionNull3 = styled(Section)`
  flex-grow: 1; /* Expand to fill remaining space */
`;

const Index = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
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

const IndexE = styled(SectionE)`
  background-color: #e6e6e6;
`;

const IndexF = styled(SectionF)`
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

const IndexLogout = styled(SectionLogout)`
  background-color: #e6e6e6;
`;

const IndexNull3 = styled(SectionNull3)`
  background-color: #e6e6e6;
`;
