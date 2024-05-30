import { useGetHomeDataQuery } from "@/store/Slices/apiSlice";
import { useSelector } from "react-redux";

export default function CheapDeals() {
  const { lang } = useSelector((state) => state.headData);
  const { userData } = useSelector((state) => state.auth);
  const { data: home } = useGetHomeDataQuery(
    { lang, role_id: userData?.role_id },
    { refetchOnMountOrArgChange: true }
  );
  return (
    <>
      <div className="container" data-aos="fade-up">
        <div
          className="content chep-hdng-man"
          dangerouslySetInnerHTML={{
            __html: home?.data?.setting?.cheap_deals_title,
          }}
        />
        {/* </div> */}
        <div className="row justify-content-center">
          <div className="col-lg-10 col-md-12">
            <div className="row justify-content-center">
              {home?.data?.cheap_deal &&
                home?.data?.cheap_deal?.length > 0 &&
                home?.data?.cheap_deal?.map((res, i) => (
                  <div className="col-md-3" key={i}>
                    <div className="cheap-dle">
                      <h3>{res.discount}%</h3>
                      <p>{res.title}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
