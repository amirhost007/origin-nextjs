import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSelector } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  useChangePasswordMutation,
  useStaticContentQuery,
} from "@/store/Slices/apiSlice";
import { errorMsg, successMsg } from "@/components/Toast";
import Header from "@/components/Header";

function CreatePassword() {
  const router = useRouter();
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const { userData } = useSelector((state) => state.auth);
  const { lang } = useSelector((state) => state.headData);
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const { data: staticData } = useStaticContentQuery(lang, {
    refetchOnMountOrArgChange: true,
  });

  let { user_id } = router.query;

  const initialState = {
    new_password: "",
    new_password_confirmation: "",
  };

  const passwordSchema = Yup.object().shape({
    new_password: Yup.string().required(staticData?.data?.field_is_required),
    new_password_confirmation: Yup.string()
      .oneOf([Yup.ref("new_password"), null], "Passwords must match")
      .required(staticData?.data?.field_is_required),
  });
  let user_ids = user_id ? user_id : userData ? userData?.id : "";
  const handleSubmit = async (values, { resetForm }) => {
    let data = {
      user_id: user_ids,
      new_password: values?.new_password,
      new_password_confirmation: values?.new_password_confirmation,
    };
    try {
      let response = await changePassword(data).unwrap();
      if (response?.status) {
        response?.message && successMsg(response?.message);
        router.push(user_id ? "/login" : "/");
      } else {
        response?.message && errorMsg(response?.message);
      }
    } catch (error) {
      let err =
        error.data && error.data?.message ? error.data?.message : error.message;
      err && errorMsg(err);
    }
  };

  return (
    <>
      <Head>
        <title>Origin Rent | Create Password</title>
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
                  src="/assets/img/mana-booking.svg"
                  alt=""
                />
              </div>
              <div className="col-md-6">
                <div className="log-act">
                  <Formik
                    initialValues={initialState}
                    validationSchema={passwordSchema}
                    onSubmit={handleSubmit}
                  >
                    {({
                      errors,
                      touched,
                      values,
                      handleChange,
                      handleBlur,
                    }) => (
                      <Form className="prcs-login" autoComplete="off">
                        <h2>{staticData?.data?.change_password}</h2>
                        <p>{staticData?.data?.details_to_confirm_a_quote}</p>

                        <div className="form-group">
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder={staticData?.data?.new_password}
                            name="new_password"
                            id="new_password"
                            value={values.new_password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            // maxLength={9}
                          />
                          {!showPassword ? (
                            <div onClick={() => setShowPassword(!showPassword)}>
                              <img
                                className="pss-hide1"
                                src="/assets/img/hide.svg"
                                alt=""
                              />
                            </div>
                          ) : (
                            <div onClick={() => setShowPassword(!showPassword)}>
                              <img
                                className="pss-hide1"
                                src="/assets/img/view.svg"
                                alt=""
                              />
                            </div>
                          )}
                          <span className="error-msgs">
                            {errors.new_password && touched.new_password ? (
                              <span className="validation-err1">
                                {errors.new_password}
                              </span>
                            ) : null}
                            {/* <span className="max-length">8 max</span> */}
                          </span>
                        </div>
                        <div className="form-group">
                          <input
                            type={showCPassword ? "text" : "password"}
                            placeholder={staticData?.data?.confirm_password}
                            name="new_password_confirmation"
                            id="confirm_password"
                            value={values.new_password_confirmation}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            // maxLength={9}
                          />
                          {!showCPassword ? (
                            <div
                              onClick={() =>
                                setShowCPassword((prevState) => !prevState)
                              }
                            >
                              <img
                                className="pss-hide1"
                                src="/assets/img/hide.svg"
                                alt=""
                              />
                            </div>
                          ) : (
                            <div
                              onClick={() =>
                                setShowCPassword((prevState) => !prevState)
                              }
                            >
                              <img
                                className="pss-hide1"
                                src="/assets/img/view.svg"
                                alt=""
                              />
                            </div>
                          )}
                          <span className="error-msgs">
                            {errors.new_password_confirmation &&
                            touched.new_password_confirmation ? (
                              <span className="validation-err1">
                                {errors.new_password_confirmation}
                              </span>
                            ) : null}
                            {/* <span className="max-length">8 max</span> */}
                          </span>
                        </div>
                        <button
                          type="submit"
                          className="sub-inq"
                          id="man-book"
                          disabled={isLoading || !user_ids}
                        >
                          {isLoading ? "updating..." : staticData?.data?.update}
                        </button>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default CreatePassword;
