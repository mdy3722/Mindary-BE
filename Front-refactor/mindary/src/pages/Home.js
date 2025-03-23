import React, { useState } from "react";
import styled, {
  ThemeProvider as StyledThemeProvider,
} from "styled-components";
import Header from "../components/Header/Header";
import Navbar from "../components/Navbar/NoLogoutNavbar";
import DefaultExcel from "../components/Background/DefaultExcel";
import kakaobtn from "../assets/images/kakao_login.png";
import { useTheme } from "../styles/ThemeContext";
import SearchPw from "../components/Auth/SearchPw";
import GeneralSignUp from "./GeneralSignUp";
import moment from "moment-timezone"; // Import timezone handling
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { theme, toggleTheme } = useTheme();
  const [showSearchPw, setShowSearchPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage1, setErrorMessage1] = useState("");
  const [errorMessage2, setErrorMessage2] = useState("");
  const [showSignUp, setShowSignUp] = useState(false);
  const navigate = useNavigate();

  const REST_API_KEY = process.env.REACT_APP_KAKAO_API_KEY; // REST API KEY
  const REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI; // Redirect URI
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
  const handleSearchPwClick = () => {
    setShowSearchPw((prevShowSearchPw) => !prevShowSearchPw);
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleKakaoLogin = () => {
    try {
      localStorage.setItem("isLoggedIn", "true");
      window.location.href = kakaoURL;
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleSignupClick = () => {
    setShowSignUp(true); // Show the sign-up page
    setShowSearchPw(false); // Hide the password search if open
    setErrorMessage1(""); // Clear any login error message
    setErrorMessage2(""); // Clear any login error message
    navigate("/signup");
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage2("※ 이메일 혹은 비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/mindary/accounts/original/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        alert("로그인 성공");

        localStorage.setItem("isLoggedIn", "true");
        setIsLoggedIn(true);
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);

        setErrorMessage1("");

        const todayDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
        navigate(`/mindary?date=${todayDate}&mode=chat`);
      } else if (response.status === 400) {
        setErrorMessage2("※ 이메일 혹은 비밀번호가 일치하지 않습니다.");
      } else if (response.status === 401) {
        setErrorMessage1("※ 존재하지 않는 계정입니다.");
      }
    } catch (error) {
      setErrorMessage1("로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <StyledThemeProvider theme={theme}>
      <HeaderBase>
        <Header />
      </HeaderBase>
      <DefaultExcel />
      <Navbar toggleTheme={toggleTheme} />
      <Body>
        <LoginBody>
          <LoginSection>
            <Title>로그인</Title>
            <InputSection>
              <TitleSection>
                <SubTitle>항목</SubTitle>
                <Description>마인더리와 함께하는 마음 기록</Description>
              </TitleSection>
              <EmailSection>
                <Label htmlFor="email">이메일</Label>
                <EmailInput
                  id="email"
                  placeholder="이메일을 입력해주세요."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </EmailSection>
              <PwSection>
                <Label htmlFor="password">비밀번호</Label>
                <PwInput
                  id="password"
                  type="password"
                  placeholder="비밀번호를 입력해주세요."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </PwSection>
              <SelectBar>
                <Signup onClick={handleSignupClick}>회원가입</Signup>
                <SearchPwbtn onClick={handleSearchPwClick}>
                  비밀번호 찾기
                </SearchPwbtn>
                <LoginBtn onClick={handleLogin}>로그인</LoginBtn>
              </SelectBar>
              <SimpleLoginWrapper>
                <SimpleLogin>간편 로그인</SimpleLogin>
                <KakaoBtn onClick={handleKakaoLogin} />
              </SimpleLoginWrapper>
            </InputSection>
            {showSearchPw && <SearchPw />}
          </LoginSection>

          <Error>
            {errorMessage1 && <ErrorMessage1>{errorMessage1}</ErrorMessage1>}
            {errorMessage2 && <ErrorMessage2>{errorMessage2}</ErrorMessage2>}
          </Error>
        </LoginBody>
      </Body>
    </StyledThemeProvider>
  );
};

export default Home;
const Error = styled.div`
  display: flex;
  margin-top: 60px;
  flex-direction: column;
`;
const Body = styled.div`
  width: 100%;
  display: flex;
  height: 100%;
  flex-direction: column;
  left: 510px;
  top: 261px;
  position: fixed;
  font-family: "PreVariable";
`;

const HeaderBase = styled.div`
  display: flex;
  width: 100%;
  height: 52px;
  justify-content: center;
  position: fixed;
  top: 0;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 29px;
  width: 374px;
  border-bottom: 1px solid black;
  background-color: ${({ theme }) => theme.background};
`;

const SubTitle = styled.span`
  font-size: 16px;
  font-weight: 700;
  height: 29px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-right: 1px solid black;
  width: 118px;
`;
const Description = styled.span`
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  width: 254px;
`;

const LoginSection = styled.div`
  display: flex;
  flex-direction: column;
  border: none;
  width: 100%;
  max-width: 376px;
`;
const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  background-color: white;
`;
const EmailSection = styled.div`
  display: flex;
  border-bottom: 1px solid black;
  height: 29px;
  flex-direction: row;
`;

const PwSection = styled(EmailSection)``;

const Title = styled.h1`
  display: flex;
  font-size: 16px;
  padding: 5px;
  font-weight: 900;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid black;
  font-size: 14px;
  width: 118.5px;
  font-weight: 700;
`;

const EmailInput = styled.input`
  display: flex;
  align-items: center;
  width: 248px;
  border: none;
  padding-left: 5px;
  font-size: 14px;
  &::placeholder {
    color: #cccccc;
    font-size: 16px;
    font-weight: 700;
    font-family: "PreVariable"; // Body에 font-family: 'PreVariable'; 이거를 써줬지만, 여기는 또 따로 더 써줘야 적용됨
  }

  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px white inset !important;
    box-shadow: 0 0 0 1000px white inset !important;
  }
`;

const PwInput = styled(EmailInput)``;

const LoginBtn = styled.button`
  height: 60px;
  width: 119px;
  color: black;
  text-decoration: underline;
  cursor: pointer;
  font-size: 14px;
  background-color: ${({ theme }) => theme.background};
  font-weight: 700;
`;

const SelectBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px solid black;
  height: 60px;
`;

const SearchPwbtn = styled(LoginBtn)`
  border-bottom: none;
  border-right: 1px solid black;
  background-color: transparent;
  width: 137px;
`;
const Signup = styled(LoginBtn)`
  border-bottom: none;
  width: 120.5px;
  border-right: 1px solid black;
  background-color: transparent;
`;

const SimpleLoginWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
`;

const SimpleLogin = styled(Label)`
  height: 29px;
  width: 100%;
  max-width: 118.5px;
`;

const KakaoBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 337px;
  width: 100%;
  height: 100%;
  background-color: #fee500;
  border: none;
  cursor: pointer;

  &::before {
    content: "";
    display: block;
    width: 50%;
    height: 100%;
    background-image: url(${kakaobtn});
    background-repeat: no-repeat;
    background-size: contain;
  }
`;

const ErrorMessage1 = styled.div`
  display: flex;
  align-items: center;
  color: #ff0000;
  font-size: 16px;
  padding-left: 10px;
  font-weight: 700;
  font-family: "Prevariable";
  height: 29px;
  width: 350px;
  text-align: center;
`;
const ErrorMessage2 = styled(ErrorMessage1)`
  margin-top: 0;
`;

const LoginBody = styled.div`
  display: flex;
  width: 720px;
  flex-direction: row;
`;
