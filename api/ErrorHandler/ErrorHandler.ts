// utils/ErrorHandler.ts
import { AxiosError } from "axios";

export default async function ErrorHandler(error: unknown) {
  let message = "An unexpected error occurred";

  if (error instanceof AxiosError) {
    if (error.response) {
      // HTTP response received, check status code
      const status = error.response.status;

      switch (status) {
        case 400:
          message = "Bad Request. Please check your input.";
          break;
        case 401:
          message = "Unauthorized. Please log in again.";
          break;
        case 403:
          message = "Forbidden. You don’t have access.";
          break;
        case 404:
          message = "Resource not found.";
          break;
        case 409:
          message = "Conflict. The data already exists.";
          break;
        case 422:
          message = "Unprocessable entity. Validation failed.";
          break;
        case 500:
          message = "Internal server error. Please try later.";
          break;
        case 503:
          message = "Service unavailable. Try again later.";
          break;
        default:
          // fallback to server-provided message if exists
          message =
            error.response.data?.message ||
            `Request failed with status ${status}`;
      }
    } else if (error.request) {
      // Request made but no response received
      message = "No response from server. Check your network connection.";
    } else {
      // Error setting up the request
      message = error.message;
    }
  } else if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === "string") {
    message = error;
  }

  // Optional: log for debugging (remove alert)
  console.error("Axios ErrorHandler:", error);

  // Just return the message, don't show alert on server
  return message;
}
