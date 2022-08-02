import styled from "styled-components";

export const Container = styled.div`
	display: flex;
	width: 100%;
	min-height: inherit;
	flex-direction: column;
	justify-content: center;
	align-items: stretch;
`;

export const PageWrapper = styled.div`
	margin: 0 auto;
	padding: 1.25rem 2rem 3rem 2rem;
  min-height: 420px;
	max-height: 720px;
	width: clamp(320px, 80%, 720px);
	border-radius: 5px;
	overflow: hidden;
	box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
`;
