import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import GlobalStyles from "./styles/GlobalStyles";

// ✅ Kakao SDK 초기화
if (window.Kakao && !window.Kakao.isInitialized()) {
  window.Kakao.init(process.env.REACT_APP_KAKAO_JS_KEY);
  console.log("✅ Kakao SDK initialized");
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GlobalStyles />
    <App />
  </React.StrictMode>
);
