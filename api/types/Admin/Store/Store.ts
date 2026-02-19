// Response Type
export interface StoreApiResponse {
  storeList: storeInital[];
}

// A single FurtherSub record
export type storeInital = {
  storeID: string;
  storeName: string;
  defaultStore: boolean;
};

export interface RequestStoreAddData {
  email: string;
  cityID: string;
  storeName: string;
  description: string;
}

export interface ResponseStoreAddData {
  status: string;
  message?: string;
}

export interface ResponseStoreList {
  message: string;
  storeList: storeListInital[];
}
export interface storeListInital {
  defaultStore: boolean;
  storeID: string;
  storeName: string;
}
