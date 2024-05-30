import { useRouter } from "next/router";
import { useState } from "react";
import { useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import moment from "moment";
import DatePicker from "react-datepicker";
import {
  useAllLocaltionQuery,
  useGetHomeDataQuery,
  useStaticContentQuery,
  useTrackApiQuery,
} from "@/store/Slices/apiSlice";
import LocalSupplierFirst from "../Modal/LocalSupplierFirst";
import RBmodal from "../Modal/RBmodal";
import { setCookies, uniqueNumber } from "@/utils/helper";
import AutoComplete from "../AutoComplete";
import useComponentVisible from "@/Hooks/useComponentVisible";

function HeroSection({ serverData }) {
  const { locale } = useRouter();
  const router = useRouter();
  const [show, setShow] = useState(false);
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(true);
  const {
    ref: refDrop,
    isComponentVisible: dropVisible,
    setIsComponentVisible: setIsComponentVisible1,
  } = useComponentVisible(true);
  const handleClose = () => setShow(false);
  const { userData } = useSelector((state) => state.auth);
  const { lang } = useSelector((state) => state.headData);

  const { data: home } = useGetHomeDataQuery(
    { lang, role_id: userData?.role_id },
    { refetchOnMountOrArgChange: true }
  );
  const { data: staticData } = useStaticContentQuery(lang, {
    refetchOnMountOrArgChange: true,
  });
  const [pick_up, setPickUp] = useState("");
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [pickUpErr, setPickUpErr] = useState(false);
  const [pickUpSearch, setPickUpSearch] = useState(false);
  const [dropOffSearch, setDropOffSearch] = useState(false);
  const [drop_off, setDropOff] = useState("");
  const { data: location } = useAllLocaltionQuery();
  const { data: trackData } = useTrackApiQuery();
  // const [searchVehical, { isLoading: searchLoading }] =
  //   useSearchVehicalMutation();

  const locationFilter = location?.data?.filter((res) => {
    if (pick_up) {
      if (res.name?.toLowerCase().includes(pick_up?.toLowerCase())) {
        return res;
      } else if (
        res.country_name?.toLowerCase().includes(pick_up?.toLowerCase())
      ) {
        return res;
      }
    } else {
      return res;
    }
  });
  const locationFilterDropUp = location?.data?.filter((res) => {
    if (drop_off) {
      if (res.name?.toLowerCase().includes(drop_off?.toLowerCase())) {
        return res;
      } else if (
        res.country_name?.toLowerCase().includes(drop_off?.toLowerCase())
      ) {
        return res;
      }
    } else {
      return res;
    }
  });

  const handlChangePickUp = (value) => {
    setPickUpSearch(true);
    setIsComponentVisible(true);
    setDropOffSearch(false);
    setPickUp(value);
    setPickUpErr(false);
  };
  const handlChangeDropUp = (value) => {
    setDropOffSearch(true);
    setIsComponentVisible1(true);
    setPickUpSearch(false);
    setDropOff(value);
  };
  const handlePickUpLocation = (data) => {
    setPickUp(data);
    setPickUpErr(false);
    setPickUpSearch(false);
  };
  const handleDropUpLocation = (data) => {
    setDropOff(data);

    setDropOffSearch(false);
  };

  const initialState = {
    // pick_up: "",
    // drop_off: "",
    pickup_datetime: new Date(
      moment().add(1, "days").format("YYYY-MM-DD HH:mm")
    ),
    pick_up_time: moment().add(2, "hours").format("HH:mm"),
    return_datetime: new Date(
      moment().add(2, "days").format("YYYY-MM-DD HH:mm")
    ),
    drop_off_time: moment().add(2, "hours").format("HH:mm"),

    without_credit_card: false,
    driver_age: "",
    different_location: false,
    driver_30_60: true,
  };
  const supplySchema = Yup.object().shape({
    // pick_up: Yup.string().required("Field is required"),
    pickup_datetime: Yup.string().required("Field is required"),
    pick_up_time: Yup.string().required("Field is required"),
    drop_off_time: Yup.string().required("Field is required"),
    // drop_off: Yup.string().required("Field is required"),
    driver_30_60: Yup.boolean(),
    driver_age: Yup.number()
      .when("driver_30_60", {
        is: false,
        then: Yup.number()
          .typeError("Age must be a number")
          .required("Field is required"),
      })
      .min(30, "Age must be greater than 30")
      .max(65, "Age must be less than 65"),
    different_location: Yup.boolean(),
    without_credit_card: Yup.boolean(),
    // drop_off: Yup.string().when("different_location", {
    //   is: true,
    //   then: Yup.string().required("Field is required"),
    // }),
  });

  const handleSubmit = async (values, {}) => {
    setLoadingBtn(true);
    if (locationFilter.length < 1) {
      setPickUp("");
      setLoadingBtn(false);
      return;
    }
    if (locationFilterDropUp?.length < 1) {
      setDropOff("");
      setLoadingBtn(false);
      return;
    }

    if (pick_up) {
      const data = {
        pickup_location: pick_up,
        return_location: drop_off,
        pickup_datetime: moment(values.pickup_datetime).format(
          "YYYY-MM-DD HH:mm"
        ),
        return_datetime: moment(values.return_datetime).format(
          "YYYY-MM-DD HH:mm"
        ),
        age: values.driver_30_60 ? 40 : values.driver_age,
        without_credit_card: values.without_credit_card === true ? 1 : 0,
        unique_time: uniqueNumber(),
        user_currency_code: trackData?.currency,
      };

      // const response = await searchVehical(data).unwrap();
      await setCookies(
        "searchData",
        JSON.stringify({
          ...data,
          different_location: values.different_location,
          driver_30_60: values.driver_30_60,
        })
      );
      setTimeout(() => {
        router.push("/list");
        setLoadingBtn(false);
      }, 300);
    } else {
      setPickUpErr(true);
      setLoadingBtn(false);
    }
  };

  return (
    <>
      <section
        id="hero"
        style={{
          background: `url(${
            home?.data?.setting?.main_banner
              ? home?.data?.setting?.main_banner
              : serverData?.setting?.main_banner
          })no-repeat`,
        }}
        className="d-flex align-items-center"
      >
        <div className="container">
          <div className="row">
            <div
              className="col-lg-12 d-flex flex-column text-center pt-4 pt-lg-0 order-2 order-lg-1"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <h1>
                {home?.data?.setting?.main_banner_title
                  ? home?.data?.setting?.main_banner_title
                  : serverData?.setting?.main_banner_title}
              </h1>
              <p>
                {home?.data?.setting?.main_banner_shor_description
                  ? home?.data?.setting?.main_banner_shor_description
                  : serverData?.setting?.main_banner_shor_description}
                {/* <a href="">right here</a> */}
              </p>
              <Formik
                initialValues={initialState}
                validationSchema={supplySchema}
                onSubmit={handleSubmit}
              >
                {({
                  errors,
                  touched,
                  values,
                  handleChange,
                  handleBlur,
                  setFieldValue,
                }) => (
                  <Form className="search-property-1 " autoComplete="off">
                    <div className="row">
                      <div className="col-md d-flex posttr">
                        <div className="form-group">
                          <div className="icon">
                            <img
                              src="assets/img/location.svg"
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                          <div
                            className="form-field position-relative"
                            ref={ref}
                          >
                            <label htmlFor="pickuplocation">
                              {/* <FormattedMessage
                                id="PICK_UP_LOCATION"
                                values={{ b: (chunks) => <b>{chunks}</b> }}
                              /> */}
                              {staticData?.data?.pick_up_location}
                            </label>
                            <input
                              type="text"
                              id="pickuplocation"
                              className="form-control"
                              placeholder=""
                              name="pick_up"
                              value={pick_up}
                              onChange={(e) =>
                                handlChangePickUp(e.target.value)
                              }
                              // onBlur={handleBlur}
                            />
                            {pickUpSearch &&
                              isComponentVisible &&
                              locationFilter?.length > 0 && (
                                <AutoComplete
                                  locations={locationFilter}
                                  handlePickUpLocation={handlePickUpLocation}
                                />
                              )}
                          </div>
                        </div>
                        {pickUpErr ? (
                          <div className="rd-slrt-s">
                            <FormattedMessage
                              id="PICK_UP_LOCATION_REQUIRED"
                              values={{ b: (chunks) => <b>{chunks}</b> }}
                            />
                          </div>
                        ) : null}
                      </div>
                      <div className="col-md d-flex">
                        <div className="form-group ">
                          <div className="icon">
                            <img
                              src="assets/img/calendar.svg"
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                          <div className="form-field">
                            <label htmlFor="PICK_UP_DATE">
                              {staticData?.data?.pick_up_date}
                            </label>

                            <div className="d-flex mbl-frm">
                              <DatePicker
                                locale={locale}
                                showTimeSelect
                                name="pickup_datetime"
                                placeholder="dd/mm/yyy HH:mm"
                                className="form-control clickable input-md"
                                selected={
                                  values.pickup_datetime
                                    ? new Date(values.pickup_datetime)
                                    : ""
                                }
                                onChange={(date) => {
                                  setFieldValue(
                                    "pickup_datetime",
                                    moment(date).format("YYYY-MM-DD HH:mm")
                                  );
                                  setFieldValue(
                                    "return_datetime",
                                    moment(date, "MM-DD-YYY HH:mm")
                                      .add(1, "days")
                                      .format("YYYY-MM-DD HH:mm")
                                  );
                                }}
                                dateFormat="MMMM d, yyyy HH:mm"
                                timeFormat="HH:mm"
                                minDate={new Date()}
                                onKeyDown={(e) => {
                                  e.preventDefault();
                                }}
                              />
                            </div>
                          </div>
                          {errors.pickup_datetime ? (
                            <div className="rd-slrt-s">
                              {staticData?.data?.field_is_required}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div
                        className={`col-md  ${
                          values.different_location ? "d-flex" : "d-none"
                        }`}
                      >
                        <div className="form-group position-relative">
                          <div className="icon">
                            <img
                              src="/assets/img/Icon.svg"
                              alt=""
                              className="img-fluid"
                            />
                          </div>

                          <div className="form-field" ref={refDrop}>
                            <label htmlFor="DROP_UP_LOCATION">
                              {staticData?.data?.drop_up_location}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="DROP_UP_LOCATION"
                              placeholder=""
                              name="drop_off"
                              value={drop_off}
                              // onChange={handleChange}
                              onChange={(e) =>
                                handlChangeDropUp(e.target.value)
                              }
                              // onBlur={handleBlur}
                            />
                            {dropOffSearch &&
                              dropVisible &&
                              locationFilterDropUp?.length > 0 && (
                                <AutoComplete
                                  locations={locationFilterDropUp}
                                  handlePickUpLocation={handleDropUpLocation}
                                />
                              )}
                          </div>
                          {errors.drop_off && touched.drop_off ? (
                            <div className="rd-slrt-s">{errors.drop_off}</div>
                          ) : null}
                        </div>
                      </div>

                      <div className="col-md d-flex">
                        <div className="form-group ">
                          <div className="icon">
                            <img
                              src="/assets/img/calendar.svg"
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                          <div className="form-field">
                            <label htmlFor="DROP_OFF_DATE">
                              {staticData?.data?.drop_off_date}
                            </label>
                            <div className="d-flex mbl-frm">
                              <DatePicker
                                locale={locale}
                                showTimeSelect
                                name="return_datetime"
                                placeholder="dd/mm/yyy HH:mm"
                                className="form-control clickable input-md"
                                selected={
                                  values.return_datetime
                                    ? new Date(values.return_datetime)
                                    : ""
                                }
                                onChange={(date) => {
                                  setFieldValue(
                                    "return_datetime",
                                    moment(date).format("YYYY-MM-DD HH:mm")
                                  );
                                }}
                                dateFormat="MMMM d, yyyy HH:mm"
                                timeFormat="HH:mm"
                                minDate={
                                  new Date(
                                    moment(
                                      values.pickup_datetime,
                                      "YYYY-MM-DD HH:mm"
                                    )
                                      .add(1, "days")
                                      .format("YYYY-MM-DD HH:mm")
                                  )
                                }
                                onKeyDown={(e) => {
                                  e.preventDefault();
                                }}
                              />

                              {/* <input
                                id="dp2 DtChkOut"
                                type="date"
                                className="form-control clickable input-md"
                                placeholder="dd/mm/yyyy"
                                name="drop_off_date"
                                value={values.drop_off_date}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                min={moment(
                                  values.pickup_datetime,
                                  "YYYY-MM-DD"
                                )
                                  .add(1, "days")
                                  .format("YYYY-MM-DD")}
                              />

                              <input
                                type="time"
                                className="form-control time-sec"
                                name="drop_off_time"
                                value={values.drop_off_time}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              /> */}
                            </div>
                          </div>
                          {errors.return_datetime && touched.return_datetime ? (
                            <div className="rd-slrt-s">
                              {errors.return_datetime}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="row align-items-center">
                      <div className="col-md-12">
                        <div className="d-flex justify-content-between">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="defaultCheck1"
                              // checked={dropOffEnable}
                              // onChange={(e) =>
                              //   setDropOffEnable(e.target.checked)
                              // }
                              name="different_location"
                              checked={values.different_location}
                              onChange={handleChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="defaultCheck1"
                            >
                              {
                                staticData?.data
                                  ?.drop_car_off_at_diffenet_location
                              }
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="driver_30_60"
                              name="driver_30_60"
                              checked={values.driver_30_60}
                              onChange={handleChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="driver_30_60"
                            >
                              {staticData?.data?.driver_aged_30_35}
                            </label>
                            {!values.driver_30_60 && (
                              <>
                                <input
                                  type="text"
                                  className="form-control adre-inn"
                                  placeholder="Age"
                                  name="driver_age"
                                  // minLength="2"
                                  // maxLength="2"
                                  value={values.driver_age}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  style={{ width: "60px" }}
                                />
                                {errors.driver_age && touched.driver_age ? (
                                  <div
                                    className="error"
                                    style={{ color: "red" }}
                                  >
                                    {errors.driver_age}
                                  </div>
                                ) : null}
                              </>
                            )}
                          </div>
                          <div className="d-flex justify-content-between">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                defaultValue=""
                                id="WITHOUT_CREDIT_CARD"
                                name="without_credit_card"
                                checked={values.without_credit_card}
                                onChange={handleChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="WITHOUT_CREDIT_CARD"
                              >
                                {staticData?.data?.without_credit_card}
                              </label>
                              {errors.without_credit_card &&
                              touched.without_credit_card ? (
                                <div className="error" style={{ color: "red" }}>
                                  {errors.without_credit_card}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* <div className="offset-md-1 col-md-3">
                        <div className="mt-3">
                          <div className="form-group">
                            <div className="icon">
                              <img
                                src="/assets/img/tag-1.svg"
                                alt=""
                                className="img-fluid"
                              />
                            </div>
                            <div className="form-field">
                              <label htmlFor="#">
                                <FormattedMessage
                                  id="APPLY_COUPON"
                                  values={{ b: (chunks) => <b>{chunks}</b> }}
                                />
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="ZNT236G"
                              />
                            </div>
                          </div>
                        </div>
                      </div> */}
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary submit"
                      disabled={loadingBtn}
                    >
                      {loadingBtn
                        ? staticData?.data?.loading
                        : staticData?.data?.search}
                    </button>
                  </Form>
                )}
              </Formik>
              <button className="loks-subly" onClick={() => setShow(true)}>
                {staticData?.data?.looking_for_local_customized_deals}
              </button>
            </div>
          </div>
        </div>
      </section>
      {show && (
        <RBmodal show={show} handleClose={handleClose}>
          <LocalSupplierFirst handleCloseFirst={handleClose} />
        </RBmodal>
      )}
    </>
  );
}

export default HeroSection;
