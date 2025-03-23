import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { axiosInstance } from "../../api/api";
import moment from "moment";

const Memo = ({ selectedDate }) => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const inputRef = useRef(null);
  const dummyRef = useRef(null); // Reference for dummy element
  const msgEndRef = useRef(null);

  const formattedDate = moment(selectedDate).format("YYYY-MM-DD");

  useEffect(() => {
    const getMemos = async () => {
      try {
        setMessages([]);

        const response = await axiosInstance.get(
          `/mindary?date=${formattedDate}&mode=chat`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        console.log("API Response:", response.data);

        const chats = response.data || [];
        const formattedMessages = chats.map((chat) => ({
          text: chat.content || "",
          time: formatTime(chat.created_at) || "",
        }));

        console.log("Formatted Messages:", formattedMessages);
        setMessages(formattedMessages);
      } catch (error) {
        console.error("Error fetching memos:", error);
      }
    };

    getMemos();
  }, [formattedDate]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto"; // Reset the height
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`; // Set new height
    }
  }, [inputValue]);

  useEffect(() => {
    if (msgEndRef.current) {
      msgEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleButtonClick = async () => {
    if (inputValue.trim()) {
      const now = new Date();
      const timeString = formatTime(now.toISOString());

      try {
        await axiosInstance.post(
          `/mindary?date=${formattedDate}&mode=chat`,
          {
            content: inputValue,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: inputValue, time: timeString },
        ]);
        setInputValue("");
      } catch (error) {
        console.error("Failed to post message", error);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (e.nativeEvent.isComposing) {
        return;
      }
      handleButtonClick();
    }
  };

  const formatTime = (isoDate) => {
    const momentDate = moment(isoDate);
    const isPM = momentDate.format("A") === "PM";
    const formattedTime = momentDate.format("h시 mm분");
    return isPM ? `오후 ${formattedTime}` : `오전 ${formattedTime}`;
  };

  const calculateHeight = (text) => {
    if (dummyRef.current) {
      dummyRef.current.textContent = text;
      // Minimum height is 30px, adjust if text height exceeds this
      return Math.max(dummyRef.current.scrollHeight, 30);
    }
    return 30; // Fallback height if dummyRef is not set
  };

  return (
    <Body>
      <Msg>
        {messages.map((msg, index) => (
          <Message key={index}>
            <TimeSection>
              <Time>{msg.time}</Time>
              <Null />
              <Null1 />
            </TimeSection>
            <TextBox height={calculateHeight(msg.text)}>{msg.text}</TextBox>
            <SpacerSection>
              <Spacer />
              <Spacer1 />
              <Spacer2 />
            </SpacerSection>
          </Message>
        ))}
        <div ref={msgEndRef} />
      </Msg>
      <InputWrapper>
        <Input
          placeholder="하고 싶은 말, 마음에 담아두지 마세요."
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <BtnContent>
          <InputBtn onClick={handleButtonClick}>등록하기</InputBtn>
        </BtnContent>
        <Dummy ref={dummyRef} /> {/* Dummy element to measure content height */}
      </InputWrapper>
    </Body>
  );
};

export default Memo;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  width: 463px;
  height: 480px;
  padding-right: 2px;
  box-sizing: border-box;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Input = styled.textarea`
  width: 100%;
  padding: 15px;
  height: 91px;
  outline: none;
  overflow-y: auto;
  border: none;
  resize: none;
  box-sizing: border-box;
  font-size: 14px;
  font-weight: 400;
  &::placeholder {
    color: #d0d0d0;
    font-size: 14px;
  }
`;

const Msg = styled.div`
  flex-grow: 1;
  width: 100%;
  margin: 0;
  background-color: white;
  overflow-x: hidden;
  overflow-y: auto;
  padding-bottom: 20px;
  border-bottom: 1px solid #cccccc;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #cccccc;
    border-radius: 4px;
  }
`;

const Time = styled.div`
  width: 117.5px;
  display: flex;
  align-items: center;
  height: 30px;
  font-size: 14px;
  font-weight: 700;
  padding-left: 10px;
  box-sizing: border-box;
`;

const Message = styled.div`
  display: flex;
  flex-direction: column;
`;

const TextBox = styled.div`
  display: flex;
  align-items: center;
  padding-left: 10px;
  border-bottom: 1px solid #cccccc;
  font-size: 14px;
  font-weight: 400;
  width: 100%;
  box-sizing: border-box;
  white-space: pre-wrap;
  height: ${(props) => props.height}px;
  overflow: hidden;
`;

const InputBtn = styled.button`
  position: absolute;
  bottom: 1px;
  right: 1px;
  width: 65px;
  height: 30px;
  font-size: 13px;
  border: none;
  text-decoration: underline;
  cursor: pointer;
`;

const Dummy = styled.div`
  visibility: hidden;
  white-space: pre-wrap;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
`;

const BtnContent = styled.div`
  width: 100%;
  height: 28px;
  display: flex;
  justify-content: flex-end;
`;

const SpacerSection = styled.div`
  display: flex;
  height: 29px;
  flex-direction: row;
  width: 100%;
  border-bottom: 1px solid #cccccc;
`;

const TimeSection = styled(SpacerSection)`
  height: 29px;
`;

const Spacer = styled.div`
  width: 118.5px;
  box-sizing: border-box;
  border-right: 1px solid #cccccc;
`;
const Spacer1 = styled.div`
  width: 119px;
  border-right: 1px solid #cccccc;
  box-sizing: border-box;
`;
const Spacer2 = styled(Spacer1)`
  border-right: none;
  flex: 1;
`;
const Null = styled.div`
  width: 119px;
  border-left: 1px solid #cccccc;
  box-sizing: border-box;
`;
const Null1 = styled.div`
  flex: 1;
  border-left: 1px solid #cccccc;
  box-sizing: border-box;
`;
