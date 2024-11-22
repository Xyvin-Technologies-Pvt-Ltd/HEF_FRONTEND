// utils/image.js

export const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous"); // Needed to avoid CORS issues if using external images
      image.src = url;
    });
  
  export const getCroppedImg = async (imageSrc, pixelCrop) => {
    try {
      const image = await createImage(imageSrc);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
  
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
  
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
  
      return new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            resolve(URL.createObjectURL(blob));
          },
          "image/jpeg",
          0.8
        );
      });
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };
  