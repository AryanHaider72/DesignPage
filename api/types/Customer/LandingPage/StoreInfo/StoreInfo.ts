export interface CustomerStoreInfoResponse {
  message: string;
  storeGet: storeGet[];
}
export interface storeGet {
  userID: string;
  headerText: string;
  subHeadingText: string;
  logoUrl: string;
  storeName: string;
  email: string;
  youtube: string;
  linkdin: string;
  instagram: string;
  twitter: string;
  facebook: string;
  phoneNo: string;
  listImg: listImg[];
}
export interface listImg {
  imageID: string;
  url: string;
}
