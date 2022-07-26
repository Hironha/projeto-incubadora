import styled from "styled-components";
import Lottie from "lottie-react";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: inherit;
  justify-content: center;
  gap: 24px;
  align-items: center;
`;

export const ImageLogo = styled.img`
  max-width: 200px;
`;

export const LottieIcon = styled(Lottie)`
  height: 70px;
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
  /* box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px; */
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
    rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
`;

export const CardTitle = styled.span`
  font-size: 20px;
  text-align: center;
`;

export const CartText = styled.span`
  font-size: 24px;
  text-align: center;
  font-weight: 600;
`;
