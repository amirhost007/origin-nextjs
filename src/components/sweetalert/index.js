import Swal from "sweetalert2";

export const errorPop = (title, text) => {
  Swal.fire({
    icon: "error",
    title: title,
    text: text,
  });
};
