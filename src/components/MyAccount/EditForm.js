import Link from "next/link";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import DatePicker from "react-datepicker";
import { errorMsg, successMsg } from "../Toast";
import { useUpdateProfileMutation } from "@/store/Slices/apiSlice";
import { userDataUpdate } from "@/store/Slices/authSlice";
import moment from "moment";

function EditForm({ setEditShow, userData, staticData }) {
  const dispatch = useDispatch();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const editState = {
    id: userData && userData?.id ? userData?.id : "",
    name: userData && userData?.name ? userData?.name : "",
    email: userData && userData?.email ? userData?.email : "",
    gender: userData && userData?.gender ? userData?.gender : "",
    dob: userData && userData?.dob ? userData?.dob : "",
  };

  const initialState = {
    name: "",
    email: "",
    gender: "",
    dob: "",
  };
  const UserFormSchema = Yup.object().shape({
    name: Yup.string().required("Field is Required"),
    email: Yup.string().email("Invalid email").required("Field is Required"),
    gender: Yup.string().required("Field is Required"),
    dob: Yup.string().required("Field is Required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const response = await updateProfile(values).unwrap();

      if (response?.status) {
        setEditShow(true);
        response?.message && successMsg(response?.message);
        dispatch(userDataUpdate(response.data));
      } else {
        response?.message && errorMsg(response?.message);
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
    <>
      <Formik
        initialValues={userData ? editState : initialState}
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
        }) => (
          <Form>
            <div className="row mt-3">
              <div className="col-md-6">
                <h3 className="prfl-ttl">
                  <span>{staticData?.data?.fullname}</span>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder={staticData?.data?.fullname}
                    className="form-control"
                    autoComplete="off"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.name && touched.name ? (
                    <div className="error" style={{ color: "red" }}>
                      {errors.name}
                    </div>
                  ) : null}
                </h3>
              </div>
              <div className="col-md-6">
                <h3 className="prfl-ttl">
                  <span>{staticData?.data?.gender}</span>
                  <select
                    className="form-select"
                    name="gender"
                    value={values.gender}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="">Select Gender</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && touched.gender ? (
                    <div className="error" style={{ color: "red" }}>
                      {errors.gender}
                    </div>
                  ) : null}
                </h3>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-6">
                <h3 className="prfl-ttl">
                  <span>{staticData?.data?.data_of_birth}</span>
                  <DatePicker
                    placeholderText={staticData?.data?.data_of_birth}
                    className="form-control"
                    name="dob"
                    selected={values.dob ? new Date(values.dob) : ""}
                    maxDate={moment().subtract(5, "years")._d}
                    onChange={(date) => {
                      setFieldValue("dob", moment(date).format("YYYY-MM-DD"));
                      setFieldTouched("dob", true);
                    }}
                    showMonthDropdown
                    showYearDropdown
                    scrollableYearDropdown
                    dropdownMode="select"
                    onKeyDown={(e) => {
                      e.preventDefault();
                    }}
                  />
                  {errors.dob && touched.dob ? (
                    <div className="error" style={{ color: "red" }}>
                      {errors.dob}
                    </div>
                  ) : null}
                </h3>
              </div>
              <div className="col-md-6">
                <h3 className="prfl-ttl">
                  <span>{staticData?.data?.email}</span>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder={staticData?.data?.email}
                    className="form-control"
                    autoComplete="off"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    readOnly="yes"
                  />
                  {errors.email && touched.email ? (
                    <div className="error" style={{ color: "red" }}>
                      {errors.email}
                    </div>
                  ) : null}
                </h3>
              </div>
            </div>

            <hr className="my-4" />
            <div className="prfl-btns">
              <button
                type="submit"
                className="editshow-btn update-profile"
                disabled={isLoading}
              >
                {isLoading ? "updating..." : staticData?.data?.update}
              </button>
              <Link href="create-password" legacyBehavior>
                <a className="btn-bg">{staticData?.data?.change_password}</a>
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default EditForm;
