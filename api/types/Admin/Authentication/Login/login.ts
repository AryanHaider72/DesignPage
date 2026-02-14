export interface RequestLoginData {
  Email: string;
  password: string;
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
