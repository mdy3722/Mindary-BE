import styled from "styled-components";
import { axiosInstance } from "../../api/api";
import { useState } from "react";
import moment from "moment";
import { downloadFile } from "./DownloadFile";

const WeekResult = ({ selectedDate }) => {
  const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
  const [image_url, setImage_URL] = useState();
  const fullImageUrl = `http://127.0.0.1:8000${image_url}`;

  const getWeekResult = async () => {
    try {
      const response = await axiosInstance.get(
        `/mindary/records/wordcloud/get-wordcloud?date=${formattedDate}&wordcloud=week`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      // ✨ 여기서 204(No Content) 응답 처리
      if (response.status === 204) {
        alert("지난주 작성한 글이 없어 결산 이미지를 생성할 수 없습니다!");
        return;
      }
      
      const imageUrl = response.data.image_url;
      setImage_URL(imageUrl);
  
      if (imageUrl) {
        const fullImageUrl = `http://127.0.0.1:8000${imageUrl}`;
        downloadFile(fullImageUrl, "주간 결산.png");
      }
    } catch (error) {
      console.error("Error fetching URL: ", error);
    }
  };
  

  return (
    <Container>
      <Title>이번주 마음 결산</Title>
      <PdfBlock onClick={getWeekResult}>주간 결산.png</PdfBlock>
    </Container>
  );
};

export default WeekResult;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 342px;
  border: 1px solid black;
  font-family: "PreVariable";
`;
const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const Title = styled.span`
  display: flex;
  align-items: center;
  height: 29px;
  font-size: 16px;
  padding-left: 10px;
  border-bottom: 1px solid black;
  background-color: #f4f4f4;
`;

const PdfBlock = styled.div`
  display: flex;
  padding-left: 10px;
  cursor: pointer;
  align-items: center;
  text-decoration: underline;
  height: 29px;
`;
