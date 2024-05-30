import Head from "next/head";
import Link from "next/link";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Header from "@/components/Header";
import { useStaticContentQuery } from "@/store/Slices/apiSlice";
import { checkManageBooking_new } from "@/utils/APIs";
import { errorMsg } from "@/components/Toast";

function ManageBooking() {
  const router = useRouter();
  const initialState = {
    email: "",
    booking_number: "",
  };
  const { lang } = useSelector((state) => state.headData);
  const { data: staticData } = useStaticContentQuery(lang, {
    refetchOnMountOrArgChange: true,
  });

  const dbStatic = staticData?.data?.additional_data;

  const manageBookingSchema = Yup.object().shape({
    email: Yup.string()
      .email()
      .typeError("Email must be valid")
      .required("Field is Required"),
    booking_number: Yup.string().required("Field is required"),
  });

  const handleSubmit = (values, { resetForm }) => {
    // <Link href={`/trip-detail?ids=${trsId}`} legacyBehavior>

    checkManageBooking_new(values)
      .then((res) => {

        console.log(res.data.txn_id);

        if (res.status) {
          router.push(
            `/trip-detail?ids=${res.data.txn_id}&email=${values.email}`
          );
          resetForm();
        } else {
          errorMsg(res.message);
        }
      })
      .catch((error) => {
        let err =
          error.data && error.data?.message
            ? error.data?.message
            : error.message;
        err && errorMsg(err);
      });
  };

  return (
    <>
      <Head>
        <title>Origin Rent | Manage Bookings</title>
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
                    validationSchema={manageBookingSchema}
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
                        <h2>{staticData?.data?.manage_booking}</h2>
                        <p>
                          {
                            dbStatic?.just_fill_in_your_details_to_confirm_a_quote
                          }
                        </p>
                        <div className="form-group">
                          <input
                            type="email"
                            id=""
                            placeholder={staticData?.data?.email_address}
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {errors.email && touched.email ? (
                            <div className="validation-err">{errors.email}</div>
                          ) : null}
                        </div>
                        <div className="form-group posttr">
                          <input
                            type="text"
                            id=""
                            placeholder={dbStatic?.booking_reference_number}
                            name="booking_number"
                            value={values.booking_number}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          {errors.booking_number && touched.booking_number ? (
                            <div className="validation-err">
                              {errors.booking_number}
                            </div>
                          ) : null}
                        </div>
                        <br />
                        <Link
                          href="/manage-booking-confirmation"
                          legacyBehavior
                        >
                          <a className="ref-no">
                            {dbStatic?.dont_have_your_booking_reference_number}
                          </a>
                        </Link>
                        <button type="submit" className="sub-inq">
                          {dbStatic?.find_my_booking}
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

export default ManageBooking;
