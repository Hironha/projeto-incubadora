import styled from "styled-components";
import { motion } from "framer-motion";
import { Input } from "@components/Input";

export const CustomInput = styled(Input)`
	align-self: flex-start;
`;

export const Title = styled(motion.h2)`
	font-size: 2rem;
	text-align: center;
`;

export const CategoryTitle = styled.h4`
	width: 100%;
	text-align: center;
`;

export const CategoryInputsWrapper = styled.div`
	width: 100%;
	display: flex;
	align-self: center;
	gap: 2.4rem;

	@media (max-width: ${props => props.theme.breakpoints.sm}) {
		flex-direction: column;
		gap: 1.6rem;
	}
`;

export const CategoryWrapper = styled(motion.div)`
	width: 80%;
	display: flex;
	flex-direction: column;
	gap: 0.8rem;
	justify-content: center;
	align-items: center;
`;

export const SubmitContainer = styled(motion.div)`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	gap: 1.2rem;

	margin-top: 1.2rem;
`;

export const Container = styled(motion.div)`
	display: flex;
	flex-direction: column;
	gap: 2.6rem;
	justify-content: center;
	align-items: center;
	padding: 2.4rem 0;
`;
