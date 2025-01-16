import React, { useEffect, useState } from "react";
import { MdClear } from "react-icons/md";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { ErrorToast } from "../../../global/Toaster";
import { FaCirclePlus } from "react-icons/fa6";
const EditDragDropImage = ({
  onFilesSelected,
  errors,
  touched,
  values,
  cover,
  setCover,
  previews,
  setPreviews,
  previewsToSend,
  setPreviewsToSend,
  allFiles,
  setAllFiles,
}) => {
  const [files, setFiles] = useState([]); // Array of file objects
  const [isDragging, setIsDragging] = useState(false);

  // Helper function to convert file to Base64
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // Add files to the state with validation
  const addFiles = async (newFiles) => {
    const totalFiles = files.length + newFiles.length + previews?.length;

    if (totalFiles > 6) {
      ErrorToast("You can only upload up to 6 files.");
      newFiles = newFiles.slice(0, 6 - files.length); // Only allow enough to stay within the limit
    }

    // Generate previews for new files
    const newPreviews = await Promise.all(
      newFiles.map((file) => fileToBase64(file))
    );

    // Update state with new files and previews
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };

  // Handle Drop Event
  const handleDrop = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(event.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );

    await addFiles(droppedFiles);
  };

  // Handle File Input Change
  const handleFileChange = async (event) => {
    const selectedFiles = Array.from(event.target.files).filter((file) =>
      file.type.startsWith("image/")
    );

    await addFiles(selectedFiles);
  };

  // Remove File by Index
  const handleRemoveFile = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex(index == 0 ? 0 : index == files?.length - 1 ? index - 1 : index);
    setCover(index == 0 ? 0 : index == files?.length - 1 ? index - 1 : index);
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
    setPreviewsToSend((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index)
    );
  };

  useEffect(() => {
    values.browse = previews;

    setAllFiles([...previewsToSend, ...files]);
  }, [files, previews]);

  useEffect(() => {
    // Pass only the files array to the parent component
    onFilesSelected(files);
    if (previews?.length > 0) {
      values.browse = previews;
    } else if (previews?.length == 0) {
      values.browse = "";
    } else {
      console.log("case not executed");
    }
  }, [files, onFilesSelected]);

  const [index, setIndex] = useState(0);

  return (
    <div className="w-full">
      {/* Drag and Drop Container */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        className={`w-full ${
          files?.length > 0 ? "h-auto" : "h-[343px] p-4  bg-gray-50 border-2"
        } rounded-[18px] flex flex-col gap-2 justify-center items-center  transition-all 
          ${
            isDragging
              ? "border-gray-500 bg-gray-50 text-gray-700 animate-pulse"
              : "border-gray-300  text-gray-700"
          }`}
      >
        <input
          type="file"
          hidden
          id="browse"
          name="browse"
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/jpg"
          multiple
        />
        {previews?.length > 0 ? (
          <div className="w-full flex flex-col justify-start items-start gap-1">
            <img
              src={
                previews[index] ||
                "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
              }
              alt="image-preview"
              className="h-[233px] w-full rounded-[18px] bg-gray-200 border border-gray-300  object-contain"
            />
            <Swiper
              slidesPerView={4}
              spaceBetween={10}
              className="mySwiper w-full h-20"
            >
              {previews?.map((preview, index) => (
                <SwiperSlide
                  key={index}
                  onClick={() => {
                    setIndex(index);
                    setCover(index);
                  }}
                  className={`relative w-full h-16 cursor-pointer bg-gray-200 border border-gray-300  rounded-xl`}
                >
                  {cover === index && (
                    <div
                      className={`bg-orange-500/50 flex items-center justify-center  w-full h-full rounded-xl absolute top-0 left-0`}
                    >
                      <span className="text-xs w-auto px-2 py-1 flex items-center justify-center  font-medium text-white bg-orange-500 rounded-full">
                        Cover
                      </span>
                    </div>
                  )}

                  <img
                    src={
                      preview ||
                      "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                    }
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-contain rounded-xl"
                  />
                  <button
                    onClick={(e) => handleRemoveFile(e, index)}
                    className="absolute -top-1 -right-1 bg-white border text-orange-500 rounded-md z-10 p-1 hover:bg-orange-500 hover:text-white"
                  >
                    <MdClear size={12} />
                  </button>
                </SwiperSlide>
              ))}
              {previews?.length < 6 && (
                <SwiperSlide
                  onClick={() => document.getElementById("browse").click()}
                  className="relative w-full h-16 cursor-pointer  bg-white border border-gray-300 border-dashed  rounded-xl"
                >
                  <div className="flex items-center justify-center w-full h-full bg-transparent">
                    <FaCirclePlus className="text-orange-500 text-xl" />
                  </div>
                </SwiperSlide>
              )}
            </Swiper>
          </div>
        ) : (
          <>
            <div className="flex flex-col justify-center items-center text-center">
              <img
                src="/camera-icon.png"
                alt="upload-image-icon"
                className="w-[37.59px]"
              />
              <label
                htmlFor="browse"
                className="text-[16px] font-medium cursor-pointer leading-[19.5px] text-orange-600 underline underline-offset-2"
              >
                {files.length < 6
                  ? "Click to upload"
                  : "Max file limit reached"}
              </label>
              <span className="text-sm font-medium">
                {isDragging ? "Drop files here..." : "Or Drag & Drop"}
              </span>
            </div>
          </>
        )}
      </div>
      {errors.browse && touched.browse ? (
        <p className="text-red-700 text-sm font-medium">{errors.browse}</p>
      ) : null}
    </div>
  );
};

export default EditDragDropImage;
