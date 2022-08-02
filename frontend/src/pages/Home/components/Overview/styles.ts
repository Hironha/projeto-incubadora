import styled from "styled-components";
import Lottie from "lottie-react";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 100%;
  max-height: inherit;
  margin: 0 auto;
  justify-content: center;
  gap: 1.25rem;
  align-items: center;
`;

export const ImageLogo = styled.img`
  max-width: 100%;
  max-height: 200px;
`;

export const LottieIcon = styled(Lottie)`
  height: 3.5rem;
`;

export const CardsList = styled.ul`
  list-style: none;
  display: flex;
  gap: 24px;
`;

export const CardWrapper = styled.li`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 5px;
  width: 160px;
  height: 180px;
  padding: 16px;
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
    rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
`;

export const CardTitle = styled.span`
  font-size: 1.25rem;
  text-align: center;
`;

export const CartText = styled.span`
  font-size: 1.5rem;
  text-align: center;
  font-weight: 600;
`;
