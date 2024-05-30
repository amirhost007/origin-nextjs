import Head from "next/head";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import { useRouter } from "next/router";
import Carousel from "@/components/Carousel";
import About from "@/components/Home/About";
import CheapDeals from "@/components/Home/CheapDeals";
import CustomerFeedback from "@/components/Home/CustomerFeedback";
import FAQ from "@/components/Home/FAQ";
import OurWordSec from "@/components/Home/OurWordSec";
import WorldWideAirport from "@/components/Home/WorldWideAirport";
import {
  apiSlice,
  // getHomeData,
  // getRunningQueriesThunk,
  useGetHomeDataQuery,
  useStaticContentQuery,
  useSupplierLogoQuery,
} from "@/store/Slices/apiSlice";
import ContactHome from "@/components/Home/ContactHome";
import HeroSection from "@/components/Home/HeroSection";
import FeedBack from "@/components/Modal/FeedBack";
// import { initializeStore, removeUndefined, wrapper } from "@/store";
import ErrorPage from "@/components/ErrorPage";
import { wrapper } from "@/store";
import { settings, supSettings } from "@/components/Home/CarouselSettings";
import Coupon from "@/components/Home/Coupon";
import Header from "@/components/Header";
// import styles from '@/styles/Home.module.css'

export default function Home(props) {
  const router = useRouter();
  const [showFeedback, setShowFeedback] = useState(false);
  const { lang } = useSelector((state) => state.headData);
  const { isLoggedIn, userData } = useSelector((state) => state.auth);
  const {
    data: home,
    isError,
    isLoading,
  } = useGetHomeDataQuery(
    { lang, role_id: userData?.role_id },
    { refetchOnMountOrArgChange: true }
  );
  const { data: staticData } = useStaticContentQuery(lang, {
    refetchOnMountOrArgChange: true,
  });
  const { data: supplerData } = useSupplierLogoQuery();

  const dbStatic = staticData?.data?.additional_data;
  const btnRef = useRef(null);

  const handleCloseFeedback = () => setShowFeedback(false);

  const openFeedbackModal = () => {
    if (isLoggedIn) {
      setShowFeedback(true);
    } else {
      router.push("/login");
    }
  };

  if (isError) {
    return (
      <section className="p-0">
        <div className="" data-aos="fade-up">
          <ErrorPage />
        </div>
      </section>
    );
  }

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
      <Header
        serverData={props.initialData ? props.initialData?.data : null}
        currencydata={props.currencies}
      />

      {/* -- ======= Hero Section =======  */}
      <HeroSection
        serverData={props.initialData ? props.initialData?.data : null}
      />
      {/* -- End Hero -- */}
      {userData?.role_id !== 3 && (
        <main id="main">
          {/*  ======= Clients Section =======  */}
          <section id="clients" className="clients">
            <div className="container">
              <div className="row" data-aos="zoom-in">
                <Carousel settings={supSettings(supplerData?.data)}>
                  {supplerData &&
                    supplerData?.data?.length > 0 &&
                    supplerData?.data?.map((res, i) => (
                      <div
                        className="col-lg-2 col-md-4 col-6 d-flex align-items-center justify-content-center"
                        key={i}
                      >
                        <img
                          src={res.image ? res.image : ""}
                          className="img-fluid"
                          alt=""
                        />
                      </div>
                    ))}
                </Carousel>
              </div>
            </div>
          </section>
          {/*  End Cliens Section  */}

          {/*  ======= About Us Section ======= */}
          <About />
          {/* End About Us Section */}

          <CustomerFeedback />
          {/*  ======= Looking for cheap deals ======= */}
          <section id="cheap-deals" className="cheap-deals">
            <CheapDeals />
          </section>
          {/*  ======= Don't take our word for it ======= */}

          <OurWordSec />

          {/*  ======= Top Worldwide Destinations =======  */}
          <section id="car-destinations" className="car-destinations">
            <div className="container">
              <div className="content">
                <h3>{home?.data?.setting?.car_category_title}</h3>
              </div>
              <ul>
                <button
                  className="pre-btn"
                  onClick={() => btnRef?.current?.slickPrev()}
                >
                  <img src="/assets/img/sldr-errow.svg" alt="" />
                </button>
                <Carousel settings={settings} btnRef={btnRef}>
                  {home?.data?.car_category &&
                    home?.data?.car_category.length > 0 &&
                    home?.data?.car_category?.map((res, i) => (
                      <li key={i}>
                        <img src={res.image ? res.image : ""} alt="" />{" "}
                      </li>
                    ))}
                </Carousel>

                <button
                  className="next-btn"
                  onClick={() => btnRef?.current?.slickNext()}
                >
                  <img src="/assets/img/sldr-errow.svg" alt="" />
                </button>
              </ul>
            </div>
          </section>

          {/*  ======= Why Us Section =======  */}
          <FAQ />
          {/*  End Why Us Section  */}

          {/*  ======= Skills Section =======  */}
          <WorldWideAirport />
          {/* End Skills Section  */}

          {/*  ======= Contact Section =======  */}
          <ContactHome />
          {/*  End Contact Section */}

          {/*  Coupon */}

          <div
            style={{ display: "grid", placeItems: "center", padding: "10px" }}
          >
            <div className="content">
              <h3>{dbStatic?.offers}</h3>
            </div>
          </div>
          {home?.data?.coupon?.length > 0 ? (
            <Coupon staticData={staticData} />
          ) : (
            <div className="no_offer">
              <p style={{ padding: "5px 10px" }}>
                {dbStatic?.no_offers_currently}
              </p>
            </div>
          )}
          {/*  End Coupon */}
          <button
            className="fdbk-btn"
            // data-bs-toggle="modal"
            // data-bs-target="#fdbc-dml"
            onClick={openFeedbackModal}
          >
            {staticData?.data?.feedback}
          </button>
        </main>
      )}
      {showFeedback && (
        <FeedBack show={showFeedback} handleClose={handleCloseFeedback} />
      )}
      {/* End #main  */}
    </>
  );
}

// export async function getServerSideProps() {
//   const store = initializeStore();
//   await store.dispatch(apiSlice.endpoints.getHomeData.initiate());
//   const { data: homeData } = apiSlice.endpoints.getHomeData.select()(
//     store.getState()
//   );

//   return {
//     props: {
//       initialReduxState: removeUndefined(store.getState()),
//       initialData: homeData ? homeData : null,
//     },
//   };
// }

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const { req, res } = context;
    //     await store.dispatch(apiSlice.endpoints.getHomeData.initiate());
    //     const { data: homeData } = apiSlice.endpoints.getHomeData.select()(
    //       store.getState()
    //     );

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}home?lang_id=2`
    );
    const jsonData = await response.json();
    let currencies = await req.cookies.origin_rent_currency;

    return {
      props: {
        initialData: jsonData ? jsonData : null,
        currencies: currencies
          ? JSON.parse(currencies)
          : { id: 2, symbol: "€", name: "EUR" },
      },
    };
  }
);
