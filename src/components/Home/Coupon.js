import moment from "moment";
import { useSelector } from "react-redux";
import { useGetHomeDataQuery } from "@/store/Slices/apiSlice";

export default function Coupon({ staticData }) {
  const { lang } = useSelector((state) => state.headData);
  const { userData } = useSelector((state) => state.auth);
  const { data: home } = useGetHomeDataQuery(
    { lang, role_id: userData?.role_id },
    { refetchOnMountOrArgChange: true }
  );
  return (
    <>
      <section id="about" className="about">
        <div className="container" data-aos="fade-up">
          <div className="row ">
            {home?.data?.coupon?.map((res) => (
              <div className="col-md-6" key={res.id}>
                <div className="coupon1">
                  <div className="container1">
                    <h3>{res.title}</h3>
                  </div>

                  <div
                    className="container1"
                    style={{ backgroundColor: "white" }}
                  >
                    <div
                      className="cpn-img-1"
                      dangerouslySetInnerHTML={{
                        __html: res.short_description,
                      }}
                    ></div>
                  </div>
                  <div className="container1">
                    <p>
                      {staticData?.data?.use_promo_code}:{" "}
                      <span className="promo1">{res.promo_code}</span>
                    </p>
                    <p className="expire1">
                      {staticData?.data?.expires}:{" "}
                      {moment(res.end_date).format("DD MMM YYYY")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
