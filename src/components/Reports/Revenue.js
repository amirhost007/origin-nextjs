import { useGetPartnerRevenueQuery } from "@/store/Slices/apiSlice";
import moment from "moment";
import DatePicker from "react-datepicker";
import { useState } from "react";
import ErrorHandler from "../ErrorHandler";
import ErrorPage from "../ErrorPage";
import Pagination from "../Pagination";

function Revenue() {
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
  } = useGetPartnerRevenueQuery(queryUrl, { refetchOnMountOrArgChange: true });

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
  const getCustomerPrice = (surgeCharge, totalPay) => {
    let profit = (totalPay * surgeCharge) / 100;
    // let total = profit + totalPay;
    let total = totalPay - profit ;

    return Math.round(total * 100) / 100;
  };
  const getProfitPrice = (surgeCharge, totalPay) => {
    let profit = (totalPay * surgeCharge) / 100;
    return Math.round(profit * 100) / 100;
  };

  return (
    <>
      <div id="tab2" className="tab_content">
        <div className="sltr-dtl">
          <h2 className="p-4 pb-0">Revenue</h2>

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
                    <th>OriginRent Price</th>
                    <th>Customer Price</th>
                    <th>Surge Charge</th>
                    <th>Profit</th>
                    <th>Booking Date</th>
                    {/* <th>Modified</th> */}
                    {/* <th>Pick up Date / Time</th>
                    <th>Pick Location</th>
                    <th>Drop Location</th>
                    <th>Action</th> */}
                  </thead>
                  <tbody>
                    {bookingData && bookingData.data?.data?.length > 0 ? (
                      bookingData.data?.data?.map((res, i) => (
                        <tr key={res.id}>
                          <th>{i + 1}</th>
                          <td>{res.order.first_name} {res.order.last_name} </td>
                          <td>{res.booking_id} / {res.txn_id}</td>
                          <td>
                          {res.currency_type} {getCustomerPrice(
                              Number(res.surge_charge),
                              Number(res.grandtotal)
                            )}
                          </td>
                          <td>{res.currency_type} {Math.round(res.grandtotal * 100) / 100}</td>
                          <td>{res.surge_charge}%</td>
                          <td>
                          {res.currency_type} {getProfitPrice(
                              Number(res.surge_charge),
                              Number(res.grandtotal)
                            )}
                          </td>
                          <td>
                          {moment(res.created_at).format(
                            "MMM DD, YYYY hh:mm A"
                          )}
                        </td>
                          {/* <td>
                            {res.parent_txn_id?.split(",")?.length === 1
                              ? "No"
                              : res.parent_txn_id?.split(",")?.length > 1
                              ? "Yes"
                              : ""}
                          </td> */}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <center>No Data Found</center>
                      </tr>
                    )}
                  </tbody>
                </table>
                <p style={{ float: "right", marginRight: "10px" }}>
                  Total Profit: KWD {Math.round(bookingData?.profit * 100) / 100}
                </p>
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

export default Revenue;
