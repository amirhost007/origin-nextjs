import React, { useState } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import Link from "next/link";
import PhoneInput from "react-phone-input-2";
// import PrivateRoute from "@/components/Routes/PrivateRoute";
import {
  useAddCarBookingQuery,
  useApplyCouponMutation,
  useModifyBookingQuery,
  useOrderBookingMutation,
  useOrderWithoutCreditCardMutation,
  useRemoveCouponMutation,
  useStaticContentQuery,
} from "@/store/Slices/apiSlice";
import { getCookieData, setCookies } from "@/utils/helper";
import { errorMsg, successMsg } from "@/components/Toast";
import countryData from "@/utils/country.json";
import BookingSuccess from "@/components/Modal/BookingSuccess";
import RBmodal from "@/components/Modal/RBmodal";
import ErrorHandler from "@/components/ErrorHandler";
import ErrorPage from "@/components/ErrorPage";
import PriceBreakdown from "@/components/DealsBooking/PriceBreakdown";
import { useDispatch, useSelector } from "react-redux";
import { Placeholder } from "react-bootstrap";
import ImportantInfo from "@/components/List/ImportantInfo";
import titleCase from "@/components/TitleCase";
import { langUpdate } from "@/store/Slices/headerSlice";
import { loggedIn, userDataUpdate } from "@/store/Slices/authSlice";
import { PayOnArraival } from "@/components/DealsBooking/Alert";
import Header from "@/components/Header";
import Head from "next/head";

