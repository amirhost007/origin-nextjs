import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CarList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [carListData, setCarListData] = useState([]);
  const [totalCars, setTotalCars] = useState(0);

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        setIsLoading(true);

        const europcarApiResponse = await axios.get('/api/europcar');
        console.log('Europcar API response:', europcarApiResponse.data);

        const stationScheduleResponse = await axios.get('/api/getStationSchedule');
        console.log('Station Schedule API response:', stationScheduleResponse.data);

        const carCategoriesResponse = await axios.get('/api/getCarCategories');
        console.log('Car Categories API response:', carCategoriesResponse.data);

        // Process the Europcar API response into a format compatible with your component
        const processedData = europcarApiResponse.data.map(station => {
          const carCategory = carCategoriesResponse.data.find(
            category => category.$.carCategoryCode === station.carCategoryCode
          );

          return {
            car_name: station.$.stationName,
            car_image: 'https://www.europcar.com/_nuxt/img/main-logo.569c225.svg',
            car_seat: carCategory ? carCategory.$.carCategorySeats : 'N/A',
            car_transmission: carCategory ? (carCategory.$.carCategoryAutomatic === 'Y' ? 'Automatic' : 'Manual') : 'N/A',
            luggageLarge: carCategory ? carCategory.$.carCategoryBaggageQuantity : 'N/A',
            luggageMed: carCategory ? carCategory.$.carCategoryBaggageQuantity : 'N/A',
            luggageSmall: carCategory ? carCategory.$.carCategoryBaggageQuantity : 'N/A',
            car_mileage: '20 km/l',
            grandTotal: 100,
            car_deposit: 200,
            supplier_id: 'Europcar',
            vendor_logo: 'https://origin-nextjs.vercel.app/assets/img/logo.png',
            open_hours: stationScheduleResponse.data,
            car_categories: carCategoriesResponse.data,
          };
        });

        console.log('Processed Data:', processedData);

        setCarListData(processedData);
        setTotalCars(processedData.length);
      } catch (error) {
        console.error('Error fetching car data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Available Cars ({totalCars})</h1>
      {carListData.map((res, i) => (
        <div className="car-pr-sct" key={i}>
          <div className="row">
            <div className="col-lg-3 col-md-12">
              <img
                className="img-fluid"
                src={res.car_image ? res.car_image : 'https://origin-nextjs.vercel.app/assets/img/logo.png'}
                alt=""
              />
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="cr-dtl">
                <div className="cr-prc-sct">
                  <h4>{res.car_name}</h4>
                </div>
                <div className="spciftn">
                  <ul>
                    {res.car_seat && (
                      <li>
                        <img
                          className="img-fluid"
                          src="/assets/img/car-seat.svg"
                          alt=""
                        />
                        {res.car_seat} Seats
                      </li>
                    )}
                    {res.car_transmission && (
                      <li>
                        <img
                          className="img-fluid"
                          src="/assets/img/gear.svg"
                          alt=""
                        />
                        {res.car_transmission}
                      </li>
                    )}
                    {res.luggageLarge && (
                      <li>
                        <img
                          className="img-fluid"
                          src="/assets/img/sport-bag.svg"
                          alt=""
                        />
                        {res.luggageLarge} Large Bags
                      </li>
                    )}
                    {res.luggageMed && (
                      <li>
                        <img
                          className="img-fluid"
                          src="/assets/img/camera-bag.svg"
                          alt=""
                        />
                        {res.luggageMed} Medium Bags
                      </li>
                    )}
                    {res.luggageSmall && (
                      <li>
                        <img
                          className="img-fluid"
                          src="/assets/img/camera-bag.svg"
                          alt=""
                        />
                        {res.luggageSmall} Small Bags
                      </li>
                    )}
                    {res.car_mileage && (
                      <li>
                        <img
                          className="img-fluid"
                          src="/assets/img/speedometer.svg"
                          alt=""
                        />
                        Mileage: {res.car_mileage}
                      </li>
                    )}
                  </ul>
                </div>
                <h5 className="d-flex align-items-center justify-content-between">
                  <span>
                    <img src="/assets/img/location.svg" alt="" />{' '}
                    {res.car_name} Location
                  </span>
                </h5>
                {/* Open Hours Section */}
                <div className="open-hours">
                  <h5>Open Hours:</h5>
                  <ul>
                    {res.open_hours && res.open_hours.map((hour, index) => (
                      <li key={index}>
                        Day {hour.$.dayNumber}: {hour.$.timeBegin} - {hour.$.timeEnd}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-12 pay_btn_div">
              <div>
                <p>
                  <img src="/assets/img/check.svg" alt="" /> Free Cancellation
                </p>
                <p>
                  Price for {res.days} days: <strong>${res.grandTotal}</strong>
                </p>
              </div>
              <div>
                <p>Deposit Amount: ${res.car_deposit}</p>
                <button
                  className="view-mdl"
                  id="man-book"
                  onClick={() =>
                    handleRedirect(res.car_id, 'BAS', carListData?.data?.insertedId)
                  }
                >
                  View Deals
                </button>
              </div>
            </div>
            <div className="col-md-12 car-onr">
              <div className="enqry">
                {res.supplier_id === 'Europcar' ? (
                  <img src="https://origin-nextjs.vercel.app/assets/img/logo.png" alt="" />
                ) : (
                  <img src={res.vendor_logo} alt="" />
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CarList;
