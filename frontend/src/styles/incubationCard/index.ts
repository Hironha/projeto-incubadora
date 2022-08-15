import Lottie from "lottie-react";
import styled from "styled-components";

export const LottieIcon = styled(Lottie)`
	height: 3.5rem;
`;

export const CardsList = styled.ul`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	justify-content: center;
	align-items: center;
	gap: 2.4rem;

	list-style: none;
	padding: 1.2rem 0;

	@media (max-width: ${props => props.theme.breakpoints.sm}) {
		grid-template-columns: 1fr;
		width: 100%;
	}
`;

export const CardWrapper = styled.li`
	display: flex;
	flex-direction: column;
	justify-content: space-between;

	border-radius: 5px;
	width: 13rem;
	height: 15rem;
	padding: 1.6rem;
	box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;

	@media (max-width: ${props => props.theme.breakpoints.sm}) {
		align-self: center;
		padding: 1.6rem 0;
		width: calc(85%);
		margin: 0 auto;
		height: 12rem;
	}
`;

export const CardTitle = styled.span`
	font-size: 1.5rem;
	text-align: center;
`;

export const CartText = styled.span`
	font-size: 2rem;
	text-align: center;
	font-weight: 600;
`;
