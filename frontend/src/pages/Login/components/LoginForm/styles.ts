import styled from "styled-components";
import { Button } from "@components/Button";

export const LogoContainer = styled.img`
	max-width: 100%;
	max-height: 150px;
`;

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1rem;
	justify-content: center;
	align-items: center;
`;

export const ButtonContainer = styled.div`
	margin-top: 2rem;
`;

export const CustomButton = styled(Button)`
	/* padding: 1rem; */
	width: 80px;
`;
