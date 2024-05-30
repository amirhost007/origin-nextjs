import Head from "next/head";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import {
  useStaticContentQuery,
  useSupplerEnquiryMutation,
} from "@/store/Slices/apiSlice";
import { errorMsg, successMsg } from "@/components/Toast";
import Header from "@/components/Header";

export default function SupplyPartner() {
  const router = useRouter();
  const { lang } = useSelector((state) => state.headData);
  const [supplerEnquiry, { isLoading }] = useSupplerEnquiryMutation();
  const { data: staticData } = useStaticContentQuery(lang, {
    refetchOnMountOrArgChange: true,
  });

  const initialState = {
    company_name: "",
    website_address: "",
    contact_name: "",
    contact_email: "",
    conatact_phone: "",
    contact_address: "",
  };
  const requiredMsg = staticData?.data?.field_is_required;
  const emaildMsg = staticData?.data?.invalid_email;
  const supplySchema = Yup.object().shape({
    contact_name: Yup.string()
      .max(50, "Contact Person must be at most 50 characters")
      .required(requiredMsg),
    website_address: Yup.string()
      .max(100, "Website address must be at most 100 characters")
      .matches(
        /^(https?:\/\/|http?:\/\/)(www\.)?([a-zA-Z0-9-]+\.)?([a-zA-Z0-9-]+\.)?([a-zA-Z]{2,})(\.com)$/,
        "Website url is invalid."
      ),
    company_name: Yup.string()
      .max(50, "Company Name must be at most 80 characters")
      .required(requiredMsg),
    contact_email: Yup.string()
      .email(emaildMsg)
      .max(80, "Person Email must be at most 80 characters")
      .required(requiredMsg),
    conatact_phone: Yup.number()
      .typeError("Contact Number must be a number")
      .required(requiredMsg),
    contact_address: Yup.string().max(
      100,
      "Address must be at most 100 characters"
    ),
  });

  const handleSubmit = async (values, {}) => {
    try {
      const response = await supplerEnquiry(values).unwrap();

      if (response?.status) {
        response?.message && successMsg(response?.message);
        setTimeout(() => {
          router.push("/");
        }, 800);
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
        <title>Origin Rent | Supply Partner</title>
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
              <div className="offset-lg-2 col-lg-8 col-md-12">
                <div className="suply-dtl">
                  <h3>{staticData?.data?.supply_partner}</h3>
                  <p>{staticData?.data?.supply_partner_description}</p>
                  <Formik
                    initialValues={initialState}
                    validationSchema={supplySchema}
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
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="">
                                {staticData?.data?.company_name} *
                              </label>
                              <input
                                type="text"
                                name="company_name"
                                id="company_name"
                                value={values.company_name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                maxLength={81}
                              />

                              <span className="error-msgs">
                                {errors.company_name && touched.company_name ? (
                                  <div className="validation-err1">
                                    {errors.company_name}
                                  </div>
                                ) : null}
                                <span className="max-length">
                                  80 {staticData?.data?.max}
                                </span>
                              </span>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="">
                                {staticData?.data?.website_url_options}
                              </label>
                              <input
                                type="text"
                                name="website_address"
                                id="website_address"
                                value={values.website_address}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                maxLength={101}
                              />

                              <span className="error-msgs">
                                {errors.website_address &&
                                touched.website_address ? (
                                  <div className="validation-err1">
                                    {errors.website_address}
                                  </div>
                                ) : null}
                                <span className="max-length">
                                  100 {staticData?.data?.max}
                                </span>
                              </span>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="">
                                {staticData?.data?.contact_person} *
                              </label>
                              <input
                                type="text"
                                name="contact_name"
                                id="contact_name"
                                value={values.contact_name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                maxLength={51}
                              />

                              <span className="error-msgs">
                                {errors.contact_name && touched.contact_name ? (
                                  <div className="validation-err1">
                                    {errors.contact_name}
                                  </div>
                                ) : null}
                                <span className="max-length">
                                  50 {staticData?.data?.max}
                                </span>
                              </span>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="">
                                {staticData?.data?.person_email} *
                              </label>
                              <input
                                type="text"
                                name="contact_email"
                                id="contact_email"
                                value={values.contact_email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                maxLength={81}
                              />

                              <span className="error-msgs">
                                {errors.contact_email &&
                                touched.contact_email ? (
                                  <div className="validation-err1">
                                    {errors.contact_email}
                                  </div>
                                ) : null}
                                <span className="max-length">
                                  80 {staticData?.data?.max}
                                </span>
                              </span>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="">
                                {staticData?.data?.contact_number} *
                              </label>
                              <input
                                type="text"
                                name="conatact_phone"
                                id="conatact_phone"
                                value={values.conatact_phone}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                maxLength={14}
                              />

                              <span className="error-msgs">
                                {errors.conatact_phone &&
                                touched.conatact_phone ? (
                                  <div className="validation-err1">
                                    {errors.conatact_phone}
                                  </div>
                                ) : null}
                                <span className="max-length">
                                  14 {staticData?.data?.max}
                                </span>
                              </span>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="">
                                {staticData?.data?.address_optional}
                              </label>
                              <input
                                type="text"
                                name="contact_address"
                                id="contact_address"
                                value={values.contact_address}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                maxLength={101}
                              />

                              <span className="error-msgs">
                                {errors.contact_address &&
                                touched.contact_address ? (
                                  <div className="validation-err1">
                                    {errors.contact_address}
                                  </div>
                                ) : null}
                                <span className="max-length">
                                  100 {staticData?.data?.max}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <hr />
                        <button
                          type="submit"
                          className="sub-inq sply-btn"
                          disabled={isLoading}
                        >
                          {isLoading
                            ? staticData?.data?.submitting
                            : staticData?.data?.submit}
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
