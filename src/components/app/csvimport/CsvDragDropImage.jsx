import React, { useEffect, useState } from "react";
import { MdClear } from "react-icons/md";
import "swiper/css";
import { ErrorToast } from "../../global/Toaster";

const CsvDragDropImage = ({ cover, setCover }) => {
  const [preview, setPreview] = useState(null); // Preview URL for the selected file
  const [isDragging, setIsDragging] = useState(false);

  // Helper function to convert file to Base64
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // Handle Drop Event
  const handleDrop = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(event.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (droppedFiles.length > 1) {
      ErrorToast("You can only upload one file.");
      return;
    }

    const file = droppedFiles[0];
    if (file) await handleFileSelection(file);
  };

  // Handle File Input Change
  const handleFileChange = async (event) => {
    const selectedFiles = Array.from(event.target.files).filter((file) =>
      file.type.startsWith("image/")
    );

    const file = selectedFiles[0];
    if (file) await handleFileSelection(file);
  };

  // Handle File Selection
  const handleFileSelection = async (file) => {
    const previewUrl = await fileToBase64(file);
    setPreview(previewUrl);
    setCover(file);
  };

  // Remove the currently selected file
  const handleRemoveFile = () => {
    setPreview(null);
    setCover(null);
  };

  useEffect(() => {
    if (cover) {
      setPreview(cover);
      setCover(cover);
    }
  }, [cover]);

  return (
    <div className="w-full">
      {/* Drag and Drop Container */}
      <div
        className={`w-full h-[343px] p-4 bg-gray-50 border-2 rounded-[18px] flex flex-col gap-2 justify-center items-center transition-all 
     `}
      >
        {preview ? (
          <div className="w-full h-full flex flex-col justify-start items-center gap-2">
            <img
              src={preview}
              alt="image-preview"
              className="h-full w-full rounded-[18px] bg-gray-200 border border-gray-300  object-contain"
            />
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center text-center">
            <img
              src="/camera-icon.png"
              alt="upload-image-icon"
              className="w-[37.59px]"
            />
            <label className="text-[16px] mt-2 font-medium cursor-pointer leading-[19.5px] text-orange-600 underline underline-offset-2">
              {"No Image File"}
            </label>

            <span className="text-[14px] mt-2 font-medium cursor-pointer leading-[19.5px] text-gray-700 ">
              {"Please add an image in csv."}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CsvDragDropImage;
