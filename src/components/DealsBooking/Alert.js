import Swal from "sweetalert2";

export const PayOnArraival = (staticData) => {
  return Swal.fire({
    title: "",
    html: `<h5>${staticData?.data?.additional_data?.amount_increased_due_to_some_processing_fee}</h5>`,
    showCancelButton: true,
    icon: "warning",
    showCancelButton: true,
    // confirmButtonColor: "#e2731e",
    customClass: {
      confirmButton: "sweet-alert-yes-button-confirm",
      cancelButton: "sweet-alert-cancel-button-cancel",
    },
    buttonsStyling: false,
    cancelButtonText: staticData?.data?.no,
    confirmButtonText: staticData?.data?.yes,
    // reverseButtons: true,
  });
};
