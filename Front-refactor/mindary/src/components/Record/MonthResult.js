import React, { useState } from "react";
import { axiosInstance } from "../../api/api";
import styled from "styled-components";
import moment from "moment";
import { downloadFile } from "./DownloadFile";

const MonthResult = ({ selectedDate }) => {
  const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
  const [image_url, setImage_URL] = useState();

  const getMonthResult = async () => {
    try {
      const response = await axiosInstance.get(
        `/mindary/records/wordcloud/get-wordcloud?date=${formattedDate}&wordcloud=month`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
  
      if (response.status === 204) {
        alert("지난달 작성한 글이 없어 결산 이미지를 생성할 수 없습니다!");
        return;
      }
  
      const imageUrl = response.data.image_url;
      if (!imageUrl) {
        alert("이미지 URL이 존재하지 않습니다.");
        return;
      }
  
      const fullImageUrl = `http://127.0.0.1:8000${image_url}`;
      await downloadFile(fullImageUrl, "월말 결산.png"); 
  
    } catch (error) {
      alert("이미지 생성 또는 확인에 실패했습니다.");
      console.error("Error: ", error);
    }
  };
  
  

  return (
    <Month>
      <Container>
        <Title>{`${selectedDate.getMonth() + 1}월의 월말 결산 (매월 마지막주 업데이트)`}</Title>
        <PdfBlock onClick={getMonthResult}>월말 결산.png</PdfBlock>
      </Container>
      <Detail>지난 결산들은 Archive 탭에서 확인 가능합니다.</Detail>
    </Month>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 342px;
  margin-top: 29px;
  border: 1px solid black;
`;

const Title = styled.span`
  display: flex;
  align-items: center;
  height: 29px;
  font-size: 16px;
  padding-left: 10px;
  border-bottom: 1px solid black;
  background-color: ${({ theme }) => theme.background};
`;

const PdfBlock = styled.div`
  display: flex;
  padding-left: 10px;
  align-items: center;
  cursor: pointer;
  text-decoration: underline;
  height: 29px;
`;
const Detail = styled.div`
  display: flex;
  align-items: center;
  width: 416px;
  height: 29px;
  font-size: 14px;
  padding-left: 10px;
  font-weight: 400;
  color: #cccccc;
`;

const Month = styled.div`
  display: flex;
  flex-direction: column;
  font-family: "PreVariable";
`;

export default MonthResult;
