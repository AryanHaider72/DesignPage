"use client";

import GetInitalStoreSalesMan from "@/api/lib/Admin/Stores/GetInitalStore/GetInitalStore";
import StoreHomePageAddSetting from "@/api/lib/Admin/Stores/StoreHomePageSetting/StoreHomePageSettingModify";
import StoreHomePageUpdateSettingImage from "@/api/lib/Admin/Stores/StoreImageSetting/StoreAddImages/StoreAddImages";
import StoreHomePageUpdateSetting from "@/api/lib/Admin/Stores/StoreImageSetting/StoreDataModfiySetting/StoreDataModfiySetting";
import StoreHomePageSettingDeleteImage from "@/api/lib/Admin/Stores/StoreImageSetting/StoreDeleteImages/StoreDeleteImages";
import { SendToCloudinary } from "@/api/lib/OtherController/UploadToCloudinary/UploadToCloudinary";
import {
  ResponseStoreList,
  storeListInital,
} from "@/api/types/Admin/Store/Store";
import { StoreHomeGet } from "@/api/types/Admin/Store/StoreHomepageSetting/StoreHomepageSetting";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ImageItem = {
  file: File;
  url: string;
};
type List = {
  imageUrl: string;
};
interface AddTillFormProps {
  initalData?: StoreHomeGet | null;
  storeID: string;
  updateData: boolean;
  onShowMessage: (message: string, type: "success" | "error") => void;
}

