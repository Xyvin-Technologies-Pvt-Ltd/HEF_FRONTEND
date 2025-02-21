import React, { useRef, useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";
import BackupOutlinedIcon from "@mui/icons-material/BackupOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import IconButton from "@mui/material/IconButton";
import Cropper from "react-easy-crop";
import Modal from "@mui/material/Modal";
import Slider from "@mui/material/Slider";
import { getCroppedImg } from "../utils/image";
import { Button } from "@mui/material";
import { PictureAsPdfOutlined } from "@mui/icons-material";

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

const SaveButton = styled(Button)(({ theme }) => ({
  marginTop: "10px",
  backgroundColor: "#f58220",
  color: "#fff",
  fontWeight: "400",
  padding: "8px 16px",
  borderRadius: "4px",
}));

const PreviewContainer = styled("div")({
  position: "relative",
  display: "inline-block",
});

const DeleteButton = styled(IconButton)({
  position: "absolute",
  top: "5px",
  right: "5px",
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  padding: "4px",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
});

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

export const StyledCropImage = ({ label, value, onChange, ratio }) => {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPdf, setIsPdf] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageForCrop, setImageForCrop] = useState(null);

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleDelete = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setIsPdf(false);
    if (onChange) {
      onChange(null);
    }
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const checkIfPdf = (file) => {
    if (file instanceof File) {
      return file.type === "application/pdf";
    }
    if (typeof file === "string") {
      return file.toLowerCase().endsWith(".pdf");
    }
    return false;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const fileType = file.type;

      if (fileType.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(file);
        setImageForCrop(imageUrl);
        setCropModalOpen(true);
        setIsPdf(false);
        setSelectedImage(imageUrl);
      } else if (fileType === "application/pdf") {
        setSelectedImage(file.name);
        setIsPdf(true);
      }
      onChange(file);
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropSave = async () => {
    if (imageForCrop && croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(imageForCrop, croppedAreaPixels);
        setSelectedImage(croppedImage);
        setCropModalOpen(false);
        const response = await fetch(croppedImage);
        const blob = await response.blob();
        const uniqueName = `cropped_image_${Date.now()}.png`;
        const file = new File([blob], uniqueName, { type: blob.type });
        setSelectedFile(file);
        setIsPdf(false);
        onChange(file);
      } catch (error) {
        console.error("Error cropping image:", error);
      }
    }
  };

  const handlePdfClick = () => {
    if (selectedFile && isPdf) {
      const pdfUrl = URL.createObjectURL(selectedFile);
      window.open(pdfUrl, "_blank");
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 100);
    } else if (typeof selectedImage === "string" && isPdf) {
      window.open(selectedImage, "_blank");
    }
  };

  useEffect(() => {
    if (value) {
      const isPdfFile = checkIfPdf(value);
      setIsPdf(isPdfFile);

      if (value instanceof File) {
        setSelectedFile(value);
      } else if (typeof value === "string") {
        setSelectedImage(value);
        if (!isPdfFile) {
          setSelectedFile(null);
        }
      }
    } else {
      setSelectedImage(null);
      setSelectedFile(null);
      setIsPdf(false);
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
        <PreviewContainer>
          {isPdf ? (
            <PdfPreview>
              <IconButton
                onClick={handlePdfClick}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  color: "#f58220",
                }}
              >
                <PictureAsPdfOutlined style={{ fontSize: "40px" }} />
                <span style={{ fontSize: "12px", marginTop: "4px" }}>
                  View PDF
                </span>
              </IconButton>
              <DeleteButton onClick={handleDelete}>
                <DeleteOutlineIcon style={{ fontSize: "20px", color: "#f44336" }} />
              </DeleteButton>
            </PdfPreview>
          ) : (
            <>
              <ImagePreview src={selectedImage} alt="Preview" />
              <DeleteButton onClick={handleDelete}>
                <DeleteOutlineIcon style={{ fontSize: "20px", color: "#f44336" }} />
              </DeleteButton>
            </>
          )}
        </PreviewContainer>
      )}

      <Modal open={cropModalOpen} onClose={() => setCropModalOpen(false)}>
        <div
          style={{
            position: "relative",
            width: "400px",
            height: "400px",
            margin: "auto",
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <Cropper
            image={imageForCrop}
            crop={crop}
            zoom={zoom}
            aspect={ratio}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(e, newZoom) => setZoom(newZoom)}
            style={{ marginTop: "10px", color: "#f58220" }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <SaveButton onClick={handleCropSave}>Save</SaveButton>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default StyledCropImage;