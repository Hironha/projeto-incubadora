import { createGlobalStyle, ThemeProvider } from "styled-components";
import { BrowserRouter } from "react-router-dom";

import { Home } from "@pages/Home";

import { theme } from "@utils/theme";

const GlobalStyle = createGlobalStyle`
  * {
    padding: 0;
    margin: 0;
  }
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
