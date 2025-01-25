"use client";
import { useCallback, useState } from "react";

export const useImageUpload = (initialState = null) => {
  const [image, setImage] = useState(initialState);
  const [preview, setPreview] = useState(initialState);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const updateImage = useCallback((url) => {
    setImage(url);
  }, []);

  const removeImage = useCallback(() => {
    setImage(null);
    setPreview(null);
  }, []);

  return {
    image,
    preview,
    handleImageChange,
    updateImage,
    removeImage,
  };
};
