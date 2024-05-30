import { useState } from "react";
import { useSelector } from "react-redux";
import { useIntl } from "react-intl";
import { useGetHomeDataQuery } from "@/store/Slices/apiSlice";

export default function About() {
  const [showFullText, setShowFullText] = useState(false);
  const { lang } = useSelector((state) => state.headData);
  const { userData } = useSelector((state) => state.auth);
  const { data: home } = useGetHomeDataQuery(
    { lang, role_id: userData?.role_id },
    { refetchOnMountOrArgChange: true }
  );

  const { formatMessage } = useIntl();
  const text = (id) => formatMessage({ id });

  let maxLength = 500;
  const toggleTextDisplay = () => {
    setShowFullText(!showFullText);
  };

  return (
    <>
      <section id="about" className="about mt-0">
        <div className="container" data-aos="fade-up">
          <div className="row content">
            <div className="col-lg-12">
              <div
                className="section-title"
                dangerouslySetInnerHTML={{
                  __html: showFullText
                    ? home?.data?.setting?.about_content
                    : home?.data?.setting?.about_content?.slice(0, maxLength) +
                      "...",
                }}
              />
              {home?.data?.setting?.about_content?.length > maxLength && (
                <button onClick={toggleTextDisplay} className="read-more">
                  {showFullText ? text("READ_LESS") : text("READ_MORE")}
                </button>
              )}
            </div>
            <div className="col-lg-12">
              <div className="row">
                <div className="col-md-3">
                  <div className="abt-box">
                    <span>
                      <img
                        src={
                          home?.data?.about_feature &&
                          home?.data?.about_feature?.length > 0 &&
                          home?.data?.about_feature &&
                          home?.data?.about_feature[0]?.image
                        }
                        className="img-fluid"
                        alt=""
                      />
                    </span>
                    <h4>
                      {home?.data?.about_feature &&
                        home?.data?.about_feature?.length > 0 &&
                        home?.data?.about_feature &&
                        home?.data?.about_feature[0]?.title}
                    </h4>
                    <p>
                      {home?.data?.about_feature &&
                        home?.data?.about_feature?.length > 0 &&
                        home?.data?.about_feature &&
                        home?.data?.about_feature[0]?.short_description}
                    </p>
                  </div>
                </div>
                <div className="col-md-3">
                  {home?.data?.about_feature &&
                    home?.data?.about_feature?.length > 1 && (
                      <div className="abt-box">
                        <span>
                          <img
                            src={
                              home?.data?.about_feature &&
                              home?.data?.about_feature[1]?.image
                            }
                            className="img-fluid"
                            alt=""
                          />
                        </span>
                        <h4>
                          {home?.data?.about_feature &&
                            home?.data?.about_feature[1]?.title}
                        </h4>
                        <p>
                          {home?.data?.about_feature &&
                            home?.data?.about_feature[1]?.short_description}
                        </p>
                      </div>
                    )}
                </div>

                <div className="col-md-3">
                  {home?.data?.about_feature &&
                    home?.data?.about_feature?.length > 2 && (
                      <div className="abt-box ">
                        <span>
                          <img
                            src={
                              home?.data?.about_feature &&
                              home?.data?.about_feature[2]?.image
                            }
                            className="img-fluid"
                            alt=""
                          />
                        </span>
                        <h4>
                          {home?.data?.about_feature &&
                            home?.data?.about_feature[2]?.title}
                        </h4>
                        <p>
                          {home?.data?.about_feature &&
                            home?.data?.about_feature[2]?.short_description}
                        </p>
                      </div>
                    )}
                </div>
                <div className="col-md-3">
                  {home?.data?.about_feature &&
                    home?.data?.about_feature?.length > 3 && (
                      <div className="abt-box">
                        <span>
                          <img
                            src={
                              home?.data?.about_feature &&
                              home?.data?.about_feature[3]?.image
                            }
                            className="img-fluid"
                            alt=""
                          />
                        </span>
                        <h4>
                          {home?.data?.about_feature &&
                            home?.data?.about_feature[3]?.title}
                        </h4>
                        <p>
                          {home?.data?.about_feature &&
                            home?.data?.about_feature[3]?.short_description}
                        </p>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
