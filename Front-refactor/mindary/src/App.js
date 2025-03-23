import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Record from "./pages/Record";
import KakaoLogin from "./components/Auth/KakaoLogin";
import Archive from "./pages/Archive";
import { ThemeProvider } from "./styles/ThemeContext";
import Landing from "./pages/Landing";
import GeneralSignUp from "./pages/GeneralSignUp";
import PrivateRoute from "./components/Auth/Auth";

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Home />} />
          <Route path="/accounts/kakao" element={<KakaoLogin />} />
          <Route
            path="/mindary"
            element={
              <PrivateRoute>
                <Record />
              </PrivateRoute>
            }
          />
          <Route
            path="/mindary/records/archive"
            element={
              <PrivateRoute>
                <Archive />
              </PrivateRoute>
            }
          />
          <Route path="/signup" element={<GeneralSignUp />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
