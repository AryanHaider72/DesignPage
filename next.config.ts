export const Routes = {
  public: [],
  private: {
    PlatformOwner: {
      token: "adminToken",
      paths: [
        "/admin/AdminPortal/MainPage/Dashboard",
        "/admin/AdminPortal/MainPage/Codes/Suppliers",
        "/admin/AdminPortal/MainPage/Codes/Units",
        "/admin/AdminPortal/MainPage/Codes/Category",
        "/admin/AdminPortal/MainPage/Codes/SubCategory",
        "/admin/AdminPortal/MainPage/Codes/Product",
        "/admin/AdminPortal/MainPage/Shipment/DelieveryStandard",
        "/admin/AdminPortal/MainPage/Shipment/CourierService",
        "/admin/AdminPortal/MainPage/Shipment/InternationDelievry",
        "/admin/AdminPortal/MainPage/Shipment/Region",
        "/admin/AdminPortal/MainPage/Shipment/Zone",
        "/admin/AdminPortal/MainPage/Shipment/City",
        "/admin/AdminPortal/MainPage/StoreManagement/StoreCreation",
        "/admin/AdminPortal/MainPage/StoreManagement/StoreProfile",
        "/admin/AdminPortal/MainPage/CreateLogin/PosStoreLogin",
        "/admin/AdminPortal/MainPage/CreateLogin/OnlineStoreLogin",
      ],
    },
    OnlineSeller: {
      token: "OnlineSellerToken",
      paths: [
        "/OnlineSeller/MainPage/CreateLogins",
        "/OnlineSeller/MainPage/Dashboard",
        "/OnlineSeller/MainPage/OrderManagement/OrderSetting",
        "/OnlineSeller/MainPage/OrderManagement/OrderShipment",
      ],
    },

    OfflineSeller: {
      token: "sellerToken",
      paths: [
        "/OfflineSeller/MainPage/CreateLogins",
        "/OfflineSeller/MainPage/Dashboard",
        "/OfflineSeller/MainPage/TillRegister",
      ],
    },
    TillSeller: {
      token: "posSellerToken",
      paths: [
        "/PosSellers/MainPage/Dashboard",
        "/PosSellers/MainPage/Codes/CustomerManagement",
        "/PosSellers/MainPage/Codes/ExpenseManagement",
        "/PosSellers/MainPage/Ledger",
        "/PosSellers/MainPage/TillTransfer",
        "/PosSellers/MainPage/SaleModule",
        "/PosSellers/MainPage/SaleReturn",
      ],
    },
    WareHouseSeller: {
      token: "wareHouseSellerToken",
      paths: [
        "/WareHouseSeller/MainPage/Dashboard",
        "/WareHouseSeller/MainPage/OrderManagement",
      ],
    },
  },
};
