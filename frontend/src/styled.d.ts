import "styled-components";

declare module "styled-components" {
	export interface DefaultTheme {
		colors: {
			main: string;
			secondary: string;
			lightGray: string;
			success: string;
			danger: string;
		};
		breakpoints: {
			sm: string;
		}
	}
}
