import styled from "styled-components";
import { motion } from "framer-motion";

export const Underline = styled(motion.div)`
	position: absolute;
	bottom: -1px;
	left: 0;
	right: 0;
	height: 1px;
	background: ${props => props.theme.colors.secondary};
`;

export const TabItem = styled(motion.li)`
	border-radius: 5px;
	border-bottom-left-radius: 0;
	border-bottom-right-radius: 0;
	width: 100%;
	padding: 10px 15px;
	position: relative;
	background: white;
	cursor: pointer;
	height: 24px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex: 1;
	min-width: 0;
	position: relative;
	user-select: none;
`;

export const TabList = styled.ul`
	display: flex;
	width: 100%;
`;
