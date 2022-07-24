import { useEffect } from "react";
import { Container, LottieIcon } from "./styles";

import humidityIcon from "@assets/lotties/humidity-icon.json";
import temperatureIcon from "@assets/lotties/temperature-icon.json";

export const Overview = () => {
  // useEffect(() => {
  //   const ws = new WebSocket('ws://192.0.0.2:80');
  // }, []);

  return (
    <Container>
      <LottieIcon animationData={humidityIcon} />
      <LottieIcon animationData={temperatureIcon} />
    </Container>
  );
};
