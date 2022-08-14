import styled from "styled-components";
import { motion } from "framer-motion";

export const LoadingContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;

	width: 100%;
	height: 100%;
	min-height: inherit;
`;

export const ErrorMessage = styled(motion.span)`
	font-size: 1.4rem;
	text-align: center;
	width: 60%;
	color: ${props => props.theme.colors.danger};
`;
