import { useRouter } from "next/router";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import { useIntl } from "react-intl";
import { getCookieData, setCookies, uniqueNumber } from "@/utils/helper";
import {
  useAllLocaltionQuery,
  useStaticContentQuery,
  useTrackApiQuery,
} from "@/store/Slices/apiSlice";
import AutoComplete from "../AutoComplete";
import { listSearching } from "@/store/Slices/headerSlice";
import useComponentVisible from "@/Hooks/useComponentVisible";

function ListForm({ setShowHeroSec, showHeroSec, isFetching, transactionId }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { locale } = useRouter();
  const { formatMessage } = useIntl();
  const text = (id) => formatMessage({ id });
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(true);
  const {
    ref: refDrop,
    isComponentVisible: dropVisible,
    setIsComponentVisible: setIsComponentVisible1,
  } = useComponentVisible(true);
  let dataForSearch =
    getCookieData("searchData") && JSON.parse(getCookieData("searchData"));
  const [pick_up, setPickUp] = useState(dataForSearch?.pickup_location);
  const [pickUpErr, setPickUpErr] = useState(false);
  const [pickUpSearch, setPickUpSearch] = useState(false);
  const [dropOffSearch, setDropOffSearch] = useState(false);
  const [drop_off, setDropOff] = useState(dataForSearch?.return_location);
  const [disabledBtn, setDisablebtn] = useState(true);
  const { data: location } = useAllLocaltionQuery();
  const { data: trackData } = useTrackApiQuery();
  const { carSearching, lang } = useSelector((state) => state.headData);

  const { data: staticData } = useStaticContentQuery(lang, {
    refetchOnMountOrArgChange: true,
  });

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
    setPickUpErr(false);
    setPickUp(value);
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

    if (dataForSearch?.pickup_location !== data) {
      setDisablebtn(false);
    } else {
      setDisablebtn(true);
    }
  };
  const handleDropUpLocation = (data) => {
    setDropOff(data);

    setDropOffSearch(false);
    if (dataForSearch?.return_location !== data) {
      setDisablebtn(false);
    } else {
      setDisablebtn(true);
    }
  };

  const initialState = {
    // pick_up: "",
    // drop_off: dataForSearch?.return_location,
    pickup_datetime: new Date(dataForSearch?.pickup_datetime),
    pick_up_time: dataForSearch?.pickup_datetime?.split(" ")[1],
    return_datetime: new Date(dataForSearch?.return_datetime),
    drop_off_time: dataForSearch?.return_datetime?.split(" ")[1],

    withcredit: "",
    without_credit_card: dataForSearch?.without_credit_card,
    driver_age: dataForSearch?.age,
    different_location: dataForSearch?.different_location,
    driver_30_60: dataForSearch?.driver_30_60,
  };
  const supplySchema = Yup.object().shape({
    // pick_up: Yup.string().required("Field is required"),
    pickup_datetime: Yup.string().required(staticData?.data?.field_is_required),
    pick_up_time: Yup.string().required(staticData?.data?.field_is_required),
    drop_off_time: Yup.string().required(staticData?.data?.field_is_required),
    // drop_off: Yup.string().required("Field is required"),
    driver_30_60: Yup.boolean(),
    driver_age: Yup.number()
      .when("driver_30_60", {
        is: false,
        then: Yup.number()
          .typeError("Age must be a number")
          .required(staticData?.data?.field_is_required),
      })
      .min(30, "Age must be greater than 30")
      .max(70, "Age must be less than 70"),
    different_location: Yup.boolean(),
    without_credit_card: Yup.boolean(),
    // withcredit: Yup.boolean(),
    // drop_off: Yup.string().when("different_location", {
    //   is: true,
    //   then: Yup.string().required("Field is required"),
    // }),
  });

  const handleSubmit = async (values, {}) => {
    if (locationFilter.length < 1) {
      setPickUp("");
      return;
    }
    if (locationFilterDropUp?.length < 1) {
      setDropOff("");
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
      dispatch(listSearching(true));
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
        let sendUrl = transactionId ? `/list?txn_id=${transactionId}` : "/list";
        router.push(sendUrl);
      }, 500);
    } else {
      setPickUpErr(true);
    }
  };

  return (
    <>
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
          <Form
            className={`search-property-1  w-100 edt-frm-ck  ${
              showHeroSec ? "" : "hide_travel_details"
            }`}
            autoComplete="off"
          >
            <img
              className="cls-fmr img-fluid"
              src="/assets/img/close.svg"
              alt=""
              onClick={() => setShowHeroSec(false)}
            />
            <div className="row" style={{ rowGap: "10px" }}>
              <div className="col-lg-4 col-md-12">
                <div className="form-group mb-3">
                  <div className="icon">
                    <img
                      src="/assets/img/location.svg"
                      alt=""
                      className="img-fluid"
                    />
                  </div>
                  <div className="form-field" ref={ref}>
                    <label htmlFor="pick_up">
                      {staticData?.data?.pick_up_location}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder=""
                      id="pick_up"
                      name="pick_up"
                      value={pick_up}
                      onChange={(e) => handlChangePickUp(e.target.value)}
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
                  {pickUpErr ? (
                    <div className="rd-slrt-s">
                      {text("PICK_UP_LOCATION_REQUIRED")}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="col-lg-4 col-md-12">
                <div className="form-group mb-3">
                  <div className="icon">
                    <img
                      src="/assets/img/calendar.svg"
                      alt=""
                      className="img-fluid"
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="pickup_datetime">
                      {staticData?.data?.pick_up_date}
                    </label>
                    <div className="d-flex">
                      <DatePicker
                        locale={locale}
                        portalId="root-portal"
                        bg="white"
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
                          if (
                            moment(date).format("YYYY-MM-DD HH:mm") !==
                            dataForSearch?.pickup_datetime
                          ) {
                            setDisablebtn(false);
                          } else {
                            setDisablebtn(true);
                          }
                        }}
                        dateFormat="MMMM d, yyyy HH:mm"
                        timeFormat="HH:mm"
                        minDate={new Date()}
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                      />

                      {/* <input
                            type="date"
                            className="form-control"
                            id="pick_up_date"
                            placeholder="2023-01-18"
                            name="pick_up_date"
                            value={values.pick_up_date}
                            onChange={(e) => {
                              setFieldValue("pick_up_date", e.target.value);
                              setFieldValue(
                                "drop_off_date",
                                moment(e.target.value, "YYYY-MM-DD")
                                  .add(1, "days")
                                  .format("YYYY-MM-DD")
                              );
                            }}
                            onBlur={handleBlur}
                            min={moment().format("YYYY-MM-DD")}
                          />
                          <input
                            type="time"
                            className="form-control"
                            name="pick_up_time"
                            value={values.pick_up_time}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          /> */}
                    </div>
                  </div>
                  {errors.pickup_datetime && touched.pickup_datetime ? (
                    <div className="rd-slrt-s">
                      {staticData?.data?.field_is_required}
                    </div>
                  ) : null}
                </div>
              </div>

              <div
                className={`col-md-4 ${
                  values.different_location ? "" : "d-none"
                }`}
              >
                <div className="form-group">
                  <div className="icon">
                    <img
                      src="/assets/img/Icon.svg"
                      alt=""
                      className="img-fluid"
                    />
                  </div>
                  <div className="form-field" ref={refDrop}>
                    <label htmlFor="drop_off">
                      {staticData?.data?.drop_up_location}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder=""
                      name="drop_off"
                      id="drop_off"
                      value={drop_off}
                      // onChange={handleChange}
                      onChange={(e) => handlChangeDropUp(e.target.value)}
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
                  {/* {errors.drop_off && touched.drop_off ? (
                          <div className="rd-slrt-s">{errors.drop_off}</div>
                        ) : null} */}
                </div>
              </div>

              <div className="col-lg-4 col-md-12">
                <div className="form-group">
                  <div className="icon">
                    <img
                      src="/assets/img/calendar.svg"
                      alt=""
                      className="img-fluid"
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="return_datetime">
                      {staticData?.data?.drop_off_date}
                    </label>
                    <div className="d-flex">
                      <DatePicker
                        locale={locale}
                        portalId="root-portal"
                        bg="white"
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
                          if (
                            moment(date).format("YYYY-MM-DD HH:mm") !==
                            dataForSearch?.return_datetime
                          ) {
                            setDisablebtn(false);
                          } else {
                            setDisablebtn(true);
                          }
                        }}
                        dateFormat="MMMM d, yyyy HH:mm"
                        timeFormat="HH:mm"
                        minDate={
                          new Date(
                            moment(values.pickup_datetime, "YYYY-MM-DD HH:mm")
                              .add(1, "days")
                              .format("YYYY-MM-DD HH:mm")
                          )
                        }
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                      />

                      {/* <input
                            type="date"
                            className="form-control"
                            id="drop_off_date"
                            placeholder="2023-01-18"
                            name="drop_off_date"
                            value={values.drop_off_date}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            min={moment(values.pickup_datetime, "YYYY-MM-DD")
                              .add(1, "days")
                              .format("YYYY-MM-DD")}
                          />
                          <input
                            type="time"
                            className="form-control"
                            name="drop_off_time"
                            value={values.drop_off_time}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          /> */}
                    </div>
                  </div>
                  {errors.return_datetime && touched.return_datetime ? (
                    <div className="rd-slrt-s">{errors.return_datetime}</div>
                  ) : null}
                </div>
              </div>
              <div className="col-lg-4 col-md-12">
                <div className="form-check mt-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="different_location"
                    name="different_location"
                    checked={values.different_location}
                    onChange={(e) => {
                      setFieldValue("different_location", e.target.checked);
                    }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="different_location"
                  >
                    {staticData?.data?.drop_car_off_at_diffenet_location}
                  </label>
                </div>
              </div>
              <div className="col-lg-4 col-md-12">
                <div className="form-check mt-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="driver_30_60"
                    name="driver_30_60"
                    checked={values.driver_30_60}
                    onChange={(e) => {
                      setFieldValue("driver_30_60", e.target.checked);
                    }}
                  />
                  <label className="form-check-label" htmlFor="driver_30_60">
                    {staticData?.data?.driver_aged_30_35}
                  </label>
                  {!values.driver_30_60 && (
                    <>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Driver Age"
                        name="driver_age"
                        value={values.driver_age}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.driver_age && touched.driver_age ? (
                        <div className="rd-slrt-s">{errors.driver_age}</div>
                      ) : null}
                    </>
                  )}
                </div>
              </div>
              <div className="col-lg-4 col-md-12">
                <div className="form-check mt-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
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
                  {errors.without_credit_card && touched.without_credit_card ? (
                    <div className="error" style={{ color: "red" }}>
                      {errors.without_credit_card}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="col-md-12 text-center">
                <button
                  type="submit"
                  className="btn btn-primary submit"
                  disabled={(isFetching && carSearching) || disabledBtn}
                >
                  {isFetching && carSearching
                    ? "Searching..."
                    : staticData?.data?.search}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default ListForm;
