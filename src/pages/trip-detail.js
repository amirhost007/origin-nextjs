import { useRouter } from "next/router";
import he from 'he';
// import StarRatings from "react-star-ratings";
import {
  // useBookingRatingMutation,
  useCancelBookingMutation,
  useGetHomeDataQuery,
  useManageBookingQuery,
  useStaticContentQuery,
} from "@/store/Slices/apiSlice";
import moment from "moment";
import Link from "next/link";
import { errorMsg, successMsg } from "@/components/Toast";
import { setCookies } from "@/utils/helper";
import { useSelector } from "react-redux";
import ErrorPage from "@/components/ErrorPage";
import Header from "@/components/Header";
import Head from "next/head";

function TripDetail(props) {

  const router = useRouter();
  const { userData } = useSelector((state) => state.auth);
  const { lang } = useSelector((state) => state.headData);

  let transactionId = router.query?.ids;
  let email = router.query?.email;
  const dataS = {
    booking_number: transactionId,
    ...(email && { email: email }),
  };
  const { data: home } = useGetHomeDataQuery(
    { lang, role_id: userData?.role_id },
    { refetchOnMountOrArgChange: true }
  );

  const { data: staticData } = useStaticContentQuery(lang, {
    refetchOnMountOrArgChange: true,
  });
  const {
    data: bookingData,
    isLoading,
    isError,
    error,
  } = useManageBookingQuery(dataS, {
    refetchOnMountOrArgChange: true,
  });
  // const [bookingRating] = useBookingRatingMutation();
  const [cancelBooking, { isLoading: cancelLoading }] =
    useCancelBookingMutation();

  // const ratingChanged = async (e) => {
  //   if (props.token) {
  //     const dataToSend = {
  //       transaction_id: bookingData?.data?.txn_id,
  //       rating: e,
  //     };
  //     let response = await bookingRating(dataToSend).unwrap();
  //     if (response?.status) {
  //       response?.message && successMsg(response?.message);
  //     } else {
  //       response?.message && errorMsg(response?.message);
  //     }
  //   } else {
  //     router.push(`/login?callbackUrl=${router.pathname}`);
  //   }
  // };


  const handleCancelBooking = async () => {
    const dataToSend = {
      txn_id: bookingData?.data?.txn_id,
    };
    let response = await cancelBooking(dataToSend).unwrap();
    if (response?.status) {
      response?.message && successMsg(response?.message);
      router.push("/my-account");
    } else {
      response?.message && errorMsg(response?.message);
    }
  };

  const handleEditTrip = async () => {
    const data = {
      pickup_location: bookingData?.data?.pickup_location,
      return_location: bookingData?.data?.return_location,
      pickup_datetime: bookingData?.data?.pickup_datetime,
      return_datetime: bookingData?.data?.return_datetime,
      age: 40,
    };
    // const response = await searchVehical(data).unwrap();
    await setCookies("searchData", JSON.stringify(data));
    await setCookies("dealCarId", bookingData?.data?.car?.car_id);
    setTimeout(() => {
      router.push(`/deal-detail?txn_id=${bookingData?.data?.txn_id}&procode=${bookingData?.data?.car?.selected_product}&search_id=${bookingData?.data?.car?.search_id}`);
    }, 500);
  };

  if (isLoading) {
    <section className="hero mt-35">
      <div className="container loader-img-img" data-aos="fade-up">
        <img src="/assets/img/ball-triangle.svg" alt="img" />
      </div>
    </section>;
  }

  if (isError) {
    return (
      <section className="p-0">
        <div className="" data-aos="fade-up">
          <ErrorPage message={error?.data?.message} />
        </div>
      </section>
    );
  }

  let currencySymbol =
    home?.data?.currencies.length > 0
      ? home?.data?.currencies.find(
          (res) => res.id == bookingData?.data?.currency_id
        )
      : null;

  // const print = () => {
  //   // const uniqueName = `${Date.now()}-${Math.round(
  //   //   Math.random() * 1e9
  //   // )}-invoice.pdf`;
  //   // let element = <Prints />;
  //   // const doc = new jsPDF("p", "pt", "a4");
  //   // doc.setPage(1);
  //   // doc.html(ReactDOMServer.renderToString(element), {
  //   //   callback: function (doc) {
  //   //     doc.save("sample.pdf");
  //   //   },
  //   // });
  // };

  const handleDownload = () => {
    const response = `${process.env.NEXT_PUBLIC_PDF_BASE_URL}/invoice-pdf?txn_id=${transactionId}&lang_id=${lang}`;

    const link = document.createElement("a");
    link.href = response;
    link.setAttribute("target", "_blank");
    // Append to html link element page
    document.body.appendChild(link);
    // Start download
    link.click();

    // Clean up and remove the link
    link.parentNode.removeChild(link);
  };

  const PricePaidByCustomer = (percentage, amount) => {
    let pricePercentage = (amount * percentage) / 100;
    let total = amount + pricePercentage;
    return Math.round(total * 100) / 100;
  };

  if(bookingData?.data?.reservation_info){
    let reservation_info = JSON.parse(bookingData.data.reservation_info);
    var address2 = reservation_info.response.location_info.address_2;
    var address1 = reservation_info.response.location_info.address_1;
    var extra = reservation_info.response.location_info.extra;
    var rep_telephone = reservation_info.response.location_info.telephone
    var rep_email = reservation_info.response.location_info.email
  }else{
    var address2 = '';
    var address1 = '';
    var extra = '';
    var rep_telephone = '';
    var rep_email = '';
  }


  return (
    <>
      <Head>
        <title>Origin Rent | Trip details</title>
        <meta
          name="description"
          content="Origin Rent is Car hire service platform for those users who need cars on rent."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/img/favicon.png" />
      </Head>
      <Header />
      <main id="main" className="my-trips">
        <div className="container">
          <img
            src="/assets/img/my-trips-bnr.png"
            alt=""
            className="img-fluid my-trips-bg"
          />
  
          <div className="tab_container w-100 start-0 bookdtl">

          {props?.token && (
                <div className="boking-cl-mo">
                  <Link href="/my-account" legacyBehavior>
                    <a className="bct-trp">
                      <img
                        src="/assets/img/back-a.svg"
                        alt=""
                        className="img-fluid"
                      />{" "}
                      {staticData?.data?.back_to_trips}
                    </a>
                  </Link>
                  <div>
                    {(bookingData?.data?.status == "0" || bookingData?.data?.status == "1" || bookingData?.data?.status == "2") && (
                      <button
                        className="cncle-btn"
                        href="#"
                        onClick={handleCancelBooking}
                        disabled={cancelLoading}
                      >    
                        {cancelLoading
                          ? staticData?.data?.loading
                          : staticData?.data?.cancel_trip}
                      </button>
                    )}
                    
                    {/* {(bookingData?.data?.status == "0" || bookingData?.data?.status == "1") && bookingData.data.car.selected_product != null ? (
                      <a className="edit-trp" onClick={handleEditTrip}>
                        {staticData?.data?.edit_trips}
                      </a>
                    ) : (
                      ""
                    )} */}
                  </div>
                </div>
              )}

             <h3 className="voucher_heading">{staticData?.data?.voucher_heading}</h3>
             <div className="row">
                <div className="col-md-6">
                    <img src="https://originrent.com/assets/img/logo.png" />
                </div>
                <div className="col-md-6 text-right">
                    <div>{staticData?.data?.additional_data?.booking_reference_number}: {bookingData?.data?.booking_id}</div>
                    <div>{staticData?.data?.booking_date}: {moment(bookingData?.data?.created_at).format("DD MMM YYYY")}</div>
                </div>

                <div className="col-md-12">
                  <h3 className="vocher_h3">{staticData?.data?.booking_details}</h3>

                  <ul className="conten_ul">
                    <li>

                      <img src={bookingData?.data?.car?.car_image} style={{'maxWidth' : '50%'}}/>
                      <p>{bookingData?.data?.car?.car_name}</p>

                    </li>
                    <li>  
                      <h2>{staticData?.data?.pick_up}</h2>
                      <p>Date: {moment(bookingData?.data?.pickup_datetime).format("DD MMM YYYY HH:mm")}</p>
                      <p>{staticData?.data?.location}: {bookingData?.data?.pickup_location}</p>
                      <p>{staticData?.data?.address}: {address1} {he.decode(address2)}</p>
                    </li>
                    <li>   
                      <h2>{staticData?.data?.drop_off}</h2>
                      <p>Date: {moment(bookingData?.data?.return_datetime).format("DD MMM YYYY HH:mm")}</p>
                      <p>{staticData?.data?.location}: {bookingData?.data?.return_location}</p>
                      <p>{staticData?.data?.address}: {address1} {he.decode(address2)} </p>
                    </li>
                  </ul>

                  <ul className="contact_ul">
                      <li><svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 20 20" fill="none">
                      <path d="M3.84615 15.8333C3.4626 15.8333 3.14236 15.7049 2.88542 15.4479C2.62847 15.191 2.5 14.8707 2.5 14.4872V5.51281C2.5 5.12927 2.62847 4.80903 2.88542 4.55208C3.14236 4.29514 3.4626 4.16667 3.84615 4.16667H16.1539C16.5374 4.16667 16.8576 4.29514 17.1146 4.55208C17.3715 4.80903 17.5 5.12927 17.5 5.51281V14.4872C17.5 14.8707 17.3715 15.191 17.1146 15.4479C16.8576 15.7049 16.5374 15.8333 16.1539 15.8333H3.84615ZM10 10.0962L3.33333 5.73719V14.4872C3.33333 14.6368 3.38141 14.7596 3.47756 14.8558C3.57372 14.9519 3.69658 15 3.84615 15H16.1539C16.3034 15 16.4263 14.9519 16.5224 14.8558C16.6186 14.7596 16.6667 14.6368 16.6667 14.4872V5.73719L10 10.0962ZM10 9.16667L16.4103 5H3.58975L10 9.16667ZM3.33333 5.73719V5V14.4872C3.33333 14.6368 3.38141 14.7596 3.47756 14.8558C3.57372 14.9519 3.69658 15 3.84615 15H3.33333V5.73719Z" fill="black"/>
                      </svg> {rep_email} </li>

                    <li><svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 20 20" fill="none">
                    <path d="M15.7753 16.6667C14.3704 16.6667 12.9302 16.3149 11.4548 15.6114C9.97937 14.9079 8.60864 13.9204 7.34261 12.649C6.07658 11.3777 5.09181 10.0069 4.3883 8.53685C3.68477 7.06677 3.33301 5.62927 3.33301 4.22435C3.33301 3.96977 3.41634 3.75762 3.58301 3.58792C3.74967 3.41819 3.95801 3.33333 4.20801 3.33333H6.2689C6.4954 3.33333 6.69306 3.40465 6.86186 3.54727C7.03067 3.6899 7.14498 3.87285 7.2048 4.09615L7.61826 6.08333C7.65673 6.31624 7.64979 6.51976 7.59742 6.69392C7.54508 6.86805 7.45267 7.01068 7.3202 7.12179L5.49165 8.82692C5.83354 9.44765 6.21149 10.0243 6.62549 10.5569C7.03947 11.0895 7.48097 11.594 7.94999 12.0705C8.43397 12.5545 8.95481 13.0045 9.51249 13.4207C10.0702 13.8368 10.6824 14.2297 11.349 14.5994L13.1311 12.7852C13.2668 12.6389 13.4193 12.5425 13.5886 12.496C13.7579 12.4495 13.9452 12.4402 14.1503 12.4679L15.9035 12.8269C16.13 12.8825 16.3138 12.9965 16.4548 13.1691C16.5958 13.3416 16.6663 13.5395 16.6663 13.7628V15.7917C16.6663 16.0417 16.5815 16.25 16.4118 16.4167C16.242 16.5833 16.0299 16.6667 15.7753 16.6667ZM5.10063 8.04487L6.69999 6.57371C6.7534 6.53097 6.78813 6.47222 6.80415 6.39744C6.82018 6.32265 6.81751 6.2532 6.79615 6.1891L6.42595 4.42308C6.40458 4.33761 6.3672 4.27351 6.31378 4.23077C6.26036 4.18804 6.19092 4.16667 6.10545 4.16667H4.39551C4.33141 4.16667 4.27799 4.18804 4.23526 4.23077C4.19252 4.27351 4.17115 4.32692 4.17115 4.39102C4.18718 4.96046 4.27639 5.55502 4.43878 6.17469C4.60117 6.79434 4.82179 7.41774 5.10063 8.04487ZM12.1423 14.9904C12.7053 15.2692 13.3055 15.4754 13.9428 15.609C14.5801 15.7425 15.1354 15.8141 15.6087 15.8237C15.6728 15.8237 15.7262 15.8023 15.7689 15.7596C15.8116 15.7169 15.833 15.6635 15.833 15.5994V13.9263C15.833 13.8408 15.8116 13.7714 15.7689 13.718C15.7262 13.6645 15.6621 13.6271 15.5766 13.6058L14.0349 13.2901C13.9708 13.2687 13.9147 13.266 13.8667 13.2821C13.8186 13.2981 13.7678 13.3328 13.7144 13.3862L12.1423 14.9904Z" fill="black"/>
                    </svg> {rep_telephone} </li>

                  </ul> 

                  <h3 className="vocher_h3">Extra Details</h3>
                  <p>{extra}</p>

                </div>


             </div>

             

          </div>
          <div className="tab_container w-100 start-0 bookdtl" style={{"display":"none"}}>
            <h3 className="d_active tab_drawer_heading" rel="tab1">
              <img
                src="/assets/img/distance.svg"
                alt=""
                className="img-fluid"
              />{" "}
              {staticData?.data?.my_trips}
            </h3>
            <div className="tim-sts" style={{}}>
              {bookingData?.data?.status == "3" ? (
                <span>{staticData?.data?.canceled}</span>
              ) : bookingData?.data?.status == "2" ? (
                <span className="grns">{staticData?.data?.completed}</span>
              ) : null}
            </div>
            <div id="tab1" className="tab_content">
              {props?.token && (
                <div className="boking-cl-mo">
                  <Link href="/my-account" legacyBehavior>
                    <a className="bct-trp">
                      <img
                        src="/assets/img/back-a.svg"
                        alt=""
                        className="img-fluid"
                      />{" "}
                      {staticData?.data?.back_to_trips}
                    </a>
                  </Link>
                  <div>
                  {(bookingData?.data?.status == "0" || bookingData?.data?.status == "1" || bookingData?.data?.status == "2") && (
                      <button
                        className="cncle-btn"
                        href="#"
                        onClick={handleCancelBooking}  
                        disabled={cancelLoading}
                      >
                        {cancelLoading
                          ? staticData?.data?.loading
                          : staticData?.data?.cancel_trip}
                      </button>
                    )}

                    {/* {(bookingData?.data?.status == "0" || bookingData?.data?.status == "1") && bookingData.data.car.selected_product != null ? (
                      <a className="edit-trp" onClick={handleEditTrip}>
                        {staticData?.data?.edit_trips}
                      </a>
                    ) : (
                      ""
                    )} */}
                  </div>
                </div>   
              )}
              <h2 className="mb-2">
                {staticData?.data?.additional_data?.booking_reference_number}:{" "}
                <span>{bookingData?.data?.booking_id}</span>
              </h2>
              <div className="tim-sts text-start">
                {moment(bookingData?.data?.pickup_datetime).format(
                  "DD MMM YYYY HH:mm"
                )}{" "}
                {staticData?.data?.to}{" "}
                {moment(bookingData?.data?.return_datetime).format(
                  "DD MMM YYYY HH:mm"
                )}
              </div>
              {/* <div className="map-loc">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28895.918276542365!2d55.2498073259747!3d25.13603621677278!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f682829c85c07%3A0xa5eda9fb3c93b69d!2sThe%20Dubai%20Mall!5e0!3m2!1sen!2sin!4v1674452851886!5m2!1sen!2sin"
                  allowFullScreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
              </div> */}
              {/* <div className="row rting-sc">
                <div className="col-md-12">
                  <h4>Rate Trip</h4>
                </div>
                <div className="col-md-8">
                  <div className="stars">
                    {bookingData?.data?.rating?.rating ? (
                      <StarRatings
                        rating={Number(bookingData?.data?.rating?.rating)}
                        starRatedColor="orange"
                        // changeRating={(newRating) => ratingChanged(newRating)}
                        numberOfStars={5}
                        name="rating"
                        starSpacing="1px"
                        starDimension="37px"
                      />
                    ) : (
                      <StarRatings
                        rating={0}
                        starRatedColor="orange"
                        changeRating={(newRating) => ratingChanged(newRating)}
                        numberOfStars={5}
                        name="rating"
                        starSpacing="1px"
                        starDimension="37px"
                      />
                    )}
                  </div>
                </div>
                <div className="col-md-4 text-end">
                  <a href="#">
                    <img
                      src="/assets/img/right-arrow.svg"
                      alt=""
                      className="img-fluid"
                    />
                  </a>
                </div>
                <hr />
              </div> */}
              <br />
              <div className="row rting-sc">
                <div className="col-md-12">
                  <h4>{staticData?.data?.trip_details}</h4>
                </div>
                <div className="col-md-12">
                  <ul>
                    <li>
                      <img
                        src="/assets/img/taxi.svg"
                        alt=""
                        className="img-fluid"
                      />{" "}
                      Premium
                    </li>
                    {/* <li>
                      <img
                        src="/assets/img/road-with-broken-line.svg"
                        alt=""
                        className="img-fluid"
                      />{" "}
                      9.17 kilometers
                    </li>
                    <li>
                      <img
                        src="/assets/img/time.svg"
                        alt=""
                        className="img-fluid"
                      />{" "}
                      23 min
                    </li> */}
                    <li>
                      <img
                        src="/assets/img/tag.svg"
                        alt=""
                        className="img-fluid"
                      />{" "}
                      {currencySymbol?.symbol +
                        "" +
                        Math.round(bookingData?.data?.grandtotal * 100) / 100}
                    </li>
                    <li>
                      <img
                        src="/assets/img/money.svg"
                        alt=""
                        className="img-fluid"
                      />{" "}
                      {bookingData?.data?.order?.payment_type == 1
                        ? "Card"
                        : bookingData?.data?.order?.payment_type == 2
                        ? "Prepaid"
                        : bookingData?.data?.order?.payment_type == 3
                        ? "Cash"
                        : bookingData?.data?.order?.payment_type == 4
                        ? "Wallet"
                        : "Cash"}
                    </li>
                  </ul>
                </div>
                <hr />
              </div>

              <div className="row rting-sc">
                <div className="col-md-12">
                  <h4 className="mb-3">{staticData?.data?.route}</h4>
                </div>
                <div className="col-md-7 d-flex align-items-center">
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
                      {bookingData?.data?.pickup_location}
                      <span className="time-pic">
                        {moment(bookingData?.data?.pickup_datetime).format(
                          "HH:MM a"
                        )}
                      </span>
                    </h4>
                    <hr />
                    <h4>
                      <span>{staticData?.data?.dropoff_point}</span>
                      {bookingData?.data?.return_location}
                      <span className="time-pic">
                        {moment(bookingData?.data?.return_datetime).format(
                          "HH:MM a"
                        )}
                      </span>
                    </h4>
                  </div>
                </div>
                <hr className="mt-3" />
              </div>
              {props.token && (
                <div className="row usr-pdamun ps-3 align-items-center">
                  {userData.role_id == "3" &&
                    bookingData?.data?.user?.role_id == "3" && (
                      <div className="col-md-5">
                        <p>
                          {staticData?.data?.amount_paid_by_you}:{" "}
                          <span>
                            {currencySymbol?.symbol +
                              "" +
                              Math.round(bookingData?.data?.grandtotal * 100) /
                                100}
                          </span>
                        </p>
                        <hr className="" />
                        <p>
                          {staticData?.data?.amount_paid_by_your_customer}:{" "}
                          <span>
                            {currencySymbol?.symbol +
                              "" +
                              PricePaidByCustomer(
                                Number(bookingData?.data?.surge_charge),
                                Number(bookingData?.data?.grandtotal)
                              )}
                          </span>
                        </p>
                      </div>
                    )}
                  <div className="col-md-3">
                    <button className="view-mdl" onClick={handleDownload}>
                      {staticData?.data?.download_Invoice}
                    </button>
                  </div>
                </div>
              )}
              <div className="row rting-sc">
                <Link href="/help" legacyBehavior>
                  <div className="col-md-8 mt-4 d-flex align-items-center">
                    <img
                      src="/assets/img/headphone.svg"
                      alt=""
                      className="img-fluid"
                    />
                    <h4 className="ms-3">{staticData?.data?.get_help}</h4>
                  </div>
                </Link>
                <div className="col-md-4 text-end">
                  <Link href="/help" legacyBehavior>
                    <a>
                      <img
                        src="/assets/img/right-arrow.svg"
                        alt=""
                        className="img-fluid"
                      />
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export const getServerSideProps = async ({ req, res, resolvedUrl }) => {
  let token = await req.cookies.origin_rent_token;

  return { props: { token: token ? token : null } };
};

export default TripDetail;
