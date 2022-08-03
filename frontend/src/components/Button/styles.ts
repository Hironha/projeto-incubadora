import { motion } from "framer-motion";
import styled, { css, DefaultTheme, FlattenInterpolation, ThemeProps } from "styled-components";

export type ButtonStyleType = "primary" | "secondary" | "success" | "danger";

const styles: {
	[key in ButtonStyleType]: FlattenInterpolation<ThemeProps<DefaultTheme>>;
} = {
	primary: css`
		background-color: ${props => props.theme.colors.main};
		color: white;
	`,
	secondary: css`
    background-color ${props => props.theme.colors.secondary};
    color: white;
  `,
	success: css`
    background-color ${props => props.theme.colors.success};
    color: white;
  `,
	danger: css`
		background-color: ${props => props.theme.colors.danger};
		color: white;
	`,
};

export const CustomButton = styled(motion.button)<{
	styleType?: ButtonStyleType;
}>`
	padding: 0.3rem 1rem;
	border-radius: 5px;
	border: none;
	cursor: pointer;
	${props => props.styleType && styles[props.styleType]}
`;
