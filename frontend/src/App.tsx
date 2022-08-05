import { ThemeProvider } from "styled-components";
import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "@providers/AuthProvider";

import { PageRoutes } from "@pages/routes";

import { theme } from "@utils/theme";
import { GlobalStyle } from "./GlobalStyles";

function App() {
	return (
		<ThemeProvider theme={theme}>
			<GlobalStyle />
			<BrowserRouter>
				<AuthProvider>
					<PageRoutes />
				</AuthProvider>
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;
