/* eslint-disable react/prop-types */
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

function ImageUpload({
  imageFile,
  setImageFile,
  imageLoadingState,
  // uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
  label,
}) {
  const inputRef = useRef(null);

  console.log(isEditMode, "isEditMode");

  function handleImageFileChange(event) {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
        toast.error("Only JPG, JPEG, and PNG files are allowed.");
        return;
      }

      if (selectedFile.size > MAX_FILE_SIZE) {
        toast.error("File size exceeds 2 MB limit.");
        return;
      }

      setImageFile(selectedFile);
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];

    if (!ALLOWED_FILE_TYPES.includes(droppedFile.type)) {
      toast.error("Only JPG, JPEG, and PNG files are allowed.");
      return;
    }

    if (droppedFile) {
      if (droppedFile.size > MAX_FILE_SIZE) {
        toast.error("File size exceeds 2 MB limit.");
        return;
      }

      setImageFile(droppedFile);
    }
  }

  function handleRemoveImage() {
    setImageFile(null);
    setUploadedImageUrl("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  console.log(imageFile);

  async function uploadImageToCloudinary() {
    setImageLoadingState(true);
    const data = new FormData();
    data.append("my_file", imageFile);
    const response = await axios.post(
      "http://localhost:5000/api/admin/products/upload-image",
      data
    );
    console.log(response, "response");

    if (response?.data?.success) {
      setUploadedImageUrl(response.data.result.url);
      setImageLoadingState(false);
    }
  }

  useEffect(() => {
    if (imageFile) {
      uploadImageToCloudinary();
    }
  }, [imageFile]);

  return (
    <div
      className={`w-full  mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
      <Label className="text-lg font-semibold mb-2 block">
        {label ? label : "Upload image"}
      </Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${
          isEditMode ? "opacity-60" : ""
        } border-2 border-dashed rounded-lg p-4`}>
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
        />
        {!imageFile ? (
          <Label
            htmlFor="image-upload"
            className={`${
              isEditMode ? "cursor-not-allowed" : ""
            } flex flex-col items-center justify-center h-32 cursor-pointer`}>
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to upload image</span>
          </Label>
        ) : imageLoadingState ? (
          <Skeleton className="h-10 bg-gray-100" />
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileIcon className="w-8 text-primary mr-2 h-8" />
            </div>
            <p className="text-sm font-medium">{imageFile.name}</p>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleRemoveImage}>
              <XIcon className="w-4 h-4" />
              <span className="sr-only">Remove File</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageUpload;
