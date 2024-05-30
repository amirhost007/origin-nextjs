import { useState } from "react";
import { useGetUserAllBookingsQuery } from "@/store/Slices/apiSlice";
import moment from "moment";
import Link from "next/link";
import ErrorHandler from "../ErrorHandler";
import ErrorPage from "../ErrorPage";
import Pagination from "../Pagination";

function MyTrips({ staticData }) {
  const [page, setPage] = useState(0);

  let queryUrl = "";

  if (page) {
    queryUrl += `page=${page}&`;
  }

  const {
    data: bookingData,
    isLoading,
    isError,
    error,
  } = useGetUserAllBookingsQuery(queryUrl, { refetchOnMountOrArgChange: true });

  if (isLoading)
    return (
      <section className="hero mt-35">
        <div className="container loader-img-img" data-aos="fade-up">
          <img src="/assets/img/ball-triangle.svg" alt="img" />
        </div>
      </section>
    );
  if (isError)
    return (
      <>
        <ErrorHandler error={error} />;
        <section className="p-0">
          <div className="" data-aos="fade-up">
            <ErrorPage />
          </div>
        </section>
      </>
    );

  const handlePagination = (value) => {
    setPage(value);
  };

  return (
    <>
      <h3 className="d_active tab_drawer_heading" rel="tab1">
        <img src="/assets/img/distance.svg" alt="" className="img-fluid" />
        {staticData?.data?.my_trips}
      </h3>
      <div id="tab1" className="tab_content">
        <h2>{staticData?.data?.my_trips}</h2>
        {bookingData?.data?.data?.length > 0 ? (
          bookingData?.data?.data?.map((res, i) => (
            <>
              <div className="row" key={res.id}>
                <div className="col-md-3">
                  <div className="car-box">
                    <span>{staticData?.data?.estate}</span>
                    <img
                      src={
                        res.car?.car_image
                          ? res.car.car_image
                          : "/assets/img/car1.png"
                      }
                      alt=""
                      className="img-fluid"
                    />
                  </div>
                </div>
                <div className="col-md-4 d-flex align-items-center">
                  <span>
                    <img
                      src="/assets/img/from-to.svg"
                      alt=""
                      className="img-fluid"
                    />
                  </span>
                  <div className="loctn">
                    <h4>
                      <span>{staticData?.data?.pickup_point}</span>
                      {res.pickup_location}
                    </h4>
                    <hr />
                    <h4>
                      <span>{staticData?.data?.dropoff_point}</span>
                      {res.return_location}
                    </h4>
                  </div>
                </div>
                <div className="col-md-5">
                  <div className="tim-sts">
                    <span style={{ color: "#000", marginBottom: "0px" }}>
                      {" "}
                      {moment(res.pickup_datetime).format(
                        "DD MMM YYYY HH:mm"
                      )}{" "}
                      to{" "}
                      {moment(res.return_datetime).format("DD MMM YYYY HH:mm")}
                    </span>
                    <Link
                      href={`/trip-detail?ids=${res.txn_id}&email=${res.user.email}`}
                      legacyBehavior
                    >
                      {staticData?.data?.view_details}
                    </Link>
                    {res.status == "3" ? (
                      <span>
                        <img
                          src="assets/img/x-mark.svg"
                          alt=""
                          className="img-fluid"
                        />{" "}
                        {staticData?.data?.canceled}
                      </span>
                    ) : res.status == "2" ? (
                      <span className="grns">
                        <img
                          src="/assets/img/check.svg"
                          alt=""
                          className="img-fluid"
                        />{" "}
                        {staticData?.data?.completed}
                      </span>
                    ) : res.status == 0 ? (
                      <span className="grns">
                        <img
                          src="/assets/img/pending.png"
                          alt=""
                          className="img-fluid"
                        />{" "}
                        {staticData?.data?.pending}
                      </span>
                    ) : res.status == 1 ? (
                      <span className="grns">
                        <img
                          src="/assets/img/proccessing.png"
                          alt=""
                          className="img-fluid"
                        />{" "}
                        {staticData?.data?.processing}
                      </span>
                    ) : res.status == 4 ? (
                    <span>
                      <img
                        src="assets/img/x-mark.svg"
                        alt=""
                        className="img-fluid"
                      />{" "}
                      {"Cancel Request Submitted"}
                    </span>
                    ):null}
                  </div>
                </div>
              </div>
              {i !== bookingData?.data?.length - 1 && <hr className="my-4" />}
            </>
          ))
        ) : (
          <div className="row">
            <h5>{staticData?.data?.no_trip_found}</h5>
          </div>
        )}

        {bookingData &&
          bookingData.data?.data?.length > 0 &&
          Math.ceil(bookingData?.data?.total / bookingData?.data?.per_page) >
            0 && (
            <Pagination
              total={Math.ceil(
                bookingData?.data?.total / bookingData?.data?.per_page
              )}
              current={bookingData?.data?.current_page}
              pagination={(crPage) => handlePagination(crPage)}
            />
          )}
        {/* <hr className="my-4" />
        <div className="row">
          <div className="col-md-3">
            <div className="car-box">
              <span>Premium</span>
              <img src="/assets/img/car2.png" alt="" className="img-fluid" />
            </div>
          </div>
          <div className="col-md-4 d-flex align-items-center">
            <span>
              <img src="/assets/img/from-to.svg" alt="" className="img-fluid" />
            </span>
            <div className="loctn">
              <h4>
                <span>Pickup point</span>
                Heathrow Airport
              </h4>
              <hr />
              <h4>
                <span>Drop point</span>
                Málaga, Andalusia, Spain
              </h4>
            </div>
          </div>
          <div className="col-md-5">
            <div className="tim-sts">
              Mon, 2 Jan, 2023, 10:00 to Thu, 5 Jan, 2023, 10:00
              <a href="my-trips1.html">View Details</a>
              <span className="grns">
                <img src="/assets/img/check.svg" alt="" className="img-fluid" />
                Completed
              </span>
            </div>
          </div>
        </div>
        <hr className="my-4" />
        <div className="row">
          <div className="col-md-3">
            <div className="car-box">
              <span>Large</span>
              <img src="assets/img/car3.png" alt="" className="img-fluid" />
            </div>
          </div>
          <div className="col-md-4 d-flex align-items-center">
            <span>
              <img src="/assets/img/from-to.svg" alt="" className="img-fluid" />
            </span>
            <div className="loctn">
              <h4>
                <span>Pickup point</span>
                Heathrow Airport
              </h4>
              <hr />
              <h4>
                <span>Drop point</span>
                Málaga, Andalusia, Spain
              </h4>
            </div>
          </div>
          <div className="col-md-5">
            <div className="tim-sts">
              Mon, 2 Jan, 2023, 10:00 to Thu, 5 Jan, 2023, 10:00
              <a href="my-trips1.html">View Details</a>
              <span>
                <img
                  src="/assets/img/x-mark.svg"
                  alt=""
                  className="img-fluid"
                />
                Cancelled
              </span>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
}

export default MyTrips;
