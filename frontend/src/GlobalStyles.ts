import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  html {
    font-size: 62.5%;
    height: 100%;
  }
  body {
    font-size: 1.6rem;
    height: 100%;
  }
  * {
    padding: 0;
    margin: 0;
    font-family: 'Poppins', sans-serif;
  }
`;
