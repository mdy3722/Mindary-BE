import React from "react";
import { Navigate } from "react-router-dom";

// access_token이 있는지 확인해서 보호된 라우트를 허용
const PrivateRoute = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem("access_token");
  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
