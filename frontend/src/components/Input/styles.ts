import styled from "styled-components";
import { motion } from "framer-motion";

export const CustomErrorMessage = styled(motion.span)`
	color: ${props => props.theme.colors.danger};
`;

export const Label = styled(motion.label)``;

export const InputContainer = styled(motion.div)`
	display: flex;
	width: 100%;
	flex: 1;
	border-radius: 5px;
`;

export const Container = styled(motion.div)`
	display: flex;
	flex-direction: column;
	width: max(400px, 50%);

	${CustomErrorMessage}, ${Label} {
		margin-left: 0.5rem;
		font-size: 1.4rem;
	}

	@media (max-width: ${props => props.theme.breakpoints.sm}) {
		width: 100%;
	}
`;

export const DataInput = styled(motion.input)`
	align-self: flex-start;
	padding: 0.6rem 1.2rem;
	width: 100%;
	border-radius: 5px;
	border: none;
	outline: none;
`;