export default function HeaderImageProfile({
  initalData,
  storeID,
  updateData,
  onShowMessage,
}: AddTillFormProps) {
  const [StoreID, setStoreID] = useState(storeID || "");
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [imageData, setImageData] = useState(initalData?.imagelist || []);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [logoPreview, setLogoPreview] = useState<string | null>(
    initalData?.logoUrl || null,
  );
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [ID, setID] = useState(String(initalData?.userID || ""));
  const [HeaderText, setHeadertext] = useState(
    String(initalData?.headerText || ""),
  );
  const [SubHeadertext, setSubHeadertext] = useState(
    String(initalData?.subHeadingText || ""),
  );
  const [imageslist, setImagesList] = useState<ImageItem[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [storeList, setStoreList] = useState<storeListInital[]>([]);

  // Reset form when initalData becomes undefined (for new store)
  useEffect(() => {
    if (!initalData) {
      // Reset all form fields for new store
      setLogoPreview(null);
      setLogoFile(null);
      setID("");
      setHeadertext("");
      setSubHeadertext("");
      setImagesList([]);
      setLogoUrl("");
      setImageData([]);
    } else {
      // Update with existing data for edit mode
      setImageData(initalData?.imagelist || []);
      setLogoPreview(initalData?.logoUrl || null);
      setID(String(initalData?.userID || ""));
      setHeadertext(String(initalData?.headerText || ""));
      setSubHeadertext(String(initalData?.subHeadingText || ""));
    }
  }, [initalData]);

  // Update StoreID when prop changes
  useEffect(() => {
    setStoreID(storeID || "");
  }, [storeID]);

  const getStores = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await GetInitalStoreSalesMan(String(token));
    const data = response.data as ResponseStoreList;

    if (data.storeList.length > 0) {
      setStoreList(data.storeList);
    } else {
      setStoreList([]);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const reorderImages = (from: number, to: number) => {
    setImages((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      return updated;
    });
  };

  const handleImageChange = (files: FileList | null) => {
    if (!files) return;

    const newImages: ImageItem[] = Array.from(files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImagesList((prev) => [...prev, ...newImages]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    handleImageChange(e.dataTransfer.files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const deleteImage = (index: number) => {
    setImagesList((prev) => {
      const removed = prev[index];
      if (removed) {
        URL.revokeObjectURL(removed.url);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleUpload = async (ID: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      setLoading(true);
      let uploadedLogoUrl = logoUrl;
      if (logoFile) {
        const result = await SendToCloudinary(logoFile as unknown as File);
        if (result.data) {
          uploadedLogoUrl = result.data.secure_url;
          console.log("logo Upload", uploadedLogoUrl);
        } else {
          console.log("Logo upload failed:", result.error);
        }
      }
      const uploadedUrls: List[] = [];
      if (imageslist && imageslist.length > 0) {
        await Promise.all(
          imageslist.map(async (fileItem) => {
            const res = await SendToCloudinary(fileItem.file);
            if (res && res.data && res.data.secure_url) {
              uploadedUrls.push({ imageUrl: res.data.secure_url });
            } else {
              alert(`Upload failed for image ${fileItem.file.name}`);
            }
          }),
        );
        console.log("Banner Images:", uploadedUrls);
      }
      const payload = {
        logoUrl: uploadedLogoUrl || logoUrl,
        HeaderText: HeaderText,
        SubHeadingText: SubHeadertext,
        OtherText: "",
        imagelist: uploadedUrls.map((item) => ({
          imageUrl: item.imageUrl,
        })),
      };
      const response = await StoreHomePageAddSetting(
        payload,
        ID,
        String(token),
      );
      if (response.status === 200 || response.status === 201) {
        setImagesList([]);
        setHeadertext("");
        setSubHeadertext("");
        setLogoPreview("");
        onShowMessage(
          response.message || "Store Modified successfully",
          "success",
        );
      }
    } catch (error) {
      onShowMessage("Something went wrong", "error");
      setLoading(true);
    } finally {
      setLoading(false);
    }
  };

  const uploadImagesUrl = async () => {
    try {
      setLoading2(true);
      const uploadedUrls: List[] = [];
      if (imageslist && imageslist.length > 0) {
        await Promise.all(
          imageslist.map(async (fileItem) => {
            const res = await SendToCloudinary(fileItem.file);
            if (res && res.data && res.data.secure_url) {
              uploadedUrls.push({ imageUrl: res.data.secure_url });
            } else {
              alert(`Upload failed for image ${fileItem.file.name}`);
            }
          }),
        );
        console.log("Banner Images:", uploadedUrls);
      }
      const payload = {
        imagelist: uploadedUrls.map((item) => ({
          imageUrl: item.imageUrl,
        })),
      };
      const token = localStorage.getItem("adminToken");
      const response = await StoreHomePageUpdateSettingImage(
        payload,
        ID,
        String(token),
      );
      if (response.status === 200 || response.status === 201) {
        setImagesList([]);
        setHeadertext("");
        setSubHeadertext("");
        setLogoPreview("");
        onShowMessage(
          response.message || "Store Modified successfully",
          "success",
        );
      }
    } catch (error) {
      onShowMessage("Something went wrong", "error");
      setLoading(true);
    } finally {
      setLoading2(false);
    }
  };

  const deleteImages = async (imageID: string) => {
    const token = localStorage.getItem("adminToken");
    const response = await StoreHomePageSettingDeleteImage(
      imageID,
      String(token),
    );
    if (response.status === 200 || response.status === 201) {
      setImageData((prev) => prev.filter((item) => item.imageID !== imageID));
    }
  };
  const updateStoreData = async () => {
    try {
      setLoading3(true);
      const token = localStorage.getItem("adminToken");
      let uploadedLogoUrl = logoUrl;
      if (logoFile) {
        const result = await SendToCloudinary(logoFile as unknown as File);
        if (result.data) {
          uploadedLogoUrl = result.data.secure_url;
          console.log("logo Upload", uploadedLogoUrl);
        } else {
          console.log("Logo upload failed:", result.error);
        }
      } else {
        uploadedLogoUrl = String(logoPreview);
      }
      const payload = {
        logoUrl: uploadedLogoUrl,
        OtherText: "",
        HeaderText: HeaderText,
        SubHeadingText: SubHeadertext,
      };
      const response = await StoreHomePageUpdateSetting(
        payload,
        ID,
        String(token),
      );
      if (response.status === 200 || response.status === 201) {
        setImagesList([]);
        setHeadertext("");
        setSubHeadertext("");
        setLogoPreview("");
        onShowMessage(
          response.message || "Store Modified successfully",
          "success",
        );
      }
    } catch (error) {
      onShowMessage("Something went wrong", "error");
      setLoading(true);
    } finally {
      setLoading3(false);
    }
  };
  useEffect(() => {
    getStores();
  }, []);

  return (
    <>
      <div className="w-full flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Store
            </label>
            <div className="relative">
              <select
                value={StoreID}
                onChange={(e) => {
                  setStoreID(e.target.value);
                }}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none cursor-pointer"
              >
                <option value="">Select Store</option>
                {storeList.map((cat) => (
                  <option key={cat.storeID} value={cat.storeID}>
                    {cat.storeName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Header Text
            </label>
            <textarea
              value={HeaderText}
              onChange={(e) => setHeadertext(e.target.value)}
              rows={3}
              placeholder="Enter header text"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Sub-Heading Text
            </label>
            <textarea
              value={SubHeadertext}
              onChange={(e) => setSubHeadertext(e.target.value)}
              rows={3}
              placeholder="Enter sub-heading text"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer px-4 py-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-200 hover:bg-blue-100 transition">
              Upload Logo
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
            </label>

            <span className="text-sm text-gray-500">
              PNG, JPG, SVG (max 1MB)
            </span>
          </div>
          {logoPreview && (
            <div className="mt-2 mb-2 ">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <div className="w-32 h-32 border rounded-lg flex items-center justify-center bg-gray-50">
                <img
                  src={logoPreview}
                  alt="Store Logo Preview"
                  className="max-w-full max-h-full object-contain pointer-events-none"
                />
              </div>
            </div>
          )}
          {updateData && (
            <div className="mt-2 w-full flex justify-end">
              <button
                onClick={() => updateStoreData()}
                type="button"
                className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition shadow-lg"
              >
                {loading3 ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>
        <div className="w-full lg:max-w-md space-y-4">
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Images
          </label>
          <div
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            className={`w-full h-1/2 p-4 border-2 border-dashed rounded-md cursor-pointer
              ${isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"}
            `}
          >
            {imageslist.length === 0 && (
              <p className=" text-gray-500 text-sm text-center">
                Click or drag images here to upload
              </p>
            )}

            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex flex-wrap gap-4 justify-center">
                {imageslist.map((img, i) => (
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
                    className="relative w-24 h-24 rounded-md overflow-hidden"
                  >
                    <img
                      src={img.url}
                      alt={`Image ${i + 1}`}
                      className="w-full h-full object-cover pointer-events-none"
                    />

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteImage(i);
                      }}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition"
                    >
                      ✕
                    </button>

                    <span className="absolute bottom-1 right-1 text-[10px] bg-black/60 text-white px-1 rounded">
                      {i + 1}
                    </span>
                  </div>
                ))}
              </div>
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
          {updateData ? (
            <div className="mt-2 w-full flex justify-end">
              <button
                onClick={() => uploadImagesUrl()}
                type="button"
                className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition shadow-lg"
              >
                {loading2 ? "Saving..." : "Save"}
              </button>
            </div>
          ) : (
            <div className="mt-2 w-full flex justify-end">
              <button
                onClick={() => handleUpload(StoreID)}
                type="button"
                className="px-6 py-2 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition shadow-lg"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>
        {updateData && (
          <>
            <div className="w-full lg:max-w-md space-y-4">
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                List Images
              </label>

              <div className="flex gap-2 flex-wrap ">
                {imageData?.map((img) => (
                  <div key={img.imageID} className="relative w-28 h-28 ">
                    {/* Image */}
                    <img
                      src={img.imageUrl}
                      alt="banner"
                      className="w-full h-full object-cover rounded-md pointer-events-none"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteImages(String(img.imageID));
                      }}
                      className="pointer-events-auto absolute -top-1 -right-1 bg-red-600 text-white 
                                  w-6 h-6 rounded-full flex items-center justify-center 
                                  text-xs hover:bg-red-700 shadow-md"
                    >
                      <X size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
