/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
});

const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXTAUTH_URL: "https://originrent.com/",
    NEXT_PUBLIC_API_BASE_URL: "https://originlaravel.iahwservice.com/api/",
    NEXT_PUBLIC_PDF_BASE_URL: "https://originlaravel.iahwservice.com/",
    NEXT_PUBLIC_GOOGLE_CLIENT_ID:
      "539938794424-u46ueh3scdpgejreuddg3olvrd5ckvhn.apps.googleusercontent.com",
    NEXT_PUBLIC_GOOGLE_SECRET_ID: "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",
    NEXT_PUBLIC_JWT_SECRET:
      "752fdc13b8bf6fc8d0efda330e2553aa00b3424a047550c72d1d9d3f156cbeed",
    NEXT_PUBLIC_FACEBOOK_APP_ID: "1347654809114635",
    NEXT_PUBLIC_FACEBOOK_SECRET: "9f1665befbbf23e3103824d9b5dbfec7",
  },
  i18n: {
    // The locales you want to support in your app
    locales: ["ar", "en"],
    // The default locale you want to be used when visiting a non-locale prefixed path e.g. `/hello`
    defaultLocale: "ar",
    localeDetection: false,
  },
};

module.exports = withPWA({
  ...nextConfig,
});
