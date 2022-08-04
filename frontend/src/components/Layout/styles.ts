import styled from "styled-components";

export const Main = styled.main`
	position: relative;
	overflow-x: hidden;
	min-height: calc(100vh);
	background-color: ${props => props.theme.colors.secondary};
`;
