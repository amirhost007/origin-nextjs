import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Spinner from "react-bootstrap/Spinner";
import { useDispatch } from "react-redux";
import {
  useGetUserProfileQuery,
  useUpdateImageMutation,
} from "@/store/Slices/apiSlice";
import { setCookies } from "@/utils/helper";
import ErrorHandler from "../ErrorHandler";
import EditForm from "./EditForm";
import titleCase from "../TitleCase";
import ErrorPage from "../ErrorPage";
import { errorMsg, successMsg } from "../Toast";
import { userDataUpdate } from "@/store/Slices/authSlice";
import styles from "./profile.module.css";
import RBmodal from "../Modal/RBmodal";

function ProfileSettings({ staticData }) {
  const dispatch = useDispatch();
  const [editShow, setEditShow] = useState(true);
  const [show, setShow] = useState(false);
  const [imgData, setImgData] = useState("");
  const [updateImage, { isLoading: imageLoading }] = useUpdateImageMutation();

  const handleClose = () => setShow(false);

  const fileInputRef = useRef();
  const {
    data: userData,
    isError,
    error,
    isLoading,
  } = useGetUserProfileQuery();

  useEffect(() => {
    if (userData) setCookies("origin_rent_userdata", JSON.stringify(userData));
  }, [userData]);

  const handleChange = async (event) => {
    let images = event.target.files[0];

    if (images?.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
      const formData = new FormData();
      formData.append("image", event.target.files[0]);
      try {
        const response = await updateImage(formData).unwrap();

        if (response?.status) {
          response?.message && successMsg(response?.message);
          dispatch(userDataUpdate(response.data));
        } else {
          response?.message && errorMsg(response?.message);
        }
      } catch (error) {
        let err = error?.data?.message ? error?.data?.message : err.message;

        errorMsg(err);
      }
    } else {
      errorMsg("Select valid image.");
    }
  };

  const handleZoomImage = (imgs) => {
    setImgData(imgs);
    setShow(true);
  };

  if (isLoading) return <div>loading...</div>;

  if (isError)
    return (
      <>
        <ErrorHandler error={error} />;
        <section className="p-0">
          <div className="" data-aos="fade-up">
            <ErrorPage />
          </div>
        </section>
      </>
    );
  return (
    <>
      <h3 className="tab_drawer_heading">
        <img src="/assets/img/user.svg" alt="" className="img-fluid" />
        {staticData?.data?.profile_setting}
      </h3>
      <div id="tab2" className="tab_content">
        <h2>{staticData?.data?.profile_setting}</h2>
        <div className="propic-nme">
          <div className="avatar-upload">
            <div
              className="avatar-edit"
              onClick={() => fileInputRef.current.click()}
            >
              <input
                type="file"
                // id="imageUpload"
                accept="image/*"
                hidden
                multiple={false}
                ref={fileInputRef}
                onChange={handleChange}
              />

              <label htmlFor="imageUpload"></label>
            </div>
            <div
              className={`avatar-preview ${
                imageLoading ? "image-loading" : ""
              }`}
            >
              {imageLoading ? (
                <span className={styles.image_loader}>
                  <Spinner variant="primary" animation="border" />
                </span>
              ) : (
                <>
                  <div
                    className="image_hover"
                    onClick={() =>
                      handleZoomImage(
                        userData?.image
                          ? userData?.image
                          : "/assets/img/user.png"
                      )
                    }
                  >
                    <i className="bi bi-eye"></i>
                  </div>
                  <div
                    id="imagePreview"
                    style={{
                      backgroundImage: `url(${
                        userData?.image
                          ? userData?.image
                          : "/assets/img/user.png"
                      })`,
                    }}
                  ></div>
                </>
              )}
            </div>
          </div>
          <h3>
            {userData && userData?.name ? titleCase(userData?.name) : "N/A"}
            <span>{userData && userData?.email ? userData?.email : "N/A"}</span>
          </h3>
        </div>

        <h3>{staticData?.data?.persional_details}</h3>
        {!editShow && (
          <EditForm
            setEditShow={setEditShow}
            userData={userData}
            staticData={staticData}
          />
        )}
        {editShow && (
          <>
            <div className="row mt-3">
              <div className="col-md-6">
                <h3 className="prfl-ttl">
                  <span>{staticData?.data?.fullname}</span>
                  {userData && userData?.name
                    ? titleCase(userData?.name)
                    : "N/A"}
                </h3>
              </div>

              <div className="col-md-6">
                <h3 className="prfl-ttl">
                  <span>{staticData?.data?.gender}</span>
                  {userData && userData?.gender
                    ? titleCase(userData?.gender)
                    : "N/A"}
                </h3>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-6">
                <h3 className="prfl-ttl">
                  <span>{staticData?.data?.data_of_birth}</span>
                  {userData && userData?.dob ? userData?.dob : "N/A"}
                </h3>
              </div>
              <div className="col-md-6">
                <h3 className="prfl-ttl">
                  <span>{staticData?.data?.email}</span>
                  {userData && userData?.email ? userData?.email : "N/A"}
                </h3>
              </div>
            </div>

            <hr className="my-4" />
          </>
        )}
        {editShow && (
          <div className="prfl-btns">
            <a className="editshow-btn" onClick={() => setEditShow(false)}>
              {staticData?.data?.edit}
            </a>
            <Link href="create-password" legacyBehavior>
              <a className="btn-bg">{staticData?.data?.change_password}</a>
            </Link>
          </div>
        )}
      </div>

      {show && (
        <RBmodal
          show={show}
          handleClose={handleClose}
          size="lg"
          ID="image_preview"
        >
          <div className="image-zoom-div pb-3">
            <button
              type="button"
              className="btn-close clss"
              // data-bs-dismiss="modal"
              // aria-label="Close"
              onClick={handleClose}
            ></button>
            <div className="image-zoom">
              <img src={imgData} alt="" />
            </div>
          </div>
        </RBmodal>
      )}
    </>
  );
}

export default ProfileSettings;
