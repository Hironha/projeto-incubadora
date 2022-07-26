import { useEffect } from "react";
import {
  Container,
  LottieIcon,
  CardWrapper,
  CardTitle,
  CartText,
  CardsList,
  ImageLogo,
} from "./styles";

import Logo from "@assets/images/logo.png";

import humidityIcon from "@assets/lotties/humidity-icon.json";
import temperatureIcon from "@assets/lotties/temperature-icon.json";

export const Overview = () => {
  // useEffect(() => {
  //   const ws = new WebSocket('ws://192.0.0.2:80');
  // }, []);

  const formatCelsius = (temperature: number) => {
    const formatter = new Intl.NumberFormat("pt-br", { notation: "standard" });
    return `${formatter.format(temperature)} °C`;
  };

  return (
    <Container>
      <ImageLogo src={Logo} alt='Logo incubadora' />
      <CardsList>
        <CardWrapper>
          <LottieIcon animationData={humidityIcon} />
          <CardTitle>Umidade</CardTitle>
          <CartText>50%</CartText>
        </CardWrapper>
        <CardWrapper>
          <LottieIcon animationData={temperatureIcon} />
          <CardTitle>Temperatura</CardTitle>
          <CartText>{formatCelsius(35.7)}</CartText>
        </CardWrapper>
      </CardsList>
    </Container>
  );
};
