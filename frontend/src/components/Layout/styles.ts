import styled from "styled-components";

export const Main = styled.main`
  position: relative;
  min-height: calc(100vh);
  background-color: ${(props) => props.theme.colors.main};
`;
