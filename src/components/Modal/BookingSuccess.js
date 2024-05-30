import Link from "next/link";
import React from "react";
import Modal from "react-bootstrap/Modal";

function BookingSuccess({
  handleClose,
  trsId,
  refundMsg,
  emailID,
  show,
  backdrop,
  staticData,
  dbStatic,
}) {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      keyboard={false}
      backdrop={backdrop}
    >
      <div
        className="pmt-methd"
        id="pmt-mdl-1"
        // tabindex="-1"
        // aria-labelledby="exampleModalLabel"
        // aria-hidden="true"
      >
        <div className="modal-content">
          {/* <button
              type="button"
              className="btn-close clss"
              //   data-bs-dismiss="modal"
              //   aria-label="Close"
              onClick={handleClose}
            ></button> */}

          <div className="modal-body text-center">
            <h2>{dbStatic?.booking_pending}</h2>
            <div className="slct-pmt">
              <img src="/assets/img/confm.svg" alt="" />
              <p>Id No. ${trsId}</p>
              <Link href={`/trip-detail?ids=${trsId}&email=${emailID}`} legacyBehavior>
                <a className="clr-btn">{staticData?.data?.view_details}</a>
              </Link>
            </div>
            {refundMsg && <p>{refundMsg}</p>}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default BookingSuccess;
