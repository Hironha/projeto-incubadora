import { ThemeProvider } from "styled-components";
import { BrowserRouter } from "react-router-dom";

import { PageRoutes } from "@pages/routes";

import { theme } from "@utils/theme";
import { GlobalStyle } from "./GlobalStyles";

function App() {
	return (
		<ThemeProvider theme={theme}>
			<GlobalStyle />
			<BrowserRouter>
				<PageRoutes />
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;
