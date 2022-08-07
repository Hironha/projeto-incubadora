import { motion } from "framer-motion";
import styled from "styled-components";

export type ButtonStyleType = "primary" | "secondary" | "success" | "danger";

export const CustomButton = styled(motion.button)<{
	styleType?: ButtonStyleType;
}>`
	display: flex;
	align-items: center;
	gap: 0.6rem;

	padding: 0.5rem 1.6rem;
	border-radius: 5px;
	color: white;
	border: none;
	cursor: pointer;
`;
