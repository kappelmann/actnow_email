// NOTE: NOT USED FOR NOW
/* eslint-disable indent */
// import { Schema } from "./types";

// {
  // "meps": [
    // {
      // "Field": "mep_id",
      // "PrimaryKey": true,
      // "Type": "INTEGER",
      // "Null": false,
      // "Default": null
    // },
    // {
      // "Field": "name",
      // "PrimaryKey": false,
      // "Type": "TEXT",
      // "Null": false,
      // "Default": null
    // },
    // {
      // "Field": "eu_fraction",
      // "PrimaryKey": false,
      // "Type": "TEXT",
      // "Null": false,
      // "Default": null
    // },
    // {
      // "Field": "national_party",
      // "PrimaryKey": false,
      // "Type": "TEXT",
      // "Null": false,
      // "Default": null
    // }
  // ],
  // "emails": [
    // {
      // "Field": "mep_id",
      // "PrimaryKey": false,
      // "Type": "INTEGER",
      // "Null": true,
      // "Default": null
    // },
    // {
      // "Field": "email",
      // "PrimaryKey": false,
      // "Type": "TEXT",
      // "Null": false,
      // "Default": null
    // }
  // ],
  // "roles": [
    // {
      // "Field": "mep_id",
      // "PrimaryKey": false,
      // "Type": "INTEGER",
      // "Null": true,
      // "Default": null
    // },
    // {
      // "Field": "committee",
      // "PrimaryKey": false,
      // "Type": "TEXT",
      // "Null": false,
      // "Default": null
    // },
    // {
      // "Field": "role",
      // "PrimaryKey": false,
      // "Type": "TEXT",
      // "Null": false,
      // "Default": null
    // }
  // ],
  // "national_parties": [
    // {
      // "Field": "party",
      // "PrimaryKey": false,
      // "Type": "TEXT",
      // "Null": false,
      // "Default": null
    // },
    // {
      // "Field": "country",
      // "PrimaryKey": false,
      // "Type": "TEXT",
      // "Null": false,
      // "Default": null
    // }
  // ]
// }

/*
export const SCHEMA : Schema = JSON.parse(`
{
  "national_parties": {
    "Name": "national_parties",
    "Columns": {
      "national_party_id": {
        "Name": "national_party_id",
        "PrimaryKey": true,
        "Type": "INTEGER",
        "Null": false,
        "Default": null
      },
      "party": {
        "Name": "party",
        "PrimaryKey": false,
        "Type": "TEXT",
        "Null": false,
        "Default": null
      },
      "country": {
        "Name": "country",
        "PrimaryKey": false,
        "Type": "TEXT",
        "Null": false,
        "Default": null
      }
    }
  },
  "meps": {
    "Name": "meps",
    "Columns": {
      "mep_id": {
        "Name": "mep_id",
        "PrimaryKey": true,
        "Type": "INTEGER",
        "Null": false,
        "Default": null
      },
      "name": {
        "Name": "name",
        "PrimaryKey": false,
        "Type": "TEXT",
        "Null": false,
        "Default": null
      },
      "eu_fraction": {
        "Name": "eu_fraction",
        "PrimaryKey": false,
        "Type": "TEXT",
        "Null": false,
        "Default": null
      },
      "national_party_id": {
        "Name": "national_party_id",
        "PrimaryKey": false,
        "Type": "INTEGER",
        "Null": false,
        "Default": null
      }
    }
  },
  "emails": {
    "Name": "emails",
    "Columns": {
      "mep_id": {
        "Name": "mep_id",
        "PrimaryKey": false,
        "Type": "INTEGER",
        "Null": true,
        "Default": null
      },
      "email": {
        "Name": "email",
        "PrimaryKey": false,
        "Type": "TEXT",
        "Null": false,
        "Default": null
      }
    }
  },
  "roles": {
    "Name": "roles",
    "Columns": {
      "mep_id": {
        "Name": "mep_id",
        "PrimaryKey": false,
        "Type": "INTEGER",
        "Null": true,
        "Default": null
      },
      "committee": {
        "Name": "committee",
        "PrimaryKey": false,
        "Type": "TEXT",
        "Null": false,
        "Default": null
      },
      "role": {
        "Name": "role",
        "PrimaryKey": false,
        "Type": "TEXT",
        "Null": false,
        "Default": null
      }
    }
  }
}`);
*/
// export default SCHEMA;
