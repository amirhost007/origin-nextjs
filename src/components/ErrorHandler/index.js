import { loggedIn, userDataUpdate } from "@/store/Slices/authSlice";
import { removeCookie } from "@/utils/helper";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

export default function ErrorHandler({ error }) {
  const router = useRouter();
  const dispatch = useDispatch();
  if (error.status === 403 || error.status === 401) {
    removeCookie("origin_rent_token");
    removeCookie("origin_rent_userdata");
    dispatch(loggedIn(false));
    dispatch(userDataUpdate({}));

    router.push(`/login?callbackUrl=${router.pathname}`);
  }
  return null;
}
