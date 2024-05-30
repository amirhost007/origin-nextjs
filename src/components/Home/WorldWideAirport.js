import { useGetHomeDataQuery } from "@/store/Slices/apiSlice";
import { useSelector } from "react-redux";

export default function WorldWideAirport() {
  const { lang } = useSelector((state) => state.headData);
  const { userData } = useSelector((state) => state.auth);
  const { data: home } = useGetHomeDataQuery(
    { lang, role_id: userData?.role_id },
    { refetchOnMountOrArgChange: true }
  );
  return (
    <>
      <section id="skills" className="skills">
        <div className="container" data-aos="fade-up">
          <div className="section-title">
            <h2>{home?.data?.setting?.airport_title}</h2>
          </div>
          <img
            src={home?.data?.setting?.airport_image}
            className="img-fluid"
            alt=""
          />
        </div>
      </section>
    </>
  );
}
