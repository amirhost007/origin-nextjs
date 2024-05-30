import Link from "next/link";
import { useSelector } from "react-redux";
import { useIntl } from "react-intl";
import { useGetHomeDataQuery } from "@/store/Slices/apiSlice";
import Carousel from "../Carousel";

export default function Footer() {
  const { userData } = useSelector((state) => state.auth);
  const { lang } = useSelector((state) => state.headData);
  const { data: home } = useGetHomeDataQuery(
    { lang, role_id: userData?.role_id },
    { refetchOnMountOrArgChange: true }
  );
  const { formatMessage } = useIntl();
  const f = (id) => formatMessage({ id });

  const partnerSettings = {
    dots: false,
    infinite: true,
    speed: 2000,
    autoplay: true,
    slidesToShow:
      home?.data?.partner_logo?.length > 4
        ? 4
        : home?.data?.partner_logo?.length,
    autoplaySpeed: 1000,
  };

  return (
    <>
      {/*  ======= Footer =======  */}
      <footer id="footer">
        <div className="footer-top">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-3 footer-contact">
                <img src="/assets/img/logo.png" className="img-fluid" alt="" />
              </div>

              <div className="col-md-9 footer-links">
                <ul>
                  {home?.data?.menu_item_footer.length &&
                    home?.data?.menu_item_footer
                      ?.filter((val) => val.id !== 13)
                      .map((item) => (
                        <li key={item.id}>
                          <Link href={item.link} legacyBehavior>
                            <a className="me-3">{item.name}</a>
                          </Link>
                        </li>
                      ))}
                  {home?.data?.menu_item_become_partner_supplier_footer.length
                    ? home?.data?.menu_item_become_partner_supplier_footer?.map(
                        (item) => (
                          <li key={item.id}>
                            <Link href={item.link} legacyBehavior>
                              <a className="btn-des">{item.name}</a>
                            </Link>
                          </li>
                        )
                      )
                    : null}
                </ul>
                {/* {userData?.role_id !== 3 && (
                    <li>
                      <Link href="/#cheap-deals" legacyBehavior>
                        <a className="me-3">{f("DEALS_AND_OFFER")}</a>
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link href="/contact" legacyBehavior>
                      <a className="me-3">{f("CONTACT_US")}</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/help" legacyBehavior>
                      {f("HELP")}
                    </Link>
                  </li>*/}
              </div>
            </div>
            {/* <li>
                        <Link href="/affiliate-partner" legacyBehavior>
                          <a className="btn-des">
                            {f("APPLY_TO_BECOME_AFFILIATE_PARTNER")}
                          </a>
                        </Link>
                      </li> */}
            <p>{home?.data?.setting?.footer_description}</p>
          </div>
        </div>

        <div className="container footer-bottom clearfix">
          {/* <section id="clients" className="clients">
            <div className="container">
              <div className="row">
                <Carousel settings={partnerSettings}>
                  {home?.data?.partner_logo &&
                    home?.data?.partner_logo?.length > 0 &&
                    home?.data?.partner_logo?.map((res, i) => (
                      <div
                        className="col-lg-2 col-md-4 col-6 d-flex align-items-center justify-content-center"
                        key={i}
                      >
                        <img
                          src={res.logo ? res.logo : ""}
                          className="img-fluid"
                          alt=""
                          style={{ width: "16rem" }}
                        />
                      </div>
                    ))}
                </Carousel>
              </div>
            </div>
          </section> */}
          <div className="copyright">
            {f("COPYRIGHT")} © {new Date().getFullYear()} .{" "}
            {f("ALL_RIGHTS_RESERVED")}
          </div>
        </div>
      </footer>
      {/* End Footer  */}
    </>
  );
}
