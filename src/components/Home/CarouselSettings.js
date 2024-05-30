export const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 2,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        arrows: false,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        initialSlide: 0,
        arrows: false,
      },
    },
  ],
};

export const supSettings = (slidesToShow) => ({
  dots: false,
  infinite: true,
  speed: 2000,
  autoplay: true,
  slidesToShow: slidesToShow?.length > 4 ? 4 : slidesToShow?.length,
  autoplaySpeed: 1000,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: slidesToShow?.length > 3 ? 3 : slidesToShow?.length,
        slidesToScroll: 3,
        infinite: true,
        arrows: false,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: slidesToShow?.length > 2 ? 2 : slidesToShow?.length,
        slidesToScroll: 2,
        initialSlide: 2,
        arrows: false,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: slidesToShow?.length > 1 ? 1 : slidesToShow?.length,
        slidesToScroll: 1,
        arrows: false,
      },
    },
  ],
});
