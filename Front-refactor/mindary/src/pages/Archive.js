import styled, {
  ThemeProvider as StyledThemeProvider,
} from "styled-components";
import Navbar from "../components/Navbar/Navbar1";
import Header from "../components/Header/Header";
import { useTheme } from "../styles/ThemeContext";
import DefaultExcel from "../components/Background/DefaultExcel";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import moment from "moment-timezone";
import SelectInput from "../components/Archieve/SelectInput";
import { axiosInstance } from "../api/api";
import DetailModal from "../components/Archieve/DetailModal";
import { downloadFile } from "../components/Record/DownloadFile";

const Archive = () => {
  const { theme, toggleTheme } = useTheme();
  const [imageurl, setImageURL] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlDate = queryParams.get("date");
  const initialDate = urlDate
    ? moment.tz(urlDate, "Asia/Seoul").toDate()
    : new Date();

  const [selectedDate, setSelectedDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  });
  const [subtitle, setSubtitle] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [keywordResults, setKeywordResults] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [keywordItemsPerPage] = useState(5);
  const [categoryResults, setCategoryResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("일상");
  const [selectedItemId, setSelectedItemId] = useState(null);
  const categories = [
    { value: "일상", label: "일상" },
    { value: "독서", label: "독서" },
    { value: "영화", label: "영화" },
    { value: "음악", label: "음악" },
    { value: "에세이", label: "에세이" },
    { value: "기타", label: "기타" },
    { value: "북마크", label: "북마크" },
  ];

  const indexOfLastCategoryItem = currentPage * itemsPerPage;
  const indexOfFirstCategoryItem = indexOfLastCategoryItem - itemsPerPage;
  const currentCategoryItems = categoryResults.slice(
    indexOfFirstCategoryItem,
    indexOfLastCategoryItem
  );
  const totalCategoryPages = Math.max(
    Math.ceil(categoryResults.length / itemsPerPage),
    1
  );

  const [currentKeywordPage, setCurrentKeywordPage] = useState(1);
  const indexOfLastKeywordItem = currentKeywordPage * keywordItemsPerPage;
  const indexOfFirstKeywordItem = indexOfLastKeywordItem - keywordItemsPerPage;
  const currentKeywordItems = keywordResults.slice(
    indexOfFirstKeywordItem,
    indexOfLastKeywordItem
  );
  const totalKeywordPages = Math.max(
    Math.ceil(keywordResults.length / keywordItemsPerPage),
    1
  );

  const handlePageChange = (event) => {
    const pageNumber = Number(event.target.value);
    if (pageNumber > 0 && pageNumber <= totalCategoryPages) {
      setCurrentPage(pageNumber);
    }
  };

  const openModal = (itemId) => {
    setSelectedItemId(itemId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItemId(null);
  };

  const handleSearchInputChange = (event) => {
    setSearchKeyword(event.target.value);
  };

  const handleKeywordPageChange = (event) => {
    const pageNumber = Number(event.target.value);
    if (pageNumber > 0 && pageNumber <= totalKeywordPages) {
      setCurrentKeywordPage(pageNumber);
    }
  };

  const handleKeywordSearch = async (event) => {
    if (event) event.preventDefault();
    try {
      const response = await axiosInstance.get(
        `mindary/records/archive?keyword=${searchKeyword}&order_by=desc`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setKeywordResults(response.data);
    } catch (error) {
      console.error("Error fetching keyword results:", error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleKeywordSearch();
    }
  };

  const handleCategoryChange = (selectedValue) => {
    setSelectedCategory(selectedValue);
  };

  useEffect(() => {
    const GetCategoryResults = async () => {
      if (selectedCategory) {
        try {
          const response = await axiosInstance.get(
            `mindary/records/archive?category=${selectedCategory}&order_by=desc`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
            }
          );
          setCategoryResults(response.data);
        } catch (error) {
          console.error("Error fetching category results:", error);
        }
      }
    };
    GetCategoryResults();
  }, [selectedCategory]);

  useEffect(() => {
    const categoryFromUrl = queryParams.get("category");
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [location.search]);

  const [summaryImageUrl, setSummaryImageUrl] = useState();
  const yearMonth = `${selectedDate.getFullYear()}${("0" + (selectedDate.getMonth() + 1)).slice(-2)}`;
  const fullImageUrl = `http://127.0.0.1:8000${imageurl}`;

  const getMonthlySummaryImage = async (yearMonth) => {
    try {
      const response = await axiosInstance.get(
        `/mindary/records/archive/get-wordcloud?date=${yearMonth}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setImageURL(response.data.image_url);
    } catch (error) {
      console.error("Error fetching monthly summary image:", error);
    }
  };

  useEffect(() => {
    const fetchSummaryImage = async () => {
      await getMonthlySummaryImage(yearMonth);
    };
    fetchSummaryImage();
    setSubtitle(`${selectedDate.getMonth() + 1}월의 월말결산`);
  }, [selectedDate]);

  const handleDateChange = (event) => {
    const { name, value } = event.target;
    const numericValue = parseInt(value, 10);
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate);
      if (name === "year") {
        if (!isNaN(numericValue) && numericValue > 0) {
          newDate.setFullYear(numericValue);
        }
      } else if (name === "month") {
        if (!isNaN(numericValue) && numericValue >= 1 && numericValue <= 12) {
          newDate.setMonth(numericValue - 1);
        }
      }
      return newDate;
    });
  };

  const handleDownloadButtonClick = () => {
    if (imageurl) {
      downloadFile(fullImageUrl, "월말 결산.png");
    } else {
      alert("지난달 결산을 하지 않아 이미지를 찾을 수 없습니다.");
    }
  };

  return (
    <StyledThemeProvider theme={theme}>
      <Mainpage>
        <HeaderBase>
          <Header />
        </HeaderBase>
        <DefaultExcel />
        <Navbar
          toggleTheme={toggleTheme}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
        <Container>
          <KeywordSection>
            <KeywordSearching>
              <Title>제목 검색</Title>
              <SearchBar>
                <SearchInput
                  placeholder="키워드로 검색하세요."
                  value={searchKeyword} // 입력 값을 상태와 연결
                  onChange={handleSearchInputChange}
                  onKeyDown={handleKeyPress}
                />
                <SearchBtn onClick={handleKeywordSearch}>검색</SearchBtn>
              </SearchBar>
            </KeywordSearching>
            <KeywordResult>
              <Title>검색결과</Title>
              {currentKeywordItems.map((item) => (
                <>
                  <KeywordContainer
                    key={item.id}
                    onClick={() => openModal(item.id)}
                  >
                    <SubTitle>
                      {item.category}/
                      {moment(item.created_at).format("YYYY.MM.DD")}
                    </SubTitle>
                    <ResultContent>{item.title}</ResultContent>
                  </KeywordContainer>
                </>
              ))}
              <PageContent>
                <PageInfo style={{ border: "none" }}>페이지 설정</PageInfo>
                <PageMoveInput
                  type="number"
                  min="1"
                  max={totalKeywordPages}
                  value={currentKeywordPage}
                  onChange={handleKeywordPageChange}
                />
                / {totalKeywordPages}
              </PageContent>
            </KeywordResult>
          </KeywordSection>
          <DateSection>
            <KeywordSearching>
              <Title>결산 검색</Title>
              <SearchBar>
                <YearInput
                  type="number"
                  name="year"
                  value={selectedDate.getFullYear() || ""}
                  placeholder="2024"
                  onChange={handleDateChange}
                />
                <InputInfo>년</InputInfo>
                <MonthInput
                  type="number"
                  name="month"
                  value={selectedDate.getMonth() + 1 || ""}
                  placeholder="8"
                  onChange={handleDateChange}
                />
                <InputInfo style={{ borderRight: "none" }}>월</InputInfo>
              </SearchBar>
            </KeywordSearching>
            <KeywordResult>
              <Title>지난 결산</Title>
              <ResultContainer>
                <SubTitle
                  style={{
                    backgroundColor: theme.background,
                  }}
                >
                  {subtitle}
                </SubTitle>
                <ResultContent>
                  <SummaryImage
                    onClick={handleDownloadButtonClick}
                    src={summaryImageUrl}
                  >
                    월말 결산.pdf
                  </SummaryImage>
                </ResultContent>
              </ResultContainer>
            </KeywordResult>
          </DateSection>
          <CategorySection>
            <KeywordSearching>
              <Title>카테고리 선택</Title>
              <SearchBar style={{ border: "none" }}>
                <SelectInput
                  id="category"
                  options={categories.map((category) => category.label)} // 옵션으로 표시할 라벨을 전달합니다.
                  placeholder="카테고리를 선택하세요."
                  onChange={handleCategoryChange} // 선택된 값이 변경될 때 호출되는 함수
                />
              </SearchBar>
            </KeywordSearching>
            <KeywordResult>
              <Title>{selectedCategory}</Title>
              <CategoryResult>
                <HeaderRow>
                  <CategoryDate style={{ background: theme.background }}>
                    날짜
                  </CategoryDate>
                  <CategoryTitle style={{ background: theme.background }}>
                    제목
                  </CategoryTitle>
                </HeaderRow>
                {currentCategoryItems.map((item, index) => (
                  <CategoryContainer
                    key={index}
                    onClick={() => openModal(item.id)}
                  >
                    <CategoryDate>
                      {moment(item.created_at).format("YY.MM.DD")}
                    </CategoryDate>
                    <CategoryTitle>{item.title}</CategoryTitle>
                  </CategoryContainer>
                ))}
                <PageContent1>
                  <PageInfo>페이지 설정</PageInfo>
                  <PageMoveInput
                    type="number"
                    min="1"
                    max={totalCategoryPages}
                    value={currentPage}
                    onChange={handlePageChange}
                  />
                  / {totalCategoryPages}
                </PageContent1>
              </CategoryResult>
            </KeywordResult>
          </CategorySection>{" "}
          <DetailModal
            isOpen={isModalOpen}
            onClose={closeModal}
            itemId={selectedItemId}
          />
        </Container>
      </Mainpage>
    </StyledThemeProvider>
  );
};

export default Archive;

const Mainpage = styled.div``;

const HeaderBase = styled.div`
  display: flex;
  width: 100%;
  position: fixed;
  top: 0;
`;

const Container = styled.div`
  top: 142px;
  left: 167px;
  position: fixed;
  display: flex;
  justify-content: center;
  font-family: "PreVariable";
`;
const KeywordSection = styled.div`
  width: 344px;
`;
const DateSection = styled.div`
  width: 256px;
  margin-left: 119px;
`;
const CategorySection = styled.div`
  width: 344px;
  margin-left: 119px;
`;

const KeywordSearching = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

const Title = styled.span`
  display: flex;
  align-items: center;
  font-weight: 700;
  height: 30px;
  font-size: 18px;
  padding-left: 5px;
`;

const SearchBar = styled.div`
  border: 1px solid black;
  box-sizing: border-box;
  height: 30px;
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-bottom: 30px;
`;

const SearchInput = styled.input`
  display: flex;
  align-items: center;
  width: 85%;
  border: none;
  padding-left: 10px;
  &::placeholder {
    color: #cccccc;
    font-size: 14px;
  }
`;

const SearchBtn = styled.button`
  width: 15%;
  height: 100%;
  box-sizing: border-box;
  border-left: 1px solid black;
  text-decoration: underline;
`;

const KeywordResult = styled.div`
  display: flex;
  flex-direction: column;
  height: 510px;
  width: 344px;
`;

const KeywordContainer = styled.div`
  border: 1px solid black;
  box-sizing: border-box;
  height: 60px;
  width: 344px;
  cursor: pointer;
  margin-bottom: 30px;
`;

const ResultContainer = styled.div`
  border: 1px solid black;
  box-sizing: border-box;
  height: 60px;
  width: 256px;
  margin-bottom: 30px;
`;

const SubTitle = styled.span`
  font-size: 16px;
  font-weight: 400;
  height: 29px;
  width: 100%;
  display: flex;
  padding-left: 10px;
  align-items: center;
  background-color: #e9e9e9;
  box-sizing: border-box;
  border-bottom: 1px solid black;
`;

const ResultContent = styled.div`
  background-color: white;
  height: 29px;
  padding-left: 10px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
`;

const InputInfo = styled.span`
  height: 29px;
  width: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid black;
  border-left: 1px solid black;
  box-sizing: border-box;
`;

const YearInput = styled.input`
  width: 100px;
  border: none;
  text-align: right;
  padding-right: 5px;
`;

const MonthInput = styled.input`
  border: none;
  padding-right: 5px;
  text-align: right;
  width: 80px;
`;

const CategoryResult = styled.div`
  height: 360px;
  width: 100%;
  border: 1px solid black;
  box-sizing: border-box;
  position: relative;
`;

const PageContent = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: row;
  width: 343px;
  box-sizing: border-box;
  background-color: white;
  border-left: 1px solid #cccccc;
  border-bottom: 1px solid #cccccc;
  left: 0;
  visibility: ${(props) => (props.totalPages === 0 ? "hidden" : "visible")};
`;

const PageContent1 = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: row;
  height: 29px;
  box-sizing: border-box;
  background-color: white;
  left: 0;
  visibility: ${(props) => (props.totalPages === 0 ? "hidden" : "visible")};
`;

const PageInfo = styled.div`
  display: flex;
  align-items: center;
  width: 119px;
  height: 29px;
  display: flex;
  box-sizing: border-box;
  padding-left: 10px;
  border-right: 1px solid black;
`;

const PageMoveInput = styled.input`
  margin-left: 5px;
  width: 44px;
  background-color: #e9e9e9;
  height: 22px;
  border: none;
  text-align: right;
  box-shadow: 0px 0px 2px 0px rgb(0, 0, 0, 0, 0.25) inset;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #f0f0f0;
  box-sizing: border-box;
`;
const CategoryDate = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 400;
  height: 29.5px;
  padding-left: 10px;
  border-bottom: 1px solid black;
  width: 126px;
  border-right: 1px solid black;
  background-color: white;
  box-sizing: border-box;
`;
const CategoryTitle = styled(CategoryDate)`
  flex: 1;
  border-right: none;
`;

const CategoryContainer = styled.div`
  height: 30px;
  cursor: pointer;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  background-color: white;
`;

const SummaryImage = styled.div`
  width: 100%;
  height: auto;
  text-decoration: underline;
  display: block;
  cursor: pointer;
  margin: auto;
`;
