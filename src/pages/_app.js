import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import AOS from "aos";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { SSRProvider } from "react-bootstrap";
import { IntlProvider } from "react-intl";
import { SessionProvider } from "next-auth/react";
import { registerLocale } from "react-datepicker";
import ar from "../lang/ar.json";
import en from "../lang/en.json";
import store from "@/store";
import Layout from "@/Layout";
import { langUpdate } from "@/store/Slices/headerSlice";
import "react-toastify/dist/ReactToastify.css";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "@/styles/globals.css";
import "react-phone-input-2/lib/style.css";
import "react-datepicker/dist/react-datepicker.css";
import arabic from "date-fns/locale/ar";
import english from "date-fns/locale/en-US";

registerLocale("ar", arabic);
registerLocale("en", english);

const messages = { ar, en };

function App({ Component, pageProps, session }) {
  // const store = useStore(pageProps.initialReduxState);
  const [scroll, setScroll] = useState(false);
  const { locale } = useRouter();
  const isBrowser = () => typeof window !== "undefined";

  useEffect(() => {
    AOS.init({
      easing: "ease-out-cubic",
      once: true,
      offset: 50,
    });
    // if (isBrowser()) {
    const loader = document.getElementById("preloader");

    if (loader) loader.remove();
    // }
    window.addEventListener("scroll", () => {
      setScroll(window.scrollY > 200);
    });
    store.dispatch(
      langUpdate({
        lang: locale === "en" ? 1 : locale === "ar" ? 2 : 3,
        lang_code: locale,
      })
    );
  }, [locale]);

  function scrollToTop() {
    if (!isBrowser()) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <Head>
        <title>Origin Rent</title>
        <meta
          name="description"
          content="Origin Rent is Car hire service platform for those users who need cars on rent."
        />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
        <link rel="icon" href="/assets/img/favicon.png" />
      </Head>
      <SessionProvider session={session}>
        <SSRProvider>
          <IntlProvider locale={locale} messages={messages[locale]}>
            <Provider store={store}>
              <Layout>
                <div id="preloader" />
                <Component {...pageProps} />
                <a
                  onClick={scrollToTop}
                  style={{ cursor: "pointer" }}
                  className={`back-to-top ${
                    scroll ? "active" : ""
                  } d-flex align-items-center justify-content-center`}
                >
                  <i className="bi bi-arrow-up-short"></i>
                </a>
              </Layout>
            </Provider>
          </IntlProvider>
        </SSRProvider>
      </SessionProvider>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
