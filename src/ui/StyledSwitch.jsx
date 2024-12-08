import React from "react";
import styled from "styled-components";

const SwitchContainer = styled.label`
  display: inline-block;
  position: relative;
  width: 45px;
  height: 20px; 
  border-radius: 23px;
  background: ${(props) => (props.checked ? "#FF9800" : "#b3b3b3")}; 
  padding: 2px; 
  transition: background 300ms ease;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

const SwitchHandle = styled.div`
  position: absolute;
  width: 16px; 
  height: 16px; 
  border-radius: 50%;
  top: 50%;
  left: ${(props) => (props.checked ? "calc(100% - 18px)" : "2px")}; 
  background: white;
  transform: translateY(-50%);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2); 
  transition: left 300ms ease;
`;

const Input = styled.input`
  display: none;
`;

const StyledSwitch = ({ checked, onChange, variant, disabled }) => {
  const handleChange = (e) => {
    if (!disabled) {
      onChange(e);
    }
  };

  return (
    <SwitchContainer variant={variant} checked={checked} disabled={disabled}>
      <Input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
      />
      <SwitchHandle checked={checked} variant={variant} />
    </SwitchContainer>
  );
};

export default StyledSwitch;
