import {
  useAddFeedbackMutation,
  useStaticContentQuery,
} from "@/store/Slices/apiSlice";
import { useState } from "react";
import { errorMsg, successMsg } from "../Toast";
import RBmodal from "./RBmodal";
import { useSelector } from "react-redux";
import Link from "next/link";

const FeedBack = ({ show, handleClose }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [acceptResearch, setAcceptResearch] = useState(false);
  const [errorAccept, setErrorAccept] = useState(false);
  const [addFeedback] = useAddFeedbackMutation();
  const { lang } = useSelector((state) => state.headData);

  const { data: staticData } = useStaticContentQuery(lang, {
    refetchOnMountOrArgChange: true,
  });
  const dbStatic = staticData?.data?.additional_data;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (acceptPrivacy && acceptResearch) {
      setErrorAccept(false);
      try {
        let response = await addFeedback({ rating, comment }).unwrap();

        if (response?.status) {
          response?.message && successMsg(response?.message);
          handleClose();
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
    } else {
      setErrorAccept(true);
    }
  };
  return (
    <>
      <RBmodal show={show} handleClose={handleClose} size="lg">
        <div className="fd-back-mdl" id="fdbc-dml">
          <div>
            <button
              type="button"
              className="btn-close clss"
              onClick={handleClose}
            ></button>
            <div className="modal-body">
              <div className="col-md-12">
                <form
                  className="container"
                  onSubmit={handleSubmit}
                  autoComplete="off"
                >
                  <h1 className="heading">{dbStatic?.give_feedback}</h1>
                  <p className="para mt-4 mb-2">
                    {dbStatic?.what_do_you_think_of_the_issue_search_experience}
                  </p>

                  <div className="feedback-level">
                    <div
                      className={`level ${rating === 1 ? "active_emoji" : ""} `}
                      onClick={() => setRating(1)}
                    >
                      <i className="fa-regular fa-face-sad-tear"></i>
                    </div>
                    <div
                      className={`level ${rating === 2 ? "active_emoji" : ""} `}
                      onClick={() => setRating(2)}
                    >
                      <i class="fa-regular fa-face-frown"></i>
                    </div>
                    <div
                      className={`level ${rating === 3 ? "active_emoji" : ""} `}
                      onClick={() => setRating(3)}
                    >
                      <i className="fa-regular fa-face-meh"></i>
                    </div>
                    <div
                      className={`level ${rating === 4 ? "active_emoji" : ""} `}
                      onClick={() => setRating(4)}
                    >
                      <i className="fa-regular fa-face-smile"></i>
                    </div>
                    <div
                      className={`level ${rating === 5 ? "active_emoji" : ""} `}
                      onClick={() => setRating(5)}
                    >
                      <i className="fa-regular fa-face-grin"></i>
                    </div>
                  </div>

                  <div className="feedback-msg">
                    <p className="para mt-4 mb-2">
                      {dbStatic?.what_are_the_main_reasons_for_your_rating}
                    </p>
                    <textarea
                      name=""
                      id=""
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="agreement">
                    <div className="checkbox">
                      <input
                        type="checkbox"
                        name=""
                        id=""
                        checked={acceptPrivacy}
                        onChange={(e) => setAcceptPrivacy(e.target.checked)}
                      />
                      <label htmlFor="">
                        {dbStatic?.i_may_be_contacted_about_this_feedback}
                        <Link href="/privacy-policy">{staticData?.data?.privacy_policy}</Link>.
                      </label>
                    </div>
                    <div className="checkbox">
                      <input
                        type="checkbox"
                        name=""
                        id=""
                        checked={acceptResearch}
                        onChange={(e) => setAcceptResearch(e.target.checked)}
                      />
                      <label htmlFor="">
                        {dbStatic?.Id_like_to_help_improve_by_joining_the_reasearch}
                      </label>
                    </div>

                    {errorAccept && (
                      <p style={{ color: "red" }}>
                        {dbStatic?.please_accept_privacy_policy_and_research_group}
                      </p>
                    )}
                  </div>

                  <div className="buttons">
                    <button className="feedback_submit_btn" type="submit">
                      {staticData?.data?.submit}
                    </button>
                    <a style={{ cursor: "pointer" }} onClick={handleClose}>
                      {dbStatic?.cancel}
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </RBmodal>
    </>
  );
};

export default FeedBack;
