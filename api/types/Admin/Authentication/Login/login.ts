export interface RequestLoginData {
  Email: string;
  password: string;
}
export interface RequestSignUpData {
  userName: string;
  email: string;
  password: string;
  phoneNo: string;
  status: string;
  stores: storeList[];
  address: string;
}
interface storeList {
  storeID: string;
}
export interface ResponseLoginData {
  login: boolean;
  isValid: boolean;
  token: string;
  sellerID: string;
  message: string;
  status: string;
  loggedBy: string;
}
