// components/Modal/DetailModal.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { axiosInstance } from "../../api/api";
import moment from "moment";

const formatDate = (date) => {
  return moment(date).format("M월 D일 일지");
};

const DetailModal = ({ isOpen, onClose, itemId, created_at }) => {
  const [itemDetails, setItemDetails] = useState(null);

  useEffect(() => {
    const fetchItemDetails = async () => {
      if (itemId) {
        try {
          const response = await axiosInstance.get(
            `mindary/records/archive/${itemId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
            }
          );
          setItemDetails(response.data);
        } catch (error) {
          console.error("Error fetching item details:", error);
        }
      }
    };

    fetchItemDetails();
  }, [itemId]);

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        {itemDetails ? (
          <>
            <ItemDate>{formatDate(created_at)}</ItemDate>
            <InfoContainer>
              <Category>
                <ItemCategory>분야</ItemCategory>
                <CategoryInfo>{itemDetails.category}</CategoryInfo>
              </Category>
              <Title>
                <ItemTitle>제목</ItemTitle>
                <TitleInfo>{itemDetails.title}</TitleInfo>
              </Title>
              <Content>
                <ItemContent>본문</ItemContent>
                <ContentInfo>{itemDetails.content}</ContentInfo>
              </Content>
            </InfoContainer>
          </>
        ) : (
          <p>Loading...</p>
        )}
        <CloseButton onClick={onClose}>닫기</CloseButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default DetailModal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: white;
  width: 460px;
  height: 480px;
  max-height: 80%;
  overflow-y: auto;
  position: relative;
  border: 1px solid black;
  box-sizing: border-box;
`;

const CloseButton = styled.button`
  position: absolute;
  bottom: 5px;
  right: 10px;
  border: none;
  text-decoration: underline;
  background: transparent;
  z-index: 1000;
  font-size: 14px;
  cursor: pointer;
`;

const ItemDate = styled.div`
  width: 100%;
  height: 30px;
  box-sizing: border-box;
  border-bottom: 1px solid black;
  font-size: 18px;
  padding: 5px;
  font-weight: 900;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const Category = styled.div`
  flex-direction: row;
  display: flex;
  height: 30px;
  border-bottom: 1px solid black;
  box-sizing: border-box;
`;

const ItemCategory = styled.div`
  display: flex;
  align-items: center;
  width: 43px;
  background-color: #f4f4f4;
  padding-left: 5px;
  height: 29px;
  border-right: 1px solid black;
  box-sizing: border-box;
`;

const CategoryInfo = styled.div`
  height: 30px;
  display: flex;
  padding-left: 5px;
  align-items: center;
  width: 100%;
`;
const Title = styled(Category)``;

const Content = styled.div`
  flex-direction: row;
  display: flex;
  height: 360px;
  border-bottom: 1px solid black;
  box-sizing: border-box;
`;
const ItemTitle = styled(ItemCategory)``;
const TitleInfo = styled(CategoryInfo)``;
const ItemContent = styled(ItemCategory)`
  height: 359px;
`;
const ContentInfo = styled.div`
  overflow-y: auto; /* 스크롤 가능 */
  height: 355px;
  display: flex;
  padding-left: 5px;
  padding-top: 5px;
  width: 100%;
`;
