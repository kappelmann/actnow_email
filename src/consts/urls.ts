import { MEPS } from "./databases";

// FIXME: Make URL handling uniform and clean
export const URLS = {
  // FIXME: auto align version number to package.json
  SQL_JS: "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.3.0/dist/",
  DATABASES: {
    MEPS: `/databases/${MEPS}`
  },
  SHORT_LINK_CREDENTIALS: "https://actnow.link/credentials.php",
  SHORTEN_LINK_DOMAIN: "https://actnow.link",
  SHORTEN_LINK: "https://actnow.link/public-api.php",
  MAILTO: "/mailto",
  MEPS: "meps",
  GITHUB: "https://github.com/kappelmann/mep_contact_frontend",
  KLIMA_CAFE: "https://klima.cafe",
  TWITTER: "https://twitter.com/CafeKlima"
};

export default URLS;
