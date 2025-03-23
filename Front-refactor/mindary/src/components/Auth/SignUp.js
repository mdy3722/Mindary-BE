import React, { useState, useEffect, useCallback } from 'react';

const EmailVerification = () => {
  const [formValue, setFormValue] = useState({ email: '' });
  const [isChecked, setIsChecked] = useState(false);
  const [isGetCode, setIsGetCode] = useState(false);
  const [isTimer, setIsTimer] = useState(false);
  const [count, setCount] = useState(0);
  const [codeValue, setCodeValue] = useState('');

  const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const onValidMail = useCallback(
    (e) => {
      e.preventDefault();
      fetch('api.emailCheck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify({
          userEmail: formValue.email,
        }),
      }).then((res) => {
        if (res.status === 200) {
          setIsGetCode(true);
          setIsTimer(true);
          setCount(180);
        } else if (res.status === 401) {
          alert('이미 존재하는 이메일입니다.');
        } else if (res.status === 402) {
          alert('이미 인증이 진행중입니다.');
        }
      });
    },
    [formValue]
  );

  const handleEmailCode = (e) => {
    setCodeValue(e.target.value);
  };

  const onValidCode = (e) => {
    e.preventDefault();
    fetch('api.verifyCode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({
        userEmail: formValue.email,
        code: codeValue,
      }),
    }).then((res) => {
      if (res.status === 200) {
        setIsChecked(true);
      } else if (res.status === 401) {
        alert('인증번호가 일치 하지 않습니다.');
      }
    });
  };

  return (
    <div>
      <input
        type="email"
        value={formValue.email}
        onChange={(e) => setFormValue({ email: e.target.value })}
        placeholder="Enter your email"
      />
      <button
        className="emailCheckBtn"
        onClick={onValidMail}
        disabled={!emailRegExp.test(formValue.email) || isChecked}
      >
        이메일 인증
      </button>

      {isTimer && !isChecked ? <Timer count={count} setCount={setCount} /> : null}
      {isGetCode ? (
        <>
          <div className="signUpHeader">
            <div className="signUpModalText">인증코드</div>
          </div>
          <input
            name="emailCode"
            value={codeValue}
            className="codeInput"
            placeholder="인증코드 4자리를 입력해주세요"
            onChange={handleEmailCode}
          />
          {isChecked ? (
            <img src="checkImg" alt="확인 완료" className="codeCheckImage" />
          ) : (
            <button
              className="codeCheckBtn"
              onClick={onValidCode}
              disabled={!(codeValue && codeValue.length >= 4)}
            >
              확인
            </button>
          )}
        </>
      ) : null}
    </div>
  );
};

const Timer = ({ count, setCount }) => {
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const id = setInterval(() => {
      setCount((count) => count - 1);
    }, 1000);

    if (count === 0) {
      clearInterval(id);
    }
    return () => clearInterval(id);
  }, [count]);

  return (
    <div className="timerContainer">
      <span className="timerText">{formatTime(count)}</span>
    </div>
  );
};

export default EmailVerification;
