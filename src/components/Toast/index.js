import { toast } from "react-toastify";

export const successMsg = (message) => {
  toast.success(message);
};
export const errorMsg = (message) => {
  toast.error(message);
};
