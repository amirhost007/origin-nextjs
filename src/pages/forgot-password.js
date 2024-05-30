import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForgotPasswordMutation } from "@/store/Slices/apiSlice";
import { errorMsg, successMsg } from "@/components/Toast";
import Header from "@/components/Header";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [errorEmail, setEmailError] = useState(false);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const NEXT_URL =  process.env.NEXTAUTH_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email) {
      try {
        const response = await forgotPassword({ email , NEXT_URL }).unwrap();

        if (response?.status) {
          response?.message && successMsg(response?.message);
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
        <title>Origin Rent | Forgot Password</title>
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
                    action=""
                    className="prcs-login mt-4 signup-frm "
                    onSubmit={handleSubmit}
                  >
                    <h2>Forgot your password?</h2>
                    <p>
                      Don't worry Resetting your password is easy. Just type in
                      the mail you registered to BoardMe.
                    </p>
                    <div className="form-group">
                      <input
                        type="email"
                        name="email"
                        id=""
                        placeholder="Email address"
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setEmailError(false);
                        }}
                      />
                      {errorEmail ? (
                        <span className="validation-err1">
                          Field is Required
                        </span>
                      ) : null}
                    </div>
                    <button
                      type="submit"
                      className="sub-inq"
                      id="man-book"
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending..." : "Send confirmation email"}
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
}
