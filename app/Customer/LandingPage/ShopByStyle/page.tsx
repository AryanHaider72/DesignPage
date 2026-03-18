import { categoryList } from "@/api/types/Customer/LandingPage/Category/GetCategroy";
import Link from "next/link";
interface NavbarProps {
  categoryList: categoryList[]; // Changed from function to array
}
export default function ShopByStyle({ categoryList }: NavbarProps) {
  return (
    <div className="w-full py-5   flex justify-center items-center">
      <div className="w-full max-w-4xl px-6  text-center">
        <h2
          className="text-4xl font-bold"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Shop Your Style
        </h2>
        <p className=" mb-4">Find the perfect look for every occasion</p>
        <div className="flex w-full justify-center gap-10">
          {categoryList?.map((item, index) => (
            <div key={index}>
              <Link
                href={`/Customer/Shop/${index}`}
                className="flex flex-col hover:underline transition-transform cursor-pointer"
                key={index}
              >
                {item.subCategory[0]?.imagelist?.length > 0 ? (
                  <img
                    src={item.subCategory[0]?.imagelist[0].url}
                    className="w-32 h-32 bg-gray-300 rounded-full object-cover hover:scale-[1.05] transition-transform"
                  />
                ) : (
                  <img
                    src={"/placeholder.jpg"}
                    className="w-32 h-32 bg-gray-300 rounded-full object-cover hover:scale-[1.05] transition-transform"
                  />
                )}

                <p className="mt-2 text-md font-bold">{item.subCategoryName}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
