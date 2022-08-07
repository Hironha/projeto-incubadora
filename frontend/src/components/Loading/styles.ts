import { motion } from "framer-motion";
import styled from "styled-components";

export const Loader = styled(motion.span)`
	border-radius: 50%;
	display: inline-block;
	border-top: 3px solid #fff;
	border-right: 3px solid transparent;
	box-sizing: border-box;
`;
