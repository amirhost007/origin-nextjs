import Header from "@/components/Header";
import Head from "next/head";

function Trip() {
  return (
    <>
      <Head>
        <title>Origin Rent | Trips </title>
        <meta
          name="description"
          content="Origin Rent is Car hire service platform for those users who need cars on rent."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/img/favicon.png" />
      </Head>
      <Header />
      <main id="main" className="my-trips">
        <div className="container">
          {/* <div className="tab_container"> */}
          <div id="tab1" className="tab_content">
            <a className="bct-trp" href="my-trips.html">
              <img src="/assets/img/back-a.svg" alt="" className="img-fluid" />{" "}
              Back to trips
            </a>
            <h2 className="mb-2">Your Trip</h2>
            <div className="tim-sts text-start">
              Mon, 2 Jan, 2023, 10:00 to Thu, 5 Jan, 2023, 10:00
            </div>
            <div className="map-loc">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28895.918276542365!2d55.2498073259747!3d25.13603621677278!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f682829c85c07%3A0xa5eda9fb3c93b69d!2sThe%20Dubai%20Mall!5e0!3m2!1sen!2sin!4v1674452851886!5m2!1sen!2sin"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <div className="row rting-sc">
              <div className="col-md-12">
                <h4>Rate Trip</h4>
              </div>
              <div className="col-md-8">
                <div className="stars">{/* Rating */}</div>
              </div>
              <div className="col-md-4 text-end">
                <a href="">
                  <img
                    src="/assets/img/right-arrow.svg"
                    alt=""
                    className="img-fluid"
                  />
                </a>
              </div>
              <hr />
            </div>

            <div className="row rting-sc">
              <div className="col-md-12">
                <h4>Trip details</h4>
              </div>
              <div className="col-md-12">
                <ul>
                  <li>
                    <img
                      src="/assets/img/taxi.svg"
                      alt=""
                      className="img-fluid"
                    />{" "}
                    Premium
                  </li>
                  <li>
                    <img
                      src="/assets/img/road-with-broken-line.svg"
                      alt=""
                      className="img-fluid"
                    />{" "}
                    9.17 kilometers
                  </li>
                  <li>
                    <img
                      src="/assets/img/time.svg"
                      alt=""
                      className="img-fluid"
                    />{" "}
                    23 min
                  </li>
                  <li>
                    <img
                      src="/assets/img/tag.svg"
                      alt=""
                      className="img-fluid"
                    />{" "}
                    $150
                  </li>
                  <li>
                    <img
                      src="/assets/img/money.svg"
                      alt=""
                      className="img-fluid"
                    />{" "}
                    Cash
                  </li>
                </ul>
              </div>
              <hr />
            </div>

            <div className="row rting-sc">
              <div className="col-md-12">
                <h4 className="mb-3">Route</h4>
              </div>
              <div className="col-md-6 d-flex align-items-center">
                <span>
                  <img
                    src="/assets/img/from-to.svg"
                    alt=""
                    className="img-fluid"
                  />
                </span>
                <div className="loctn">
                  <h4>
                    <span>Pickup point</span>
                    Heathrow Airport
                    <span className="time-pic">5:22 PM</span>
                  </h4>
                  <hr />
                  <h4>
                    <span>Drop point</span>
                    Málaga, Andalusia, Spain
                    <span className="time-pic">5:46 PM</span>
                  </h4>
                </div>
              </div>
              <hr className="mt-3" />
            </div>

            <div className="row rting-sc">
              <div className="col-md-8 mt-4 d-flex align-items-center">
                <img
                  src="assets/img/headphone.svg"
                  alt=""
                  className="img-fluid"
                />
                <h4 className="ms-3">Get Help</h4>
              </div>
              <div className="col-md-4 text-end">
                <a href="">
                  <img
                    src="/assets/img/right-arrow.svg"
                    alt=""
                    className="img-fluid"
                  />
                </a>
              </div>
            </div>
          </div>
          {/* </div> */}
        </div>
      </main>
    </>
  );
}

export default Trip;
