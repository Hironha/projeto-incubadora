import React from "react";
import { Main } from "./styles";

type LayoutProps = {
  className?: string;
  children?: React.ReactNode;
};

export const PageLayout = ({ className, children }: LayoutProps) => {
  return <Main className={className}>{children}</Main>;
};
