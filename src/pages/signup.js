import Head from "next/head";
import Link from "next/link";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Router from "next/router";
import { useSession, signIn } from "next-auth/react";
import { useIntl } from "react-intl";
import {
  useRegisterUserMutation,
  useSocial_loginMutation,
  useStaticContentQuery,
} from "@/store/Slices/apiSlice";
import { errorMsg, successMsg } from "@/components/Toast";
import { setCookies } from "@/utils/helper";
import { loggedIn, userDataUpdate } from "@/store/Slices/authSlice";
import { langUpdate } from "@/store/Slices/headerSlice";
import Header from "@/components/Header";

export default function SignUp() {
  const dispatch = useDispatch();
  const session = useSession();
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const [social_login] = useSocial_loginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const { lang } = useSelector((state) => state.headData);
  const { data: staticData } = useStaticContentQuery(lang, {
    refetchOnMountOrArgChange: true,
  });
  const { formatMessage } = useIntl();
  const text = (id) => formatMessage({ id });

  const initialState = {
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  };

  const SignupSchema = Yup.object().shape({
    name: Yup.string().required(staticData?.data?.field_is_required),
    email: Yup.string()
      .email("Invalid email")
      .required(staticData?.data?.field_is_required),
    password: Yup.string().required(staticData?.data?.field_is_required),
    passwordConfirmation: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required(staticData?.data?.field_is_required),
  });

  const handleSubmit = async (values, { resetForm }) => {
    let callbackUrl = Router.query?.callbackUrl
      ? Router.query?.callbackUrl
      : "";
    try {
      const returned = await registerUser(values).unwrap();
      returned?.message && successMsg(returned?.message);

      setCookies("origin_rent_token", returned?.data?.token);
      setCookies("origin_rent_userdata", JSON.stringify(returned?.data));
      dispatch(loggedIn(true));
      dispatch(userDataUpdate(returned?.data));
      let url = callbackUrl
        ? callbackUrl === "/deal-booking"
          ? returned?.data?.role_id == "3"
            ? "/list"
            : callbackUrl
          : callbackUrl
        : "/";
      Router.push(url);
      // resetForm();
    } catch (error) {
      let err =
        error.data && error.data?.message ? error.data?.message : error.message;
      err && errorMsg(err);
      // you can handle errors here if you want to
    }
  };

  const handleLoginWithGoogle = async () => {
    await signIn("google");
  };
  useEffect(() => {
    (async () => {
      if (session.status === "authenticated") {
        let callbackUrl = Router.query?.callbackUrl
          ? Router.query?.callbackUrl
          : "";
        let data = {
          login_type: 1,
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
            dispatch(
              langUpdate({
                lang: response?.data?.lang_id,
                lang_code: response?.data?.lang_code,
              })
            );
          dispatch(loggedIn(true));
          dispatch(userDataUpdate(response?.data));
          let url = callbackUrl
            ? callbackUrl === "/deal-booking"
              ? response?.data?.role_id == "3"
                ? "/list"
                : callbackUrl
              : callbackUrl
            : "/";
          Router.push(url);
          response?.message && successMsg(response?.message);
        }
      }
    })();
  }, [session["status"]]);

  return (
    <>
      <Head>
        <title>Origin Rent | Sign Up</title>
        <meta
          name="description"
          content="Origin Rent is Car hire service platform for those users who need cars on rent."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/img/favicon.png" />
      </Head>
      <Header />
      <main id="main">
        <section id="signup-sect" className="signup-sect mt-35">
          <div className="container" data-aos="fade-up">
            <div className="row">
              <div className="col-md-6 mbl-none-img">
                <img
                  className="img-fluid signup-banner"
                  src="/assets/img/sign-img.svg"
                  alt=""
                />
              </div>
              <div className="col-md-6">
                <div className="log-act">
                  <Formik
                    initialValues={initialState}
                    validationSchema={SignupSchema}
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
                        className="prcs-login signup-frm"
                        autoComplete="off"
                      >
                        <h2>{staticData?.data?.create_account}</h2>
                        <p>{staticData?.data?.welcome_back}</p>
                        <div className="form-group">
                          <label htmlFor="name">
                            {staticData?.data?.fullname}
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            placeholder={staticData?.data?.fullname}
                            value={values.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {errors.name && touched.name ? (
                            <div className="validation-err1">{errors.name}</div>
                          ) : null}
                        </div>
                        <div className="form-group">
                          <label htmlFor="email">
                            {staticData?.data?.email_address}
                          </label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder={staticData?.data?.email_address}
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {errors.email && touched.email ? (
                            <div className="validation-err1">{errors.email}</div>
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
                              <span className="validation-err">
                                {errors.password}
                              </span>
                            ) : null}
                            {/* <span className="max-length">8 {staticData?.data?.max}</span> */}
                          </span>
                        </div>
                        <div className="form-group">
                          <label htmlFor="confirm_password">
                            {staticData?.data?.confirm_password}
                          </label>
                          <input
                            type={showCPassword ? "text" : "password"}
                            name="passwordConfirmation"
                            id="confirm_password"
                            placeholder={staticData?.data?.confirm_password}
                            value={values.passwordConfirmation}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            // maxLength={9}
                          />
                          {!showCPassword ? (
                            <div
                              onClick={() => setShowCPassword(!showCPassword)}
                            >
                              <img
                                className="pss-hide"
                                src="/assets/img/hide.svg"
                                alt=""
                              />
                            </div>
                          ) : (
                            <div
                              onClick={() => setShowCPassword(!showCPassword)}
                            >
                              <img
                                className="pss-hide"
                                src="/assets/img/view.svg"
                                alt=""
                              />
                            </div>
                          )}
                          <span className="error-msgs">
                            {errors.passwordConfirmation &&
                            touched.passwordConfirmation ? (
                              <span className="validation-err">
                                {errors.passwordConfirmation}
                              </span>
                            ) : null}
                            {/* <span className="max-length">8 {staticData?.data?.max}</span> */}
                          </span>
                        </div>
                        <button
                          type="submit"
                          className="sub-inq"
                          id="man-book"
                          disabled={isLoading}
                        >
                          {isLoading
                            ? staticData?.data?.loading
                            : staticData?.data?.sign_up}
                        </button>
                      </Form>
                    )}
                  </Formik>
                  <div className="otr-lgn">
                    <h6>{staticData?.data?.or_signup_with}</h6>
                    <ul>
                      <li>
                        <a
                          onClick={handleLoginWithGoogle}
                          style={{ cursor: "pointer" }}
                        >
                          <img src="/assets/img/google.svg" alt="" />
                        </a>
                      </li>
                      {/* <li>
                        <a href="#">
                          <img src="/assets/img/facebook.svg" alt="" />
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <img src="/assets/img/apple-logo.svg" alt="" />
                        </a>
                      </li> */}
                    </ul>
                    <h5>
                      {staticData?.data?.by_signing_up_you_agree_to_our}{" "}
                      <Link href="/terms">
                        {staticData?.data?.term_and_condition}
                      </Link>{" "}
                      {text("AND")}{" "}
                      <Link href="/privacy-policy">
                        {staticData?.data?.privacy_policy}
                      </Link>
                    </h5>
                    <hr />
                    <p>
                      {staticData?.data?.already_have_a_acount}
                      <Link href="/login"> {staticData?.data?.login}</Link>
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
