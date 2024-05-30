import Head from "next/head";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";

import {
  useGetHomeDataQuery,
  useGetInTouchMutation,
  useStaticContentQuery,
} from "@/store/Slices/apiSlice";
import { errorMsg, successMsg } from "@/components/Toast";
import { useSelector } from "react-redux";
import Header from "@/components/Header";

export default function Contact() {

  const router = useRouter();
  const [getInTouch, { isLoading, isSuccess }] = useGetInTouchMutation();
  const { lang } = useSelector((state) => state.headData);
  const { userData } = useSelector((state) => state.auth);
  const { data: home } = useGetHomeDataQuery(
    { lang, role_id: userData?.role_id },
    { refetchOnMountOrArgChange: true }
  );
  const { data: staticData } = useStaticContentQuery(lang, {
    refetchOnMountOrArgChange: true,
  });
  console.log("home :", home);
  const initialState = {
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  };

  const contactSchema = Yup.object().shape({
    firstname: Yup.string()
      .max(50, "First Name must be at most 50 characters")
      .required(`${staticData?.data?.first_name_is_req}*`),
    lastname: Yup.string()
      .max(50, "Last Name must be at most 50 characters")
      .required(`${staticData?.data?.last_name_is_req}*`),
    email: Yup.string()
      .email("Invalid email")
      .max(80, "Email must be at most 80 characters")
      .required(`${staticData?.data?.email_is_req}*`),
    phone: Yup.number()
      .typeError("Phone must be a number")
      .required(`${staticData?.data?.phone_is_req}*`),
    subject: Yup.string()
      .max(200, "Subject must be at most 200 characters")
      .required(`${staticData?.data?.subject_is_req}*`),
    message: Yup.string()
      .max(500, "Issue must be at most 500 characters")
      .required(`${staticData?.data?.issue_is_req}*`),
  });

  const handleSubmit = async (values, {}) => {
    try {
      const response = await getInTouch(values).unwrap();
      if (response?.status) {
        response?.message && successMsg(response?.message);
        router.reload();
      } else {
        response?.message && errorMsg(response?.message);
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

  return (
    <>
      <Head>
        <title>Origin Rent | Contact</title>
        <meta
          name="description"
          content="Origin Rent is Car hire service platform for those users who need cars on rent."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/img/favicon.png" />
      </Head>
      <Header />
      <main id="main">
        {/* ======= Contact Section =======  */}
        <section id="contact" className="contact hlp-pag">
          <div className="container" data-aos="fade-up">
            <div className="row contact-mn">
              <div className="col-md-4 cont-bg">
                <div>
                  <img
                    height="45px"
                    src="/assets/img/logo.png"
                    alt=""
                    className="img-fluid"
                  />
                  <p>
                    Origin Rent is a leading broker company in the car rental
                    industry that offers unique services to its customers.
                  </p>
                  <ul>
                    {/* <li>
                      <a href="">
                        <img
                          src="/assets/img/twitter.svg"
                          alt=""
                          className="img-fluid"
                        />
                      </a>
                    </li> */}
                    <li>
                      <a href="https://www.linkedin.com/company/originrent" target="_blank">
                        <img
                          src="/assets/img/linkedin.svg"
                          alt=""
                          className="img-fluid"
                        />
                      </a>
                    </li>
                    <li>
                      <a href="https://m.facebook.com/p/Origin-Rent-A-Car-100066600231358/" target="_blank">
                        <img
                          src="/assets/img/facebook.svg"
                          alt=""
                          className="img-fluid"
                        />
                      </a>
                    </li>
                    <li>
                      <a href="https://www.instagram.com/origin_rent/" target="_blank">
                        <img
                          src="/assets/img/instagram.svg"
                          alt=""
                          className="img-fluid"
                        />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-md-8 mt-lg-0 p-5">
                <div className="section-title">
                  <h2>{home?.data?.setting?.get_in_touch_title}</h2>
                  <p>{home?.data?.setting?.get_in_touch_short_description}</p>
                </div>
                <Formik
                  initialValues={initialState}
                  validationSchema={contactSchema}
                  onSubmit={handleSubmit}
                >
                  {({ errors, touched, values, handleChange, handleBlur }) => (
                    <Form className="php-email-form" autoComplete="off">
                      <div className="row">
                        <div className="form-group col-md-6">
                          <input
                            type="text"
                            name="firstname"
                            placeholder={`${staticData?.data?.first_name}*`}
                            className="form-control usr-ic"
                            id="name"
                            value={values.firstname}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            maxLength={51}
                          />
                          <span className="error-msgs">
                            {errors.firstname && touched.firstname ? (
                              <div className="validation-err1">
                                {errors.firstname}
                              </div>
                            ) : null}
                            <span className="max-length">
                              50 {staticData?.data?.max}
                            </span>
                          </span>
                        </div>
                        <div className="form-group col-md-6">
                          <input
                            type="text"
                            placeholder={`${staticData?.data?.last_name}*`}
                            className="form-control usr-ic"
                            name="lastname"
                            id="email"
                            value={values.lastname}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            maxLength={51}
                          />
                          <span className="error-msgs">
                            {errors.lastname && touched.lastname ? (
                              <div className="validation-err1">
                                {errors.lastname}
                              </div>
                            ) : null}
                            <span className="max-length">
                              50 {staticData?.data?.max}
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="form-group">
                        <input
                          type="email"
                          className="form-control usr-ml"
                          placeholder={`${staticData?.data?.email}*`}
                          name="email"
                          id="subject"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength={81}
                        />
                        <span className="error-msgs">
                          {errors.email && touched.email ? (
                            <div className="validation-err1">
                              {errors.email}
                            </div>
                          ) : null}
                          <span className="max-length">
                            80 {staticData?.data?.max}
                          </span>
                        </span>
                      </div>
                      <div className="row">
                        <div className="form-group col-md-6">
                          <input
                            type="text"
                            name="phone"
                            placeholder={`${staticData?.data?.phone}*`}
                            className="form-control usr-phn"
                            id="name"
                            value={values.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            maxLength={14}
                            minLength={9}
                          />
                          <span className="error-msgs">
                            {errors.phone && touched.phone ? (
                              <div className="validation-err1">
                                {errors.phone}
                              </div>
                            ) : null}
                            <span className="max-length">
                              14 {staticData?.data?.max}
                            </span>
                          </span>
                        </div>
                        <div className="form-group col-md-6">
                          <input
                            type="text"
                            placeholder={`${staticData?.data?.subject}*`}
                            className="form-control"
                            name="subject"
                            id="subject"
                            value={values.subject}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            maxLength={201}
                          />
                          <span className="error-msgs">
                            {errors.subject && touched.subject ? (
                              <div className="validation-err1">
                                {errors.subject}
                              </div>
                            ) : null}
                            <span className="max-length">
                              200 {staticData?.data?.max}
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="form-group">
                        <textarea
                          className="form-control"
                          placeholder={`${staticData?.data?.describe_your_issue}*`}
                          name="message"
                          rows="8"
                          value={values.message}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength={501}
                        ></textarea>
                        <span className="error-msgs">
                          {errors.message && touched.message ? (
                            <div className="validation-err1">
                              {errors.message}
                            </div>
                          ) : null}
                          <span className="max-length">
                            500 {staticData?.data?.max}
                          </span>
                        </span>
                      </div>
                      <div className="my-3">
                        {isLoading && <div className="loading">Loading</div>}
                        <div className="error-message"></div>
                        {isSuccess && (
                          <div className="sent-message">
                            Your message has been sent. Thank you!
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <button type="submit" disabled={isLoading}>
                          {isLoading
                            ? staticData?.data?.submitting
                            : staticData?.data?.submit}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </section>
        {/* End Contact Section  */}
      </main>
    </>
  );
}
