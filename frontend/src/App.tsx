import { ThemeProvider } from "styled-components";
import { BrowserRouter } from "react-router-dom";

import { Home } from "@pages/Home";

import { theme } from "@utils/theme";
import { GlobalStyle } from "./GlobalStyles";

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
