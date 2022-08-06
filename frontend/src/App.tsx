import { ThemeProvider } from "styled-components";
import { initializeApp } from "firebase/app";
import { BrowserRouter } from "react-router-dom";

import { PageRoutes } from "@pages/routes";

import { theme } from "@utils/theme";
import { GlobalStyle } from "./GlobalStyles";
import { AuthProvider } from "@providers/AuthProvider";

initializeApp({
	apiKey: "AIzaSyAbtxd0ojySd-qjOWtehmB1lnc3hVt2rQs",
	authDomain: "incubadora-1d788.firebaseapp.com",
	// databaseURL: "https://incubadora.firebaseio.com",
	projectId: "incubadora-1d788",
	appId: "1:925798259177:web:71995b1f39265d122fd378",
	// storageBucket: "incubadora-1d788.appspot.com",
});

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
