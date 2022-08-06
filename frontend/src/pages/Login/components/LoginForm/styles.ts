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
  padding-top: 4rem;
`;

export const CustomButton = styled(Button)`
  padding: 1rem;
  width: 80px;
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  
  @media(max-width: ${props => props.theme.breakpoints.sm}) {
		width: 100%;
	}
`;

export const DataInput = styled.input`
  padding: 1rem;
  border: 1px solid lightgrey;
  border-radius: 5px;
`;