import { useSelector } from "react-redux";
import {
  useAllLocaltionQuery,
  useLookingLocalSupplierMutation,
  useStaticContentQuery,
} from "@/store/Slices/apiSlice";
import { useState } from "react";
import { useIntl } from "react-intl";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import LocalSupplierDeals from "../LocalSuppliers";
import { errorMsg, successMsg } from "../Toast";
import RBmodal from "./RBmodal";
import AutoComplete from "../AutoComplete";
import useComponentVisible from "@/Hooks/useComponentVisible";

function LocalSupplierFirst({ handleCloseFirst }) {
  const [show, setShow] = useState(false);
  const [dataForNextStep, setDataNextStep] = useState(null);
  //
  const [pick_up, setPickUp] = useState("");
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [pickUpErr, setPickUpErr] = useState(false);
  const [dropUpErr, setDropUpErr] = useState(false);
  const [pickUpSearch, setPickUpSearch] = useState(false);
  const [dropOffSearch, setDropOffSearch] = useState(false);
  const [drop_off, setDropOff] = useState("");
  const { data: location } = useAllLocaltionQuery();
  // API
  const [lookingLocalSupplier] = useLookingLocalSupplierMutation();
  const { lang } = useSelector((state) => state.headData);
  const { data: staticData } = useStaticContentQuery(lang, {
    refetchOnMountOrArgChange: true,
  });
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(true);
  const {
    ref: refDrop,
    isComponentVisible: dropVisible,
    setIsComponentVisible: setIsComponentVisible1,
  } = useComponentVisible(true);

  const { formatMessage } = useIntl();
  const text = (id) => formatMessage({ id });

  const handleClose = () => setShow(false);

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
    setDropUpErr(false);
  };
  const handlePickUpLocation = (data) => {
    setPickUp(data);
    setPickUpErr(false);
    setDropUpErr(false);
    setPickUpSearch(false);
  };
  const handleDropUpLocation = (data) => {
    setDropOff(data);

    setDropOffSearch(false);
  };

  const initialState = {
    email: "",
    // pick_up: "",
    // drop_off: "",
  };

  let requireMsg = staticData?.data?.field_is_required;
  let invalidMsg = staticData?.data?.invalid_email;

  const supplySchema = Yup.object().shape({
    email: Yup.string().email(invalidMsg).required(requireMsg),
    // pick_up: Yup.string().required(requireMsg),
    // drop_off: Yup.string().required(requireMsg),
  });

  const handleSubmit = async (values, {}) => {
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
    if (pick_up && drop_off) {
      try {
        let data = {
          email: values.email,
          pick_up: pick_up,
          drop_off: drop_off,
        };
        setDataNextStep(data);
        const respose = await lookingLocalSupplier(data).unwrap();
        if (respose?.status) {
          setShow(true);
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
    } else {
      setLoadingBtn(false);
      if (!pick_up && !drop_off) {
        setPickUpErr(true);
        setDropUpErr(true);
      } else if (!pick_up) {
        setPickUpErr(true);
      } else if (!drop_off) {
        setDropUpErr(true);
      }
    }
  };
  return (
    <>
      <div
        className="car-inqu-mdl deal-offer subpl-mdl"
        // id="fltrmdl"
        // tabIndex="-1"
        // aria-labelledby="exampleModalLabel"
        // aria-hidden="true"
      >
        {/* <div className="modal-dialog"> */}

        <div className=" pb-3">
          <button
            type="button"
            className="btn-close clss"
            // data-bs-dismiss="modal"
            // aria-label="Close"
            onClick={handleCloseFirst}
          ></button>

          <div className="modal-body">
            <h2 className="mb-3">{staticData?.data?.local_supplier}</h2>
            <div className="col-md-12">
              <Formik
                initialValues={initialState}
                validationSchema={supplySchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, values, handleChange, handleBlur }) => (
                  <Form
                    className="search-property-1 global-frm"
                    autoComplete="off"
                  >
                    <div className="row">
                      <div className="col-md-12">
                        <input
                          style={{ padding: "10px" }}
                          className="form-group"
                          type="email"
                          name="email"
                          id="email"
                          placeholder={staticData?.data?.email_address + "*"}
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />

                        {errors.email && touched.email ? (
                          <span className="inp-alrt error">{errors.email}</span>
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
                          <div className="form-field" ref={ref}>
                            <label htmlFor="pickuplocation">
                              {staticData?.data?.pick_up_location + "*"}
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
                              // value={values.pick_up}
                              // onChange={handleChange}
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
                          <span className="error-msgs">
                            <div className="error">{requireMsg}</div>
                          </span>
                        ) : null}
                        {/* <span className="error-msgs">
                          {errors.pick_up && touched.pick_up ? (
                            <div className="error">{errors.pick_up}</div>
                          ) : null}
                        </span> */}
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <div className="icon">
                            <img
                              src="/assets/img/Icon.svg"
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                          <div className="form-field" ref={refDrop}>
                            <label htmlFor="DROP_UP_LOCATION">
                              {staticData?.data?.drop_up_location + "*"}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="DROP_UP_LOCATION"
                              placeholder=""
                              name="drop_off"
                              // value={values.drop_off}
                              // onChange={handleChange}
                              // onBlur={handleBlur}
                              value={drop_off}
                              onChange={(e) =>
                                handlChangeDropUp(e.target.value)
                              }
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
                        </div>
                        {dropUpErr ? (
                          <span className="error-msgs">
                            <div className="error">{requireMsg}</div>
                          </span>
                        ) : null}
                        {/* {errors.drop_off && touched.drop_off ? (
                          <div className="error" style={{ color: "red" }}>
                            {errors.drop_off}
                          </div>
                        ) : null} */}
                      </div>
                    </div>
                    <hr />
                    <input
                      type="submit"
                      value={staticData?.data?.submit}
                      // data-bs-toggle="modal"
                      // data-bs-target="#fltrmdl-2"
                      className="btn btn-primary submit"
                    />
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>

      {show && (
        <RBmodal show={show} handleClose={handleClose} size="lg">
          <LocalSupplierDeals
            handleClose={handleClose}
            dataForNextStep={dataForNextStep}
            handleCloseFirst={handleCloseFirst}
          />
        </RBmodal>
      )}
    </>
  );
}

export default LocalSupplierFirst;
