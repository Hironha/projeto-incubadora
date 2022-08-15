import styled from "styled-components";
import { scrollStyles } from "@styles/scrollbar";

export const LoadingContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;

	width: 100%;
	height: 100%;
	min-height: inherit;
`;

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1.6rem;

	width: calc(100% - 2rem);
	height: calc(100% - 3.2rem - 2 * 1.6rem);
	margin: 1.6rem auto;
	padding: 1rem;
	overflow-x: hidden;
	overflow-y: auto;

	${scrollStyles}
`;
