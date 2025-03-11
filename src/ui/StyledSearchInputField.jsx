import React from "react";
import styled from "styled-components";
import Select from "react-select";

const SelectContainer = styled.div`
  position: relative;
  width: 100%;
`;

const StyledSearchInputField = ({
  placeholder,
  isDisabled,
  options,
  onChange,
  value,
  isMulti,
  onInputChange
}) => {
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      height: "auto",
      padding: "8px",
      border: "1px solid rgba(0, 0, 0, 0.2)",
      borderRadius: "4px",
      backgroundColor: "#ffffff",
      color: "#000000",
      boxShadow: state.isFocused ? "0 0 0 2px #fff" : "none",
      cursor: "pointer",
      "&:hover": {
        borderColor: "rgba(0, 0, 0, 0.2)",
      },
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: "none",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#F58220" : "transparent",
      color: state.isFocused ? "#ffffff" : "#000000",
      cursor: "pointer",
      ":active": {
        backgroundColor: "#F58220",
      },
    }),
    menu: (provided) => ({
      ...provided,
      position: "absolute",
      backgroundColor: "#ffffff",
      color: "#B5B8C5",
      zIndex: 1000,
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "150px", // Set the max height of the dropdown
      overflowY: "auto", // Enable vertical scrolling
    }),
    singleValue: (provided) => ({
      ...provided,
      color: isDisabled ? "#a0a0a0" : "#000000",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#79747E",
    }),
  };
  

  return (
    <SelectContainer>
      <Select
        placeholder={placeholder}
        options={options}
        onChange={onChange}
        value={value}
        isMulti={isMulti}
        isDisabled={isDisabled}
        styles={customStyles}
        onInputChange={(inputValue, { action }) => {
          if (action === "input-change") {
            onInputChange(inputValue);
          }
        }}
      />
    </SelectContainer>
  );
};

export default StyledSearchInputField;
