import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useIntl } from "react-intl";
import { signOut, useSession } from "next-auth/react";
import { loggedIn, userDataUpdate } from "@/store/Slices/authSlice";
import { removeCookie, setCookies } from "@/utils/helper";
import {
  useGetHomeDataQuery,
  useStaticContentQuery,
  useUpdateLangForUserMutation,
} from "@/store/Slices/apiSlice";
import titleCase from "../TitleCase";
import {
  currencyUpdate,
  langUpdate,
  preCurrencyUpdate,
  updateFetching,
} from "@/store/Slices/headerSlice";
import useWindowSize from "../WindowSize";
import useComponentVisible from "@/Hooks/useComponentVisible";

function Header(props) {
  const serverData = props?.serverData ? props.serverData : null;
  const currentPath = props?.pathname ? props.pathname : null;
  const router = useRouter();
  const dispatch = useDispatch();
  const size = useWindowSize();
  const session = useSession();
  const [showMobile, setShowMobile] = useState(false);
  const [showLangDropDown, setLangDropDown] = useState(false);
  const [showProfileDropDown, setProfileDropDown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [updateLangForUser] = useUpdateLangForUserMutation();
  const { lang, lang_code, currency } = useSelector((state) => state.headData);
  const { isLoggedIn, userData } = useSelector((state) => state.auth);
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);

  const { data: home } = useGetHomeDataQuery(
    { lang, role_id: userData?.role_id },
    { refetchOnMountOrArgChange: true }
  );
  const { data: staticData } = useStaticContentQuery(lang, {
    refetchOnMountOrArgChange: true,
  });
  const { formatMessage } = useIntl();
  const text = (id) => formatMessage({ id });

  const handleLogout = async () => {
    setIsLoading(true);
    await removeCookie("origin_rent_token");
    await removeCookie("origin_rent_userdata");
    await dispatch(loggedIn(false));
    await dispatch(userDataUpdate({}));
    session.status === "authenticated" && (await signOut("google"));

    // successMsg("Logout Successfully");
    router.push("/login");
    setShowMobile(false);
    setIsLoading(false);
  };

  const handleLanguageUpdate = async (id, code) => {
    setIsLoading(true);
    await dispatch(langUpdate({ lang: id, lang_code: code }));
    isLoggedIn && (await updateLangForUser({ lang_id: id, lang_code: code }));
    setIsLoading(false);
  };
  const handleCurrencyUpdate = (id, code) => {
    setIsLoading(true);
    dispatch(updateFetching(true));
    let currencies =
      home?.data?.currencies?.length > 0
        ? home?.data?.currencies?.find((res) => res.id == id)
        : { id: 2, symbol: "€", name: "EUR" };

    dispatch(
      preCurrencyUpdate({
        prev_currency: currency,
      })
    );
    dispatch(
      currencyUpdate({
        currency: id,
        currency_symbol: currencies.symbol,
        currency_name: currencies.name,
      })
    );
    setCookies("origin_rent_currency", JSON.stringify(currencies));
    setIsLoading(false);
    // isLoggedIn && updateLangForUser({ lang_id: id, lang_code: code });
  };

  let language =
    home?.data?.languages && home?.data?.languages?.length > 0
      ? home?.data?.languages
      : null;

  const currentLang = language?.find(
    (res) => res.id == home?.data?.setting?.lang_id
  );

  return (
    <>
      {/* ======= Header =======  */}
      <header
        id="header"
        className={
          currentPath === "/list" ? "position-relative" : "fixed-top "
        }
      >
        <div className="container-fluid d-flex align-items-center">
          <Link href="/" legacyBehavior>
            <a className="logo me-auto">
              <img src="/assets/img/logo.png" alt="" className="img-fluid" />
            </a>
          </Link>
          {isLoading && <div className="list-loader" />}
          <nav
            id="navbar"
            className={`navbar ${
              size.width && size.width <= 975 && showMobile
                ? "navbar-mobile"
                : ""
            }`}
          >
            <ul>
              {home?.data?.menu_item_header.length
                ? home?.data?.menu_item_header?.map((res) => (
                    <li key={res.id}>
                      <Link href={res.link} legacyBehavior>
                        <a
                          className={`nav-link scrollto ${
                            router.asPath === res.link ? "active" : ""
                          }`}
                          onClick={() => setShowMobile(false)}
                        >
                          {res.name}
                        </a>
                      </Link>
                    </li>
                  ))
                : serverData?.menu_item_header?.map((res) => (
                    <li key={res.id}>
                      <Link href={res.link} legacyBehavior>
                        <a
                          className={`nav-link scrollto ${
                            router.pathname === res.link &&
                            router.asPath === res.link
                              ? "active"
                              : ""
                          }`}
                          onClick={() => setShowMobile(false)}
                        >
                          {res.name}
                        </a>
                      </Link>
                    </li>
                  ))}

              {
                home?.data?.menu_item_manage_booking.length > 0
                  ? home?.data?.menu_item_manage_booking?.map((item) => (
                      <li key={item.id}>
                        <Link href={item?.link} legacyBehavior>
                          <a
                            className="getstarted scrollto"
                            onClick={() => setShowMobile(false)}
                          >
                            {item?.name}
                          </a>
                        </Link>
                      </li>
                    ))
                  : null
                //  serverData?.menu_item_manage_booking?.map((item) => (
                //     <li key={item.id}>
                //       <Link href={item?.link} legacyBehavior>
                //         <a
                //           className="getstarted scrollto"
                //           onClick={() => setShowMobile(false)}
                //         >
                //           {item?.name}
                //         </a>
                //       </Link>
                //     </li>
                //   ))
              }
              {/* {home?.data?.currencies && home?.data?.currencies?.length > 0 ? ( */}
              <li>
                <select
                  value={currency ? currency : props.currencydata?.id}
                  onChange={(e) => handleCurrencyUpdate(e.target.value)}
                >
                  {home?.data?.currencies?.map((res) => (
                    <option value={res.id} name={res.name} key={res.id}>
                      {res.name}
                    </option>
                  ))}
                </select>
              </li>
              {/* ) : (
                serverData && (
                  <li>
                    <select
                      value={currency ? currency : props.currencydata?.id}
                      onChange={(e) => handleCurrencyUpdate(e.target.value)}
                    >
                      {serverData?.currencies?.map((res) => (
                        <option value={res.id} key={res.id}>
                          {res.name}
                        </option>
                      ))}
                    </select>
                  </li>
                )
              )} */}
              {currentLang &&
                Object.keys(currentLang).length > 0 &&
                language.length > 0 && (
                  <li className="lng-drp" ref={ref}>
                    <a
                      className="cuntry-drpdn lang_box drop-lung-1"
                      // onClick={() => setLangDropDown((prev) => !prev)}
                    >
                      {currentLang && Object.keys(currentLang).length > 0 ? (
                        <img
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50px",
                          }}
                          className="img-fluid"
                          src={currentLang?.image}
                          alt=""
                        />
                      ) : (
                        <img
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50px",
                          }}
                          src="/assets/img/usa.svg"
                          alt=""
                          className="img-fluid"
                        />
                      )}
                      <i className="bi bi-chevron-down"></i>
                    </a>
                    <ul
                      className={isComponentVisible ? "activelang" : "d-none"}
                    >
                      {language?.map((res) => (
                        <li
                          key={res.id}
                          onClick={() => {
                            handleLanguageUpdate(res.id, res.short_name);
                            setIsComponentVisible(false);
                          }}
                        >
                          <Link
                            href={router.asPath}
                            locale={res.short_name ? res.short_name : lang_code}
                          >
                            <img
                              style={{
                                width: "20px",
                                height: "20px",
                                borderRadius: "50px",
                              }}
                              className="img-fluid"
                              src={res.image ? res.image : ""}
                              alt=""
                            />
                            {res.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                )}

              {isLoggedIn ? (
                <li className="dropdown pr-dp ">
                  <a
                    className="cuntry-drpdn profile_box"
                    style={{ width: "max-content" }}
                    onClick={() => {
                      setProfileDropDown((prev) => !prev);
                    }}
                  >
                    <img
                      src={
                        userData?.image
                          ? userData.image
                          : "/assets/img/account1.svg"
                      }
                      alt=""
                      className="me-1 image-style"
                    />
                    {titleCase(userData?.name?.split(" ")[0])}
                    <i className="bi bi-chevron-down"></i>
                  </a>
                  <ul className={showProfileDropDown ? "dropdown-active" : ""}>
                    <li>
                      <Link href="my-account" legacyBehavior>
                        <a onClick={() => setShowMobile(false)}>
                          <img
                            className="img-fluid me-2"
                            src="/assets/img/account.svg"
                            alt=""
                          />
                          {staticData?.data?.my_account}
                        </a>
                      </Link>
                    </li>
                    <li>
                      <a onClick={handleLogout} style={{ cursor: "pointer" }}>
                        <img
                          className="img-fluid me-2"
                          src="/assets/img/logout.svg"
                          alt=""
                        />
                        {staticData?.data?.logout}
                      </a>
                    </li>
                  </ul>
                </li>
              ) : (
                <li>
                  <Link href="/login" legacyBehavior>
                    <a
                      className="getstarted scrollto"
                      onClick={() => setShowMobile(false)}
                    >
                      {staticData?.data?.login
                        ? staticData?.data?.login
                        : text("LOGIN")}
                    </a>
                  </Link>
                </li>
              )}
              {userData?.role_id == 3 && (
                <li>
                  <a className="getstarted scrollto">B2B</a>
                </li>
              )}
            </ul>
            {!showMobile ? (
              <i
                className="bi bi-list mobile-nav-toggle"
                onClick={() => setShowMobile((prev) => !prev)}
              ></i>
            ) : (
              <i
                className="bi mobile-nav-toggle bi-x"
                onClick={() => setShowMobile((prev) => !prev)}
              ></i>
            )}
          </nav>
          {/* navbar  */}
        </div>
      </header>
      {/* End Header  */}
    </>
  );
}

export default React.memo(Header);
