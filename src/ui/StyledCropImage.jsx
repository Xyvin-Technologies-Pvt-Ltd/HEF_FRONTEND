import React, { useRef, useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";
import BackupOutlinedIcon from "@mui/icons-material/BackupOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Cropper from "react-easy-crop";
import Modal from "@mui/material/Modal";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { PictureAsPdfOutlined } from "@mui/icons-material";
import { getCroppedImg } from "../utils/image";

const CustomTextField = styled(TextField)(({ theme }) => ({
  width: "100%",
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    backgroundColor: "#fff",
    "& fieldset": {
      borderColor: "rgba(0, 0, 0, 0.2)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(0, 0, 0, 0.2)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#f58220",
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(0, 0, 0, 0.5)",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#f58220",
  },
  "& .MuiInputBase-input::placeholder": {
    color: "rgba(0, 0, 0, 0.4)",
    opacity: 1,
  },
}));

const SaveButton = styled(Button)({
  backgroundColor: "#f58220",
  color: "#fff",
  fontWeight: "500",
  padding: "8px 20px",
  borderRadius: "6px",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#e07316",
  },
});

const CancelButton = styled(Button)({
  backgroundColor: "#fff",
  color: "#333",
  border: "1px solid #ccc",
  fontWeight: "500",
  padding: "8px 20px",
  borderRadius: "6px",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
});

const PreviewContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  marginTop: "12px",
  gap: "12px",
});

const PreviewCard = styled("div")({
  position: "relative",
  width: "120px",
  height: "120px",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
});

const DeleteButton = styled(IconButton)({
  position: "absolute",
  top: "6px",
  right: "6px",
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  padding: "4px",
  opacity: 0.85,
  transition: "opacity 0.2s ease, background-color 0.2s ease",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 1)",
    opacity: 1,
  },
});

const ImagePreview = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  borderRadius: "8px",
});

const PdfPreview = styled("div")({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#f5f5f5",
  borderRadius: "8px",
  transition: "background-color 0.2s ease",
  "&:hover": {
    backgroundColor: "#e0e0e0",
  },
});

const PdfIconButton = styled(IconButton)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  color: "#f58220",
  "&:hover": {
    color: "#d96b0b",
  },
});

const PdfText = styled("span")({
  fontSize: "12px",
  fontWeight: "500",
  marginTop: "6px",
  color: "inherit",
});

export const StyledCropImage = ({
  label,
  value,
  onChange,
  ratio,
  show,
  accept = "image/*,application/pdf",
  maxFileSizeMB = 1,
}) => {
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
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDelete = () => {
    if (selectedImage && typeof selectedImage === "string" && selectedImage.startsWith("blob:")) {
      URL.revokeObjectURL(selectedImage);
    }
    setSelectedImage(null);
    setSelectedFile(null);
    setIsPdf(false);
    if (onChange) {
      onChange(null);
    }
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
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const fileType = file.type;

      if (fileType.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(file);
        setImageForCrop(imageUrl);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCropModalOpen(true);
        setIsPdf(false);
        // Notice: do NOT call onChange here with the uncropped file!
      } else if (fileType === "application/pdf") {
        setSelectedImage(file.name);
        setIsPdf(true);
        if (onChange) {
          onChange(file);
        }
      }
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropSave = async () => {
    if (imageForCrop && croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(
          imageForCrop,
          croppedAreaPixels,
          maxFileSizeMB
        );

        setCropModalOpen(false);

        const response = await fetch(croppedImage);
        const blob = await response.blob();
        const extension = blob.type === "image/png" ? "png" : "jpg";
        const uniqueName = `cropped_image_${Date.now()}.${extension}`;
        const file = new File([blob], uniqueName, { type: blob.type });

        if (selectedImage && typeof selectedImage === "string" && selectedImage.startsWith("blob:")) {
          URL.revokeObjectURL(selectedImage);
        }

        setSelectedImage(croppedImage);
        setSelectedFile(file);
        setIsPdf(false);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        if (onChange) {
          onChange(file);
        }

        if (imageForCrop && typeof imageForCrop === "string" && imageForCrop.startsWith("blob:")) {
          URL.revokeObjectURL(imageForCrop);
        }
        setImageForCrop(null);
      } catch (error) {
        console.error("Error cropping image:", error);
      }
    }
  };

  const handleCropCancel = () => {
    setCropModalOpen(false);
    if (imageForCrop && typeof imageForCrop === "string" && imageForCrop.startsWith("blob:")) {
      URL.revokeObjectURL(imageForCrop);
    }
    setImageForCrop(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
        if (!isPdfFile) {
          const imageUrl = URL.createObjectURL(value);
          setSelectedImage(imageUrl);
        }
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

  useEffect(() => {
    return () => {
      if (selectedImage && typeof selectedImage === "string" && selectedImage.startsWith("blob:")) {
        URL.revokeObjectURL(selectedImage);
      }
      if (imageForCrop && typeof imageForCrop === "string" && imageForCrop.startsWith("blob:")) {
        URL.revokeObjectURL(imageForCrop);
      }
    };
  }, [selectedImage, imageForCrop]);

  return (
    <>
      <CustomTextField
        fullWidth
        placeholder={label}
        value={selectedFile ? selectedFile.name : typeof value === "string" ? value : ""}
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
        onClick={handleIconClick}
        sx={{ cursor: "pointer" }}
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept={accept}
      />
      {selectedImage && !show && (
        <PreviewContainer>
          <PreviewCard>
            {isPdf ? (
              <PdfPreview>
                <PdfIconButton onClick={handlePdfClick}>
                  <PictureAsPdfOutlined style={{ fontSize: "40px" }} />
                  <PdfText>View PDF</PdfText>
                </PdfIconButton>
                <DeleteButton onClick={handleDelete}>
                  <DeleteOutlineIcon style={{ fontSize: "18px", color: "#f44336" }} />
                </DeleteButton>
              </PdfPreview>
            ) : (
              <>
                <ImagePreview src={selectedImage} alt="Preview" />
                <DeleteButton onClick={handleDelete}>
                  <DeleteOutlineIcon style={{ fontSize: "18px", color: "#f44336" }} />
                </DeleteButton>
              </>
            )}
          </PreviewCard>
        </PreviewContainer>
      )}

      <Modal open={cropModalOpen} onClose={handleCropCancel}>
        <Box
          sx={{
            position: "relative",
            width: { xs: "90vw", sm: "480px" },
            maxWidth: "500px",
            margin: "auto",
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: 24,
            outline: "none",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              Crop Image
            </Typography>
            <IconButton onClick={handleCropCancel} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: "320px",
              backgroundColor: "#111",
              borderRadius: "8px",
              overflow: "hidden",
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
          </Box>

          <Box sx={{ mt: 2, px: 1 }}>
            <Typography variant="body2" color="textSecondary" mb={0.5}>
              Zoom
            </Typography>
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(e, newZoom) => setZoom(newZoom)}
              sx={{ color: "#f58220" }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              mt: 2,
            }}
          >
            <CancelButton onClick={handleCropCancel}>Cancel</CancelButton>
            <SaveButton onClick={handleCropSave}>Save</SaveButton>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default StyledCropImage;