import { useSelector } from "react-redux";
import Head from "next/head";
import Header from "@/components/Header";
import { usePrivacyPolicyQuery } from "@/store/Slices/apiSlice";
import "@/styles/privacy-policy.module.css";
import ErrorHandler from "@/components/ErrorHandler";
import ErrorPage from "@/components/ErrorPage";

function PrivacyPolicy() {
  const { lang } = useSelector((state) => state.headData);
  const { data, isLoading, isError, error } = usePrivacyPolicyQuery(lang, {
    refetchOnMountOrArgChange: true,
  });

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
        <title>Origin Rent | Privacy-Policy</title>
        <meta
          name="description"
          content="Origin Rent is Car hire service platform for those users who need cars on rent."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/img/favicon.png" />
      </Head>
      <Header />
      {isLoading && <div className="list-loader" />}
      <main id="main">
        <section id="" className="help">
          <div className="container" data-aos="fade-up">
            <div className="hlp-bnr">
              <div className="row">
                <div className="col-lg-12">
                  <div className="section-title text-center">
                    {/* <h4>The Privacy Policy</h4> */}
                    <h2>{data?.data?.setting?.privacy_title}</h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="plcy-content">
              <div className="container">
                <div
                  className="cpn-img-1"
                  dangerouslySetInnerHTML={{
                    __html: data?.data?.setting?.privacy_description,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default PrivacyPolicy;
