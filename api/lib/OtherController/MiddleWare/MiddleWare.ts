import { Routes } from "@/next.config";
import CheckAuth from "../../Admin/Authentication/CheckAuth/CheckAuth";

export async function MiddleWareRequestCheck(
  request: string,
  currentPath: string,
) {
  try {
    if (!request || !currentPath) {
      return { isValid: false, status: 401 };
    }

    const group = Routes.private[request as keyof typeof Routes.private];

    if (!group) {
      return { isValid: false, status: 401 };
    }

    const isPathAllowed = group.paths.some((path) =>
      currentPath.startsWith(path),
    );

    if (!isPathAllowed) {
      return { isValid: false, status: 401 };
    }

    const token = localStorage.getItem(group.token);

    if (!token) {
      return { isValid: false, status: 401 };
    }
    const response = await CheckAuth(token);
    console.log(response);
    if (response.status === 401) {
      return { isValid: false, status: 401 };
    }
    return { isValid: true, status: 200 };
  } catch {
    return { isValid: false, status: 500 };
  }
}
