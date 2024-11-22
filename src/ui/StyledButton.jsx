import React from "react";
import styled, { css } from "styled-components";

const buttonVariants = css`
  ${(props) =>
    props.variant === "primary" &&
    css`
      border: none;
      font-size: 16px;
      font-weight: 400;
      color: #ffffff;
      background-color: #f58220;
      radius: 5px;
    `}

  ${(props) =>
    props.variant === "secondary" &&
    css`
      border: none;
      font-family: Inter;
      font-size: 16px;
      font-weight: 400;
      color: #4a4647;
      background-color: #f3efef;
      radius: 5px;
    `}


${(props) =>
    props.variant === "third" &&
    css`
      font-family: Inter;
      border: 1px solid #AEAAAB;
      font-size: 16px;
      font-weight: 600;
      color: #AEAAAB;
      background-color: #fff;
      radius: 5px;
    `}
`;

const disabledStyles = css`
  ${(props) =>
    props.disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
    `}
`;

const ButtonContainer = styled.button`
  padding: 10px 20px;
  text-align: center;
  font-family: "Inter", "sans-serif";
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  cursor: pointer;
  ${buttonVariants}
  ${disabledStyles}
`;

export const StyledButton = ({ name, variant, color, onClick, disabled }) => {
  return (
    <ButtonContainer
      variant={variant}
      color={color}
      disabled={disabled}
      onClick={onClick}
    >
      {name}
    </ButtonContainer>
  );
};
