"use client";
import DeleteImageApi from "@/api/lib/Admin/Codes/Product/ModifyProduct/ModifyImages/DeleteImages/DeletImage";
import GetProductImages from "@/api/lib/Admin/Codes/Product/ModifyProduct/ModifyImages/GetImages/GetImages";
import {
  ImageGetApiResponse,
  ImageListID,
} from "@/api/types/Admin/Codes/Product/ModifyImages";
import Spinner from "@/app/UsefullComponent/Spinner/page";
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";
interface GetImagesPropsID {
  value: string;
}
export default function GetIMagesFormForMain({ value }: GetImagesPropsID) {
  const [loading, setLoading] = useState(false);
  const [ImageList, setImageList] = useState<ImageListID[]>([]);

  useEffect(() => {
    getImage(value);
  }, [value]);

  const getImage = async (item: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await GetProductImages(item, String(token));
      if (response.status === 200 || response.status === 201) {
        const data = response.data as ImageGetApiResponse;
        setImageList(data.imagesList);
      }
    } finally {
      setLoading(false);
    }
  };
  const deleteImage = async (ID: string) => {
    const token = localStorage.getItem("adminToken");
    const response = await DeleteImageApi(ID, String(token));
    if (response.status === 200 || response.status === 201) {
      const data = ImageList.filter((item) => item.urlID !== ID);
      setImageList(data);
    }
  };
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {ImageList.length > 0 ? (
          <>
            {loading ? (
              <Spinner />
            ) : (
              <>
                {ImageList.map((img) => (
                  <div
                    key={img.urlID}
                    className="relative border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
                  >
                    <img
                      src={img.url}
                      alt="Product"
                      className="w-full h-30 object-cover"
                    />
                    <button
                      onClick={() => deleteImage(img.urlID)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                      title="Delete Image"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </>
            )}
          </>
        ) : (
          <p className="text-center text-gray-500">No images found.</p>
        )}
      </div>
    </>
  );
}
