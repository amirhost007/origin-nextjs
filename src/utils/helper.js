import toTimestamp from "@/components/timestamp";
import { setCookie, getCookie, hasCookie, deleteCookie } from "cookies-next";

export const setCookies = (key, value) => {
  setCookie(key, value);
};

export const getCookieData = (key) => {
  return getCookie(key);
};

export const getServerSideProps = (key) => {
  let data = getCookie(key);

  return { props: { data } };
};

export const hasKeyInCookie = (key) => {
  return hasCookie(key);
};
export const removeCookie = (key) => {
  deleteCookie(key);
};

export const getFromStorage = (key) => {
  let data;
  if (typeof window !== "undefined") {
    data = localStorage.getItem(key);
  }
  return data;
};

export const setToStorage = (key, value) => {
  if (typeof window !== "undefined") {
    return localStorage.setItem(key, value);
  }
};
export const clearStorage = (key) => {
  if (typeof window !== "undefined") {
    return localStorage.removeItem(key);
  }
};

export const uniqueNumber = () => {
  return (
    Math.floor(Math.random() * 90000) + 10000 + "" + toTimestamp(new Date())
  );
};

export const roundNum = (num) => {
  if (!parseInt(num)) return 0;
  return Math.round(num * 100) / 100;
};
