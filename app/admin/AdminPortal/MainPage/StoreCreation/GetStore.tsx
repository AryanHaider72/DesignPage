import { Pencil, Trash } from "lucide-react";

export default function StoreGetPage() {
  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition relative">
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-gray-800">
              StoreNames
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* <button
              className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
              //onClick={() => fetchData(item.tillID)}
            >
              <Pencil />
            </button> */}

            <button
              // onClick={() => {
              //   setDelete(true);
              //   setID(item.tillID);
              // }}
              className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-red-600 border border-red-600 rounded hover:bg-red-50 transition"
            >
              <Trash />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
