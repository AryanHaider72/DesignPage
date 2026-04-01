export interface ResponseCustomerData {
  message: string;
  customerData: customerData[];
}
export interface customerData {
  userID: string;
  customerName: string;
  email: string;
  phoneNo: string;
  isActive: string;
  verificationStatus: string;
}
