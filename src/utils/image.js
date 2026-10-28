export const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // Avoid CORS issues
    image.src = url;
  });

export const getCroppedImg = async (imageSrc, pixelCrop, maxFileSizeMB = 1) => {
  try {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Detect mime type properly
    let mimeType = "image/jpeg";
    try {
      const res = await fetch(imageSrc);
      const blob = await res.blob();
      if (blob.type) {
        mimeType = blob.type;
      }
    } catch (e) {
      console.warn("Could not detect MIME type, defaulting to jpeg", e);
    }

    const canvasToBlob = (type, quality) =>
      new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), type, quality);
      });

    let quality = 0.9;
    let blob = await canvasToBlob(mimeType, quality);
    const maxBytes = maxFileSizeMB * 1024 * 1024;

    // Compress if file size exceeds limit
    if (blob.size > maxBytes) {
      if (mimeType !== "image/jpeg") {
        mimeType = "image/jpeg";
      }
      while (blob.size > maxBytes && quality > 0.1) {
        quality -= 0.1;
        blob = await canvasToBlob(mimeType, quality);
      }
    }

    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Error cropping image:", error);
    throw error;
  }
};