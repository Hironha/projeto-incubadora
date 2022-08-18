import styled from "styled-components";
import { Button } from "@components/Button";

import { scrollStyles } from "@styles/scrollbar";

export const LoadingContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;

	width: 100%;
	height: 100%;
	min-height: inherit;
`;

export const StartIncubationButton = styled(Button)`
	align-self: flex-end;
`;

export const Container = styled.div`
	--vertical-margin: 1.6rem;

	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1.6rem;
	margin: var(--vertical-margin) 0;

	width: calc(100% - 2rem);
	height: calc(100% - 4 * var(--vertical-margin));
	padding: 1rem;
	overflow-x: hidden;
	overflow-y: auto;

	${scrollStyles}
`;

export const TableContainer = styled.div`
	overflow-x: auto;
	width: 100%;
	padding: 1.2rem;
	${scrollStyles}
`;

export const Table = styled.table`
	border-collapse: collapse;

	width: 100%;
`;

export const TableHeader = styled.th`
	text-align: left;
	padding: 1rem;
`;

export const TableData = styled.td`
	text-align: left;
	padding: 1rem;
`;

export const TBody = styled.tbody`
	& tr {
		&:nth-child(odd) {
			background-color: ${props => `${props.theme.colors.main}B5`};
		}
	}
`;
