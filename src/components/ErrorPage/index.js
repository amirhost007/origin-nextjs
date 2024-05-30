import Link from "next/link";

function ErrorPage({ message }) {
  return ( 
    <>
      <div className="main_container error-pagemain">
        <div >
        <span className="error-num">5</span>
        <div className="eye"></div>
        <div className="eye"></div>

        <br />
        <p className="sub-text">
          {message ? (
            message
          ) : (
            <>
              Oh eyeballs! Something went wrong. We're <i>looking</i> to see
              what happened.
            </>
          )}
        </p>
        <Link className="getstarted scrollto" href="/" >
           Go home 
        </Link>
        </div>
      </div>
    </>
  );
}

export default ErrorPage;
