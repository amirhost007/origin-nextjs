import Head from "next/head";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import country from "@/utils/country.json";
import {
  useGetIndustriesQuery,
  usePartnerEnquiryMutation,
  useStaticContentQuery,
} from "@/store/Slices/apiSlice";
import { errorMsg, successMsg } from "@/components/Toast";
import Header from "@/components/Header";

export default function AffiliatePartner() {
  const router = useRouter();
  const { lang } = useSelector((state) => state.headData);
  const { data: industry, isLoading } = useGetIndustriesQuery();
  const [partnerEnquiry, { isLoading: submitLoading }] =
    usePartnerEnquiryMutation();
  const { data: staticData } = useStaticContentQuery(lang, {
    refetchOnMountOrArgChange: true,
  });
  const initialState = {
    first_name: "",
    last_name: "",
    email: "",
    country: "",
    company_name: "",
    company_url: "",
    industry_type: "",
    bussiness_details: "",
  };
  const requiredMsg = staticData?.data?.field_is_required;
  const emaildMsg = staticData?.data?.invalid_email;

  const supplySchema = Yup.object().shape({
    first_name: Yup.string()
      .max(50, "First Name must be at most 50 characters")
      .required(requiredMsg),
    last_name: Yup.string()
      .max(50, "Last Name must be at most 50 characters")
      .required(requiredMsg),
    email: Yup.string()
      .email(emaildMsg)
      .max(80, "Email must be at most 80 characters")
      .required(requiredMsg),
    country: Yup.string().required(requiredMsg),
    company_name: Yup.string()
      .max(80, "Company Name be at most 80 characters")
      .required(requiredMsg),
    company_url: Yup.string()
      .max(100, "Company url must be at most 100 characters")
      .matches(
        /^(https?:\/\/|http?:\/\/)(www\.)?([a-zA-Z0-9-]+\.)?([a-zA-Z0-9-]+\.)?([a-zA-Z]{2,})(\.com|.in|.org|.net)$/,
        "Company url is invalid."
      ),
    industry_type: Yup.string().required(requiredMsg),
    bussiness_details: Yup.string()
      .max(100, "Bussiness Detail must be at most 100 characters")
      .required(requiredMsg),
  });

  const handleSubmit = async (values, {}) => {
    try {
      const response = await partnerEnquiry(values).unwrap();
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
        <title>Origin Rent | Affiliate Partner</title>
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
                  <h3>{staticData?.data?.affiliate_partner}</h3>
                  <p>{staticData?.data?.affiliate_partner_description}</p>
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
                                {staticData?.data?.first_name}*
                              </label>
                              <input
                                type="text"
                                name="first_name"
                                id="first_name"
                                value={values.first_name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                maxLength={51}
                              />

                              <span className="error-msgs">
                                {errors.first_name && touched.first_name ? (
                                  <div className="validation-err1">
                                    {errors.first_name}
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
                                {staticData?.data?.last_name}*
                              </label>
                              <input
                                type="text"
                                name="last_name"
                                id="last_name"
                                value={values.last_name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                maxLength={51}
                              />

                              <span className="error-msgs">
                                {errors.last_name && touched.last_name ? (
                                  <div className="validation-err1">
                                    {errors.last_name}
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
                                {staticData?.data?.email}*
                              </label>
                              <input
                                type="email"
                                name="email"
                                id="email"
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
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="">
                                {staticData?.data?.country}*
                              </label>
                              <select
                                name="country"
                                id="country"
                                value={values.country}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              >
                                <option value="">
                                  {staticData?.data?.select_country}
                                </option>
                                {country?.map((res, i) => (
                                  <option value={res.name} key={i}>
                                    {res.name}
                                  </option>
                                ))}
                              </select>

                              <span className="error-msgs">
                                {errors.country && touched.country ? (
                                  <div className="validation-err1">
                                    {errors.country}
                                  </div>
                                ) : null}
                                {/* <span className="max-length">80 max</span> */}
                              </span>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="">
                                {staticData?.data?.company_name}*
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
                                {staticData?.data?.company_url_optional}
                              </label>
                              <input
                                type="text"
                                name="company_url"
                                id="company_url"
                                value={values.company_url}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                maxLength={101}
                              />
                              <span className="error-msgs">
                                {errors.company_url && touched.company_url ? (
                                  <span className="validation-err1">
                                    {errors.company_url}
                                  </span>
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
                                {staticData?.data?.industry_type}*
                              </label>
                              <select
                                name="industry_type"
                                id="industry_type"
                                value={values.industry_type}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              >
                                <option value="">
                                  {staticData?.data?.select_industry}
                                </option>
                                {isLoading ? (
                                  <option value="">Loading...</option>
                                ) : (
                                  industry?.data?.map((res, i) => (
                                    <option value={res.id} key={i}>
                                      {res.name}
                                    </option>
                                  ))
                                )}
                              </select>

                              <span className="error-msgs">
                                {errors.industry_type &&
                                touched.industry_type ? (
                                  <span className="validation-err1">
                                    {errors.industry_type}
                                  </span>
                                ) : null}
                                {/* <span className="max-length">100 max</span> */}
                              </span>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="">
                                {staticData?.data?.business_detail}*
                              </label>
                              <input
                                type="text"
                                name="bussiness_details"
                                id="bussiness_details"
                                value={values.bussiness_details}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                maxLength={101}
                              />

                              <span className="error-msgs">
                                {errors.bussiness_details &&
                                touched.bussiness_details ? (
                                  <span className="validation-err1">
                                    {errors.bussiness_details}
                                  </span>
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
                          id="man-book"
                          disabled={submitLoading}
                        >
                          {submitLoading
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
