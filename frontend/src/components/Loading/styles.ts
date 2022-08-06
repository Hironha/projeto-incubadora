import Lottie from "lottie-react";
import styled from "styled-components";

export type LoadingSize = "small" | "medium" | "large";

export const LoadingWrapper = styled(Lottie)<{ loadingSize: LoadingSize }>`
	--small: 25px;
	--medium: 50px;
	--large: 75px;

	width: ${props => `var(--${props.loadingSize})`};
	height: ${props => `var(--${props.loadingSize})`};
`;
