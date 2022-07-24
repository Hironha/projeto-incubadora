import styled from "styled-components";
import Lottie from "lottie-react";

export const Container = styled.div`
  display: flex;
  width: 100%;
  min-height: inherit;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

export const LottieIcon = styled(Lottie)`
  height: 100px;
`;
