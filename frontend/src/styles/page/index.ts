import styled from "styled-components";

export const PageWrapper = styled.div`
	position: relative;
	border-radius: 5px;
	overflow: hidden;
	background-color: white;
	box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
	
	height: clamp(420px, calc(100vh - 5.6rem - 6.4rem), 720px);
	margin: 3.2rem auto 3.2rem auto;
	padding: 2.4rem 3.2rem 4rem 3.2rem;
	width: clamp(280px, calc(100% - 6.4rem), 800px);

	@media (max-width: ${props => props.theme.breakpoints.sm}) {
		display: flex;
		flex-direction: column;
		justify-content: stretch;

		margin: 0;
		width: calc(100% - 3.2rem);
		padding: 1.6rem;
		height: calc(100vh - 3.2rem);
	}
`;