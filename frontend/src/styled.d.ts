import "styled-components";

declare module "styled-components" {
	export interface DefaultTheme {
		colors: {
			main: string;
			secondary: string;
			lightGray: string;
			gray: string;
			success: string;
			danger: string;
			blue: string;
		};
		breakpoints: {
			sm: string;
		};
	}
}
