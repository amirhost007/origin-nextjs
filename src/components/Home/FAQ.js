import { useSelector } from "react-redux";
import { useGetHomeDataQuery } from "@/store/Slices/apiSlice";

export default function FAQ() {
  const { lang } = useSelector((state) => state.headData);
  const { userData } = useSelector((state) => state.auth);
  const { data: home } = useGetHomeDataQuery(
    { lang, role_id: userData?.role_id },
    { refetchOnMountOrArgChange: true }
  );
  return (
    <>
      <section id="why-us" className="why-us">
        <div className="container section-bg" data-aos="fade-up">
          <div className="row">
            <div className="col-lg-1"></div>
            <div className="col-lg-10 d-flex flex-column justify-content-center align-items-stretch">
              <div className="content">
                <h3>{home?.data?.setting?.faq_title}</h3>
                <p>{home?.data?.setting?.faq_short_description}</p>
              </div>

              <div className="accordion-list">
                <ul>
                  {home?.data?.faq?.map((res, i) => (
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
                </ul>
              </div>
            </div>
            <div className="col-lg-1"></div>
          </div>
        </div>
      </section>
    </>
  );
}
