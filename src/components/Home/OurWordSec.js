import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import {
  useGetHomeDataQuery,
  useStaticContentQuery,
  useSubscribeMutation,
} from "@/store/Slices/apiSlice";
import { errorMsg, successMsg } from "../Toast";
import { useIntl } from "react-intl";

export default function OurWordSec() {
  const { lang } = useSelector((state) => state.headData);
  const { userData } = useSelector((state) => state.auth);
  const { data: home } = useGetHomeDataQuery(
    { lang, role_id: userData?.role_id },
    { refetchOnMountOrArgChange: true }
  );
  const { data: staticData } = useStaticContentQuery(lang, {
    refetchOnMountOrArgChange: true,
  });
  // Change Language
  const { formatMessage } = useIntl();
  const text = (id) => formatMessage({ id });

  const [subscribe, { isLoading }] = useSubscribeMutation();

  const initialState = {
    email: "",
  };
  const SignupSchema = Yup.object().shape({
    email: Yup.string()
      .email(staticData?.data?.invalid_email)
      .required(staticData?.data?.field_is_required),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const returned = await subscribe(values).unwrap();
      returned?.message && successMsg(returned?.message);
      resetForm();
    } catch (error) {
      let err =
        error.data && error.data?.message ? error.data?.message : error.message;
      err && errorMsg(err);
      // you can handle errors here if you want to
    }
  };
  return (
    <>
      <section id="our-word" className="our-word">
        <div className="container" data-aos="fade-up">
          <div className="content">
            <h3>{home?.data?.setting?.home_feature_title}</h3>
            <p>{home?.data?.setting?.home_feature_short_description}</p>
          </div>
          <div className="row">
            <div className="col-lg-1"></div>
            <div className="col-lg-10 col-md-12">
              <div className="otr-box">
                <div className="row">
                  {home?.data?.home_feature &&
                    home?.data?.home_feature.length > 0 &&
                    home?.data?.home_feature.map((res) => (
                      <div className="col-md-4" key={res.id}>
                        <div className="our-dtl">
                          <img src={res.image ? res.image : ""} alt="" />
                          <h4>{res.title}</h4>
                          <p>{res.short_description}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="col-lg-1"></div>
            <div className="col-lg-3"></div>
            <div className="col-lg-6 col-md-12">
              <div className="news-ltr">
                <h5>{home?.data?.setting?.subscriber_title}</h5>
                <Formik
                  initialValues={initialState}
                  validationSchema={SignupSchema}
                  onSubmit={handleSubmit}
                >
                  {({ errors, touched, values, handleChange, handleBlur }) => (
                    <Form>
                      <div className="form-group">
                        <input
                          type="text"
                          name="email"
                          id="email"
                          placeholder={`${staticData?.data?.email_address}*`}
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />

                        {errors.email && touched.email ? (
                          <span
                            className="validation-err1"
                            style={{ float: "left" }}
                          >
                            {errors.email}
                          </span>
                        ) : null}
                        <button
                          className="frm-submt-btn"
                          disabled={isLoading}
                          type="submit"
                        >
                          {isLoading ? staticData?.data?.loading : staticData?.data?.sign_me_up}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
