import AddImageProduct from "@/api/lib/Admin/Codes/Product/ModifyProduct/ModifyImages/AddImages/AddImages";
import { SendToCloudinary } from "@/api/lib/OtherController/UploadToCloudinary/UploadToCloudinary";
import { ImageApiRequest } from "@/api/types/Admin/Codes/Product/ModifyImages";
import { useRef, useState } from "react";

interface ImagesList {
  listImage: urlTypes[];
}
interface Imagettype {
  image: File;
}
type urlTypes = {
  url: string;
};
interface GetImagesPropsID {
  values: string;
  onShowMessage: (message: any, type: "success" | "error") => void;
}
export default function AddImagesForm({
  values,
  onShowMessage,
}: GetImagesPropsID) {
  const [loading, setLoading] = useState(false);
  const [listImages, setListImages] = useState<ImagesList>({ listImage: [] });
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    handleImageChange(e.dataTransfer.files);
  };

  const handleClick = () => fileInputRef.current?.click();

  const handleImageChange = (files: FileList | null) => {
    if (!files) return;
    setImages((prev) => [...prev, ...Array.from(files)]);
  };

  const reorderImages = (from: number, to: number) => {
    const updated = [...images];
    const moved = updated.splice(from, 1)[0];
    updated.splice(to, 0, moved);
    setImages(updated);
  };

  const handleDeleteImage = (indexToDelete: number) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToDelete));
  };
  const sendMultipleImages = async (files: Imagettype[]) => {
    if (!files || files.length === 0) {
      alert("Please select at least one file");
      return null;
    }

    setLoading(true);

    try {
      const uploadedUrls: string[] = [];

      for (const file of files) {
        const res = await SendToCloudinary(file.image);
        if (res?.data?.secure_url) {
          uploadedUrls.push(res.data.secure_url);
        }
      }

      const payload: ImageApiRequest = {
        imgList: uploadedUrls.map((url) => ({ url })),
      };

      return payload;
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };
  const handleSaveImages = async () => {
    const payload = await sendMultipleImages(
      images.map((img) => ({ image: img })),
    );

    if (!payload) return;

    await addImages(payload);
  };

  const addImages = async (listImage: ImageApiRequest) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");

      const response = await AddImageProduct(listImage, String(token), values);

      if (response.status === 200 || response.status === 201) {
        onShowMessage(
          response.message || "Images modified successfully",
          "success",
        );
      } else {
        onShowMessage(response.message, "error");
      }
    } catch (error) {
      console.error("Error in addImages:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full flex flex-col xl:flex-row gap-6">
        <div className="mb-4 w-full ">
          <label className="block text-gray-700 font-medium mb-1">
            Product Images
          </label>
          <div
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            className={`w-full p-4 border-2 flex  justify-center gap-5 border-dashed rounded-md cursor-pointer text-center ${
              isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
          >
            <div className="flex flex-wrap gap-4">
              {images.length > 0 ? (
                <>
                  {images.map((img, i) => (
                    <div
                      key={i}
                      draggable
                      onDragStart={() => setDragIndex(i)}
                      onDragEnter={() => setHoverIndex(i)}
                      onDragEnd={() => {
                        if (
                          dragIndex !== null &&
                          hoverIndex !== null &&
                          dragIndex !== hoverIndex
                        ) {
                          reorderImages(dragIndex, hoverIndex);
                        }
                        setDragIndex(null);
                        setHoverIndex(null);
                      }}
                      className={`relative w-20 h-20 rounded-md 
                      ${hoverIndex === i ? "ring-2 ring-blue-500 scale-105" : ""}
                      transition-all duration-150`}
                    >
                      {/* ❌ Delete Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteImage(i);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white 
                 rounded-full w-5 h-5 flex items-center 
                 justify-center text-xs hover:bg-red-600 
                 shadow-md"
                      >
                        ✕
                      </button>

                      <img
                        src={URL.createObjectURL(img)}
                        className="w-full h-full object-cover rounded-md"
                        alt={`Product ${i + 1}`}
                      />

                      <span className="absolute -bottom-5 text-xs text-gray-600">
                        {i === 0 ? "Header Image" : `Image ${i + 1}`}
                      </span>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="text-lg text-gray-500">No Images Added Yet</p>
                </div>
              )}
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleImageChange(e.target.files)}
            className="hidden"
          />
        </div>
      </div>
      <button
        onClick={() => handleSaveImages()}
        className="w-full px-2 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md cursor-pointer"
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </>
  );
}
