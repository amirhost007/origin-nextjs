import Head from "next/head";
import { useState } from "react";
import { useSelector } from "react-redux";
import { errorMsg, successMsg } from "@/components/Toast";
import {
  useGetMasterSettingQuery,
  usePartnerCommissionMutation,
  useStaticContentQuery,
} from "@/store/Slices/apiSlice";
import "@/styles/pricing.module.css";
import ErrorHandler from "@/components/ErrorHandler";
import ErrorPage from "@/components/ErrorPage";
import Header from "@/components/Header";

function Pricing() {
  const { lang, currency, currency_symbol } = useSelector(
    (state) => state.headData
  );
  const {
    data: masterData,
    isError,
    error,
    isLoading,
  } = useGetMasterSettingQuery(
    { lang, ...(currency && { currency_id: currency }) },
    { refetchOnMountOrArgChange: true }
  );
  const { data: staticData } = useStaticContentQuery(lang, {
    refetchOnMountOrArgChange: true,
  });
  const [partnerCommission] = usePartnerCommissionMutation();
  const [commision, setCommission] = useState("");

  const handleSubmit = async () => {
    if (commision) {
      const response = await partnerCommission({
        commission: commision,
      }).unwrap();
      if (response?.status) {
        response?.message && successMsg(response?.message);
      } else {
        response?.message && errorMsg(response?.message);
      }
      try {
      } catch (error) {
        let err = error?.data?.message
          ? error?.data?.message
          : error?.message
          ? error?.message
          : "Something went wrong";
        if (err) errorMsg(err);
      }
    } else {
      errorMsg("Please insert surge charge");
    }
  };
  if (isLoading)
    return (
      <section className="hero mt-35">
        <div className="container loader-img-img" data-aos="fade-up">
          <img src="/assets/img/ball-triangle.svg" alt="img" />
        </div>
      </section>
    );
  if (isError)
    return (
      <>
        <ErrorHandler error={error} />
        <section className="p-0">
          <div className="" data-aos="fade-up">
            <ErrorPage />
          </div>
        </section>
      </>
    );
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
        <section className="hero mt-35">
          <div className="container aos-init aos-animate" data-aos="fade-up">
            <div className="bnr-img">
              <img src="/assets/img/bnr-img.png" alt="" />
            </div>
          </div>
        </section>
        <section id="ld-lst" className="lodng-lst p-0 pb-4">
          <div className="container" data-aos="fade-up">
            <div className="content report-tile prcng">
              {/* <h2>
                {masterData?.data?.master_setting?.master_setting_heading}
                <span>
                  {masterData?.data?.master_setting?.master_setting_commission}%
                </span>
              </h2> */}
              <h2>
                {staticData?.data?.your_surge_charge_is}
                <span>
                  {Math.round(
                    masterData?.data?.master_setting?.surge_charge * 100
                  ) / 100}
                  %
                </span>
              </h2>
              <div className="chr-cus">
                <div className="row">
                  <div className="col-lg-4 col-md-12">
                    <p>
                      {
                        masterData?.data?.master_setting
                          ?.master_setting_short_description
                      }
                    </p>
                  </div>
                  <div className="col-lg-4 col-md-12">
                    <input
                      type="text"
                      placeholder={staticData?.data?.surge_charge}
                      value={commision}
                      onChange={(e) => setCommission(e.target.value)}
                    />
                  </div>
                  <div className="offset-lg-2 col-lg-2 col-md-12">
                    <button
                      className="commission_add_btn"
                      onClick={handleSubmit}
                    >
                      {staticData?.data?.add}
                    </button>
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

export default Pricing;
