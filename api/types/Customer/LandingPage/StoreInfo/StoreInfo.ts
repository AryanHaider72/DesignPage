export interface CustomerStoreInfoResponse {
  message: string;
  storeGet: storeGet[];
}
export interface storeGet {
  userID: string;
  headerText: string;
  subHeadingText: string;
  logoUrl: string;
  listImg: listImg[];
}
export interface listImg {
  imageID: string;
  url: string;
}
