import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styled, {
  ThemeProvider as StyledThemeProvider,
} from "styled-components";
import { useTheme } from "../styles/ThemeContext";
import Header from "../components/Header/Header";
import Navbar from "../components/Navbar/NoLogoutNavbar";
import DefaultExcel from "../components/Background/DefaultExcel";
// Reuse your styled-components here
const StyledTable = styled.table`
  border-collapse: collapse;
  width: auto;
  font-family: "PreVariable"; /* 폰트를 GlobalStyles.js로 적용한댄다.*/
`;

const Cell = styled.td`
  width: ${(props) => props.width || "auto"};
  height: 30px;
  border-top: ${(props) => props.borderTop || "1px solid black"};
  border-right: ${(props) => props.borderRight || "1px solid black"};
  border-bottom: ${(props) => props.borderBottom || "1px solid black"};
  border-left: ${(props) => props.borderLeft || "1px solid black"};
  text-align: ${(props) => props.textAlign || "center"};
  padding: 0px;
  color: #000;
  box-sizing: border-box;
  background-color: ${(props) => props.backgroundColor || "none"};
  font-size: ${(props) => props.fontSize || "16px"};
  font-style: ${(props) => props.fontStyle || "normal"};
  font-weight: ${(props) => props.fontWidth || "900"};
`;

const Input = styled.input`
  width: 96%;
  height: 27px;
  border: none;
  text-align: left;
  background-color: white;
  font-family: "PreVariable";
  font-style: normal;
  font-weight: 700;
`;

const Button = styled.button`
  width: 118px;
  height: 29px;
  border: none;
  text-align: left;
  background-color: white;
  font-family: "PreVariable";
  font-style: normal;
  font-weight: 700;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 16px;
  height: 29px;
  display: flex;
  align-items: center;
  font-weight: 700;
  text-align: left;
`;

const StartButton = styled.div`
  font-size: 14px;
  font-weight: bold;
  text-decoration: underline;
  width: 100px;
  cursor: pointer;
  text-align: center;
  font-family: "PreVariable";
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  justify-content: flex-end; // Align the button to the right
`;

