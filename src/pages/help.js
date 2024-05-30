import Header from "@/components/Header";
import { useGetHelpEnquiryQuery } from "@/store/Slices/apiSlice";
import Head from "next/head";
import { useSelector } from "react-redux";

export default function Help() {
  const { lang } = useSelector((state) => state.headData);
  const { data: HelpData, isLoading } = useGetHelpEnquiryQuery(
    { lang },
    { refetchOnMountOrArgChange: true }
  );
  if (isLoading)
    return (
      <>
        <Header />
        <section className="hero mt-35">
          <div className="container loader-img-img" data-aos="fade-up">
            <img src="/assets/img/ball-triangle.svg" alt="img" />
          </div>
        </section>
      </>
    );

  return (
    <>
      <Head>
        <title>Origin Rent | Help</title>
        <meta
          name="description"
          content="Origin Rent is Car hire service platform for those users who need cars on rent."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/img/favicon.png" />
      </Head>
      <Header />
      <main id="main">
        {/* ======= About Us Section =======  */}
        <section id="" className="help">
          <div className="container" data-aos="fade-up">
            <div className="hlp-bnr">
              <div className="row">
                <div className="col-lg-8">
                  <div className="section-title">
                    <h4>{HelpData?.data?.setting?.the_faq}</h4>
                    <h2>{HelpData?.data?.setting?.help_title}</h2>
                  </div>
                  <p>{HelpData?.data?.setting?.help_short_description}</p>
                </div>
                <div className="col-lg-4">
                  {HelpData?.data?.setting?.help_number && (
                    <a
                      href={`https://api.whatsapp.com/send?phone=${HelpData?.data?.setting?.help_number}`}
                      target="_blank"
                    >
                      <img
                        src="/assets/img/whatsapp.svg"
                        alt=""
                        className="img-fluid"
                      />
                      {HelpData?.data?.setting?.help_number}
                    </a>
                  )}
                  <a href={`mailto:${HelpData?.data?.setting?.help_mail}`}>
                    <img
                      src="/assets/img/mail.svg"
                      alt=""
                      className="img-fluid"
                    />{" "}
                    {HelpData?.data?.setting?.help_mail}
                  </a>
                </div>
              </div>
            </div>
            <div className="row content">
              <div className="col-lg-4">
                <div className="faq-cntn">
                  <div className="section-title">
                    <h4>{HelpData?.data?.setting?.the_faq}</h4>
                    <h2>{HelpData?.data?.setting?.faqs}</h2>
                  </div>
                  <p>{HelpData?.data?.setting?.faqs_short_description}</p>
                </div>
              </div>
              <div className="col-lg-8 why-us">
                <div className="accordion-list">
                  <ul>
                    {HelpData?.data?.faq?.map((res, i) => (
                      <li key={i}>
                        <a
                          data-bs-toggle="collapse"
                          className={i === 0 ? "collapse" : "collapsed"}
                          data-bs-target={`#accordion-list-${i + 1}`}
                        >
                          {res.question}
                          <i className="bx bx-chevron-down icon-show"></i>
                          <i className="bx bx-chevron-up icon-close"></i>
                        </a>
                        <div
                          id={`accordion-list-${i + 1}`}
                          className={i === 0 ? "collapse show" : "collapse"}
                          data-bs-parent=".accordion-list"
                        >
                          <p>{res.answer}</p>
                        </div>
                      </li>
                    ))}

                    {/* <li>
                      <a
                        data-bs-toggle="collapse"
                        data-bs-target="#accordion-list-2"
                        className="collapsed"
                      >
                        How old do I have to be to rent a car?{" "}
                        <i className="bx bx-chevron-down icon-show"></i>
                        <i className="bx bx-chevron-up icon-close"></i>
                      </a>
                      <div
                        id="accordion-list-2"
                        className="collapse"
                        data-bs-parent=".accordion-list"
                      >
                        <p>
                          Dolor sit amet consectetur adipiscing elit
                          pellentesque habitant morbi. Id interdum velit laoreet
                          id donec ultrices. Fringilla phasellus faucibus
                          scelerisque eleifend donec pretium. Est pellentesque
                          elit ullamcorper dignissim. Mauris ultrices eros in
                          cursus turpis massa tincidunt dui.
                        </p>
                      </div>
                    </li>

                    <li>
                      <a
                        data-bs-toggle="collapse"
                        data-bs-target="#accordion-list-3"
                        className="collapsed"
                      >
                        Can I book a hire car for someone else?{" "}
                        <i className="bx bx-chevron-down icon-show"></i>
                        <i className="bx bx-chevron-up icon-close"></i>
                      </a>
                      <div
                        id="accordion-list-3"
                        className="collapse"
                        data-bs-parent=".accordion-list"
                      >
                        <p>
                          Eleifend mi in nulla posuere sollicitudin aliquam
                          ultrices sagittis orci. Faucibus pulvinar elementum
                          integer enim. Sem nulla pharetra diam sit amet nisl
                          suscipit. Rutrum tellus pellentesque eu tincidunt.
                          Lectus urna duis convallis convallis tellus. Urna
                          molestie at elementum eu facilisis sed odio morbi quis
                        </p>
                      </div>
                    </li>

                    <li>
                      <a
                        data-bs-toggle="collapse"
                        className="collapse"
                        data-bs-target="#accordion-list-4"
                      >
                        What do I need to hire a car?{" "}
                        <i className="bx bx-chevron-down icon-show"></i>
                        <i className="bx bx-chevron-up icon-close"></i>
                      </a>
                      <div
                        id="accordion-list-4"
                        className="collapse"
                        data-bs-parent=".accordion-list"
                      >
                        <p>
                          Feugiat pretium nibh ipsum consequat. Tempus iaculis
                          urna id volutpat lacus laoreet non curabitur gravida.
                          Venenatis lectus magna fringilla urna porttitor
                          rhoncus dolor purus non.
                        </p>
                      </div>
                    </li>

                    <li>
                      <a
                        data-bs-toggle="collapse"
                        data-bs-target="#accordion-list-5"
                        className="collapsed"
                      >
                        How old do I have to be to rent a car?{" "}
                        <i className="bx bx-chevron-down icon-show"></i>
                        <i className="bx bx-chevron-up icon-close"></i>
                      </a>
                      <div
                        id="accordion-list-5"
                        className="collapse"
                        data-bs-parent=".accordion-list"
                      >
                        <p>
                          Dolor sit amet consectetur adipiscing elit
                          pellentesque habitant morbi. Id interdum velit laoreet
                          id donec ultrices. Fringilla phasellus faucibus
                          scelerisque eleifend donec pretium. Est pellentesque
                          elit ullamcorper dignissim. Mauris ultrices eros in
                          cursus turpis massa tincidunt dui.
                        </p>
                      </div>
                    </li>

                    <li>
                      <a
                        data-bs-toggle="collapse"
                        data-bs-target="#accordion-list-6"
                        className="collapsed"
                      >
                        Can I book a hire car for someone else?{" "}
                        <i className="bx bx-chevron-down icon-show"></i>
                        <i className="bx bx-chevron-up icon-close"></i>
                      </a>
                      <div
                        id="accordion-list-6"
                        className="collapse"
                        data-bs-parent=".accordion-list"
                      >
                        <p>
                          Eleifend mi in nulla posuere sollicitudin aliquam
                          ultrices sagittis orci. Faucibus pulvinar elementum
                          integer enim. Sem nulla pharetra diam sit amet nisl
                          suscipit. Rutrum tellus pellentesque eu tincidunt.
                          Lectus urna duis convallis convallis tellus. Urna
                          molestie at elementum eu facilisis sed odio morbi quis
                        </p>
                      </div>
                    </li> */}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/*  End About Us Section */}
      </main>
    </>
  );
}
