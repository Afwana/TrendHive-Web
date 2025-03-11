/* eslint-disable react/prop-types */
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import axios from "axios";
import { Button } from "../ui/button";
import { useEffect } from "react";

const AddMoreImages = ({ onImagesUpload, onClose, currentImages }) => {
  const [additionalImages, setAdditionalImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    console.log(file);

    try {
      setIsUploading(true);
      const data = new FormData();
      data.append("my_file", file);
      const response = await axios.post(
        "http://localhost:5000/api/admin/products/upload-image",
        data
      );
      console.log(response, "response");
      const imageUrl = response?.data?.result?.url;
      console.log(imageUrl);

      const updatedImages = [...additionalImages, imageUrl];
      console.log(updatedImages);

      setAdditionalImages(updatedImages);

      if (onImagesUpload) {
        onImagesUpload(updatedImages);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (indexToRemove) => {
    const updatedImages = additionalImages.filter(
      (_, index) => index !== indexToRemove
    );
    setAdditionalImages(updatedImages);
    if (onImagesUpload) {
      onImagesUpload(updatedImages);
    }
  };

  const handleAdd = () => {
    if (onImagesUpload) {
      onImagesUpload(additionalImages);
    }
    onClose();
  };

  const handleCancel = () => {
    setAdditionalImages([]);
    if (onImagesUpload) {
      onImagesUpload([]);
    }
    onClose();
  };

  useEffect(() => {
    // Populate the state with current images when dialog opens
    setAdditionalImages(currentImages);
  }, [currentImages]);

  return (
    <div className="w-full">
      <DialogHeader>
        <DialogTitle>Add More Product Images</DialogTitle>
      </DialogHeader>

      <div className="mt-4">
        <div className="grid grid-cols-3 gap-4 mb-4">
          {additionalImages.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <img
                src={imageUrl}
                alt={`Additional ${index + 1}`}
                className="w-full h-32 object-cover rounded-md"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-white rounded-full text-red-500 border-red-500 z-10 border-2 group-hover:opacity-100 transition-opacity">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {isUploading ? (
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              ) : (
                <>
                  <ImagePlus className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="text-sm text-gray-500">Click to upload image</p>
                </>
              )}
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
            />
          </label>
        </div>

        <div className="mt-5 flex items-center justify-end">
          <div className="flex items-center gap-3">
            <Button onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleAdd}>Add</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMoreImages;
