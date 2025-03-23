import styled from "styled-components";
import { useState } from "react";

const SearchPw = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSendEmail = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/mindary/accounts/original/new-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.status === 400) {
        setErrorMessage("잘못된 양식입니다.");
      } else if (response.status === 404) {
        setErrorMessage("※ 유효하지 않은 이메일입니다.");
      }
    } catch (error) {
      setErrorMessage("네트워크 오류가 발생했습니다.");
    }
  };

  return (
    <Wrapper>
      <Container>
        <Title>비밀번호 찾기</Title>
        <SearchBox>
          <TitleSection>
            <SubTitle>항목</SubTitle>
            <Description>마인더리와 함께하는 마음 기록</Description>
          </TitleSection>
          <EmailSection>
            <Label htmlFor="email">이메일</Label>
            <EmailInput
              id="email"
              placeholder="hongik@hongik.ac.kr"
              value={email}
              onChange={handleInputChange}
            />
          </EmailSection>
          <SendEmail onClick={handleSendEmail}> 새 비밀번호 받기 </SendEmail>
        </SearchBox>
      </Container>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
    </Wrapper>
  );
};

export default SearchPw;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
const Wrapper = styled.div`
  display: flex;
  width: 720px;
  flex-direction: row;
  margin-top: 90px;
`;

const Title = styled.span`
  display: flex;
  font-size: 16px;
  font-weight: 900;
  padding: 5px;
`;

const SearchBox = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 29px;
  width: 374px;
  border-bottom: 1px solid black;
  background-color: #dddddd;
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
const EmailSection = styled.div`
  display: flex;
  border-bottom: 1px solid black;
  height: 29px;
  flex-direction: row;
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
  width: 209px;
  border: none;
  padding-left: 5px;
  font-size: 14px;
  &::placeholder {
    color: #cccccc;
    font-size: 16px;
    font-weight: 600;
  }

  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px white inset !important;
    box-shadow: 0 0 0 1000px white inset !important;
  }
`;

const SendEmail = styled.button`
  border: none;
  text-decoration: underline;
  background-color: white;
  height: 28px;
  font-weight: 700;
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  color: #ff0000;
  font-size: 16px;
  font-weight: 700;
  height: 29px;
  width: 350px;
  padding-left: 10px;
  margin-top: 60px;
  text-align: center;
`;

const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #008000;
  font-size: 16px;
  font-weight: 700;
  height: 29px;
  width: 300px;
  margin-top: 60px;
  padding-left: 10px;
  text-align: center;
`;
