// Response Type
export interface StoreHomeSettingGetApiResponse {
  message: string;
  storeList: StoreHomeGet[];
}

// A single FurtherSub record
export type StoreHomeGet = {
  userID: string;
  headerText: string;
  subHeadingText: string;
  otherText: string;
  logoUrl: string;
  imagelist: list[];
};

// Unit inside FurtherSub
export type list = {
  imageID?: string;
  imageUrl: string;
};

export interface RequestStoreHomepageData {
  logoUrl: string;
  OtherText: string;
  HeaderText: string;
  SubHeadingText: string;
  imagelist: list[];
}

export interface ResponseStoreHomePageData {
  status: string;
  message?: string;
}

export interface RequestStoreHomepageUpdateData {
  logoUrl: string;
  OtherText: string;
  HeaderText: string;
  SubHeadingText: string;
}
export interface RequestStoreHomepageUpdateDataImage {
  imagelist: list[];
}
