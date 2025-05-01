import React, { useState } from "react";
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
  onInputChange,
}) => {
  const [inputVal, setInputVal] = useState("");

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
      maxHeight: "150px",
      overflowY: "auto",
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
  const handleInputChange = (inputValue, { action }) => {
    if (action === "input-change") {
      setInputVal(inputValue);
      if (onInputChange) {
        onInputChange(inputValue);
      }

      if (inputValue.endsWith(" ") && inputValue.trim() !== "") {
        const terms = inputValue.trim().split(" ");
        const currentValues = value || [];
        const newValues = terms
          .filter((term) => term)
          .map((term) => ({
            label: term,
            value: term,
          }));
        const uniqueValues = [...currentValues];

        newValues.forEach((newVal) => {
          if (!uniqueValues.some((item) => item.value === newVal.value)) {
            uniqueValues.push(newVal);
          }
        });
        onChange(uniqueValues);
        setInputVal("");
        return "";
      }
    }
    return inputValue;
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
        inputValue={inputVal}
        onInputChange={handleInputChange}
        isCreatable={true}
      />
    </SelectContainer>
  );
};

export default StyledSearchInputField;
