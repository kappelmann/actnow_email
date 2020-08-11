import { MEPS } from "./databases";

// FIXME: Make URL handling uniform and clean
export const URLS = {
  // FIXME: auto align version number to package.json
  SQL_JS: "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.3.0/dist/",
  DATABASES: {
    MEPS: `/databases/${MEPS}/`,
  },
  MAILTO: "/mailto/",
  MEPS: "/",
  GITHUB: "https://github.com/kappelmann/mep_contact_frontend",
  TWITTER: "https://klima.cafe"
};

export default URLS;