const GeneralSignUp = () => {
  const [emailValue, setEmailValue] = useState({ email: "" });
  const [isVerified, setIsVerified] = useState(false);
  const [isTimeForVeriCode, setIsTimeForVeriCode] = useState(false);
  // const [isWithinTime, setIsWithinTime] = useState(false);
  // const [timeCount, setTimeCount] = useState(0
  const { theme, toggleTheme } = useTheme();
  const [veriCodeValue, setVeriCodeValue] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const emailRegExpr = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegExpr =
    /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[a-z\d!@#$%^&*]{8,12}$/;

  const onValidEmail = useCallback(
    (e) => {
      e.preventDefault();
      fetch("http://127.0.0.1:8000/mindary/accounts/original/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json;charset=utf-8" },
        body: JSON.stringify({
          email: emailValue.email,
        }),
      }).then((res) => {
        if (res.status === 200) {
          setIsTimeForVeriCode(true);
          // setIsWithinTime(true);
          // setTimeCount(180);
          alert("인증번호가 이메일로 전송되었습니다.");
        } else if (res.status === 400) {
          setErrors({ email: "※ 유효하지 않은 이메일입니다. " });
        } else {
          setErrors({ email: "※ 오류가 발생했습니다." });
        }
      });
    },
    [emailValue]
  );

  const onValidVeriCode = useCallback(
    (e) => {
      e.preventDefault();
      fetch("http://127.0.0.1:8000/mindary/accounts/original/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json;charset=utf-8" },
        body: JSON.stringify({
          email: emailValue.email,
          code: veriCodeValue,
        }),
      }).then((res) => {
        if (res.status === 200) {
          setIsVerified(true);
          alert("인증 성공");
        } else if (res.status === 400) {
          setErrors({ veriCode: "인증 시간(3분) 초과" });
        } else if (res.status === 401) {
          setErrors({ veriCode: "※ 잘못된 인증 코드입니다." });
        }
      });
    },
    [veriCodeValue]
  );

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (!passwordRegExpr.test(e.target.value)) {
      setErrors((prev) => ({
        ...prev,
        password: "※ 8~12 자리 영소문자, 숫자, 특수문자 조합으로 입력해주세요",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        password: "",
      }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (value !== password) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "※ 비밀번호가 일치하지 않습니다.",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "",
      }));
    }
  };

  const onSubmitSignUp = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "※ 비밀번호가 일치하지 않습니다." });
      return;
    }

    fetch("http://127.0.0.1:8000/mindary/accounts/original/register", {
      method: "POST",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      body: JSON.stringify({
        email: emailValue.email,
        password: password,
        nickname: nickname,
      }),
    }).then((res) => {
      if (res.status === 201) {
        alert("회원가입 성공");
        navigate("/login");
      } else {
        setErrors({ form: "회원가입에 실패했습니다." });
        alert(errors.form);
      }
    });
  };

  // 오류가 있는지 확인합니다.
  const hasErrors = Object.keys(errors).some((key) => errors[key]);

  return (
    <StyledThemeProvider theme={theme}>
      <HeaderBase>
        <Header />
      </HeaderBase>
      <DefaultExcel />
      <Navbar toggleTheme={toggleTheme} />
      <Body>
        <LoginBody>
          <StyledTable>
            <tbody>
              <tr>
                <Cell
                  width="490px"
                  height="30px"
                  colSpan="3"
                  textAlign="left"
                  borderTop="none"
                  borderRight="none"
                  borderLeft="none"
                >
                  &nbsp;회원가입
                </Cell>
                <Cell
                  width="340px"
                  borderTop="none"
                  borderRight="none"
                  borderBottom="none"
                  borderLeft="none"
                ></Cell>
              </tr>
              <tr>
                <Cell
                  backgroundColor={({ theme }) => theme.background}
                  width="119px"
                >
                  항목
                </Cell>
                <Cell
                  backgroundColor={({ theme }) => theme.background}
                  colSpan="2"
                >
                  감정을 기록하고 마음을 정리해요.
                </Cell>
                <Cell
                  width="340px"
                  borderTop="none"
                  borderRight="none"
                  borderBottom="none"
                  borderLeft="none"
                ></Cell>
              </tr>
              <tr>
                <Cell width="119px" fontSize="14px" backgroundColor="white">
                  이메일
                </Cell>
                <Cell width="256px" textAlign="left" backgroundColor="white">
                  &nbsp;
                  <Input
                    // type="email"
                    value={emailValue.email}
                    onChange={(e) => setEmailValue({ email: e.target.value })}
                    placeholder="이메일을 입력해주세요."
                  />
                </Cell>
                <Cell width="119px">
                  <Button
                    onClick={onValidEmail}
                    disabled={
                      !emailRegExpr.test(emailValue.email) || isVerified
                    }
                  >
                    {isVerified ? "전송 완료" : "인증코드 전송"}
                  </Button>
                </Cell>
                <Cell
                  width="340px"
                  borderTop="none"
                  borderRight="none"
                  borderBottom="none"
                  borderLeft="none"
                >
                  {errors.email && (
                    <ErrorMessage>&nbsp;{errors.email}</ErrorMessage>
                  )}
                </Cell>
              </tr>
              <tr>
                <Cell
                  width="119px"
                  height="100%"
                  fontSize="14px"
                  backgroundColor="white"
                >
                  인증코드
                </Cell>
                <Cell width="256px" textAlign="left" backgroundColor="white">
                  &nbsp;
                  <Input
                    name="veriCode"
                    value={veriCodeValue}
                    placeholder="인증코드를 입력해주세요."
                    onChange={(e) => setVeriCodeValue(e.target.value)}
                    disabled={!isTimeForVeriCode || isVerified}
                  />
                </Cell>
                <Cell width="119px">
                  <Button
                    onClick={onValidVeriCode}
                    disabled={
                      !(veriCodeValue && veriCodeValue.length >= 4) ||
                      isVerified
                    }
                  >
                    {isVerified ? "인증 완료" : "인증코드 입력"}
                  </Button>
                </Cell>
                <Cell
                  width="340px"
                  borderTop="none"
                  borderRight="none"
                  borderBottom="none"
                  borderLeft="none"
                >
                  {errors.veriCode && (
                    <ErrorMessage>&nbsp;{errors.veriCode}</ErrorMessage>
                  )}
                </Cell>
              </tr>
              <tr>
                <Cell width="119px" fontSize="14px" backgroundColor="white">
                  비밀번호
                </Cell>
                <Cell colSpan="2" textAlign="left" backgroundColor="white">
                  &nbsp;
                  <Input
                    type="password" //////////////////////////////////
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="※ 8~12 자리 영소문자, 숫자, 특수문자 조합으로 입력해주세요."
                    disabled={!isVerified}
                  />
                </Cell>
                <Cell
                  width="340px"
                  borderTop="none"
                  borderRight="none"
                  borderBottom="none"
                  borderLeft="none"
                >
                  {errors.password && (
                    <ErrorMessage>&nbsp;{errors.password}</ErrorMessage>
                  )}
                </Cell>
              </tr>
              <tr>
                <Cell width="119px" fontSize="14px" backgroundColor="white">
                  비밀번호 확인
                </Cell>
                <Cell colSpan="2" textAlign="left" backgroundColor="white">
                  &nbsp;
                  <Input
                    type="password"
                    value={confirmPassword}
                    backgroundColor="white"
                    onChange={handleConfirmPasswordChange}
                    placeholder="8~12 자리 영소문자, 숫자, 특수문자 조합"
                    disabled={!isVerified}
                  />
                </Cell>
                <Cell
                  width="340px"
                  borderTop="none"
                  borderRight="none"
                  borderBottom="none"
                  borderLeft="none"
                >
                  {errors.confirmPassword && (
                    <ErrorMessage>{errors.confirmPassword}</ErrorMessage>
                  )}
                </Cell>
              </tr>
              <tr>
                <Cell width="119px" fontSize="14px" backgroundColor="white">
                  닉네임
                </Cell>
                <Cell colSpan="2" textAlign="left" backgroundColor="white">
                  &nbsp;
                  <Input
                    // type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="닉네임을 입력해주세요."
                    disabled={!isVerified}
                  />
                </Cell>
                <Cell
                  width="340px"
                  borderTop="none"
                  borderRight="none"
                  borderBottom="none"
                  borderLeft="none"
                />
              </tr>
              <tr>
                <Cell colSpan="3">
                  <ButtonWrapper style={{ backgroundColor: "white" }}>
                    <StartButton
                      onClick={onSubmitSignUp}
                      disabled={
                        !password ||
                        !confirmPassword ||
                        !nickname ||
                        password !== confirmPassword ||
                        !isVerified ||
                        hasErrors
                      }
                    >
                      시작하기 →
                    </StartButton>
                  </ButtonWrapper>
                </Cell>
                <Cell
                  width="340px"
                  borderTop="none"
                  borderRight="none"
                  borderBottom="none"
                  borderLeft="none"
                />
              </tr>
            </tbody>
          </StyledTable>
        </LoginBody>
      </Body>
    </StyledThemeProvider>
  );
};

export default GeneralSignUp;

const LoginBody = styled.div`
  display: flex;
  width: 900px;
  flex-direction: row;
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
