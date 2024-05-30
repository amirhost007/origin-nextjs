import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Footer from "@/components/Footer";
// import Header from "@/components/Header";
import { loggedIn, userDataUpdate } from "@/store/Slices/authSlice";
import { getCookieData, hasKeyInCookie, setCookies } from "@/utils/helper";
import { currencyUpdate } from "@/store/Slices/headerSlice";

let BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Layout({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const { userData } = useSelector((state) => state.auth);
  const { lang, currency_name } = useSelector((state) => state.headData);

  // useEffect(() => {
  //   dispatch(loggedIn(hasKeyInCookie("origin_rent_token")));
  //   dispatch(
  //     userDataUpdate(
  //       getCookieData("origin_rent_userdata")
  //         ? JSON.parse(getCookieData("origin_rent_userdata"))
  //         : getCookieData("origin_rent_userdata")
  //     )
  //   );

  //   fetch(
  //     BaseUrl +
  //       `home?lang_id=${lang}&${
  //         userData?.role_id ? `role_id=${userData?.role_id}` : ""
  //       }`
  //   )
  //     .then((res) => res.json())
  //     .then(async (item) => {
  //       let cokData = await getCookieData("origin_rent_currency");
  //       const currenyData = cokData ? JSON.parse(cokData) : cokData;
  //       let dataforfind = await item.data.currencies;
  //       // https://ipapi.co/json/
  //       let dd = await fetch("https://ipapi.co/json/");
  //       let trackData = await dd.json();
  //       console.log(trackData);
        
  //       let currencies =
  //         dataforfind?.length > 0
  //           ? dataforfind.find((res) => trackData?.currency === res.name)
  //           : { id: 1, symbol: "$", name: "USD" };
  //       let currencySet = currencies
  //         ? currencies
  //         : { id: 1, symbol: "$", name: "USD" };
  //       // console.log("dataforfind :", dataforfind);
  //       // console.log("testlocation :", testlocation);
  //       console.log("currencies :", currencies);
  //       let setCurreny = currenyData ? currenyData : currencySet;

  //       setCookies(
  //         "origin_rent_currency",
  //         currenyData ? currenyData : JSON.stringify(currencySet)
  //       );

  //       dispatch(
  //         currencyUpdate({
  //           currency: setCurreny?.id,
  //           currency_symbol: setCurreny.symbol,
  //           currency_name: setCurreny.name,
  //         })
  //       );
  //     });
  // }, []);

  return (
    <main>
      {/* {router.pathname !== "/pdf-invoice" && <Header />} */}
      {children}
      {router.pathname !== "/pdf-invoice" && <Footer />}
    </main>
  );
}
