import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Router from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useSession, signIn } from "next-auth/react";
import { errorMsg, successMsg } from "@/components/Toast";
import {
  clearStorage,
  getFromStorage,
  setCookies,
  setToStorage,
} from "@/utils/helper";
import {
  useLoginUserMutation,
  useSocial_loginMutation,
  useStaticContentQuery,
} from "@/store/Slices/apiSlice";
import { loggedIn, userDataUpdate } from "@/store/Slices/authSlice";
import { langUpdate } from "@/store/Slices/headerSlice";
import Header from "@/components/Header";

export default function Login(props) {
  const dispatch = useDispatch();
  const { lang } = useSelector((state) => state.headData);
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const session = useSession();
  const { data: staticData } = useStaticContentQuery(lang, {
    refetchOnMountOrArgChange: true,
  });

  let rememberData = getFromStorage("remember")
    ? JSON.parse(getFromStorage("remember"))
    : null;
  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(rememberData ? true : false);

  const [social_login] = useSocial_loginMutation();

  const handleCheck = () => {
    setChecked(true);
  };
  const handleUnCheck = () => {
    setChecked(false);
    clearStorage("remember");
  };

  const initialState = {
    email: "",
    password: "",
  };
  const rememberState = {
    email: rememberData?.email ? rememberData?.email : "",
    password: rememberData?.password ? rememberData?.password : "",
  };
  const loginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Field is required"),
    password: Yup.string().required("Field is required"),
  });

  const handleSubmit = async (values, {}) => {
    let callbackUrl = Router.query?.callbackUrl
      ? Router.query?.callbackUrl
      : "";
      
    try {
      const returned = await loginUser(values).unwrap();

      checked
        ? await setToStorage("remember", JSON.stringify(values))
        : await clearStorage("remember");
      await setCookies("origin_rent_token", returned?.data?.token);
      await setCookies("origin_rent_userdata", JSON.stringify(returned?.data));
      returned?.data?.lang_id &&
        dispatch(
          langUpdate({
            lang: returned?.data?.lang_id,
            lang_code: returned?.data?.lang_code,
          })
        );
      dispatch(loggedIn(true));
      dispatch(userDataUpdate(returned?.data));
      console.log("returned :", returned, callbackUrl)
      let url = callbackUrl
        ? callbackUrl === "deal-booking"
          ? returned?.data?.role_id == 3
            ? "/list"
            : callbackUrl
          : callbackUrl
        : "/";

        console.log(url);
        console.log(returned);

      setTimeout(() => {

        // console.log(url);
        // Router.push(url);
        // Router.push(url, { locale: returned?.data?.lang_code });
        Router.push(url, url, { locale: returned?.data?.lang_code });
      }, 500);

      if (returned?.status) {
        returned?.message && successMsg(returned?.message);
      } else {
        returned?.message && errorMsg(returned?.message);
      }
    } catch (error) {
      let err = error?.data?.message
        ? error?.data?.message
        : error?.message
        ? error?.message
        : "Something went wrong";
      if (err) errorMsg(err);
    }
  };

  // const handleLoginWithGoogle = async () => {
  //   const result = await signIn("google");
  //   if (result?.error) {
  //     // handle error
  //     router.push("/login");

  //   }
  // };

  useEffect(() => {
    (async () => {
      if (session.status === "authenticated") {
        let callbackUrl = Router.query?.callbackUrl
          ? Router.query?.callbackUrl
          : "";
        let data = {
          login_type: session.data.provider === "facebook" ? 2 : 1,
          social_id: session.data.providerAccountId,
          name: session.data.user.name ? session.data.user.name : "",
          email: session.data.user.email ? session.data.user.email : "",
          image: session.data.user.image ? session.data.user.image : "",
        };
        let response = await social_login(data).unwrap();
        if (response.status) {
          setCookies("origin_rent_token", response?.data?.token);
          setCookies("origin_rent_userdata", JSON.stringify(response?.data));
          response?.data?.lang_id &&
            dispatch(langUpdate({ lang: response?.data?.lang_id }));
          dispatch(loggedIn(true));
          dispatch(userDataUpdate(response?.data));
          let url = callbackUrl
            ? callbackUrl === "/deal-booking"
              ? response?.data?.role_id == "3"
                ? "/list"
                : callbackUrl
              : callbackUrl
            : "/";
          // Router.push(url);

          // Router.push(url, { locale: response?.data?.lang_code });
          Router.push(url, Router.asPath, {
            locale: response?.data?.lang_code,
          });
          response?.message && successMsg(response?.message);
        }
      }
    })();
  }, [session["status"]]);

  return (
    <>
      <Head>
        <title>Origin Rent | Login</title>
        <meta
          name="description"
          content="Origin Rent is Car hire service platform for those users who need cars on rent."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/img/favicon.png" />
      </Head>
      <Header />
      <main id="main">
        <section id="login-sect" className="login-sect mt-35">
          <div className="container" data-aos="fade-up">
            <div className="row">
              <div className="col-md-6 mbl-none-img">
                <img
                  className="img-fluid"
                  src="/assets/img/login-new.svg"
                  alt=""
                />
              </div>
              <div className="col-md-6">
                <div className="log-act">
                  <Formik
                    initialValues={rememberData ? rememberState : initialState}
                    validationSchema={loginSchema}
                    onSubmit={handleSubmit}
                  >
                    {({
                      errors,
                      touched,
                      values,
                      handleChange,
                      handleBlur,
                    }) => (
                      <Form
                        className="prcs-login signup-frm "
                        autoComplete="off"
                      >
                        <h2>{staticData?.data?.login_your_account}</h2>
                        <p>
                          {staticData?.data?.hello},{" "}
                          {staticData?.data?.welcome_back_to_your_account}
                        </p>
                        <div className="form-group">
                          <label htmlFor="email">
                            {staticData?.data?.email_address}
                          </label>
                          <input
                            type="text"
                            name="email"
                            id="email"
                            placeholder={staticData?.data?.email_address}
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {errors.email && touched.email ? (
                            <div className="validation-err1">
                              {errors.email}
                            </div>
                          ) : null}
                        </div>
                        <div className="form-group">
                          <label htmlFor="password">
                            {staticData?.data?.password}
                          </label>
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            id="password"
                            placeholder={staticData?.data?.password}
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            // maxLength={9}
                          />

                          {!showPassword ? (
                            <div onClick={() => setShowPassword(!showPassword)}>
                              <img
                                className="pss-hide"
                                src="/assets/img/hide.svg"
                                alt=""
                              />
                            </div>
                          ) : (
                            <div onClick={() => setShowPassword(!showPassword)}>
                              <img
                                className="pss-hide"
                                src="/assets/img/view.svg"
                                alt=""
                              />
                            </div>
                          )}
                          <span className="error-msgs">
                            {errors.password && touched.password ? (
                              <span className="validation-err1 mt-0">
                                {errors.password}
                              </span>
                            ) : null}
                          </span>
                        </div>

                        <p className="rember">
                          {!checked ? (
                            <span
                              className="laces-checkbox"
                              onClick={() => {
                                setChecked((prev) => {
                                  if (prev) {
                                    clearStorage("remember");
                                  }
                                  return !prev;
                                });
                              }}
                            >
                              <i className="fa"></i>
                            </span>
                          ) : (
                            <span
                              className="laces-checkbox"
                              onClick={() => {
                                setChecked((prev) => {
                                  if (prev) {
                                    clearStorage("remember");
                                  }
                                  return !prev;
                                });
                              }}
                            >
                              <i className="fa fa-check"></i>
                            </span>
                          )}
                          <span
                            style={{ cursor: "default" }}
                            onClick={() => {
                              setChecked((prev) => {
                                if (prev) {
                                  clearStorage("remember");
                                }
                                return !prev;
                              });
                            }}
                          >
                            {staticData?.data?.remember_me}
                          </span>
                          <Link href="/forgot-password" legacyBehavior>
                            <a>{staticData?.data?.forgot_password}</a>
                          </Link>
                        </p>
                        <button
                          type="submit"
                          className="sub-inq"
                          id="man-book"
                          disabled={isLoading}
                        >
                          {isLoading ? "loading..." : staticData?.data?.sign_in}
                        </button>
                      </Form>
                    )}
                  </Formik>
                  <div className="otr-lgn">
                    <h6>{staticData?.data?.or_login_with}</h6>
                    <ul>
                      <li>
                        <a
                          // onClick={handleLoginWithGoogle}
                          onClick={() => {
                            signIn("google");
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <img src="/assets/img/google.svg" alt="" />
                        </a>
                      </li>
                      {/* <li>
                        <a
                          onClick={() => {
                            signIn("facebook");
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <img src="/assets/img/facebook.svg" alt="" />
                        </a>
                      </li> */}
                      {/* <li>
                        <a href="#">
                          <img src="/assets/img/apple-logo.svg" alt="" />
                        </a>
                      </li> */}
                    </ul>
                    {/* <button onClick={() => signOut()}>SignOut</button> */}
                    <p>
                      {staticData?.data?.dont_have_an_account}
                      <Link
                        href={`/signup${
                          props.query.callbackUrl
                            ? `?callbackUrl=${props.query.callbackUrl}`
                            : ""
                        }`}
                        legacyBehavior
                      >
                        <a>{staticData?.data?.sign_up}</a>
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

// export const getServerSideProps = async ({ req, res }) => {
//   let token = await req.cookies.origin_rent_token;
//   return { props: { token: token ? token : null } };
// };

export const getServerSideProps = async (context) => {
  const { req, res } = context;
  const id = context.query;

  let token = await req.cookies.origin_rent_token;
  if (token) {
    if (res) {
      return {
        redirect: {
          permanent: false,
          destination: `/`,
        },
      };
    } else {
      Router.replace("/");
    }
  }
  return { props: { query: id } };
};
