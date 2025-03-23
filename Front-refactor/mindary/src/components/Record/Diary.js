import React, { useState, useEffect } from "react";
import styled from "styled-components";
import moment from "moment-timezone";
import Memo from "./Memo";
import { Toggle } from "./Toggle";
import WritePage from "./WritePage";
import { axiosInstance } from "../../api/api";
import BookmarkEmpty from "../../assets/images/emptyBookmark.svg"; // Adjust path as needed
import BookmarkFilled from "../../assets/images/FilledBookmark.svg";
import { useNavigate, useLocation } from "react-router-dom";

const Diary = ({ selectedDate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChat, setIsChat] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [memos, setMemos] = useState([]);
  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    liked: false,
  });
  const handleRecordSelect = (record) => {
    setSelectedRecord(record);
    setSelectedCategory(record.category); // Ensure category is set for editing
    setFormData({
      title: record.title,
      content: record.content,
      liked: record.liked,
    });
    setIsEditing(true);
    setCurrentStep(1);
  };
  const isSelectedRecord = (record) =>
    selectedRecord && selectedRecord.id === record.id;
  const formattedDate = moment(selectedDate)
    .tz("Asia/Seoul")
    .format("YYYY-MM-DD");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const mode = queryParams.get("mode");
    setIsChat(mode === "record");

    setIsEditing(false);
    setCurrentStep(0);
    setSelectedCategory(null);
  }, [location]);

  useEffect(() => {
    if (!isChat) {
      getRecords();
    } else {
      getMemos();
    }
  }, [isChat, selectedDate]);

  const getMemos = async () => {
    try {
      const response = await axiosInstance.get(
        `/mindary?date=${formattedDate}&mode=chat`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setMemos(response.data);
    } catch (error) {
      console.error("Error fetching memos:", error);
    }
  };

  const getRecords = async () => {
    try {
      const response = await axiosInstance.get(
        `/mindary?date=${formattedDate}&mode=record`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setRecords(response.data);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  const handleToggle = () => {
    const newMode = isChat ? "chat" : "record";
    setIsChat((prev) => !prev);
    navigate(`/mindary?date=${formattedDate}&mode=${newMode}`);
  };

  const handleEditClick = () => {
    if (selectedRecord) {
      setIsEditing(true);
      setCurrentStep(1);
    } else {
      setIsEditing(true);
      setCurrentStep(0);
      setFormData({
        title: "",
        content: "",
        liked: false,
      });
      setSelectedCategory(null);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };
  const truncateText = (text, maxLength) => {
    return text.length > maxLength
      ? text.slice(0, maxLength) + "\u00B7" + "\u00B7" + "\u00B7"
      : text;
  };
  const handlePreviousStep = () => {
    if (currentStep === 1 && selectedRecord) {
      setIsEditing(false);
      setSelectedRecord(null); // Clear the selected record
      setCurrentStep(0); // Go back to the list of records
    } else if (currentStep === 1) {
      setIsEditing(false);
      setSelectedCategory(null);
      setCurrentStep(0);
    } else {
      setIsEditing(false);
      setSelectedCategory(null);
      setCurrentStep(0);
    }
  };

  const handleNextStep = () => {
    if (selectedCategory) {
      setCurrentStep(1);
    }
  };
  const handleBookmarkClick = async (record) => {
    try {
      const newLikedState = !record.liked;

      await axiosInstance.patch(
        `/mindary/${record.id}?date=${formattedDate}&mode=record`,
        {
          liked: newLikedState,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      // Update local state for bookmark status
      setRecords((prevRecords) =>
        prevRecords.map((r) =>
          r.id === record.id ? { ...r, liked: newLikedState } : r
        )
      );
    } catch (error) {
      console.error("Failed to update liked state:", error);
      alert("북마크 상태 업데이트 실패");
    }
  };
  const handleSave = async () => {
    if (selectedRecord) {
      try {
        await axiosInstance.patch(
          `/mindary/${selectedRecord.id}?date=${formattedDate}&mode=record`,
          {
            title: formData.title,
            content: formData.content,
            liked: formData.liked,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        alert("수정되었습니다.");
      } catch (error) {
        console.error("Failed to update data:", error);
        alert("수정 실패");
      }
    } else {
      try {
        await axiosInstance.post(
          `/mindary?date=${formattedDate}&mode=record`,
          {
            title: formData.title,
            category: selectedCategory,
            content: formData.content,
            liked: formData.liked,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        alert("저장되었습니다.");
      } catch (error) {
        console.error("Failed to post data:", error);
        alert("저장 실패");
      }
    }
    setIsEditing(false);
    setSelectedRecord(null);
    setFormData({ title: "", content: "", liked: false }); // Reset form data
    getRecords();
  };
  const handleDelete = async () => {
    if (selectedRecord) {
      try {
        await axiosInstance.delete(
          `/mindary/${selectedRecord.id}?date=${formattedDate}&mode=record`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        alert("삭제되었습니다.");
        setSelectedRecord(null);
        setIsEditing(false);
        getRecords();
      } catch (error) {
        console.error("Failed to delete data:", error);
        alert("삭제 실패");
      }
    }
  };

  const handleFormDataChange = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };
  const getSaveButtonText = () => (selectedRecord ? "수정하기" : "등록하기");

  return (
    <Container>
      <TitleBox>
        <Title>
          {moment(selectedDate).tz("Asia/Seoul").format("M월 D일 일지")}
        </Title>
        <Toggle isOn={isChat} toggleHandler={handleToggle} />
      </TitleBox>
      <BodyContainer>
        {isChat ? (
          <Body>
            <SubTitle>
              <SubTitle1>분야</SubTitle1>
              <SubTitle2>제목</SubTitle2>
              <SubTitle3>
                {isEditing && currentStep === 1 ? "본문" : "미리보기"}
              </SubTitle3>
            </SubTitle>
            <Content isEditing={isEditing} currentStep={currentStep}>
              {isEditing ? (
                currentStep === 0 ? (
                  <WriteSection isEditing={isEditing} currentStep={currentStep}>
                    {["일상", "영화", "음악", "독서", "에세이", "기타"].map(
                      (category) => (
                        <WriteItem
                          key={category}
                          onClick={() => handleCategorySelect(category)}
                          isSelected={selectedCategory === category}
                        >
                          <WriteCategory>{category}</WriteCategory>
                          <WriteTitle />
                          <WriteContent />
                        </WriteItem>
                      )
                    )}
                  </WriteSection>
                ) : (
                  <WritePage
                    selectedDate={selectedDate}
                    category={selectedCategory}
                    formData={formData}
                    onFormDataChange={handleFormDataChange}
                  />
                )
              ) : (
                records.map((record) => (
                  <Record
                    key={record.id}
                    onClick={() => handleRecordSelect(record)}
                    isSelected={isSelectedRecord(record)}
                    onBookmarkClick={() => handleBookmarkClick(record)}
                  >
                    <Category>{record.category}</Category>
                    <RecordTitle>{truncateText(record.title, 13)}</RecordTitle>
                    <RecordContent>
                      {truncateText(record.content, 89)}
                      <BookmarkIcon
                        src={record.liked ? BookmarkFilled : BookmarkEmpty}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookmarkClick(record);
                        }}
                      />
                    </RecordContent>
                  </Record>
                ))
              )}
            </Content>
            <BtnContent
              isEditing={isEditing}
              currentStep={currentStep}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              {isEditing ? (
                <>
                  {currentStep === 0 && (
                    <>
                      <PreviousBtn onClick={handlePreviousStep}>
                        이전 단계
                      </PreviousBtn>
                      <NextBtn onClick={handleNextStep}>다음 단계</NextBtn>
                    </>
                  )}
                  {currentStep === 1 && (
                    <>
                      <PreviousBtn onClick={handlePreviousStep}>
                        이전 단계
                      </PreviousBtn>
                      {selectedRecord && (
                        <DeleteBtn onClick={handleDelete}>삭제하기</DeleteBtn>
                      )}
                      <SaveBtn onClick={handleSave}>
                        {getSaveButtonText()}
                      </SaveBtn>
                    </>
                  )}
                </>
              ) : (
                <WriteBtn onClick={handleEditClick}>작성하기</WriteBtn>
              )}
            </BtnContent>
          </Body>
        ) : (
          <Memo selectedDate={selectedDate} memos={memos} />
        )}
      </BodyContainer>
    </Container>
  );
};

export default Diary;

// Styled components
const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  font-family: "PreVariable";
`;

const Body = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  border: 1px solid black;
  width: 462px;
  height: 480px;
  box-sizing: border-box;
`;

const Title = styled.span`
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: fixed;
  top: 171px;
  left: 767px;
  width: 465px;
  font-family: "Pretendard";
`;

const TitleBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 30px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: ${(props) =>
    props.isEditing && props.currentStep === 1 ? "420px" : "360px"};
  overflow-y: ${(props) => (props.isEditing ? "hidden" : "auto")};
  box-sizing: border-box;
`;

const SubTitle = styled.div`
  display: flex;
  width: 100%;
  height: 29px;
  background-color: #f4f4f4;
  flex-direction: row;
  border-bottom: 1px solid black;
`;

const SubTitle1 = styled.div`
  display: flex;
  justify-content: center;
  border-right: 1px solid black;
  align-items: center;
  font-size: 14px;
  font-weight: 700;
  width: 43px;
`;

const SubTitle2 = styled(SubTitle1)`
  width: 73px;
`;

const SubTitle3 = styled(SubTitle1)`
  width: 343px;
  border-right: none;
`;

const Record = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  cursor: pointer;
  box-sizing: border-box;
  border-top: ${(props) => (props.isSelected ? "1.5px solid #0066FF" : "none")};
  border-bottom: ${(props) =>
    props.isSelected ? "1.5px solid #0066FF" : "1px solid black"};
  border-left: ${(props) =>
    props.isSelected ? "1.5px solid #0066FF" : "none"};
  border-right: ${(props) =>
    props.isSelected ? "1.5px solid #0066FF" : "none"};
  transform: ${(props) => (props.isSelected ? "translateZ(5px)" : "none")};
`;

const RecordTitle = styled(SubTitle2)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0; /* 축소되지 않도록 설정 */
  height: 89px;
  background-color: white;
  width: 73px;
  text-align: center;
  font-weight: 400;
`;

const RecordContent = styled(SubTitle3)`
  display: flex;
  width: 80%;
  padding-left: 5px;
  padding-right: 5px;
  align-items: center;
  position: relative;
  background-color: white;
  font-weight: 400;
  text-align: center;
`;

const Category = styled(SubTitle1)`
  flex-shrink: 0; /* 축소되지 않도록 설정 */
  width: 43px;
  background-color: ${({ theme }) => theme.background};
`;

const WriteBtn = styled.button`
  display: flex;
  right: 3px;
  bottom: 5px;
  position: absolute;
  align-items: center;
  cursor: pointer;
  text-decoration: underline;
`;

const SaveBtn = styled(WriteBtn)``;

const BtnContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 29px;
  width: 100%;
  background-color: white;
  border-top: 1px solid black;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
`;

const WriteSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 360px;
  overflow-y: ${(props) =>
    props.isEditing && props.currentStep === 1 ? "hidden" : "auto"};
`;

const WriteItem = styled.div`
  display: flex;
  height: 62px;
  cursor: pointer;
  box-sizing: border-box;
  font-size: 14px;
  align-items: center;
  border-bottom: 1px solid black;
  border-top: ${({ isSelected }) => (isSelected ? "1.5px solid #0066FF" : "")};
  border-right: ${({ isSelected }) =>
    isSelected ? "1.5px solid #0066FF" : ""};
  border-bottom: ${({ isSelected }) =>
    isSelected ? "1.5px solid #0066FF" : ""};
  border-left: ${({ isSelected }) => (isSelected ? "1.5px solid #0066FF" : "")};
  transform: ${({ isSelected }) => (isSelected ? "translateZ(5px)" : "none")};
`;

const WriteCategory = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  width: 44px;
  background-color: white;
  height: 59px;
  border-right: 1px solid black;
  box-sizing: border-box;
`;

const WriteTitle = styled.div`
  width: 73px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 59px;
  background-color: white;
  border-right: 1px solid black;
  text-align: center;
`;

const WriteContent = styled.div`
  background-color: white;
  text-align: center;
  flex: 1;
  height: 59px;
`;

const PreviousBtn = styled.button`
  cursor: pointer;
  padding-left: 10px;
  text-decoration: underline;
  border: none;
`;

const NextBtn = styled(PreviousBtn)``;
const DeleteBtn = styled(WriteBtn)`
  margin-right: 70px;
`;

const BookmarkIcon = styled.img`
  width: 12px;
  height: auto;
  cursor: pointer;
  padding: 5px;
  top: 8px;
  right: 8px;
  position: absolute;
`;
