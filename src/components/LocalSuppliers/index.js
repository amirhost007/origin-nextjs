import { useRouter } from "next/router";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import moment from "moment";
import DatePicker from "react-datepicker";
import {
  useLookingLocalSupplierMutation,
  useStaticContentQuery,
} from "@/store/Slices/apiSlice";

function LocalSupplierDeals({
  handleClose,
  dataForNextStep,
  handleCloseFirst,
}) {
  const { locale } = useRouter();
  // API
  const [lookingLocalSupplier] = useLookingLocalSupplierMutation();
  const { lang } = useSelector((state) => state.headData);
  const { data: staticData } = useStaticContentQuery(lang, {
    refetchOnMountOrArgChange: true,
  });

  const initialState = {
    first_name: "",
    last_name: "",
    phone: "",
    email: dataForNextStep?.email ? dataForNextStep?.email : "",
    pick_up: dataForNextStep?.pick_up ? dataForNextStep?.pick_up : "",
    drop_off: dataForNextStep?.drop_off ? dataForNextStep?.drop_off : null,
    // pick_up_date: "",
    pick_up_time: new Date(
      moment().add(1, "days").format("YYYY-MM-DD HH:mm")
    ),
    // drop_off_date: "",
    drop_off_time: new Date(
      moment().add(2, "days").format("YYYY-MM-DD HH:mm")
    ),
    without_credit: "",
    withcredit: "",
    driver_age: "",
    different_location: true,
    driver_30_60: false,
  };
  let requireMsg = staticData?.data?.field_is_required;
  let invalidMsg = staticData?.data?.invalid_email;

  const supplySchema = Yup.object().shape({
    first_name: Yup.string().required(requireMsg),
    last_name: Yup.string().required(requireMsg),
    phone: Yup.string().required(requireMsg),
    email: Yup.string().email(invalidMsg).required(requireMsg),
    pick_up: Yup.string().required(requireMsg),
    pick_up_time: Yup.string().required(requireMsg),
    drop_off_time: Yup.string().required(requireMsg),
    // drop_off: Yup.string().required("Field is required"),
    driver_30_60: Yup.boolean(),
    driver_age: Yup.number().when("driver_30_60", {
      is: false,
      then: Yup.number().required(requireMsg),
    }),
    different_location: Yup.boolean(),
    // withcredit: Yup.boolean(),
    drop_off: Yup.string().when("different_location", {
      is: true,
      then: Yup.string().required(requireMsg),
    }),
  });

  const handleSubmit = async (values, {}) => {
    const dataSubmit = {
      first_name: values?.first_name,
      last_name: values?.last_name,
      email: values?.email,
      phone: values?.phone,
      pick_up: values?.pick_up,
      drop_off: values?.drop_off,
      pick_up_time: values?.pick_up_time,
      drop_off_time: values?.drop_off_time,
      with_credit: values?.withcredit === true ? 1 : 0,
      without_credit: values?.without_credit === true ? 1 : 0,
      driver_age_30_to_65: values?.driver_30_60 === true ? 1 : 0,
      driver_age: values?.driver_age,
    };
    try {
      const respose = await lookingLocalSupplier(dataSubmit).unwrap();

      if (respose?.status) {
        handleClose();
        handleCloseFirst();
        respose?.message && successMsg(respose?.message);
      } else {
        respose?.message && errorMsg(respose?.message);
      }
    } catch (error) {
      let err = error?.data?.message
        ? error?.data?.message
        : error?.message
        ? error?.message
        : "Something went wrong";
      if (err) errorMsg(err);
    }
  };

  return (
    <div className="car-inqu-mdl deal-offer">
      <button
        type="button"
        className="btn-close clss"
        aria-label="Close"
        onClick={handleClose}
      ></button>
      <div className="">
        <div className="modal-body">
          <h2 className="mb-3">{staticData?.data?.customized_deals}</h2>
          <div className="col-md-12">
            <Formik
              initialValues={initialState}
              validationSchema={supplySchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, values, handleChange, handleBlur, setFieldValue  }) => (
                <Form
                  className="search-property-1 global-frm"
                  autoComplete="off"
                >
                  <div className="row">
                    <div className="col-md-6">
                      <input
                        className="form-group"
                        type="text"
                        name="first_name"
                        id="first_name"
                        placeholder={staticData?.data?.first_name + "*"}
                        value={values.first_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        style={{ padding: "10px" }}
                      />
                      {errors.first_name && touched.first_name ? (
                        <div className="error" style={{ color: "red" }}>
                          {errors.first_name}
                        </div>
                      ) : null}
                    </div>
                    <div className="col-md-6">
                      <input
                        className="form-group"
                        type="text"
                        name="last_name"
                        id="last_name"
                        placeholder={staticData?.data?.last_name + "*"}
                        value={values.last_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        style={{ padding: "10px" }}
                      />
                      {errors.last_name && touched.last_name ? (
                        <div className="error" style={{ color: "red" }}>
                          {errors.last_name}
                        </div>
                      ) : null}
                    </div>
                    <div className="col-md-6">
                      <input
                        className="form-group"
                        type="text"
                        name="phone"
                        id="phone"
                        placeholder={staticData?.data?.contact_number + "*"}
                        value={values.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        style={{ padding: "10px" }}
                      />
                      {errors.phone && touched.phone ? (
                        <div className="error" style={{ color: "red" }}>
                          {errors.phone}
                        </div>
                      ) : null}
                    </div>
                    <div className="col-md-6">
                      <input
                        className="form-group"
                        type="text"
                        name="email"
                        id="email"
                        placeholder={staticData?.data?.email_address + "*"}
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        style={{ padding: "10px" }}
                      />
                      {errors.email && touched.email ? (
                        <div className="error" style={{ color: "red" }}>
                          {errors.email}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <div className="icon">
                          <img
                            src="/assets/img/location.svg"
                            alt=""
                            className="img-fluid"
                          />
                        </div>
                        <div className="form-field">
                          <label htmlFor="#">
                            {staticData?.data?.pick_up_location + "*"}
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder=""
                            name="pick_up"
                            value={values.pick_up}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </div>
                      </div>
                      {errors.pick_up && touched.pick_up ? (
                        <div className="error" style={{ color: "red" }}>
                          {errors.pick_up}
                        </div>
                      ) : null}
                      <div className="form-group ">
                        <div className="icon">
                          <img
                            src="/assets/img/calendar.svg"
                            alt=""
                            className="img-fluid"
                          />
                        </div>
                        <div className="form-field">
                          <label htmlFor="pickup_datetime">
                            {staticData?.data?.pick_up_date + "*"}
                          </label>
                          <div className="d-flex mbl-frm">
                            {/* <input
                              type="date"
                              className="form-control"
                              id="input_from"
                              placeholder="2023-01-18"
                              name="pick_up_date"
                              value={values.pick_up_date}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <input
                              type="time"
                              className="form-control time-sec"
                              name="pick_up_time"
                              value={values.pick_up_time}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            /> */}
                            <DatePicker
                              locale={locale}
                              showTimeSelect
                              name="pick_up_time"
                              placeholder="dd/mm/yyy HH:mm"
                              className="form-control clickable input-md"
                              selected={
                                values.pick_up_time
                                  ? new Date(values.pick_up_time)
                                  : ""
                              }
                              onChange={(date) => {
                                setFieldValue(
                                  "pick_up_time",
                                  moment(date).format("YYYY-MM-DD HH:mm")
                                );
                                setFieldValue(
                                  "drop_off_time",
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
                      </div>
                      {errors.pick_up_time && touched.pick_up_time ? (
                        <div className="error" style={{ color: "red" }}>
                          {requireMsg}
                        </div>
                      ) : null}
                    </div>

                    <div className="col-md-6">
                      {values.different_location && (
                        <>
                          <div className="form-group">
                            <div className="icon">
                              <img
                                src="/assets/img/Icon.svg"
                                alt=""
                                className="img-fluid"
                              />
                            </div>
                            <div className="form-field">
                              <label htmlFor="#">
                                {staticData?.data?.drop_up_location + "*"}
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder=""
                                name="drop_off"
                                value={values.drop_off}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                            </div>
                          </div>
                          {errors.drop_off && touched.drop_off ? (
                            <div className="error" style={{ color: "red" }}>
                              {errors.drop_off}
                            </div>
                          ) : null}
                        </>
                      )}
                      <div className="form-group ">
                        <div className="icon">
                          <img
                            src="/assets/img/calendar.svg"
                            alt=""
                            className="img-fluid"
                          />
                        </div>

                        <div className="form-field">
                          <label htmlFor="drop_off_time">
                            {staticData?.data?.drop_off_date + "*"}
                          </label>
                          <div className="d-flex mbl-frm">
                            {/* <input
                              type="date"
                              className="form-control"
                              id="input_to"
                              placeholder="2023-01-18"
                              // data-rome-id="1"
                              name="drop_off_date"
                              value={values.drop_off_date}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <input
                              type="time"
                              className="form-control time-sec"
                              defaultValue="10:05"
                              name="drop_off_time"
                              value={values.drop_off_time}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            /> */}
                            <DatePicker
                              locale={locale}
                              showTimeSelect
                              name="drop_off_time"
                              placeholder="dd/mm/yyy HH:mm"
                              className="form-control clickable input-md"
                              selected={
                                values.drop_off_time
                                  ? new Date(values.drop_off_time)
                                  : ""
                              }
                              onChange={(date) => {
                                setFieldValue(
                                  "drop_off_time",
                                  moment(date).format("YYYY-MM-DD HH:mm")
                                );
                              }}
                              dateFormat="MMMM d, yyyy HH:mm"
                              timeFormat="HH:mm"
                              minDate={
                                new Date(
                                  moment(
                                    values.drop_off_time,
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
                          </div>
                        </div>
                      </div>
                      {(errors.drop_off_date && touched.drop_off_date) ||
                      (errors.drop_off_time && touched.drop_off_time) ? (
                        <div className="error" style={{ color: "red" }}>
                          Field is required
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          name="different_location"
                          id="different_location"
                          checked={values.different_location}
                          onChange={handleChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="different_location"
                        >
                          {staticData?.data?.drop_car_off_at_diffenet_location}
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          type="checkbox"
                          name="driver_30_60"
                          id="driver_30_60"
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
                              className="form-control"
                              id="driver_age"
                              placeholder="Enter Driver Age* "
                              name="driver_age"
                              value={values.driver_age}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            {errors.driver_age && touched.driver_age ? (
                              <div
                                className="error mt-2"
                                style={{ color: "red" }}
                              >
                                {errors.driver_age}
                              </div>
                            ) : null}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          name="without_credit"
                          id="without_credit"
                          value={values.without_credit}
                          onChange={handleChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="without_credit"
                        >
                          {staticData?.data?.without_credit_card}
                        </label>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <button type="submit" className="btn btn-primary submit">
                    {staticData?.data?.submit}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LocalSupplierDeals;
