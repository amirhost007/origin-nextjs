import React from "react";

function AutoComplete({ locations, handlePickUpLocation }) {
  return (
    <>
      <div className="lctn-drpdn">
        <ul>
          {locations?.map((res, i) => (
            <li key={i} onClick={() => handlePickUpLocation(res.name)} className="location-select">
              {res.name}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default AutoComplete;
