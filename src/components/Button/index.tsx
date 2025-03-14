import React from "react";
import { TouchableOpacityProps } from "react-native";
import { ButtonContainer, ButtonText, ButtonIcon } from "./styles";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  iconName?: string;
  color?: string;
}

export function Button({ title, iconName, ...rest }: ButtonProps) {
  return (
    <ButtonContainer {...rest}>
      {iconName && <ButtonIcon name={iconName} />}
      <ButtonText>{title}</ButtonText>
    </ButtonContainer>
  );
}
