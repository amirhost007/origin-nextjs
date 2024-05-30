import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage, useIntl } from "react-intl";
import { loggedIn, userDataUpdate } from "@/store/Slices/authSlice";
import { removeCookie } from "@/utils/helper";
import {
  useGetHomeDataQuery,
  useStaticContentQuery,
  useUpdateLangForUserMutation,
} from "@/store/Slices/apiSlice";
import titleCase from "../TitleCase";
import { langUpdate } from "@/store/Slices/headerSlice";

function Partner() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [updateLangForUser] = useUpdateLangForUserMutation();
  const { lang, lang_code } = useSelector((state) => state.headData);
  const { isLoggedIn, userData } = useSelector((state) => state.auth);

  const { data: home } = useGetHomeDataQuery(
    { lang, role_id: userData?.role_id },
    { refetchOnMountOrArgChange: true }
  );
  const { data: staticData } = useStaticContentQuery(lang, {
    refetchOnMountOrArgChange: true,
  });
  const { formatMessage } = useIntl();
  const f = (id) => formatMessage({ id });

  const handleLogout = async () => {
    await removeCookie("origin_rent_token");
    await removeCookie("origin_rent_userdata");
    await dispatch(loggedIn(false));
    dispatch(userDataUpdate({}));
    // successMsg("Logout Successfully");
    router.push("/login");
  };

  const handleLanguageUpdate = (id, code) => {
    dispatch(langUpdate({ lang: id, lang_code: code }));
    isLoggedIn && updateLangForUser({ lang_id: id, lang_code: code });
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
      <header id="header" className="fixed-top ">
        <div className="container d-flex align-items-center">
          <Link href="/" legacyBehavior>
            <a className="logo me-auto">
              <img src="/assets/img/logo.png" alt="" className="img-fluid" />
            </a>
          </Link>

          <nav id="navbar" className="navbar">
            <ul>
              <li>
                <Link href="/" legacyBehavior>
                  <a className="nav-link scrollto active">Home</a>
                </Link>
              </li>
              <li>
                <a className="nav-link scrollto" href="pricing.html">
                  Pricing
                </a>
              </li>
              <li>
                <a className="nav-link scrollto" href="report.html">
                  Reports
                </a>
              </li>

              <li>
                <Link href="/help" legacyBehavior>
                  <a className="nav-link   scrollto" href="help.html">
                    Help & FAQs
                  </a>
                </Link>
              </li>

              <li>
                <select>
                  {home?.data?.currencies &&
                    home?.data?.currencies?.length > 0 &&
                    home?.data?.currencies?.map((res) => (
                      <option key={res.id}>{res.name}</option>
                    ))}
                </select>
              </li>
              <li className="dropdown">
                <a className="cuntry-drpdn" style={{ width: "80%" }}>
                  {currentLang && Object.keys(currentLang).length > 0 ? (
                    <img
                      className="img-fluid"
                      src={currentLang?.image}
                      alt=""
                    />
                  ) : (
                    <img
                      src="/assets/img/usa.svg"
                      alt=""
                      className="img-fluid"
                    />
                  )}
                  <i className="bi bi-chevron-down"></i>
                </a>
                <ul>
                  {language?.map((res) => (
                    <li
                      key={res.id}
                      onClick={() =>
                        handleLanguageUpdate(res.id, res.short_name)
                      }
                    >
                      <Link
                        href={"#"}
                        locale={res.short_name ? res.short_name : lang_code}
                      >
                        <img
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
              {isLoggedIn ? (
                <li className="dropdown pr-dp ">
                  <a className="cuntry-drpdn" style={{ width: "max-content" }}>
                    <img
                      src={
                        userData?.image
                          ? userData.image
                          : "/assets/img/account1.svg"
                      }
                      alt=""
                      className="img-fluid me-1 image-style"
                    />
                    {titleCase(userData?.name?.split(" ")[0])}
                    <i className="bi bi-chevron-down"></i>
                  </a>
                  <ul>
                    <li>
                      <Link href="my-account" legacyBehavior>
                        <a>
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
                    <a className="getstarted scrollto">
                      {staticData?.data?.login}
                    </a>
                  </Link>
                </li>
              )}
            </ul>
            <i className="bi bi-list mobile-nav-toggle"></i>
          </nav>
          {/*End navbar  */}
        </div>
      </header>
    </>
  );
}

export default Partner;
