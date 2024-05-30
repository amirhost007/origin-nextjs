import moment from "moment";
import Link from "next/link";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { useGetPartnerBookingQuery } from "@/store/Slices/apiSlice";
import ErrorHandler from "../ErrorHandler";
import ErrorPage from "../ErrorPage";
import Pagination from "../Pagination";

function Bookings() {
  const [page, setPage] = useState(0);
  const [from_date, setFromDate] = useState("");
  const [to_date, setToDate] = useState("");

  let queryUrl = "";

  if (page) {
    queryUrl += `page=${page}&`;
  }

  if (from_date) {
    queryUrl += `from_date=${moment(from_date).format("YYYY-MM-DD")}&`;
  }
  if (to_date) {
    queryUrl += `to_date=${moment(to_date).format("YYYY-MM-DD")}&`;
  }

  const {
    data: bookingData,
    isError,
    error,
    isLoading,
  } = useGetPartnerBookingQuery(queryUrl, { refetchOnMountOrArgChange: true });

  if (isLoading) {
    <section className="hero mt-35">
      <div className="container loader-img-img" data-aos="fade-up">
        <img src="/assets/img/ball-triangle.svg" alt="img" />
      </div>
    </section>;
  }

  if (isError)
    return (
      <>
        <ErrorHandler error={error} />
        <section className="p-0">
          <div className="" data-aos="fade-up">
            <ErrorPage message={error?.data?.message} />
          </div>
        </section>
      </>
    );

  const handlePagination = (value) => {
    setPage(value);
  };

  return (
    <>
      <div id="tab1" className="tab_content">
        <div className="sltr-dtl">
          <h2 className="p-4 pb-0">Booking</h2>

          <div className="date-picker-div">
            <DatePicker
              selected={from_date}
              placeholderText="MM-DD-YYYY"
              onChange={(date) => setFromDate(date)}
              showMonthDropdown
              showYearDropdown
              scrollableYearDropdown
              dropdownMode="select"
              onKeyDown={(e) => {
                e.preventDefault();
              }}
            />
            <DatePicker
              placeholderText="MM-DD-YYYY"
              selected={to_date}
              onChange={(date) => setToDate(date)}
              showMonthDropdown
              showYearDropdown
              scrollableYearDropdown
              dropdownMode="select"
              onKeyDown={(e) => {
                e.preventDefault();
              }}
            />

            <button
              className="clear-btn"
              onClick={(e) => {
                e.preventDefault();
                setFromDate("");
                setToDate("");
                setPage(0);
              }}
            >
              Clear
            </button>
          </div>
        </div>

        <div className="tables-page-section service">
          <div className="row">
            <div className="col-sm-12">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <th>#</th>
                    <th>User Name</th>
                    <th>Booking ID / Txn ID</th>
                    <th>Pick up Date / Time</th>
                    <th>Pick Location</th>
                    <th>Drop Location</th>
                    <th>Booking Date</th>
                    <th>Action</th>
                  </thead>
                  {bookingData && bookingData.data?.data?.length > 0 ? (
                    bookingData.data?.data?.map((res, i) => (
                      <tr key={res.id}>
                        <th>{i + 1}</th>
                        <td>{res.order.first_name} {res.order.last_name} </td>
                        <td>{res.booking_id} / {res.txn_id}</td>
                        <td>
                          {moment(res.pickup_datetime).format(
                            "MMM DD, YYYY hh:mm A"
                          )}
                        </td>
                        <td>{res.pickup_location}</td>
                        <td>{res.return_location}</td>
                        <td>
                          {moment(res.created_at).format(
                            "MMM DD, YYYY hh:mm A"
                          )}
                        </td>

                        <td>
                          <Link
                            href={`/trip-detail?ids=${res.txn_id}&email=${res.order.email}`}
                            legacyBehavior
                          >
                            <a className="me-2">
                              <img src="/assets/img/view.svg" alt="" />
                            </a>
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <center>No Data Found</center>
                    </tr>
                  )}
                </table>
              </div>
            </div>

            {bookingData &&
              bookingData.data?.data?.length > 0 &&
              Math.floor(
                bookingData?.data?.total / bookingData?.data?.per_page
              ) > 0 && (
                <Pagination
                  total={Math.floor(
                    bookingData?.data?.total / bookingData?.data?.per_page
                  )}
                  current={bookingData?.data?.current_page}
                  pagination={(crPage) => handlePagination(crPage)}
                />
              )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Bookings;
