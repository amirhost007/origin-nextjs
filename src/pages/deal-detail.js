import { useState , useEffect } from "react";
import { useRouter } from "next/router";
import moment from "moment/moment";
import Link from "next/link";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import ListForm from "@/components/List";
import ImportantInfo from "@/components/List/ImportantInfo";
import { errorMsg, successMsg } from "@/components/Toast";
import {
  useGuest_loginMutation,
  useStaticContentQuery,
  useVehicalDetailsQuery,
} from "@/store/Slices/apiSlice";
import { getCookieData, setCookies , removeCookie , roundNum } from "@/utils/helper";
import { loggedIn, userDataUpdate } from "@/store/Slices/authSlice";
import { langUpdate } from "@/store/Slices/headerSlice";
import Header from "@/components/Header";
import Head from "next/head";

function DealDetail(props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showImptinfo, setImptinfo] = useState(false);
  const [showHeroSec, setShowHeroSec] = useState(false);
  const [isActive, setActive] = useState(false);
  const [extraDetails, setextraDetails] = useState('');
 
  const { currency, currency_symbol, lang } = useSelector(
    (state) => state.headData
  );
  
  useEffect(() => {
    removeCookie('selected_extra_details');
  }, [])

  const [guest_login, { isLoading: loginLoading }] = useGuest_loginMutation();
  const { data: staticData } = useStaticContentQuery(lang, {
    refetchOnMountOrArgChange: true,
  });
  const handleCloseImptInfo = () => setImptinfo(false);

  let transactionId = props?.txn_id;
  let token = props?.token;

  let dataForSearch =
    getCookieData("searchData") && JSON.parse(getCookieData("searchData"));
  let selectedCarId = getCookieData("dealCarId");

  if(props?.search_id != null){
    var search_id = props?.search_id;
    setCookies("inserted_id", props?.search_id);
  }else{
    var search_id = getCookieData("inserted_id");
  }

  if(props?.procode != null){
    var proCode = props?.procode;
    setCookies("proCode", proCode);
  }else{
    var proCode = getCookieData("proCode");
  }

  // var insertedId = getCookieData("inserted_id");
  // let proCode = getCookieData("proCode");

  let postData = {
    proCode: proCode ? proCode : "",
    car_id: selectedCarId ? selectedCarId : "",
    search_id: search_id ? search_id : "",
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
    unique_time: dataForSearch?.unique_time,
    without_credit_card: dataForSearch?.without_credit_card,
    ...(transactionId && { txn_id: transactionId }),
    ...(currency && { currency_id: currency }),
    ...(props.userData?.id && { user_id: props.userData?.id }),
    lang_id: lang,
  };

  const { data, isLoading } = useVehicalDetailsQuery(postData, {
    refetchOnMountOrArgChange: true,
  });


  const handleRedirect = async (pro_code) => {
    await setCookies("proCode", pro_code);
    router.reload();
  };

  let selected_pack; 
  if (getCookieData('proCode') !== '') {
      selected_pack = getCookieData('proCode');
  } else {
      selected_pack = 'BAS';
  }

  const setextraData_fun = async (res) =>{

    if(getCookieData('selected_extra_details')){
       var get_selected_extra_details = JSON.parse(getCookieData('selected_extra_details'));
       if(get_selected_extra_details.optionID == res.optionID){
         setActive(false);
         setextraDetails('');
         removeCookie('selected_extra_details');
       }else{
        setActive(res.optionID);
        setextraDetails(res);
        await setCookies("selected_extra_details", JSON.stringify(res));
       }
    }else{
      setActive(res.optionID);
      setextraDetails(res);
      await setCookies("selected_extra_details", JSON.stringify(res));
    }
  }
  
  let extra_rate = 0;
  if(extraDetails != ''){
     extra_rate = extraDetails.Daily_rate;
  }
  
  let signupurl;
  if(lang == 1){
    signupurl = '/en/login?callbackUrl=deal-booking';
  }else{
    signupurl = '/login?callbackUrl=deal-booking';
  }

  const goToBooking = async (id) => {

    if (id === 1) {
      if (data?.data?.car[0]?.supplier_id === 36) {
        return Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Full Protection not available for this car.",
        });
      }
    }
    await setCookies("withProtection", id);
    if (token) {
      setTimeout(() => {
        let url = data?.data?.txn_id
          ? `/deal-booking?txn_id=${data?.data?.txn_id}`
          : "/deal-booking";
        router.push(url);
      }, 100);
    } else {
      Swal.fire({
        title: "",
        // html: "<a href='" + signupurl + "'>Signup</a>",
        showCancelButton: true,
        icon: "warning",
        showCancelButton: true,
        // confirmButtonColor: "#e2731e",
        customClass: {
          confirmButton: "sweet-alert-yes-button-confirm",
          cancelButton: "sweet-alert-cancel-button-cancel",
        },
        buttonsStyling: false,
        cancelButtonText: "Login / Sign up",
        confirmButtonText: "Continue Booking As A Guest",
        reverseButtons: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            let response = await guest_login().unwrap();

            response.message && successMsg(response.message);

            await setCookies("origin_rent_token", response?.data?.token);
            await setCookies(
              "origin_rent_userdata",
              JSON.stringify(response?.data)
            );
            dispatch(
              langUpdate({
                lang: response?.data?.lang_id,
                lang_code: response?.data?.lang_code,
              })
            );
            dispatch(loggedIn(true));
            dispatch(userDataUpdate(response?.data));

            setTimeout(() => {
              let url = data?.data?.txn_id
                ? `/deal-booking?txn_id=${data?.data?.txn_id}`
                : "/deal-booking";
              router.push(url);
            }, 100);
          } catch (error) {
            let err = error?.data?.message
              ? error?.data?.message
              : error.message;
            errorMsg(err);
          }
        } else {
          router.push(`/login?callbackUrl=deal-booking`);
        }
      });
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

  const handleShowImportantInfo = () => {
    setImptinfo(true);
  };

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
      {loginLoading && <div className="list-loader" />}
      <section className="hero mt-35">
        <div className="container" data-aos="fade-up">
          <div className="bnr-img">
            <img src="/assets/img/bnr-img.png" alt="" />
          </div>
          {/* <div className="ovtr-box">
            <div
              classNameName={`srch-bx ${showHeroSec ? "hide_travel_details" : ""}`}
            >
              <div className="d-flex w-100 align-items-center">
                <div className="srch-dth ">
                  <h3>Heathrow Airport</h3>
                  <p>Mon, 2 Jan, 2023, 10:00</p>
                </div>
                <div className="col-lg-2 col-md-1 text-center">
                  <img src="/assets/img/errow-nxt.svg" alt="" />
                </div>
                <div className="srch-dth">
                  <h3>Málaga, Andalusia, Spain</h3>
                  <p>Thu, 5 Jan, 2023, 10:00</p>
                </div>
              </div>
              <div className="col-lg-5 col-md-3 text-end">
                <button className="edt-btn" onClick={() => setShowHeroSec(true)}>
                  Edit
                </button>
              </div>
            </div>

            <ListForm
              setShowHeroSec={setShowHeroSec}
              showHeroSec={showHeroSec}
            />
          </div> */}
          <div className="ovtr-box">
            <div
              className={`srch-bx ${showHeroSec ? "hide_travel_details" : ""}`}
            >
              <div className="d-flex w-100 align-items-center">
                <div className="srch-dth ">
                  <h3>{data?.data?.address?.pickup}</h3>
                  <p>
                    {moment(data?.data?.datetime?.pickup_datetime).format(
                      "DD MMM YYYY HH:mm"
                    )}
                  </p>
                </div>
                <div className="col-lg-2 col-md-1 text-center">
                  <img src="/assets/img/errow-nxt.svg" alt="" />
                </div>
                <div className="srch-dth">
                  <h3>{data?.data?.address?.dropoff}</h3>
                  <p>
                    {moment(data?.data?.datetime?.return_datetime).format(
                      "DD MMM YYYY HH:mm"
                    )}
                  </p>
                </div>
              </div>
              <div className="col-lg-5 col-md-3 text-end">
                <button
                  className="edt-btn"
                  onClick={() => setShowHeroSec(true)}
                >
                  {staticData?.data?.edit}
                </button>
              </div>
            </div>

            <ListForm
              setShowHeroSec={setShowHeroSec}
              showHeroSec={showHeroSec}
              isFetching={false}
              transactionId={data?.data?.txn_id ? data?.data?.txn_id : null}
            />
          </div>
        </div>
      </section>

      <main id="main">
        <section id="cr-lst" className="cr-lst pt-0">
          <div className="container" data-aos="fade-up">
            <div className="row">
              <div className="col-lg-9 col-md-12">
                <div className="car-pr-sct shadow-none">
                  <div className="row">
                    {data?.data?.car?.length > 0 && (
                      <>
                        <div className="col-md-3">
                          <img
                            className="img-fluid"
                            src={
                              data?.data?.car[0]?.car_image
                                ? data?.data?.car[0]?.car_image
                                : "/assets/img/car-9.png"
                            }
                            alt=""
                          />
                        </div>
                        <div className="col-md-9">
                          <div className="cr-dtl">
                            <h4>{data?.data?.car[0]?.car_name}</h4>
                            {/* <p>or similar estate car</p> */}
                            <div className="spciftn border-0 ">
                              <ul>
                                {data?.data?.car[0]?.car_seat && (
                                  <li>
                                    <img
                                      className="img-fluid"
                                      src="/assets/img/car-seat.svg"
                                      alt=""
                                    />{" "}
                                    {data?.data?.car[0]?.car_seat} seats
                                  </li>
                                )}
                                {data?.data?.car[0]?.car_transmission && (
                                  <li>
                                    <img
                                      className="img-fluid"
                                      src="/assets/img/gear.svg"
                                      alt=""
                                    />{" "}
                                    {data?.data?.car[0]?.car_transmission}
                                  </li>
                                )}
                                {data?.data?.car[0]?.luggageLarge && (
                                  <li>
                                    <img
                                      className="img-fluid"
                                      src="/assets/img/sport-bag.svg"
                                      alt=""
                                    />{" "}
                                    {data?.data?.car[0]?.luggageLarge} Large
                                    bags
                                  </li>
                                )}
                                {data?.data?.car[0]?.luggageMed && (
                                      <li>
                                        <img
                                          className="img-fluid"
                                          src="/assets/img/camera-bag.svg"
                                          alt=""
                                        />
                                        {data?.data?.car[0]?.luggageMed}{" "}
                                        {"Medium bags"}
                                      </li>
                                    )}
                                {data?.data?.car[0]?.luggageSmall && (
                                  <li>
                                    <img
                                      className="img-fluid"
                                      src="/assets/img/camera-bag.svg"
                                      alt=""
                                    />{" "}
                                    {data?.data?.car[0]?.luggageSmall} Small bag
                                  </li>
                                )}
                                {data?.data?.car[0]?.car_mileage && (
                                  <li>
                                    <img
                                      className="img-fluid"
                                      src="/assets/img/speedometer.svg"
                                      alt=""
                                    />{" "}
                                    {data?.data?.car[0]?.car_mileage}
                                  </li>
                                )}
                              </ul>
                            </div>
                            <h5>
                              <img src="/assets/img/location.svg" alt="" />{" "}
                              {data?.data?.address?.pickup}{" "}
                              {/* <span>- Shuttle Bus</span> */}
                            </h5>
                          </div>
                        </div>
                      </>
                    )}

                <div className="accordion" id="accordionExample">
                  {
                    data?.data?.car[0].car_product.BAS && (
                
                  <div className="accordion-item">
                  <h2 className="accordion-header" id="headingOne">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                      Step 1: Choose your package
                    </button>
                  </h2>
                  <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                    <div className="accordion-body">
                      <div className="">
                      <div className="row">
                                {
                                  data?.data?.car[0].car_product.BAS && (
                                    <>
                                    <div className="col-md-4">
                                        <div className="price-cards">
                                        <div className="ml-4 d-block">
                                            <div className="price-card h-100 row-price-card">
                                              <h5 className="title text-center"><img src="https://booking.greenmotion.com/images/vehicle-listing/basic-badge.svg" alt=""/></h5>
                                              <ul className="product-details mb-4 mt-4">
                                                  <li><span className="w-8 text-center icon">

                                                  <span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span> <span>
                                                  Excess liability <span><strong> {currency_symbol} {data?.data?.car[0].car_product.BAS.excess}</strong></span></span>
                                                  </li>

                                                <li><span className="w-8 text-center icon"><span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span> <span>
                                                Security deposit
                                                <span><strong> {currency_symbol} {data?.data?.car[0].car_product.BAS.deposit}</strong></span></span></li>

                                                <li><span className="w-8 text-center icon">
                                                  <span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span>
                                                  <span>Fuel policy Like for Like ({data?.data?.car[0].car_product.BAS.fuelpolicy})</span>
                                                </li>

                                                <li><span className="w-8 text-center icon">
                                                  <span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span>
                                                  <span>{data?.data?.car[0].car_product.BAS.mileage} free km per rental</span>
                                                </li>

                                                <li><span className="w-8 text-center icon">
                                                  <span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-x.svg" /></span></span>
                                                  <span>Non refundable</span>
                                                </li>
                                                <li><span className="w-8 text-center icon">
                                                  <span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-x.svg" /></span></span>
                                                  <span>Non amendable</span>
                                                </li>

                                              </ul>
                                               <p style={{'textAlign':'center'}}><strong>{currency_symbol} {data?.data?.car[0].car_product.BAS.grandTotal ? roundNum(data?.data?.car[0].car_product.BAS.grandTotal): 0}</strong></p>
                                               {selected_pack === 'BAS' ? (
                                                    <button type="button" className="btn_book disable_book_btn">Selected</button>
                                                ) : (
                                                    <button className="btn_book" onClick={() => handleRedirect('BAS')}>Select</button>
                                                )}

                                            </div>
                                        </div>
                                      </div> 
                                      </div>
                                    </>
                                  )
                                }
                                
                                {
                                  data?.data?.car[0].car_product.PLU && (
                                    <>
                                    <div className="col-md-4">
                                        <div className="price-cards">
                                        <div className="ml-4 d-block">
                                            <div className="price-card h-100 row-price-card">
                                              <h5 className="title text-center"><img src="/assets/img/premium-plus-badge4.svg" alt=""/></h5>
                                              <ul className="product-details mb-4 mt-4">
                                                  <li><span className="w-8 text-center icon">

                                                  <span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span> <span>
                                                  Excess liability <span><strong> {currency_symbol} {data?.data?.car[0].car_product.PLU.excess}</strong></span></span>
                                                  </li>

                                                <li><span className="w-8 text-center icon"><span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span> <span>
                                                Security deposit
                                                <span><strong> {currency_symbol} {data?.data?.car[0].car_product.PLU.deposit}</strong></span></span></li>

                                                <li><span className="w-8 text-center icon">
                                                  <span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span>
                                                  <span>Fuel policy Like for Like ({data?.data?.car[0].car_product.PLU.fuelpolicy})</span>
                                                </li>

                                                <li><span className="w-8 text-center icon">
                                                  <span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span>
                                                  <span>{data?.data?.car[0].car_product.PLU.mileage} free km per rental</span>
                                                </li>

                                                <li><span className="w-8 text-center icon">
                                                  <span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span>
                                                  <span>Cancellation in line with <span className="tc_popup" onClick={handleShowImportantInfo} >T&Cs</span></span>
                                                </li>

                                              </ul>

                                              <p style={{'textAlign':'center'}}><strong>{currency_symbol} {data?.data?.car[0].car_product.PLU.grandTotal ? roundNum(data?.data?.car[0].car_product.PLU.grandTotal): 0}</strong></p>
                                              

                                              {selected_pack === 'PLU' ? (
                                                    <button type="button" className="btn_book disable_book_btn">Selected</button>
                                                ) : (
                                                    <button className="btn_book" onClick={() => handleRedirect('PLU')}>Select</button>
                                                )}

                                            </div>
                                        </div>
                                      </div> 
                                      </div>
                                    </>
                                  )
                                }

                                {
                                  data?.data?.car[0].car_product.PRE && (
                                    <>
                                    <div className="col-md-4" style={{'marginTop':'10px'}}>
                                        <div className="price-cards">
                                        <div className="ml-4 d-block">
                                            <div className="price-card h-100 row-price-card">
                                              <h5 className="title text-center"><img src="/assets/img/premium-plus-badge3.svg" alt=""/></h5>
                                              <ul className="product-details mb-4 mt-4">
                                                  <li><span className="w-8 text-center icon">

                                                  <span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span> <span>
                                                  Excess liability <span><strong> {currency_symbol} {data?.data?.car[0].car_product.PRE.excess}</strong></span></span>
                                                  </li>

                                                <li><span className="w-8 text-center icon"><span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span> <span>
                                                Security deposit
                                                <span><strong> {currency_symbol} {data?.data?.car[0].car_product.PRE.deposit}</strong></span></span></li>

                                                <li><span className="w-8 text-center icon">
                                                  <span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span>
                                                  <span>Fuel policy Like for Like ({data?.data?.car[0].car_product.PRE.fuelpolicy})</span>
                                                </li>

                                                <li><span className="w-8 text-center icon">
                                                  <span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span>
                                                  <span>{data?.data?.car[0].car_product.PRE.mileage} free km per rental</span>
                                                </li>

                                                <li><span className="w-8 text-center icon">
                                                  <span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span>
                                                  <span>Cancellation in line with <span className="tc_popup" onClick={handleShowImportantInfo}  >T&Cs</span></span>
                                                </li>

                                                <li><span className="w-8 text-center icon">
                                                  <span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span>
                                                  <span>Glass and tyres covered</span>
                                                </li>
                                                

                                              </ul>

                                              <p style={{'textAlign':'center'}}><strong>{currency_symbol} {data?.data?.car[0].car_product.PRE.grandTotal ? roundNum(data?.data?.car[0].car_product.PRE.grandTotal): 0}</strong></p>  
                                                

                                              {selected_pack === 'PRE' ? (
                                                    <button type="button" className="btn_book disable_book_btn">Selected</button>
                                                ) : (
                                                    <button className="btn_book" onClick={() => handleRedirect('PRE')}>Select</button>
                                                )}

                                            </div>
                                        </div>
                                      </div> 
                                      </div>
                                    </>
                                  )
                                }

                                {
                                  data?.data?.car[0].car_product.PMP && (
                                    <>
                                    <div className="col-md-4" style={{'marginTop':'10px'}}>
                                        <div className="price-cards">
                                        <div className="ml-4 d-block">
                                            <div className="price-card h-100 row-price-card">
                                              <h5 className="title text-center"><img src="https://booking.greenmotion.com/images/vehicle-listing/premium-plus-badge.svg" alt=""/></h5>
                                              <ul className="product-details mb-4 mt-4">
                                                  <li><span className="w-8 text-center icon">

                                                  <span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span> <span>
                                                  Excess liability <span><strong> {currency_symbol} {data?.data?.car[0].car_product.PMP.excess}</strong></span></span>
                                                  </li>

                                                <li><span className="w-8 text-center icon"><span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span> <span>
                                                Security deposit
                                                <span><strong> {currency_symbol} {data?.data?.car[0].car_product.PMP.deposit}</strong></span></span></li>

                                                <li><span className="w-8 text-center icon">
                                                  <span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span>
                                                  <span>Fuel policy Like for Like ({data?.data?.car[0].car_product.PMP.fuelpolicy}) </span>
                                                </li>

                                                <li><span className="w-8 text-center icon">
                                                  <span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span>
                                                  <span>{data?.data?.car[0].car_product.PMP.mileage} free km per rental</span>
                                                </li>

                                                <li><span className="w-8 text-center icon">
                                                  <span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span>
                                                  <span>Cancellation in line with <span className="tc_popup" onClick={handleShowImportantInfo} >T&Cs</span></span>
                                                </li>

                                                <li><span className="w-8 text-center icon">
                                                  <span className="inline w-6"><img svg-inline="" src="https://booking.greenmotion.com/images/svgs/checkbox-border-ticked-alt.svg" /></span></span>
                                                  <span>Glass and tyres covered</span>
                                                </li>


                                              </ul>

                                              <p style={{'textAlign':'center'}}><strong>{currency_symbol} {data?.data?.car[0].car_product.PMP.grandTotal ? roundNum(data?.data?.car[0].car_product.PMP.grandTotal): 0}</strong></p>
                                              
                                              {selected_pack === 'PMP' ? (
                                                    <button type="button" className="btn_book disable_book_btn">Selected</button>
                                                ) : (
                                                    <button className="btn_book" onClick={() => handleRedirect('PMP')}>Select</button>
                                                )}

                                            </div>
                                        </div>
                                      </div> 
                                      </div>
                                    </>
                                  )
                                }  
                              </div>
                      </div>
                    </div>
                  </div>
                </div>
                  
                    )
                  }
                
                {
                   data?.data?.extraData != '' && (
                      <div className="accordion-item">
                        <h2 className="accordion-header" id="headingTwo">
                          <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                            Step 2: Choose your additional options
                          </button>
                        </h2>
                        <div id="collapseTwo" className="accordion-collapse collapse show" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                          <div className="accordion-body">
                            <div>
                              <ul className="extra_ul">
                                  {data?.data?.extraData?.extra?.map((res, i) => (
                                        <li className={isActive == res.optionID && 'active'}  onClick={() => setextraData_fun(res)}>
                                          <div>{res.Name}</div>
                                          <div>{currency_symbol} {res.Total_for_this_booking}</div>
                                        </li>
                                  ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                  )
                }
                
                </div>
                        
                    
                    <div className="col-md-12 car-onr">
                      <div className="enqry">
                        <div className="wch-lg" style={{ borderRight: "none" }}>
                          {data?.data?.car[0]?.supplier_id == "35" ? (
                            <img src="/assets/img/green_motion.png" alt="" />
                          ) : (
                            <img src={data?.data?.car[0]?.vendor_logo} alt="" />
                          )}
                        </div>
                        {/* <div className="rte-tle">
                          <h3>{data?.data?.car[0]?.vendor_name}</h3>
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
                        <a className="me-4" onClick={handleShowImportantInfo}>
                          <img src="/assets/img/info.svg" alt="" /> Important
                          info
                        </a>
                      </div> */}
                    </div>
                  </div>
                </div>
                {/* <div className="car-choice">
                  <h3>Great choice!</h3>
                  <ul className="inline-ul">
                    <li>
                      <img src="/assets/img/left-eorw.svg" alt="" /> Customer
                      rating: 6.4 / 10
                    </li>
                    <li>
                      <img src="/assets/img/left-eorw.svg" alt="" /> Clean cars
                    </li>
                    <li>
                      <img src="/assets/img/left-eorw.svg" alt="" /> Most
                      popular fuel policy{" "}
                    </li>
                    <li>
                      <img src="/assets/img/left-eorw.svg" alt="" /> Free
                      Cancellation{" "}
                    </li>
                    <li>
                      <img src="/assets/img/left-eorw.svg" alt="" />{" "}
                      Well-maintained cars{" "}
                    </li>
                  </ul>
                  <h3 className="mt-4">Great choice!</h3>
                  <div className="row">
                    <div className="col-md-6">
                      <ul>
                        <li>
                          <img src="./assets/img/left-eorw.svg" alt="" /> Free
                          cancellation up to 48 hours before pick-up
                        </li>
                        <li>
                          <img src="./assets/img/left-eorw.svg" alt="" /> Theft
                          Protection with ₹1,19,917 excess
                        </li>
                      </ul>
                    </div>
                    <div className="col-md-6">
                      <ul>
                        <li>
                          <img src="./assets/img/left-eorw.svg" alt="" />{" "}
                          Collision Damage Waiver with ₹1,19,917 excess{" "}
                        </li>
                        <li>
                          <img src="./assets/img/left-eorw.svg" alt="" /> 300
                          miles per rental
                        </li>
                      </ul>
                    </div>
                  </div>
                </div> */}
                <div className="insur-policy">
                  <h4>{data?.data?.insurance?.insurance_title}</h4>
                  <p>
                  <div dangerouslySetInnerHTML={{__html: data?.data?.insurance?.insurance_short_description}}></div>
                    {/* {data?.data?.insurance?.insurance_short_description}
                    <br /> */}
                    {/* <br />
                    T&Cs and standard exclusions apply. Please read:{" "}
                    <Link href={"/privacy-policy"} legacyBehavior>
                      <a>Policy </a>
                    </Link>
                    and
                    <Link href={"/terms"} legacyBehavior>
                      <a> Terms</a>
                    </Link> */}
                  </p>
                </div>    
              </div>
              <div className="col-lg-3 col-md-12">
                <div className="pick-lcton">
                  <h3>{staticData?.data?.pickup_and_dropoff}</h3>
                  <div className="col-md-12 d-flex align-items-center">
                    <span>
                      <img
                        src="assets/img/from-to.svg"
                        alt=""
                        className="img-fluid"
                      />
                    </span>
                    <div className="loctn">
                      <h4>
                        <span>{staticData?.data?.pickup_point}</span>
                        {data?.data?.address?.pickup}
                        <span className="mt-1">
                          {moment(data?.data?.datetime?.pickup_datetime).format(
                            "DD MMM YYYY HH:mm"
                          )}
                        </span>
                      </h4>
                      <hr />
                      <img
                        className="up-dn-lcton"
                        src="./assets/img/lcton-chnge.svg"
                        alt=""
                      />
                      <h4>
                        <span>{staticData?.data?.dropoff_point}</span>
                        {data?.data?.address?.dropoff}
                        <span className="mt-1">
                          {moment(data?.data?.datetime?.return_datetime).format(
                            "DD MMM YYYY HH:mm"
                          )}
                        </span>
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="pick-lcton">
                  <h3>{staticData?.data?.price_breakdown}</h3>
                  <p>
                    {staticData?.data?.car_rental_price}{" "}
                    <span>
                      {currency_symbol +
                        "" +
                        Math.round(
                          data?.data?.car[0]?.car_total_pricing * 100
                        ) /
                          100}
                    </span>
                  </p>
                  <hr />
                  {extra_rate > 0 ? (
                    <div>
                      <p className="prm-aply">
                        Extra <span>{currency_symbol + "" + Math.round(extra_rate * 100) / 100}</span>
                      </p>
                      <hr />
                    </div>
                  ) : null}
                  
                  <p>
                    {staticData?.data?.price_for +
                      " " +
                      data?.data?.car[0]?.days +
                      " " + 
                      staticData?.data?.days}
                    :{" "}
                    <span>
                      
                      {currency_symbol && data?.data?.car && data.data.car[0] &&
                          currency_symbol + " " + Math.round((parseFloat(data.data.car[0].grandTotal) + parseFloat(extra_rate)) * 100) / 100}
                          
                    </span>
                  </p>
                  <hr />

                  

                  {/* <p className="prm-aply">
                    <input
                      type="text"
                      name=""
                      id=""
                      placeholder="Coupon Code"
                    />{" "}
                    <span>
                      <button>Apply</button>
                    </span>
                  </p> */}

                  <div className="book-protection">
                    {/* <Link href="/deal-booking" legacyBehavior> */}
                    <a className="fil-btn" onClick={() => goToBooking(0)}>
                      {staticData?.data?.go_to_book}{" "}
                    </a>
                    {/* </Link> */}
                    {/* <a className="fil-btn" onClick={() => goToBooking(1)}>
                      {staticData?.data?.go_to_book}{" "}
                      <span>{staticData?.data?.with_full_protection}</span>
                    </a> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      {showImptinfo && (
        <ImportantInfo
          showImptinfo={showImptinfo}
          popupdata={data?.data?.term_conditions_data}
          handleCloseImptInfo={handleCloseImptInfo}
        />
      )}
    </>
  );
}

export const getServerSideProps = async (context) => {
  const { req, res, resolvedUrl } = context;
  const query = context.query ? context.query?.txn_id : null;
  const procode = context.query ? context.query?.procode : null;
  const search_id = context.query ? context.query?.search_id : null;
  let userData = await req.cookies.origin_rent_userdata;
  let token = await req.cookies.origin_rent_token;

  return {
    props: {
      txn_id: query ? query : null,
      token: token ? token : null,
      procode: procode ? procode : null,
      search_id: search_id ? search_id : null,
      userData: userData ? JSON.parse(userData) : null,
    },
  };
};
export default DealDetail;
