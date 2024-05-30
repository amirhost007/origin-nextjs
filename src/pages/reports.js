import Head from "next/head";
import { useSelector } from "react-redux";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import Bookings from "@/components/Reports/Bookings";
import Revenue from "@/components/Reports/Revenue";

import Header from "@/components/Header";
import { useStaticContentQuery } from "@/store/Slices/apiSlice";

function Reports() {
  const { lang } = useSelector((state) => state.headData);
  const { data: staticData } = useStaticContentQuery(lang, {
    refetchOnMountOrArgChange: true,
  });
  return (
    <>
      <Head>
        <title>Origin Rent </title>
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
          <img
            src="/assets/img/my-trips-bnr.png"
            alt=""
            className="img-fluid my-trips-bg"
          />
          <Tab.Container id="left-tabs-example" defaultActiveKey="first">
            <ul className="tabs mble-show">
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="first">
                    <li>{staticData?.data?.book_ing}</li>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="second">
                    <li>{staticData?.data?.revenue}</li>
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </ul>
            <div className="tab_container p-0">
              <Tab.Content>
                <Tab.Pane eventKey="first">
                  <Bookings />
                </Tab.Pane>
                <Tab.Pane eventKey="second">
                  <Revenue />
                </Tab.Pane>
              </Tab.Content>
            </div>
          </Tab.Container>
        </div>
      </main>
    </>
  );
}

export const getServerSideProps = async ({ req, res }) => {
  let userData = req.cookies.origin_rent_userdata
    ? JSON.parse(req.cookies.origin_rent_userdata)
    : null;

  if (!userData || userData?.role_id !== 3) {
    if (res) {
      res?.writeHead(302, {
        Location: "/login",
      });
      res?.end();
    } else {
      Router.replace("/login");
    }
  }
  return { props: {} };
};
export default Reports;
