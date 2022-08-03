import styled from "styled-components";

export const PageWrapper = styled.div`
	position: relative;
	gap: 1.6rem;
	margin: 6.4rem auto 1.6rem auto;
	padding: 2.4rem 3.2rem 4rem 3.2rem;
	min-height: 420px;
	max-height: 720px;
	width: clamp(280px, 75%, 720px);
	border-radius: 5px;
	overflow: hidden;
	background-color: white;
	box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;

	@media (max-width: ${props => props.theme.breakpoints.sm}) {
		display: flex;
		flex-direction: column;
		justify-content: stretch;
		padding: 2.4rem 3rem;
		margin: 1.6rem auto;
		min-height: 80vh;
		width: calc(80% - 3rem);
		max-height: auto;
	}
`;
