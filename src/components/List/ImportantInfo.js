import React from "react";
import RBmodal from "../Modal/RBmodal";

function ImportantInfo({ showImptinfo, popupdata , handleCloseImptInfo }) {
  return (
    <RBmodal
      show={showImptinfo}
      handleClose={handleCloseImptInfo}
      size="lg"
      ID="image_preview"
    >
      <div className="image-zoom-div pb-3">
        <h4 className="imp_header">Terms and conditions</h4>
        <button
          type="button"
          className="btn-close clss"
          // data-bs-dismiss="modal"
          // aria-label="Close"
          onClick={handleCloseImptInfo}
        ></button>
        <br />
        <br />
        <hr />

        <div className="image-zoom imp_content" dangerouslySetInnerHTML={{ __html: popupdata }}>
          
        </div>
      </div>
    </RBmodal>
  );
}

export default ImportantInfo;
