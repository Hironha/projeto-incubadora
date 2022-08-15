import styled from "styled-components";
import Lottie from "lottie-react";
import { scrollStyles } from "@styles/scrollbar";

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1.6rem;

	width: calc(100% - 2rem);
	height: calc(100% - 3.2rem);
	margin: 0 auto;
	padding: 1rem;
	overflow-x: hidden;
	overflow-y: auto;

	${scrollStyles}
`;

export const LoadingContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;

	width: 100%;
	height: 100%;
	min-height: inherit;
`;

export const ImageLogo = styled.img`
	max-width: 100%;
	max-height: 200px;
`;
