import Header from "@/components/Header";
import { errorMsg, successMsg } from "@/components/Toast";
import {
  useBookingReferenceNumberMutation,
  useStaticContentQuery,
} from "@/store/Slices/apiSlice";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useSelector } from "react-redux";

const ManageBookingConfirmation = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [bookingReferenceNumber, { isLoading }] =
    useBookingReferenceNumberMutation();

  const { lang } = useSelector((state) => state.headData);
  const { data: staticData } = useStaticContentQuery(lang, {
    refetchOnMountOrArgChange: true,
  });

  const dbStatic = staticData?.data?.additional_data;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email) {
      try {
        const response = await bookingReferenceNumber({ email }).unwrap();

        if (response?.status) {
          response?.message && successMsg(response?.message);
          router.push("/");
        } else {
          response?.message && errorMsg(response?.message);
        }
      } catch (error) {
        let err =
          error.data && error.data?.message
            ? error.data?.message
            : error.message;
        err && errorMsg(err);
      }
    } else {
      setEmailError(true);
    }
  };

  return (
    <>
      <Head>
        <title>Origin Rent </title>
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
                  <a
                    onClick={() => router.back()}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      className="mb-3"
                      src="/assets/img/back-icon.svg"
                      alt=""
                    />
                  </a>
                  <form
                    className="prcs-login"
                    onSubmit={handleSubmit}
                    autoComplete="off"
                  >
                    <h2>{dbStatic?.dont_have_your_booking_reference_number}</h2>
                    <p>
                      {dbStatic?.Its_in_your_confirmation_email_If_youd_like}
                    </p>
                    <div className="form-group">
                      <input
                        className="mbc_email"
                        type="email"
                        name="email"
                        id=""
                        placeholder={staticData?.data?.email_address}
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setEmailError(false);
                        }}
                      />
                      {emailError ? (
                        <span className="validation-err1 mbc_clas">
                          {staticData?.data?.field_is_required}
                        </span>
                      ) : null}
                    </div>
                    <button
                      type="submit"
                      className="sub-inq"
                      id="man-book"
                      disabled={isLoading}
                    >
                      {isLoading
                        ? staticData?.data?.submitting
                        : dbStatic?.resend_confirmation_email}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default ManageBookingConfirmation;
