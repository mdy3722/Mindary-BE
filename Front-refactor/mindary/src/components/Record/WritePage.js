import styled from "styled-components";
import { useState } from "react";
import { axiosInstance } from "../../api/api";
import moment from "moment";

const WritePage = ({ category, onFormDataChange, formData }) => {
  const handleTitleChange = (e) => {
    onFormDataChange({ title: e.target.value });
  };

  const handleContentChange = (e) => {
    onFormDataChange({ content: e.target.value });
  };

  return (
    <Wrapper>
      <Category>{category}</Category>
      <Title
        placeholder="제목을 입력하세요."
        value={formData.title || ""}
        onChange={handleTitleChange}
      />
      <Content
        placeholder="본문을 입력하세요."
        value={formData.content || ""}
        onChange={handleContentChange}
      />
    </Wrapper>
  );
};
export default WritePage;

const Wrapper = styled.div`
  display: flex;
  height: 500px;
  flex-direction: row;
  overflow-y: hidden;
`;

const Category = styled.div`
  display: flex;
  justify-content: center;
  width: 43px;
  padding-top: 15px;
  font-size: 14px;
  font-weight: 700;
  background-color: white;
  height: 100%;
  border-right: 1px solid black;
`;

const Title = styled.textarea`
  display: flex;
  padding: 5px;
  padding-top: 15px;
  width: 74px;
  border: none;
  background-color: white;
  font-size: 13px;
  resize: none; /* 텍스트 영역 크기 조절 막기 */
  outline: none; /* 포커스 시 외곽선 제거 */
  border-right: 1px solid black;
  height: 100%;
  box-sizing: border-box; /* 패딩과 테두리를 포함한 전체 크기 계산 */
  &::placeholder {
    color: #d0d0d0;
    padding: 5px;
    font-size: 13px;
  }
`;

const Content = styled.textarea`
  flex: 1;
  outline: none; /* 포커스 시 외곽선 제거 */
  resize: none; /* 텍스트 영역 크기 조절 막기 */
  border: none;
  background-color: white;
  font-size: 13px;
  height: 100%;
  box-sizing: border-box; /* 패딩과 테두리를 포함한 전체 크기 계산 */
  overflow: auto; /* 내용이 길어졌을 때 스크롤 생기도록 */
  &::placeholder {
    color: #d0d0d0;
    font-size: 13px;
    padding: 5px;
  }
  padding-left: 10px;
  padding-top: 15px;
`;
