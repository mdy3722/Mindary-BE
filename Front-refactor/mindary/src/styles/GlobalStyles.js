import { createGlobalStyle } from "styled-components";
import PreRegular from "../assets/fonts/Pretendard-Regular.otf";
import PreBold from "../assets/fonts/Pretendard-Bold.otf";
import PreMedium from "../assets/fonts/Pretendard-Medium.otf";
import PreSemiBold from "../assets/fonts/Pretendard-SemiBold.otf";
import PreVariable from "../assets/fonts/PretendardVariable.ttf";

const GlobalStyles = createGlobalStyle` 
 @font-face {
        font-family: 'PreRegular';
        font-style: normal;
        src: url(${PreRegular}) format('opentype');
  }
   @font-face {
        font-family: 'PreBold';
        font-style: normal;
        src: url(${PreBold}) format('opentype');
  }
   @font-face {
        font-family: 'PreMedium';
        font-style: normal;
        src: url(${PreMedium}) format('opentype');
  }
   @font-face {
        font-family: 'PreSemiBold';
        font-style: normal;
        src: url(${PreSemiBold}) format('opentype');
  } 
  @font-face {
        font-family: 'PreVariable';
        font-style: normal;
        src: url(${PreVariable}) format('truetype');
  }

    a{
        text-decoration: none;
        color: inherit;
    }
    html, body, div, span, h1, h2, h3, h4, h5, h6, p, 
    a, dl, dt, dd, ol, ul, li, form, label, table{
        margin: 0;
        padding: 0;
        border: 0;
        vertical-align: baseline;
    }
    body{
        font-family: 'Noto Sans KR', sans-serif;
    }
    ol, ul{
        list-style: none;
    }
    button {
        border: 0;
        cursor: pointer;
        background: transparent;
    }
`;

export default GlobalStyles;
