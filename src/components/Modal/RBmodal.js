import Modal from "react-bootstrap/Modal";

function RBmodal({ show, handleClose, size, ID, children }) {
  return (
    <>
      <Modal
        size={size}
        show={show}
        onHide={handleClose}
        keyboard={false}
        id={ID}
      >
        {/* <Modal.Dialog> */}
        {children}
        {/* </Modal.Dialog> */}
      </Modal>
    </>
  );
}

export default RBmodal;
