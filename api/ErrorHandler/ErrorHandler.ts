export default function ErrorHandler(status: number): string {
  switch (status) {
    case 400:
      return "Bad Request.";
    case 401:
      return "Invalid Email or Password.";
    case 403:
      return "You are not authorized.";
    case 404:
      return "Resource not found.";
    case 500:
      return "Internal Server Error.";
    default:
      return "Something went wrong.";
  }
}