function DealBooking(props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showImptinfo, setImptinfo] = useState(false);
  const [couponError, setCouponError] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [show, setShow] = useState(false);
  const [checkterm, setcheckterm] = useState(false);
  const [payOnArraival, setPayOnArraival] = useState(0);

  let txn_id = props?.txn_id;

  const { currency, lang } = useSelector((state) => state.headData);
  let dataForSearch =
    getCookieData("searchData") && JSON.parse(getCookieData("searchData"));
  let userData =
    getCookieData("origin_rent_userdata") &&
    JSON.parse(getCookieData("origin_rent_userdata"));

  let selectedCarId = getCookieData("dealCarId");
  let withProtection = getCookieData("withProtection");
  let Extradetails = getCookieData("selected_extra_details");
  var proCode = getCookieData("proCode");
  var insertedId = getCookieData("inserted_id");
  
  const { data: staticData } = useStaticContentQuery(lang, {
    refetchOnMountOrArgChange: true,
  });

  const dbStatic = staticData?.data?.additional_data;

  const handleCloseImptInfo = () => setImptinfo(false);

  let postData = {
    car_id: selectedCarId ? selectedCarId : "",
    proCode: proCode ? proCode : "",
    insertedId: insertedId ? insertedId : "",
    extradetails: Extradetails ? Extradetails : "",
    pickup_location: dataForSearch?.pickup_location
      ? dataForSearch?.pickup_location
      : "",
    return_location: dataForSearch?.return_location
      ? dataForSearch?.return_location
      : "",
    pickup_datetime: dataForSearch?.pickup_datetime
      ? dataForSearch?.pickup_datetime
      : "",
    return_datetime: dataForSearch?.return_datetime
      ? dataForSearch?.return_datetime
      : "",
    with_full_protection: withProtection,
    without_credit_card: dataForSearch?.without_credit_card,
    is_pay_on_arrival: payOnArraival,
    unique_time: dataForSearch?.unique_time,
    ...(txn_id && { txn_id: txn_id }),
    ...(currency && { currency_id: currency }),
    ...(userData?.hasOwnProperty("login_as") && {
      login_as: userData?.login_as
    }),
  };

  const {
    data: bookingData,
    isLoading,
    isError,
    error,
    isFetching,
  } = txn_id
      ? useModifyBookingQuery(postData, {
        refetchOnMountOrArgChange: true,
      })
      : useAddCarBookingQuery(postData, {
        refetchOnMountOrArgChange: true,
      });
  const [applyCoupon, { isLoading: applyCouponLoading }] =
    useApplyCouponMutation();
  const [orderBooking, { isLoading: bookingLoading }] =
    useOrderBookingMutation();
  const [orderWithoutCreditCard, { isLoading: bookingWithoutLoading }] =
    useOrderWithoutCreditCardMutation();
  const [removeCoupon] = useRemoveCouponMutation();

  let carDetails =
    txn_id && bookingData ? bookingData.data?.new_car?.car : null;

  let oldCarDetails =
    txn_id && bookingData ? bookingData.data?.old_booking?.car : null;
  let driverDetails =
    txn_id && bookingData ? bookingData.data?.old_booking?.driver : null;
  let billingsDetails =
    txn_id && bookingData ? bookingData.data?.old_booking?.order : null;

  const handleApplyCoupon = async () => {
    let setForData = {
      promo_code: couponCode,
      car_id: txn_id
        ? carDetails.id
        : bookingData?.data?.id
          ? bookingData?.data?.id
          : "",
      ...(currency && { currency_id: currency }),
    };
    if (couponCode) {
      try {
        let response = await applyCoupon(setForData).unwrap();

        response.message && successMsg(response.message);
      } catch (error) {
        let err = error?.data?.message ? error?.data?.message : error.message;

        errorMsg(err);
        setCouponCode("");
      }
    } else {
      setCouponError(true);
      // errorMsg("Please fill coupon code first.");
    }
  };
  const handleRemoveCoupon = async (code, carID) => {
    let setForData = {
      promo_code: code,
      car_id: carID,
      ...(currency && { currency_id: currency }),
    };

    try {
      let response = await removeCoupon(setForData).unwrap();

      response.message && successMsg(response.message);
      setCouponCode("");
    } catch (error) {
      let err = error?.data?.message ? error?.data?.message : error.message;

      errorMsg(err);
    }
  };
  const handleClose = () => {
    setShow(false);
  };

  const set_term_checkbox = () =>{
    setcheckterm(true);
  }

  let finalAmt = txn_id
    ? Number(carDetails?.grand_total) -
    Number(bookingData?.data?.old_booking?.grandtotal)
    : 0;

  const initialState = {
    car_id:
      txn_id && bookingData
        ? bookingData.data?.new_car?.car_detail_id
        : bookingData?.data?.id
          ? bookingData?.data?.id
          : "",
    driver_first_name:
      driverDetails && driverDetails.first_name ? driverDetails.first_name : "",
    driver_last_name:
      driverDetails && driverDetails?.last_name ? driverDetails?.last_name : "",
    driver_email:
      driverDetails && driverDetails?.email ? driverDetails?.email : "",
    driver_phone:
      driverDetails && driverDetails?.phone ? driverDetails?.phone : "",
    driver_passport_number:
      driverDetails && driverDetails?.passport_number ? driverDetails?.passport_number : "",
    driver_title:
      driverDetails && driverDetails?.title ? driverDetails?.title : "",
    driver_country:
      driverDetails && driverDetails?.country ? driverDetails?.country : "",
    driver_address:
      driverDetails && driverDetails?.address ? driverDetails?.address : "",
    driver_city:
      driverDetails && driverDetails?.city ? driverDetails?.city : "",
    driver_postcode:
      driverDetails && driverDetails?.postcode ? driverDetails?.postcode : "",
    driver_flight_number:
      driverDetails && driverDetails?.flight_number
        ? driverDetails?.flight_number
        : "",
    billing_first_name:
      billingsDetails && billingsDetails.first_name
        ? billingsDetails.first_name
        : "",
    billing_last_name:
      billingsDetails && billingsDetails.last_name
        ? billingsDetails.last_name
        : "",
    billing_email:
      billingsDetails && billingsDetails.email ? billingsDetails.email : "",
    billing_phone:
      billingsDetails && billingsDetails.phone ? billingsDetails.phone : "",
    billing_country:
      billingsDetails && billingsDetails.country ? billingsDetails.country : "",
    billing_address:
      billingsDetails && billingsDetails.address ? billingsDetails.address : "",
    billing_city:
      billingsDetails && billingsDetails.city ? billingsDetails.city : "",
    billing_postcode:
      billingsDetails && billingsDetails.postcode
        ? billingsDetails.postcode
        : "",
    billing_is_bussiness_booking:
      billingsDetails && billingsDetails.is_bussiness_booking
        ? billingsDetails.is_bussiness_booking
        : "yes",
    payment_type: txn_id && finalAmt ? (finalAmt > 0 ? "2" : "2") : "2",
    // user_name:
    //   billingsDetails && billingsDetails.user_name
    //     ? billingsDetails.user_name
    //     : "",
    // user_email:
    //   billingsDetails && billingsDetails.user_email
    //     ? billingsDetails.user_email
    //     : "",
    fullName: "",
    number: "",
    month: "",
    year: "",
    cvv: "",
  };
  const requiredMsg = staticData?.data?.field_is_required;
  const emaildMsg = staticData?.data?.invalid_email;
  const UserFormSchema = Yup.object().shape({
    driver_email: Yup.string().email(emaildMsg).required(requiredMsg),
    // user_email: Yup.string().email(emaildMsg).required(requiredMsg),
    // user_name: Yup.string().required(requiredMsg),
    driver_first_name: Yup.string().required(requiredMsg),
    driver_last_name: Yup.string().required(requiredMsg),
    driver_phone: Yup.string().required(requiredMsg),
    driver_passport_number: Yup.string().required(requiredMsg),
    // driver_title: Yup.string().required("Field is Required"),
    driver_country: Yup.string().required(requiredMsg),
    driver_address: Yup.string().required(requiredMsg),
    driver_city: Yup.string().required(requiredMsg),
    driver_postcode: Yup.string(),
    // driver_flight_number: Yup.string(),
    billing_first_name: Yup.string().required(requiredMsg),
    billing_last_name: Yup.string().required(requiredMsg),
    billing_email: Yup.string().email(emaildMsg).required(requiredMsg),
    billing_phone: Yup.string().required(requiredMsg),
    billing_country: Yup.string().required(requiredMsg),
    billing_address: Yup.string().required(requiredMsg),
    billing_city: Yup.string().required(requiredMsg),
    billing_postcode: Yup.string(),
    payment_type: Yup.string().required(requiredMsg),
    term_check: Yup.string().required(requiredMsg),
    
    // drop_off: Yup.string().when("different_location", {
    //   is: true,
    //   then: Yup.string().required("Field is required"),
    // }),
    fullName: Yup.string().when("payment_type", {
      is: "1",
      then: Yup.string().required(requiredMsg),
    }),
    number: Yup.string()
      .when("payment_type", {
        is: "1",
        then: Yup.string().required("Card Number is required"),
      })
      .min(13)
      .max(20),
    // .matches(/^4[0-9]{12}(?:[0-9]{3})?$/, "Please Enter Valid Card Number"),
    month: Yup.string()
      .when("payment_type", {
        is: "1",
        then: Yup.string().required("Expiry month is required"),
      })
      .matches(/^(0?[1-9]|1[012])$/, "Invalid expiry Month")
      .length(2),
    year: Yup.string()
      .when("payment_type", {
        is: "1",
        then: Yup.string().required("Expiry year is required"),
      })
      .matches(/(?:(?:20|20)[0-9]{2})/, "Invalid expiry Year")
      .max(4)
      .min(4),
    cvv: Yup.string()
      .when("payment_type", {
        is: "1",
        then: Yup.string().required("CVV is required"),
      })
      .max(3)
      .min(3),
  });

  const handleSubmit = async (values, { resetForm }) => {
    const orderDataSubmit = {
      ...values,
      without_deal_credit_card: props.searchData?.without_credit_card,
      ...(userData?.hasOwnProperty("login_as") && {
        login_as: userData?.login_as,
      }),
      ...(txn_id && { txn_id: txn_id }),
      ...(txn_id && {
        final_amount:
          Number(carDetails?.grand_total) - Number(oldCarDetails?.grand_total),
      }),
      ...(txn_id && {
        new_total_amount: carDetails?.grand_total,
      }),

      new_total_amount: txn_id ? carDetails?.grand_total : "",
      ...(currency && { currency_id: currency }),
      ...(props?.host && { base_url: props?.host }),
    };

  
    try {
      let response =
        props.searchData?.without_credit_card == 1
          ? await orderWithoutCreditCard(orderDataSubmit).unwrap()
          : await orderBooking(orderDataSubmit).unwrap();

      if (response.status) {
        // when guest login
        if (response?.userdata) {
          await setCookies("origin_rent_token", response?.userdata?.token);
          await setCookies(
            "origin_rent_userdata",
            JSON.stringify(response?.userdata)
          );
          dispatch(
            langUpdate({
              lang: response?.userdata?.lang_id,
              lang_code: response?.userdata?.lang_code,
            })
          );
          dispatch(userDataUpdate(response?.userdata));
          dispatch(loggedIn(true));
        }

        if (props.searchData?.without_credit_card == 0) {
          values?.payment_type != "2" && setShow(true);
          if (values?.payment_type == "2") {
            setTransactionId(response.data?.transaction);
            if (response.data?.link) router.push(response.data?.link);
          }
          setTransactionId(response.data);
        } else {
          setShow(true);
          setTransactionId(response.data);
        }
      }
    } catch (error) {
      let err = error?.data?.message ? error?.data?.message : error.message;

      errorMsg(err);
    }
  };

  if (isLoading)
    return (
      <>
        <Header />
        <section className="hero mt-35">
          <div className="container loader-img-img" data-aos="fade-up">
            <img src="/assets/img/ball-triangle.svg" alt="img" />
          </div>
        </section>
      </>
    );
  if (isError)
    return (
      <>
        <Header />
        <ErrorHandler error={error} />
        <section className="p-0">
          <div className="" data-aos="fade-up">
            <ErrorPage
              message={error?.data?.message ? error?.data?.message : null}
            />
          </div>
        </section>
      </>
    );
  // const handleShowImportantInfo = () => {
  //   setImptinfo(true);
  // };
  return (
    <>
      <Head>
        <title>Origin Rent </title>
        <meta
          name="description"
          content="Origin Rent is Car hire service platform for those users who need cars on rent."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/img/favicon.png" />
      </Head>
      <Header />
      {bookingLoading || bookingWithoutLoading ? (
        <div className="list-loader" />
      ) : null}
      <section className="hero mt-35">
        <div className="container" data-aos="fade-up">
          <div className="bnr-img">
            <img src="/assets/img/bnr-img.png" alt="" />
          </div>
          <div className="ovtr-box">
            <div className="srch-bx">
              <div className="d-flex w-100 align-items-center">
                <div className="srch-dth ">
                  <h3>
                    {carDetails
                      ? carDetails.pickup_location
                      : bookingData?.data?.pickup_location}
                  </h3>
                  <p>
                    {carDetails
                      ? moment(carDetails?.pickup_datetime).format(
                        "DD MMM YYYY HH:mm"
                      )
                      : moment(bookingData?.data?.pickup_datetime).format(
                        "DD MMM YYYY HH:mm"
                      )}
                  </p>
                </div>
                <div className="col-lg-2 col-md-1 text-center">
                  <img src="/assets/img/errow-nxt.svg" alt="" />
                </div>
                <div className="srch-dth">
                  <h3>
                    {carDetails
                      ? carDetails.return_location
                      : bookingData?.data?.return_location}
                  </h3>
                  <p>
                    {carDetails
                      ? moment(carDetails?.return_datetime).format(
                        "DD MMM YYYY HH:mm"
                      )
                      : moment(bookingData?.data?.return_datetime).format(
                        "DD MMM YYYY HH:mm"
                      )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {show && (
        <BookingSuccess
          handleClose={handleClose}
          trsId={transactionId?.transaction_id}
          refundMsg={transactionId?.refund_msg}
          emailID={transactionId?.email}
          show={show}
          backdrop="static"
          staticData={staticData}
          dbStatic={dbStatic}
        />
      )}

      <section id="cr-lst" className="stacky-postn cr-lst pt-0">
        <div className="container" data-aos="fade-up">
          <Formik
            initialValues={initialState}
            validationSchema={UserFormSchema}
            onSubmit={handleSubmit}
          >
            {({
              errors,
              touched,
              values,
              handleChange,
              handleBlur,
              setFieldValue,
              setFieldTouched,
              isValid,
            }) => (
              <Form autoComplete="off">
                <div className="row">
                  <div className="col-lg-9 col-md-12">
                    <div className="car-pr-sct shadow-none">
                      <div className="row">
                        <div className="col-md-3">
                          <img
                            className="img-fluid"
                            src={
                              carDetails || bookingData?.data?.car_image
                                ? carDetails
                                  ? carDetails.car_image
                                  : bookingData?.data?.car_image
                                : "/assets/img/car-9.png"
                            }
                            alt=""
                          />
                        </div>
                        <div className="col-md-9">
                          <div className="cr-dtl">
                            <h4>
                              {carDetails
                                ? carDetails?.car_name
                                : bookingData?.data?.car_name}
                            </h4>
                            {/* <p>or similar estate car</p> */}
                            <div className="spciftn border-0 ">
                              <ul>
                                {(carDetails
                                  ? carDetails.car_seat
                                  : bookingData?.data?.car_seat) && (
                                    <li>
                                      <img
                                        src="/assets/img/car-seat.svg"
                                        alt=""
                                      />{" "}
                                      {carDetails
                                        ? carDetails.car_seat
                                        : bookingData?.data?.car_seat}{" "}
                                      {staticData?.data?.seats}
                                    </li>
                                  )}
                                {(carDetails
                                  ? carDetails.car_transmission
                                  : bookingData?.data?.car_transmission) && (
                                    <li>
                                      <img src="/assets/img/gear.svg" alt="" />
                                      {carDetails
                                        ? titleCase(carDetails.car_transmission)
                                        : titleCase(
                                          bookingData?.data?.car_transmission
                                        )}
                                    </li>
                                  )}
                                {(carDetails
                                  ? carDetails.luggageLarge
                                  : bookingData?.data?.luggageLarge) && (
                                    <li>
                                      <img
                                        src="/assets/img/sport-bag.svg"
                                        alt=""
                                      />{" "}
                                      {carDetails
                                        ? carDetails.luggageLarge
                                        : bookingData?.data?.luggageLarge}{" "}
                                      {staticData?.data?.large_begs}
                                    </li>
                                  )}
                                {(carDetails
                                  ? carDetails.luggageSmall
                                  : bookingData?.data?.luggageSmall) && (
                                    <li>
                                      <img
                                        src="/assets/img/camera-bag.svg"
                                        alt=""
                                      />{" "}
                                      {carDetails
                                        ? carDetails.luggageSmall
                                        : bookingData?.data?.luggageSmall}{" "}
                                      {staticData?.data?.small_begs}
                                    </li>
                                  )}

                                {(carDetails
                                  ? carDetails.luggageMed
                                  : bookingData?.data?.luggageMed) && (
                                    <li>
                                      <img
                                        src="/assets/img/camera-bag.svg"
                                        alt=""
                                      />{" "}
                                      {carDetails
                                        ? carDetails.luggageMed
                                        : bookingData?.data?.luggageMed}{" "}
                                      {"Medium bags"}
                                    </li>
                                  )}
                                  
                                {(carDetails
                                  ? carDetails.car_mileage
                                  : bookingData?.data?.car_mileage) && (
                                    <li>
                                      <img
                                        src="/assets/img/speedometer.svg"
                                        alt=""
                                      />
                                      {carDetails
                                        ? carDetails.car_mileage
                                        : bookingData?.data?.car_mileage}
                                    </li>
                                  )}
                              </ul>
                            </div>
                            <h5>
                              <img src="/assets/img/location.svg" alt="" />
                              {carDetails
                                ? carDetails?.pickup_location
                                : bookingData?.data?.pickup_location}
                              {/* <span>- Shuttle Bus</span> */}
                            </h5>
                          </div>
                        </div>
                        <div className="col-md-12 car-onr">
                          <div className="enqry">
                            <div
                              className="wch-lg "
                              style={{ borderRight: "none" }}
                            >
                              {(carDetails ? carDetails : bookingData?.data)
                                ?.supplier_id == "35" ? (
                                <img
                                  src="/assets/img/green_motion.png"
                                  alt=""
                                />
                              ) : (
                                <img
                                  src={
                                    (carDetails
                                      ? carDetails
                                      : bookingData?.data
                                    )?.vendor_logo
                                  }
                                  alt=""
                                />
                              )}
                            </div>
                            {/* <div className="rte-tle">
                              <h3>
                                {
                                  (carDetails ? carDetails : bookingData?.data)
                                    ?.vendor_name
                                }
                              </h3>
                            </div> */}
                            {/* <div className="rte-tle">
                                <img src="/assets/img/star.svg" alt="" />
                                <h3>8.5</h3>
                              </div>
                              <div className="tle-re">
                                <h5>
                                  Very good <span>1000+ reviews</span>
                                </h5>
                              </div> */}
                          </div>
                          {/* <div className="imrt-mel">
                              <a
                                className="me-4"
                                onClick={handleShowImportantInfo}
                              >
                                <img src="/assets/img/info.svg" alt="" />{" "}
                                Important info
                              </a>
                            </div> */}
                        </div>

                        {/* <div className="inq-frm pick-lcton mt-5 car-rene-ad">
                          <h3 className="m-0">
                            {staticData?.data?.persional_details}
                          </h3>
                          
                          <form>
                            <div className="row">
                              <div className="col-lg-5 col-md-6">
                                <div className="form-group">
                                  <label htmlFor="user_name">
                                    {staticData?.data?.fullname}*
                                  </label>
                                  <input
                                    type="text"
                                    name="user_name"
                                    id="user_name"
                                    value={values.user_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                  {errors.user_name && touched.user_name ? (
                                    <span className="inp-alrt error">
                                      {errors.user_name}
                                    </span>
                                  ) : null}
                                </div>
                              </div>

                              <div className="col-lg-5 col-md-6">
                                <div className="form-group">
                                  <label htmlFor="user_email">
                                    {staticData?.data?.email_address}*
                                  </label>
                                  <input
                                    type="text"
                                    id="user_email"
                                    name="user_email"
                                    value={values.user_email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />

                                  {errors.user_email && touched.user_email ? (
                                    <span className="inp-alrt error">
                                      {errors.user_email}
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </form>
                        </div> */}
                        <div className="inq-frm pick-lcton mt-5 car-rene-ad">
                          <h3 className="m-0">
                            {staticData?.data?.main_drivers_details}
                          </h3>
                          <p>
                            {
                              staticData?.data
                                ?.as_they_appear_on_driving_licence
                            }
                          </p>
                          <form>
                            <div className="row">
                              {/* <div className="col-lg-5 col-md-6">
                                  <div className="form-group">
                                    <label htmlFor="driver_title">Title*</label>
                                    <select
                                      name="driver_title"
                                      id=""
                                      value={values.driver_title}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    >
                                      <option value="">Title</option>
                                      <option value="mr">Mr.</option>
                                      <option value="mrs">Mrs.</option>
                                      <option value="ms">Ms.</option>
                                    </select>
                                    {errors.driver_title &&
                                    touched.driver_title ? (
                                      <span className="inp-alrt">
                                        {errors.driver_title}
                                      </span>
                                    ) : null}
                                  </div>
                                </div> */}
                              <div className="col-lg-5 col-md-6">
                                <div className="form-group">
                                  <label htmlFor="Email address">
                                    {staticData?.data?.first_name}*
                                  </label>
                                  <input
                                    type="text"
                                    name="driver_first_name"
                                    id=""
                                    value={values.driver_first_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                  {errors.driver_first_name &&
                                    touched.driver_first_name ? (
                                    <span className="inp-alrt error">
                                      {errors.driver_first_name}
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                              <div className="col-lg-5 col-md-6">
                                <div className="form-group">
                                  <label htmlFor="Email address">
                                    {staticData?.data?.last_name}*
                                  </label>
                                  <input
                                    type="text"
                                    name="driver_last_name"
                                    id=""
                                    value={values.driver_last_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                  {errors.driver_last_name &&
                                    touched.driver_last_name ? (
                                    <span className="inp-alrt error">
                                      {errors.driver_last_name}
                                    </span>
                                  ) : null}
                                </div>
                              </div>

                              <div className="col-lg-5 col-md-6">
                                <div className="form-group">
                                  <label htmlFor="Email address">
                                    {staticData?.data?.email_address}*
                                  </label>
                                  <input
                                    type="text"
                                    id=""
                                    name="driver_email"
                                    value={values.driver_email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                  {/* <span>
                                      So we can send the confirmation email and
                                      voucher
                                    </span> */}
                                  {errors.driver_email &&
                                    touched.driver_email ? (
                                    <span className="inp-alrt error">
                                      {errors.driver_email}
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                              <div className="col-lg-5 col-md-6">
                                <div className="form-group ">
                                  <label
                                    htmlFor="driver_phone"
                                    className=" mt-0"
                                  >
                                    {staticData?.data?.contact_number}*
                                  </label>
                                  <PhoneInput
                                    id="mobile_code-1"
                                    country={"us"}
                                    placeholder="Phone Number"
                                    name="driver_phone"
                                    value={values.driver_phone}
                                    onChange={(a, b, c, formatted) => {
                                      setFieldValue("driver_phone", formatted);
                                    }}
                                    onBlur={handleBlur}
                                  />
                                  {/* <span style={{ marginTop: "4px" }}>
                                      So we can call you if any problems come up
                                    </span> */}
                                     
                                  {errors.driver_phone &&
                                    touched.driver_phone ? (
                                    <span className=" top-number-space-arrow inp-alrt error">
                                      {errors.driver_phone}
                                    </span>
                                  ) : null}
                               </div>
                              </div>

                              <div className="col-lg-10 col-md-12">
                                <div className="form-group">
                                  <label htmlFor="Passport Number">
                                    {"Passport Number"}*
                                  </label>
                                  <input
                                    type="text"
                                    name="driver_passport_number"
                                    id="driver_passport_number"
                                    value={values.driver_passport_number}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                  {errors.driver_passport_number &&
                                    touched.driver_passport_number ? (
                                    <span className="inp-alrt error">
                                      {errors.driver_passport_number}
                                    </span>
                                  ) : null}
                                </div>
                              </div>

                              <div className="col-lg-5 col-md-6">
                                <div className="form-group">
                                  <label htmlFor="driver_country">
                                    {staticData?.data?.country_of_residence}*
                                  </label>
                                  <select
                                    name="driver_country"
                                    id="driver_country"
                                    value={values.driver_country}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  >
                                    <option value="">
                                      {staticData?.data?.country_of_residence}
                                    </option>
                                    {countryData?.map((res, i) => (
                                      <option value={res.name} key={i}>
                                        {res.name}
                                      </option>
                                    ))}
                                  </select>
                                  {errors.driver_country &&
                                    touched.driver_country ? (
                                    <span className="left-input-alert inp-alrt error">
                                      {errors.driver_country}
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                              <div className="col-lg-5 col-md-6">
                                <div className="form-group">
                                  <label htmlFor="driver_address">
                                    {staticData?.data?.address}*
                                  </label>
                                  <input
                                    type="text"
                                    name="driver_address"
                                    id="driver_address"
                                    value={values.driver_address}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                  {errors.driver_address &&
                                    touched.driver_address ? (
                                    <span className="inp-alrt error">
                                      {errors.driver_address}
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                              <div className="col-lg-5 col-md-6">
                                <div className="form-group">
                                  <label htmlFor="driver_city">
                                    {staticData?.data?.city}*
                                  </label>
                                  <input
                                    type="text"
                                    name="driver_city"
                                    id="driver_city"
                                    value={values.driver_city}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                  {errors.driver_city && touched.driver_city ? (
                                    <span className="inp-alrt error">
                                      {errors.driver_city}
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                              <div className="col-lg-5 col-md-6">
                                <div className="form-group">
                                  <label htmlFor="driver_postcode">
                                    {staticData?.data?.postcode}
                                  </label>
                                  <input
                                    type="text"
                                    name="driver_postcode"
                                    id="driver_postcode"
                                    value={values.driver_postcode}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                  {errors.driver_postcode &&
                                    touched.driver_postcode ? (
                                    <span className="inp-alrt error">
                                      {errors.driver_postcode}
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                              {/* <div className="col-lg-5 col-md-6">
                                  <div className="form-group">
                                    <label htmlFor="Email address">
                                      Flight number (optional)
                                    </label>
                                    <input
                                      type="text"
                                      name="driver_flight_number"
                                      id=""
                                      value={values.driver_flight_number}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    />
                                    <span>
                                      Just in case the flight is delayed{" "}
                                    </span>
                                    {errors.driver_flight_number &&
                                    touched.driver_flight_number ? (
                                      <span className="inp-alrt error">
                                        {errors.driver_flight_number}
                                      </span>
                                    ) : null}
                                  </div>
                                </div> */}
                            </div>
                          </form>
                          <p className="mt-2">
                            {staticData?.data?.our}{" "}
                            <Link href="/privacy-policy" legacyBehavior>
                              <a target="_blank" className="w-auto">
                                {staticData?.data?.privacy_statement}
                              </a>
                            </Link>{" "}
                            {
                              staticData?.data
                                ?.explains_how_we_use_and_protect_your_personal_information
                            }
                            .
                          </p>
                        </div>
                        <div className="inq-frm pick-lcton mt-5 car-rene-ad">
                          <label>
                            {
                              staticData?.data
                                ?.billing_address_same_as_driver_details
                            }
                            ?{" "}
                          </label>
                          <div className="same-billing">
                            <div>
                              <input
                                type="radio"
                                className="form-check-input"
                                name="same_as"
                                id="same-yes"
                                onClick={async () => {
                                  await setFieldValue(
                                    "billing_first_name",
                                    values.driver_first_name
                                  );
                                  await setFieldValue(
                                    "billing_last_name",
                                    values.driver_last_name
                                  );
                                  await setFieldValue(
                                    "billing_email",
                                    values.driver_email
                                  );
                                  await setFieldValue(
                                    "billing_phone",
                                    values.driver_phone
                                  );
                                  await setFieldValue(
                                    "billing_country",
                                    values.driver_country
                                  );
                                  await setFieldValue(
                                    "billing_address",
                                    values.driver_address
                                  );
                                  await setFieldValue(
                                    "billing_city",
                                    values.driver_city
                                  );
                                  await setFieldValue(
                                    "billing_postcode",
                                    values.driver_postcode
                                  );

                                  setFieldTouched("billing_first_name", true);
                                  setFieldTouched("billing_last_name", true);
                                  setFieldTouched("billing_email", true);
                                  setFieldTouched("billing_phone", true);
                                  setFieldTouched("billing_country", true);
                                  setFieldTouched("billing_address", true);
                                  setFieldTouched("billing_city", true);
                                  setFieldTouched("billing_postcode", true);
                                  
                                }}
                              />
                              <label
                                htmlFor="same-yes"
                                className="label-inline"
                              >
                                {staticData?.data?.yes}
                              </label>
                            </div>
                            <div style={{ marginLeft: "10px" }}>
                              <input
                                type="radio"
                                name="same_as"
                                id="same-no"
                                defaultChecked
                                className="form-check-input"
                              />
                              <label htmlFor="same-no" className="label-inline">
                                {staticData?.data?.no}
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="inq-frm pick-lcton car-rene-ad">
                          <h3 className="m-0">
                            {staticData?.data?.billing_address}
                          </h3>
                          <form>
                            <div className="row">
                              <div className="col-lg-5 col-md-6">
                                <div className="form-group">
                                  <label htmlFor="Email address">
                                    {staticData?.data?.first_name}*
                                  </label>
                                  <input
                                    type="text"
                                    name="billing_first_name"
                                    id=""
                                    value={values.billing_first_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                  {errors.billing_first_name &&
                                    touched.billing_first_name ? (
                                    <span className="inp-alrt error">
                                      {errors.billing_first_name}
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                              <div className="col-lg-5 col-md-6">
                                <div className="form-group">
                                  <label htmlFor="Email address">
                                    {staticData?.data?.last_name}*
                                  </label>
                                  <input
                                    type="text"
                                    name="billing_last_name"
                                    id=""
                                    value={values.billing_last_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                  {errors.billing_last_name &&
                                    touched.billing_last_name ? (
                                    <span className="inp-alrt error">
                                      {errors.billing_last_name}
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                              <div className="col-lg-5 col-md-6">
                                <div className="form-group">
                                  <label htmlFor="billing_email">
                                    {staticData?.data?.email_address}*
                                  </label>
                                  <input
                                    type="email"
                                    id="billing_email"
                                    name="billing_email"
                                    value={values.billing_email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                  {/* <span>
                                      So we can send the confirmation email and
                                      voucher
                                    </span> */}
                                  {errors.billing_email &&
                                    touched.billing_email ? (
                                    <span className="inp-alrt error">
                                      {errors.billing_email}
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                              <div className="col-lg-5 col-md-6">
                                <div className="form-group">
                                  <label
                                    htmlFor="billing_phone"
                                    className="mt-0"
                                  >
                                    {staticData?.data?.contact_number}*
                                  </label>

                                  <PhoneInput
                                    id="mobile_code-1"
                                    country={"us"}
                                    placeholder="Phone Number"
                                    name="billing_phone"
                                    value={values.billing_phone}
                                    onChange={(a, b, c, formatted) => {
                                      setFieldValue("billing_phone", formatted);
                                    }}
                                  />
                         
                                  {errors.billing_phone &&
                                    touched.billing_phone ? (
                                    <span className="top-number-space-arrow inp-alrt error">
                                      {errors.billing_phone}
                                    </span>
                                  ) : null}
                                         </div>
                              </div>


                              <div className="col-lg-5 col-md-6">
                                <div className="form-group">
                                  <label htmlFor="Email address">
                                    {staticData?.data?.country_of_residence}*
                                  </label>
                                  <select
                                    id=""
                                    name="billing_country"
                                    value={values.billing_country}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  >
                                    <option value="">
                                      {staticData?.data?.country_of_residence}
                                    </option>
                                    {countryData?.map((res, i) => (
                                      <option value={res.name} key={i}>
                                        {res.name}
                                      </option>
                                    ))}
                                  </select>
                                  {errors.billing_country &&
                                    touched.billing_country ? (
                                    <span className="left-input-alert inp-alrt error">
                                      {errors.billing_country}
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                              <div className="col-lg-5 col-md-6">
                                <div className="form-group">
                                  <label htmlFor="Email address">
                                    {staticData?.data?.address}*
                                  </label>
                                  <input
                                    type="text"
                                    name="billing_address"
                                    id=""
                                    value={values.billing_address}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                  {errors.billing_address &&
                                    touched.billing_address ? (
                                    <span className="inp-alrt error">
                                      {errors.billing_address}
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                              <div className="col-lg-5 col-md-6">
                                <div className="form-group">
                                  <label htmlFor="Email address">
                                    {staticData?.data?.city}*
                                  </label>
                                  <input
                                    type="text"
                                    name="billing_city"
                                    id=""
                                    value={values.billing_city}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                  {errors.billing_city &&
                                    touched.billing_city ? (
                                    <span className="inp-alrt  error">
                                      {errors.billing_city}
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                              <div className="col-lg-5 col-md-6">
                                <div className="form-group">
                                  <label htmlFor="Email address">
                                    {staticData?.data?.postcode}
                                  </label>
                                  <input
                                    type="text"
                                    name="billing_postcode"
                                    id=""
                                    value={values.billing_postcode}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                  {errors.billing_postcode &&
                                    touched.billing_postcode ? (
                                    <span className="inp-alrt error">
                                      {errors.billing_postcode}
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                              {/* <div className="col-lg-5 col-md-6">
                                  <div className="form-group">
                                    <label htmlFor="Email address">
                                      Is this a business booking?
                                    </label>
                                    <ul className="rdo-btn">
                                      <li>
                                        <label className="rado">
                                          Yes
                                          <input
                                            type="radio"
                                            name="billing_is_bussiness_booking"
                                            value="1"
                                            defaultChecked={
                                              values.payment_type == 1
                                            }
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                          />
                                          <span className="checkmark"></span>
                                        </label>
                                      </li>
                                      <li>
                                        <label className="rado">
                                          No
                                          <input
                                            type="radio"
                                            name="billing_is_bussiness_booking"
                                            value="0"
                                            defaultChecked={
                                              values.payment_type == 0
                                            }
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                          />
                                          <span className="checkmark"></span>
                                        </label>
                                      </li>
                                    </ul>
                                    {errors.billing_is_bussiness_booking &&
                                    touched.billing_is_bussiness_booking ? (
                                      <span className="inp-alrt error">
                                        {errors.billing_is_bussiness_booking}
                                      </span>
                                    ) : null}
                                  </div>
                                </div> */}
                            </div>
                          </form>
                        </div>

                        {props.searchData &&
                          !props.searchData?.without_credit_card ? (
                          <div className="pmt-card-add inq-frm car-rene-ad">
                            <h3>
                              {staticData?.data?.how_would_you_like_to_pay}
                            </h3>

                            <div className="payment_types">
                              {/* <div>
                              <input
                                type="radio"
                                className="form-check-input"
                                value="1"
                                name="payment_type"
                                id="stripe"
                                defaultChecked={values.payment_type == 1}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={finalAmt && txn_id && finalAmt < 1}
                              />
                              <label htmlFor="stripe" className="label-inline">
                                Stripe
                              </label>
                            </div> */}

                              <div>
                                <input
                                  type="radio"
                                  className="form-check-input"
                                  value="2"
                                  name="payment_type"
                                  id="tappay"
                                  checked={values.payment_type == 2}
                                  onChange={() => {
                                    setFieldValue("payment_type", 2);
                                    setPayOnArraival(0);
                                  }}
                                // onBlur={handleBlur}
                                // disabled={finalAmt && txn_id && finalAmt < 1}
                                />
                                <label
                                  htmlFor="tappay"
                                  className="label-inline"
                                >
                                  {dbStatic?.prepaid}
                                </label>
                              </div>
                              <div>
                                <input
                                  type="radio"
                                  className="form-check-input"
                                  value="3"
                                  name="payment_type"
                                  id="credit-voucher"
                                  checked={values.payment_type == 3}
                                  onChange={(e) => {
                                    PayOnArraival(staticData).then((result) => {
                                      if (result.isConfirmed) {
                                        setFieldValue("payment_type", 3);
                                        setPayOnArraival(1);
                                      } else {
                                        setFieldValue("payment_type", 2);
                                        setFieldTouched("payment_type");
                                      }
                                    });
                                  }}
                                // onBlur={handleBlur}
                                />
                                <label
                                  htmlFor="credit-voucher"
                                  className="label-inline"
                                >
                                  {dbStatic?.pay_on_arrival}
                                </label>
                              </div>  
                              {props.userData && 
                                props.userData?.role_id === 3 && (
                                  <div>
                                    <input
                                      type="radio"
                                      className="form-check-input"
                                      value="4"
                                      name="payment_type"
                                      id="wallet_pay"
                                      checked={values.payment_type == 4}
                                      onChange={(e) => {
                                        setFieldValue("payment_type", 4);
                                        setPayOnArraival(4);
                                      }}
                                    // onBlur={handleBlur}
                                    />
                                    <label
                                      htmlFor="wallet_pay"
                                      className="label-inline"
                                    >
                                      {dbStatic?.pay_using_wallet}
                                    </label>
                                  </div>
                                )}
                            </div>
                            {errors.payment_type && touched.payment_type ? (
                              <span className="inp-alrt error">
                                {errors.payment_type}
                              </span>
                            ) : null}
                            {values.payment_type == "1" && (
                              <form>
                                <div className="row">
                                  <div className="col-md-3">
                                    <div className="form-group">
                                      <label htmlFor="Email address">
                                        Cardholder's name <span>*</span>
                                      </label>
                                      <input
                                        type="text"
                                        id=""
                                        name="fullName"
                                        value={values.fullName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      />
                                      {errors.fullName && touched.fullName ? (
                                        <span className="inp-alrt error">
                                          {errors.fullName}
                                        </span>
                                      ) : null}
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="form-group">
                                      <label htmlFor="Email address">
                                        Card number <span>*</span>
                                      </label>
                                      <input
                                        type="text"
                                        id=""
                                        name="number"
                                        value={values.number}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      />
                                      {errors.number && touched.number ? (
                                        <span className="inp-alrt error">
                                          {errors.number}
                                        </span>
                                      ) : null}
                                      {/* <img
                                        className="frm-img-l"
                                        src="/assets/img/visa.svg"
                                        alt=""
                                      /> */}
                                    </div>
                                  </div>
                                  <div className="col-md-2">
                                    <div className="form-group">
                                      <label htmlFor="Email address">
                                        Expiry month<span>*</span>
                                      </label>
                                      <input
                                        type="text"
                                        id=""
                                        name="month"
                                        value={values.month}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      />
                                      {errors.month && touched.month ? (
                                        <span className="inp-alrt error">
                                          {errors.month}
                                        </span>
                                      ) : null}
                                    </div>
                                  </div>
                                  <div className="col-md-2">
                                    <div className="form-group">
                                      <label htmlFor="Email address">
                                        Expiry year<span>*</span>
                                      </label>
                                      <input
                                        type="text"
                                        id=""
                                        name="year"
                                        value={values.year}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      />
                                      {errors.year && touched.year ? (
                                        <span className="inp-alrt error">
                                          {errors.year}
                                        </span>
                                      ) : null}
                                    </div>
                                  </div>
                                  <div className="col-md-2">
                                    <div className="form-group">
                                      <label htmlFor="Email address">
                                        CVC <span>*</span>
                                      </label>
                                      <input
                                        type="tel"
                                        id=""
                                        name="cvv"
                                        value={values.cvv}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        maxLength="3"
                                        onPaste={(e) => {
                                          e.preventDefault();
                                          return false;
                                        }}
                                        onCopy={(e) => {
                                          e.preventDefault();
                                          return false;
                                        }}
                                      />

                                      <img
                                        className="frm-img-r"
                                        src="./assets/img/cvc.svg"
                                        alt=""
                                      />
                                      {errors.cvv && touched.cvv ? (
                                        <span className="inp-alrt error">
                                          {errors.cvv}
                                        </span>
                                      ) : null}
                                    </div>
                                  </div>
                                </div>
                              </form>
                            )}
                          </div>
                        ) : (
                          <div className=" pick-lcton car-rene-ad p-5">
                            <p className="mb-0">
                              {
                                dbStatic?.your_request_is_pending_admin_will_approve_it
                              }
                            </p>
                          </div> 
                        )}
                        <div className=" pick-lcton car-rene-ad p-5">
                          <h3 className="mb-0">
                            {staticData?.data?.term_and_condition}
                          </h3>
                          <p className="mb-0">
                            {staticData?.data?.by_clicking_book}{" "}
                            <Link target="_blank" href="/terms" legacyBehavior>
                              <a target="_blank" className="w-auto">
                                {staticData?.data?.term_and_condition}
                              </a>
                            </Link>
                          </p>

                          <label><input type="checkbox" name="term_check" onChange={(e) => {
                                        setFieldValue("term_check", 2);
                                      
                                      }} onClick={() => {setFieldValue("term_check", 2);setFieldTouched("term_check");}}/>I agree to the {staticData?.data?.term_and_condition}</label>
                          {errors.term_check ? (
                            <span className="inp-alrt error">
                              {errors.term_check}
                            </span>
                          ) : null}

                        </div>
                      </div>
                    </div>
                  </div>

                  {isFetching ? (
                    <div className="col-lg-3 col-md-12">
                      <section className="p-0 main-sta">
                        <div className="pick-lcton">
                          <Placeholder as="p" animation="glow">
                            <Placeholder
                              xs={12}
                              style={{
                                height: "60vh",
                                borderRadius: "25px",
                                textAlign: "center",
                                background: "#d5cece",
                              }}
                            />
                          </Placeholder>
                        </div>
                      </section>
                    </div>
                  ) : (
                    <PriceBreakdown
                      txn_id={txn_id}
                      carDetails={carDetails}
                      bookingData={bookingData}
                      handleRemoveCoupon={handleRemoveCoupon}
                      couponCode={couponCode}
                      setCouponCode={setCouponCode}
                      handleApplyCoupon={handleApplyCoupon}
                      applyCouponLoading={applyCouponLoading}
                      bookingLoading={bookingLoading}
                      couponError={couponError}
                      setCouponError={setCouponError}
                      isValid={isValid}
                      staticData={staticData}
                      checkterm={checkterm}
                    />
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </section>

      {showImptinfo && (
        <ImportantInfo
          showImptinfo={showImptinfo}
          handleCloseImptInfo={handleCloseImptInfo}
        />
      )}
    </>
  );
}

export const getServerSideProps = async (context) => {
  const { req, res, resolvedUrl } = context;

  const query = context.query ? context.query?.txn_id : null;

  let token = await req.cookies.origin_rent_token;
  let carId = await req.cookies.dealCarId;
  let searchData = await req.cookies.searchData;
  let userData = await req.cookies.origin_rent_userdata;

  if (!token) {
    if (res) {
      // res?.writeHead(302, {
      //   Location: `/login?callbackUrl=${resolvedUrl}`,
      // });
      // res?.end();
      return {
        redirect: {
          permanent: false,
          destination: `/login?callbackUrl=${resolvedUrl}`,
        },
      };
    } else {
      Router.push("/login");
    }
  } else {
    if (!carId) {
      if (res) {
        // res?.writeHead(302, {
        //   Location: `/login?callbackUrl=${resolvedUrl}`,
        // });
        // res?.end();
        return {
          redirect: {
            permanent: false,
            destination: `/`,
          },
        };
      } else {
        Router.push("/");
      }
    }
  }
  return {
    props: {
      txn_id: query ? query : null,
      host: context.req.headers.host || null,
      searchData: searchData ? JSON.parse(searchData) : null,
      userData: userData ? JSON.parse(userData) : null,
    },
  };
};
export default DealBooking;
