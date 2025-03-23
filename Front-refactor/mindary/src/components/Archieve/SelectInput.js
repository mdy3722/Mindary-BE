import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Down from "../../assets/images/arrow_drop_down.svg";
import Up from "../../assets/images/arrow_drop_up.svg";

const SelectInput = ({ label, id, options, placeholder, onChange }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener("click", handleClickOutside);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  const handleToggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectChange = (value) => {
    setSelectedOption(value);
    onChange(value);
    setIsOpen(false);
  };

  return (
    <>
      {label && <Label htmlFor={id}>{label}</Label>}
      <SelectContainer ref={selectRef} onChange={onChange}>
        <SelectValue onClick={handleToggleOpen}>
          {selectedOption || placeholder}
          <Arrow src={isOpen ? Up : Down} alt="arrow" />
        </SelectValue>
        {isOpen && (
          <OptionList>
            {options.map((option, index) => (
              <Option key={index} onClick={() => handleSelectChange(option)}>
                {option}
              </Option>
            ))}
          </OptionList>
        )}
      </SelectContainer>
    </>
  );
};

export default SelectInput;

const Label = styled.label`
  display: block;
  font-size: 14px;
  margin-bottom: 8px;
`;

const SelectContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
`;

const SelectValue = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 30px;
  border: 1px solid black;
  background: white;
  cursor: pointer;
  box-sizing: border-box;
  color: #cccccc;
  font-size: 16px;
  font-weight: 400;
  padding-left: 10px;
`;

const OptionList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  width: 317px;
  border: 1px solid black;
  border-top: none;
  background: white;
  box-sizing: border-box;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  max-height: 210px;
  z-index: 10;
  list-style: none;
  box-shadow: 0px 4px 12px 0px #00000040;
`;

const Option = styled.li`
  display: flex;
  align-items: center; // 수직 중앙 정렬
  justify-content: center; // 수평 중앙 정렬
  font-size: 16px;
  font-weight: 700;
  height: 30px;
  box-sizing: border-box;
  border-bottom: 1px solid black;
  background-color: white;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const Arrow = styled.img`
  width: 27px;
  height: 30px;
  border-left: 1px solid black;
  box-sizing: border-box;
`;
