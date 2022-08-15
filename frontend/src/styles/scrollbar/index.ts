import { css } from "styled-components";

export const scrollStyles = css`
	::-webkit-scrollbar {
		width: 8px;
		border-radius: 5px;
	}

	::-webkit-scrollbar-track {
		background: ${props => props.theme.colors.secondary};
	}

	::-webkit-scrollbar-thumb {
		background: ${props => props.theme.colors.main};
		border-radius: 5px;
	}
`;
