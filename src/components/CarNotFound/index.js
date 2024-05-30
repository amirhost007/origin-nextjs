import Link from "next/link";
import React from "react";

function CarNotFound({ error, size = false }) {
  return (
    <div className="opps-404">
      <div className="dtls-ops">
        <img
          className={size ? "image-not-found" : "img-fluid"}
          src="/assets/img/loction-found.png"
          alt=""
        />
        <h3>{error?.message ? error.message : "LOCATION NOT FOUND"}</h3>
        <p>
          {error?.suggestion ? (
            <div dangerouslySetInnerHTML={{ __html: error?.suggestion }} />
          ) : (
            <>
              There is no service available for this location.
              <br />
              Kindly search for another location.
            </>
          )}
        </p>
        {!size && (
          <Link href="/" legacyBehavior>
            <a>GO TO HOMEPAGE</a>
          </Link>
        )}
      </div>
    </div>
  );
}

export default CarNotFound;
