import Head from "next/head";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import MyTrips from "@/components/MyAccount/MyTrips";
import ProfileSettings from "@/components/MyAccount/ProfileSettings";
import ReferFriends from "@/components/MyAccount/ReferFriends";
import MasterSettings from "@/components/MyAccount/MasterSettings";
import { useSelector } from "react-redux";
import { Router } from "next/router";
import { useStaticContentQuery } from "@/store/Slices/apiSlice";
import Header from "@/components/Header";

function MyAccount() {
  const { userData } = useSelector((state) => state.auth);
  const { lang } = useSelector((state) => state.headData);
  const { data: staticData } = useStaticContentQuery(lang, {
    refetchOnMountOrArgChange: true,
  });

  return (
    <>
      <Head>
        <title>Origin Rent | My Account</title>
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
            <ul className="tabs tabs_active">
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="first">
                    <li className="" rel="tab1">
                      <img
                        src="/assets/img/distance.svg"
                        alt=""
                        className="img-fluid me-2"
                      />
                      {staticData?.data?.my_trips}
                    </li>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="second">
                    <li rel="tab2">
                      <img
                        src="/assets/img/user.svg"
                        alt=""
                        className="img-fluid me-2"
                      />
                      {staticData?.data?.profile_setting}
                    </li>
                  </Nav.Link>
                </Nav.Item>
                {/* <Nav.Item>
                  <Nav.Link eventKey="third">
                    <li rel="tab3">
                      <img
                        src="/assets/img/share.svg"
                        alt=""
                        className="img-fluid me-2"
                      />
                      {staticData?.data?.refer_friends}
                    </li>
                  </Nav.Link>
                </Nav.Item> */}
                {userData?.role_id == "3" && (
                  <Nav.Item>
                    <Nav.Link eventKey="four">
                      <li>
                        <img
                          src="/assets/img/user.svg"
                          alt=""
                          className="img-fluid me-2"
                        />
                        {staticData?.data?.master_setting}
                      </li>
                    </Nav.Link>
                  </Nav.Item>
                )}
              </Nav>
            </ul>
            <div className="tab_container">
              <Tab.Content>
                {/* #tab1  */}
                <Tab.Pane eventKey="first">
                  <MyTrips staticData={staticData} />
                </Tab.Pane>
                {/* #tab2  */}
                <Tab.Pane eventKey="second">
                  <ProfileSettings staticData={staticData} />
                </Tab.Pane>
                {/* #tab3  */}
                <Tab.Pane eventKey="third">
                  <ReferFriends staticData={staticData} />
                </Tab.Pane>
                {/* #tab4  */}
                {userData?.role_id == "3" && (
                  <Tab.Pane eventKey="four">
                    <MasterSettings staticData={staticData} />
                  </Tab.Pane>
                )}
              </Tab.Content>
            </div>
          </Tab.Container>
        </div>
      </main>
    </>
  );
}

export default MyAccount;

export const getServerSideProps = async ({ req, res }) => {
  let token = await req.cookies.origin_rent_token;
  if (!token) {
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
