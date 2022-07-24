import styled from "styled-components";

export const Main = styled.main`
  position: relative;
  margin: 20px;
  padding: 20px;
  min-height: calc(100vh - 4 * 20px);
  background-color: ${(props) => props.theme.colors.main};
`;
