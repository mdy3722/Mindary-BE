import React from "react";
import styled from "styled-components";

const ToggleContainer = styled.div`
  position: relative;
  display: flex;
  position: fixed;
  align-items: center;
  justify-content: flex-start;
  margin-left: 123px;

  .toggle-container {
    width: 40.8px;
    height: 18px;
    background-color: rgb(233, 233, 234);
    border: 1.5px solid #cccccc;
    transition: background-color 0.5s;
    background-color: transparent;
    display: flex; /* 자식 요소를 포함하는 Flex 컨테이너 */
    align-items: center; /* 자식 요소를 세로 중앙 정렬 */
    padding-right: 2px; /* 토글 서클과 컨테이너 사이의 간격 */
    cursor: pointer;
  }

  .toggle-container.toggle--checked {
    background-color: #8a8a8a;
  }

  .toggle-circle {
    width: 14px;
    height: 16px;
    background: linear-gradient(270deg, #e2e2e2 0%, #f0f0f0 50%, #e2e2e2 100%);
    border: 1.5px solid #cccccc;
    transition: transform 0.5s; /* 위치 이동 애니메이션 */
    transform: translateX(0); /* 기본 위치 */
    position: relative; /* 작대기 위치를 위한 상대 위치 */
    display: flex; /* 내부 작대기들을 위한 Flex 컨테이너 */
    justify-content: center; /* 가로 중앙 정렬 */
    align-items: center; /* 세로 중앙 정렬 */
    overflow: hidden; /* 내용이 넘치지 않도록 */

    /* 작대기 3개 추가 */
    &::before,
    &::after,
    .line {
      content: "";
      position: absolute;
      height: 7px;
      width: 2px;
      background-color: #cccccc;
    }

    &::before {
      left: 2px;
    }

    .line {
      left: 50%;
      transform: translateX(-50%);
    }

    &::after {
      right: 2px;
    }
  }

  .toggle-container.toggle--checked .toggle-circle {
    transform: translateX(23px); /* 오른쪽으로 이동 */
  }
`;

export const Toggle = ({ isOn, toggleHandler }) => {
  return (
    <ToggleContainer onClick={toggleHandler}>
      <div className={`toggle-container ${isOn ? "toggle--checked" : ""}`}>
        <div className={`toggle-circle ${isOn ? "toggle--checked" : ""}`}>
          <div className="line"></div>
        </div>
      </div>
    </ToggleContainer>
  );
};
