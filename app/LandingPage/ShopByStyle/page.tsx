export default function ShopByStyle() {
  const categories = [
    {
      images:
        "https://res.cloudinary.com/daz8ajhg3/image/upload/v1768383054/bcrg0urlkzew0fvhnph1.jpg",
      subCategoryName: "Weist Coat",
    },
    {
      images:
        "https://res.cloudinary.com/daz8ajhg3/image/upload/v1768380240/qrbuoqyzo3lhnxniipty.webp",
      subCategoryName: "Stitched",
    },
    {
      images:
        "https://res.cloudinary.com/daz8ajhg3/image/upload/v1770438914/yins9corvpzgzdysqisl.jpg",
      subCategoryName: "Unsticted",
    },
    {
      images:
        "https://res.cloudinary.com/daz8ajhg3/image/upload/v1768380236/xftbs9aqjiskjswfxctv.webp",
      subCategoryName: "Shalwar Kameez",
    },
    {
      images:
        "https://res.cloudinary.com/daz8ajhg3/image/upload/v1768379317/wi0zw4upirxrzil7j4ak.webp",
      subCategoryName: "Sweaters",
    },
  ];
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
          {categories.map((item, index) => (
            <div
              className="flex flex-col hover:underline transition-transform cursor-pointer"
              // onClick={() => {
              //   //   router.push(`${item.subCategoryID}/shop`);
              // }}
              key={index}
            >
              <img
                src={item.images}
                className="w-32 h-32 bg-gray-300 rounded-full object-cover hover:scale-[1.05] transition-transform"
              />

              <p className="mt-2 text-md font-bold">{item.subCategoryName}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
