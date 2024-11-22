import React, { useRef, useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";
import BackupOutlinedIcon from "@mui/icons-material/BackupOutlined";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";

const CustomTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "rgba(0, 0, 0, 0.2)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(0, 0, 0, 0.2)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "rgba(0, 0, 0, 0.2)",
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(0, 0, 0, 0.2)",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "rgba(0, 0, 0, 0.2)",
  },
  "& .MuiInputBase-input::placeholder": {
    color: "rgba(0, 0, 0, 0.2)",
    opacity: 1,
  },
}));

const ImagePreview = styled("img")({
  width: "100px",
  height: "100px",
  marginTop: "10px",
  objectFit: "contain",
  border: "1px solid rgba(0, 0, 0, 0.2)",
  borderRadius: "4px",
});
const PdfPreview = styled("div")({
  width: "100px",
  height: "100px",
  marginTop: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid rgba(0, 0, 0, 0.2)",
  borderRadius: "4px",
  backgroundColor: "#f0f0f0",
  fontSize: "12px",
  fontWeight: "bold",
  color: "rgba(0, 0, 0, 0.5)",
});
export const StyledEventUpload = ({ label, value, onChange }) => {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(value || null); // Initialize with the passed value
  const [isPdf, setIsPdf] = useState(false);
  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type;
      if (fileType.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(file);
        setSelectedImage(imageUrl);
        setIsPdf(false);
      } else if (fileType === "application/pdf") {
        setSelectedImage(file.name);
        setIsPdf(true);
      }
      onChange(file); // Update form value with the selected file
    }
  };
  useEffect(() => {
    if (value && typeof value === "string") {
      setSelectedImage(value);
      setIsPdf(value.endsWith(".pdf"));
    }
  }, [value]);

  return (
    <>
      <CustomTextField
        fullWidth
        label={label}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleIconClick}>
                <BackupOutlinedIcon />
              </IconButton>
            </InputAdornment>
          ),
          readOnly: true,
        }}
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept="image/*,application/pdf"
      />
       {selectedImage && (
        isPdf ? (
          <PdfPreview>PDF Preview: {selectedImage}</PdfPreview>
        ) : (
          <ImagePreview src={selectedImage} alt="Preview" />
        )
      )}
    </>
  );
};