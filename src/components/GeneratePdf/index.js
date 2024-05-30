import React from "react";
// import styles from "../styles/Pdf.module.css";
import styles from "../../styles/Pdf.module.css";
// jspdf 1.3.3

const Prints = () => (
  // <main id="main">
  //   <section id="ld-lst" className="mt-35">
      <div
        className={styles.container}
        style={{
          border: "1px solid #b9b9b9",
          borderRadius: "20px",
          padding: "20px",
        }}
      >
        <div className={styles.logo}>
          <img src="/assets/img/logo.png" alt="" />
        </div>
        <div className="bkd-no">
          <h2
            style={{ marginTop: "0", fontSize: "20px", marginBottom: "15px" }}
          >
            Id No. #123456984654
          </h2>
          <p style={{ fontSize: "12px", color: "#484848" }}>
            25 Mar 2023 12:03 to <span>26 Mar 2023 12:03</span>
          </p>
        </div>
        <h2
          style={{ marginTop: "50px", fontSize: "20px", marginBottom: "15px" }}
        >
          Trip details
        </h2>
        <div
          className="trp-dtl"
          style={{ display: "flex", alignItems: "center" }}
        >
          <ul
            style={{
              display: "flex",
              padding: 0,
              listStyle: "none",
              alignItems: "center",
              width: "50%",
            }}
          >
            <li style={{ marginRight: "30px" }}>
              <i>
                <img
                  style={{ marginRight: "5px" }}
                  src="/assets/img/tag.svg"
                  alt=""
                />
              </i>
              $1955.2
            </li>
            <li style={{ marginRight: "30px" }}>
              <i>
                <img
                  style={{ marginRight: "5px" }}
                  src="/assets/img/money.svg"
                  alt=""
                />
              </i>
              Stripe
            </li>
          </ul>
          <div
            className="car-img"
            style={{ width: "50%", textAlign: "center" }}
          >
            <img
              style={{ maxWidth: "100%" }}
              src="/assets/img/cr-8.png"
              alt=""
            />
            <h2
              style={{
                marginTop: "20px",
                fontSize: "20px",
                marginBottom: "15px",
              }}
            >
              Volkswagen Passat Estate
            </h2>
          </div>
        </div>
        <h3 style={{ margin: "50px 0 20px" }} className={styles.h_style}>
          Route
        </h3>
        <div className={styles.pic_dro}>
          <div className={styles.widt_d}>
            <span style={{ display: "block", fontSize: "14px" }}>
              Pickup point
            </span>
            <h3 style={{ margin: "10px 0 0" }} className={styles.h_style}>
              Tirana Airport
            </h3>
            <p>12:03 pm</p>
          </div>
          <div className={styles.widt_d}>
            <span style={{ display: "block", fontSize: "14px" }}>
              Pickup point
            </span>
            <h3 className={styles.h_style} style={{ margin: "10px 0 0" }}>
              Tirana Airport
            </h3>
            <p>12:03 pm</p>
          </div>
        </div>
        <h3 style={{ margin: "50px 0 0px" }} className={styles.h_style}>
          Price breakdown
        </h3>
        <div style={{ width: "50%" }}>
          <ul
            className={styles.price_dtl}
            style={{
              padding: 0,
              listStyle: "none",
              marginTop: 0,
            }}
          >
            <li>
              Car rental price <span>$1500</span>
            </li>
            <li>
              Price for 3 days: <span>$1500</span>
            </li>
            <li>
              Price for 3 days: <span>$1500</span>
            </li>
          </ul>
        </div>
      </div>
  //   </section>
  // </main>
);

// const GeneratePDF = () => (
//   <div style={styles}>
//     <h2>Start editing to see some magic happen {"\u2728"}</h2>
//     <button onClick={print}>print</button>
//   </div>
// );

export default Prints;
