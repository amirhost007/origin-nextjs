import React from "react";
import Router from "next/router";
// import { getCookieData } from "@/utils/helper";
import { getCookie } from "cookies-next";

// const login = "/login"; // Define your login route address.

const checkUserAuthentication = async () => {
  let token = await getCookie("origin_rent_token");

  return { auth: token ? true : false }; // change null to { isAdmin: true } for test it.
};

// export const getServerSideProps = async ({ req, res }) => {
//   return { props: { token: req.cookies.origin_rent_token } };
// };

export default (WrappedComponent) => {
  const hocComponent = ({ ...props }) => <WrappedComponent {...props} />;

  hocComponent.getInitialProps = async (context) => {
    const userAuth = await checkUserAuthentication();

    // Are you an authorized user or not?
    if (!userAuth?.auth) {
      // Handle server-side and client-side rendering.
      if (context.res) {
        context.res?.writeHead(302, {
          Location: `/login?callbackUrl=${context?.resolvedUrl}`,
        });
        context.res?.end();
      } else {
        Router.replace(`/login?callbackUrl=${Router?.pathname}`);
      }
    } else if (WrappedComponent.getInitialProps) {
      const wrappedProps = await WrappedComponent.getInitialProps({
        ...context,
        auth: userAuth,
      });
      return { ...wrappedProps, userAuth };
    }

    return { userAuth };
  };

  return hocComponent;
};
