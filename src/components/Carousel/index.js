import React from "react";
import Slider from "react-slick";

export default function Carousel({ settings, btnRef, children }) {
  return (
    <>
      <Slider ref={btnRef} {...settings}>
        {children}
      </Slider>
    </>
  );
}
