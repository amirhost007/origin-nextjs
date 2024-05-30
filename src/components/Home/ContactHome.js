import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
// import { useIntl } from "react-intl";
import { errorMsg, successMsg } from "@/components/Toast";
import {
  useGetHomeDataQuery,
  useGetInTouchMutation,
  useStaticContentQuery,
} from "@/store/Slices/apiSlice";

export default function ContactHome() {
  const { lang } = useSelector((state) => state.headData);
  const { userData } = useSelector((state) => state.auth);
  const { data: home } = useGetHomeDataQuery(
    { lang, role_id: userData?.role_id },
    { refetchOnMountOrArgChange: true }
  );
  
  const { data: staticData } = useStaticContentQuery(lang, {
    refetchOnMountOrArgChange: true,
  });
  // const { formatMessage } = useIntl();
  // const text = (id) => formatMessage({ id });

  const [getInTouch, { isLoading }] = useGetInTouchMutation();
  const initialState = {
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  };
  const SignupSchema = Yup.object().shape({
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

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const returned = await getInTouch(values).unwrap();
      returned?.message && successMsg(returned?.message);
      // resetForm();
    } catch (error) {
      let err =
        error.data && error.data?.message ? error.data?.message : error.message;
      err && errorMsg(err);
      // you can handle errors here if you want to
    }
  };

  return (
    <>
      <section id="contact" className="contact">
        <div className="container" data-aos="fade-up">
         

          <div className="row contact-mn">
            <div className="col-lg-6 text-center bg-white">
              <img className="img-fluid" style={{width: "80%"}} src="https://img.freepik.com/free-vector/flat-design-illustration-customer-support_23-2148887720.jpg?w=826&t=st=1691822319~exp=1691822919~hmac=813c6be5ed145cbd362b89a40e70577e3895d1540ede634a868e916f22998021" />
            </div>
            <div className="col-lg-6 my-5 ">
            <div className="section-title">
            <h2>{home?.data?.setting?.get_in_touch_title}</h2>
            <p>{home?.data?.setting?.get_in_touch_short_description}</p>
          </div>
              <Formik
                initialValues={initialState}
                validationSchema={SignupSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, values, handleChange, handleBlur }) => (
                  <Form className="php-email-form" autoComplete="off">
                    <div className="row">
                      <div className="form-group col-md-6">
                        <input
                          type="text"
                          name="firstname"
                          // placeholder={`${text("FIRST_NAME")}*`}
                          placeholder={`${staticData?.data?.first_name}*`}
                          className="form-control"
                          id="firstname"
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
                          <span className="max-length">50 {staticData?.data?.max}</span>
                        </span>
                      </div>
                      <div className="form-group col-md-6">
                        <input
                          type="text"
                          placeholder={`${staticData?.data?.last_name}*`}
                          className="form-control"
                          name="lastname"
                          id="lastname"
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
                          <span className="max-length">50 {staticData?.data?.max}</span>
                        </span>
                      </div>
                    </div>
                    <div className="form-group">
                      <input
                        type="email"
                        className="form-control"
                        placeholder={`${staticData?.data?.email}*`}
                        name="email"
                        id="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        maxLength={81}
                      />
                      <span className="error-msgs">
                        {errors.email && touched.email ? (
                          <div className="validation-err1">{errors.email}</div>
                        ) : null}
                        <span className="max-length">80 {staticData?.data?.max}</span>
                      </span>
                    </div>
                    <div className="row">
                      <div className="form-group col-md-6">
                        <input
                          type="text"
                          name="phone"
                          placeholder={`${staticData?.data?.phone}*`}
                          className="form-control"
                          id="phone"
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
                          <span className="max-length">14 {staticData?.data?.max}</span>
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
                          <span className="max-length">200 {staticData?.data?.max}</span>
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
                        <span className="max-length">500 {staticData?.data?.max}</span>
                      </span>
                    </div>

                    <div className="text-center">
                      <button className="w-auto rounded" type="submit" disabled={isLoading}>
                        {isLoading ? "loading..." : staticData?.data?.submit}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
            <div className="col-lg-2"></div>
          </div>
        </div>
      </section>
    </>
  );
}
