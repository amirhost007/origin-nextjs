import React from "react";
import { Slider } from "antd";

function FilterModal({
  handleClose,
  carListData,
  handleClearFilter,
  carSpecs,
  carFuel,
  mileageFilter,
  carBrandFilter,
  transmissionFilter,
  carCatFilter,
  handleCarSpaces,
  handleEleCar,
  handleMileageFilter,
  handleCarBrandFilter,
  handleCarCatFilterFilter,
  handleTransmissionFilter,
  staticData,
  minMax,
  handlePriceRange,
}) {
  return (
    <>
      <div
        className="pmt-methd"
        id="pmt-mdl-1"
        // tabindex="-1"
        // aria-labelledby="exampleModalLabel"
        // aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <button
              type="button"
              className="btn-close clss"
              //   data-bs-dismiss="modal"
              //   aria-label="Close"
              onClick={handleClose}
            ></button>

            <div className="modal-body">
              <h2 className="mb-3">{staticData?.data?.filter}</h2>
              <div className="col-md-12">
                <aside className="flter-car">
                  <h3>
                    {staticData?.data?.filter}
                    <a
                      style={{ cursor: "pointer" }}
                      onClick={handleClearFilter}
                    >
                      {staticData?.data?.clear}
                    </a>
                  </h3>
                  <ul className="fltr-che">
                    <h5>{staticData?.data?.price}</h5>
                    <Slider
                      range
                      min={0}
                      max={3000}
                      marks={{ 0: `0`, 3000: `3000` }}
                      value={minMax}
                      onChange={handlePriceRange}
                    />
                  </ul>
                  {carListData?.data["car-spaces-lang"] &&
                  Object.keys(carListData?.data["car-spaces-lang"]).length >
                    0 ? (
                    <ul className="fltr-che">
                      <h5>{carListData?.data?.filter_title?.car_specs}</h5>
                      {Object.keys(carListData?.data["car-spaces-lang"])?.map(
                        (res, i) => (
                          <li key={res.id}>
                            <input
                              type="checkbox"
                              name={res}
                              checked={carSpecs.hasOwnProperty(res)}
                              onChange={handleCarSpaces}
                            />{" "}
                            {carListData?.data["car-spaces-lang"][res]}
                          </li>
                        )
                      )}
                    </ul>
                  ) : null}
                  {carListData?.data["electric-car-lang"] &&
                  Object.keys(carListData?.data["electric-car-lang"]).length >
                    0 ? (
                    <ul className="fltr-che">
                      <h5>{carListData?.data?.filter_title?.car_fuel}</h5>
                      {Object.keys(carListData?.data["electric-car-lang"])?.map(
                        (res, i) => (
                          <li key={res.id}>
                            <input
                              type="checkbox"
                              name={res}
                              checked={carFuel.includes(res)}
                              onChange={handleEleCar}
                            />{" "}
                            {carListData?.data["electric-car-lang"][res]}
                          </li>
                        )
                      )}
                    </ul>
                  ) : null}
                  {carListData?.data["mileage_lang"] &&
                  Object.keys(carListData?.data["mileage_lang"]).length > 0 ? (
                    <ul className="fltr-che">
                      <h5>
                        {carListData?.data?.filter_title?.mileage_kilometres}
                      </h5>
                      {Object.keys(carListData?.data["mileage_lang"])?.map(
                        (res, i) => (
                          <li key={res.id}>
                            <input
                              type="checkbox"
                              name={res}
                              checked={mileageFilter.includes(res)}
                              onChange={handleMileageFilter}
                            />{" "}
                            {carListData?.data["mileage_lang"][res]}
                          </li>
                        )
                      )}
                    </ul>
                  ) : null}
                  {carListData?.data["car_brand_lang"] &&
                  Object.keys(carListData?.data["car_brand_lang"]).length >
                    0 ? (
                    <ul className="fltr-che">
                      <h5> {carListData?.data?.filter_title?.car_brand}</h5>
                      {Object.keys(carListData?.data["car_brand_lang"])?.map(
                        (res, i) => (
                          <li key={res.id}>
                            <input
                              type="checkbox"
                              name={res}
                              checked={carBrandFilter.includes(res)}
                              onChange={handleCarBrandFilter}
                            />{" "}
                            {carListData?.data["car_brand_lang"][res]}
                          </li>
                        )
                      )}
                    </ul>
                  ) : null}
                  {carListData?.data["transmission_lang"] &&
                  Object.keys(carListData?.data["transmission_lang"]).length >
                    0 ? (
                    <ul className="fltr-che">
                      <h5>{carListData?.data?.filter_title?.transmission}</h5>
                      {Object.keys(carListData?.data["transmission_lang"])?.map(
                        (res, i) => (
                          <li key={res.id}>
                            <input
                              type="checkbox"
                              name={res}
                              checked={transmissionFilter.includes(res)}
                              onChange={handleTransmissionFilter}
                            />{" "}
                            {carListData?.data["transmission_lang"][res]}
                          </li>
                        )
                      )}
                    </ul>
                  ) : null}
                  {carListData?.data["car_category_lang"] &&
                  Object.keys(carListData?.data["car_category_lang"]).length >
                    0 ? (
                    <ul className="fltr-che">
                      <h5>{carListData?.data?.filter_title?.car_category}</h5>
                      {Object.keys(carListData?.data["car_category_lang"])?.map(
                        (res, i) => (
                          <li key={res.id}>
                            <input
                              type="checkbox"
                              name={res}
                              checked={carCatFilter.includes(res)}
                              onChange={handleCarCatFilterFilter}
                            />{" "}
                            {carListData?.data["car_category_lang"][res]}
                          </li>
                        )
                      )}
                    </ul>
                  ) : null}
                </aside>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FilterModal;
