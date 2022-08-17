import styled from "styled-components";
import { motion } from "framer-motion";
import { Button } from "@components/Button";

export const LogoContainer = styled(motion.img)`
	max-width: 100%;
	max-height: 150px;
`;

export const Container = styled(motion.div)`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 16px;
`;

export const CustomButton = styled(Button)`
	margin-top: 2.4rem;
`;
