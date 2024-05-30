import { useRef } from "react";
import { useSelector } from "react-redux";
import StarRatings from "react-star-ratings";
import { useGetHomeDataQuery } from "@/store/Slices/apiSlice";
import Carousel from "../Carousel";

export default function CustomerFeedback() {
  const { lang } = useSelector((state) => state.headData);
  const { userData } = useSelector((state) => state.auth);
  const feedbackRef = useRef(null);
  const { data: home } = useGetHomeDataQuery(
    { lang, role_id: userData?.role_id },
    { refetchOnMountOrArgChange: true }
  );

  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
  };
  return (
    <>
      <section id="feedbck" className="feedbck">
        <div className="container">
          <div className="content">
            <h3>{home?.data?.setting?.feedback_title}</h3>
          </div>
          <div className="my-slider">
            <button
              className="pre-btn"
              onClick={() => feedbackRef?.current?.slickPrev()}
            >
              <img src="/assets/img/sldr-errow.svg" alt="" />
            </button>
            <Carousel settings={settings} btnRef={feedbackRef}>
              {home?.data?.feedback &&
                home?.data?.feedback?.length > 0 &&
                home?.data?.feedback?.map((res, i) => (
                  <div key={res.id}>
                    <div className="slider__contents">
                      
                      <p className="slider__txt">{res.comment}</p>
                      <h2 className="slider__caption">{res.user?.name}</h2>
                      <StarRatings
                        rating={Number(res?.rating)}
                        starRatedColor="orange"
                        // changeRating={(newRating) => ratingChanged(newRating)}
                        numberOfStars={5}
                        name="rating"
                        starSpacing="1px"
                        starDimension="37px"
                      />
                    </div>
                  </div>
                ))}
            </Carousel>
            <button
              className="next-btn"
              onClick={() => feedbackRef?.current?.slickNext()}
            >
              <img src="/assets/img/sldr-errow.svg" alt="" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
