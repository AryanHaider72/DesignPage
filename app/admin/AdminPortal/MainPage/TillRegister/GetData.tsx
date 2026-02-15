import DeleteTillForPos from "@/api/lib/Admin/TillRegister/DeleteTill/DeleteTill";
import GetTillForPos from "@/api/lib/Admin/TillRegister/TillGet/TillGet";
import {
  RespiosneGet,
  TillList,
} from "@/api/types/Admin/TillRegister/TillRegister";
import DeleteComponent from "@/app/UsefullComponent/DeleteComponent/page";
import Spinner from "@/app/UsefullComponent/Spinner/page";
import { Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";

interface GetTillFormProps {
  onEdit: (till: TillList, tillID: string) => void;
}

export default function GetTillForm({ onEdit }: GetTillFormProps) {
  const [loading, setLoading] = useState(true);
  const [ID, setID] = useState("");
  const [Delete, setDelete] = useState(false);
  const [TillList, setTillList] = useState<TillList[]>([]);

  const getTill = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await GetTillForPos(String(token));
      if (response.status === 200) {
        const data = response.data as RespiosneGet;
        if (data) {
          console.log(data);
          setTillList(data.tillList);
        } else {
          setTillList([]);
        }
      }
    } finally {
      setLoading(false);
    }
  };
  const deleteTill = async (ID: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const formData = {
        TillID: ID,
      };
      const response = await DeleteTillForPos(formData, String(token));
      if (response.status === 200 || response.status === 201) {
        setDelete(false);
        setTillList(TillList.filter((item) => item.tillID !== ID));
      } else {
      }
    } catch (error) {
      setLoading(true);
    } finally {
      setLoading(false);
    }
  };
  const fetchData = (ID: string) => {
    const data = TillList.find((item) => item.tillID === ID);
    if (data) {
      onEdit(data, ID);
    }
  };
  useEffect(() => {
    getTill();
  }, []);
  return (
    <>
      {Delete && (
        <DeleteComponent
          onCancel={() => {
            setDelete(false);
            setID("");
          }}
          onConfirm={() => deleteTill(ID)}
        />
      )}
      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : (
        <div className="space-y-4">
          {TillList.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition relative"
            >
              {/* Left: Till Info */}
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-gray-800">
                  {item.tillName}
                </span>
                <div className="mt-2">
                  <details className="text-sm text-gray-600">
                    <summary className="cursor-pointer select-none font-medium text-gray-700">
                      {item.tillSubList.length} Products
                    </summary>
                    <ul className="mt-2 space-y-1 pl-4">
                      {item.tillSubList.map((subItem, index) => (
                        <li key={index}>
                          {subItem.productName}, {subItem.subVarientName},{" "}
                          {subItem.qty}
                        </li>
                      ))}
                    </ul>
                  </details>
                </div>
              </div>

              {/* Right: Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
                  onClick={() => fetchData(item.tillID)}
                >
                  <Pencil />
                </button>

                <button
                  onClick={() => {
                    setDelete(true);
                    setID(item.tillID);
                  }}
                  className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-red-600 border border-red-600 rounded hover:bg-red-50 transition"
                >
                  <Trash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
