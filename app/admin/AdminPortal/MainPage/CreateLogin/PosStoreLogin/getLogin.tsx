import SellerDelete from "@/api/lib/Admin/CreateLogins/DeleteSeller/DeleteSeller";
import SellerLoginGet from "@/api/lib/Admin/CreateLogins/getLogins/getlogin";
import SellerRevoke from "@/api/lib/Admin/CreateLogins/RevokeSeller/RevokeSeller";
import DeleteComponent from "@/app/UsefullComponent/DeleteComponent/page";
import Spinner from "@/app/UsefullComponent/Spinner/page";
import { RefreshCcw, Trash } from "lucide-react";
import { useEffect, useState } from "react";

interface responseFromSellerGet {
  message: string;
  sellerList: sellerList[];
}
interface sellerList {
  email: string;
  isActive: boolean;
  sellerID: string;
  status: string;
  userName: string;
}
export default function GetLoginForm() {
  const [ID, setID] = useState("");
  const [Delete, setDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [GetSeller, setgetSeller] = useState<sellerList[]>([]);

  const getStores = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await SellerLoginGet(String(token));
      if (response.status === 200 || response.status === 201) {
        const data = response.data as responseFromSellerGet;
        if (data.sellerList.length > 0) {
          setgetSeller(
            data.sellerList.filter((item) => item.status === "OfflineSeller"),
          );
        } else {
          setgetSeller([]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const revokeSeller = async (ID: string, active: boolean) => {
    const token = localStorage.getItem("adminToken");
    const formData = {
      sellerID: ID,
      isActive: !active,
    };
    const response = await SellerRevoke(formData, String(token));
    if (response.status === 200 || response.status === 201) {
      console.log(response);
      getStores();
    }
  };
  const DeleteSeller = async (ID: string) => {
    const token = localStorage.getItem("adminToken");
    const formData = {
      sellerID: ID,
    };
    const response = await SellerDelete(formData, String(token));
    if (response.status === 200 || response.status === 201) {
      setDelete(false);
      getStores();
    }
  };
  useEffect(() => {
    getStores();
  }, []);
  return (
    <>
      {Delete && (
        <DeleteComponent
          onCancel={() => {
            setDelete(false);
            setID("");
          }}
          onConfirm={() => DeleteSeller(ID)}
        />
      )}
      <div className="mt-2 ">
        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : (
          <>
            {GetSeller.length > 0 ? (
              <div className="space-y-4">
                {GetSeller.map((item) => (
                  <div
                    key={item.sellerID}
                    className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition relative"
                  >
                    {/* Left: Till Info */}
                    <div className="flex flex-col">
                      <span className="text-lg font-semibold text-gray-800">
                        {item.email}
                      </span>

                      <span className="text-sm mt-1  text-gray-800">
                        <span className="font-bold">Active : </span>{" "}
                        {item.isActive ? (
                          <span className="text-sm rounded-full px-2 py-1 bg-green-100 text-green-600 ">
                            {"Active"}
                          </span>
                        ) : (
                          <span className="text-sm rounded-full px-2 py-1 bg-red-100 text-red-600 ">
                            {"InActive"}
                          </span>
                        )}
                      </span>
                    </div>

                    {/* Right: Action Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
                        onClick={() =>
                          revokeSeller(item.sellerID, item.isActive)
                        }
                      >
                        <RefreshCcw />
                      </button>

                      <button
                        onClick={() => {
                          setDelete(true);
                          setID(item.sellerID);
                        }}
                        className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-red-600 border border-red-600 rounded hover:bg-red-50 transition"
                      >
                        <Trash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <span>No Record Found</span>
            )}
          </>
        )}
      </div>
    </>
  );
}
