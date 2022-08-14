import styled from "styled-components";
import Lottie from "lottie-react";

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
	overflow-y: scroll;

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
		padding-left: 2.4rem;
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
		width: calc(100% - 2.4rem);
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
