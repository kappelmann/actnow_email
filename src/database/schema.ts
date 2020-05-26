// NOTE: NOT USED FOR NOW
/* eslint-disable indent */
// import { Schema } from "./types";

// TODO: PR for
// 1. reanming Field to Name
// 2. make it object, not array
// 3. still safe the name of the object

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


// export const SCHEMA : Schema = JSON.parse(`{
  // "meps": {
    // "Name": "meps",
    // "Columns": {
      // "mep_id": {
        // "Name": "mep_id",
        // "Index": true,
        // "Type": "INTEGER",
        // "Null": "NO",
        // "Key": "PRI",
        // "Default": "",
        // "Extra": ""
      // },
      // "name": {
        // "Name": "name",
        // "Index": false,
        // "Type": "TEXT",
        // "Null": "NO",
        // "Key": "",
        // "Default": "",
        // "Extra": ""
      // },
      // "eu_fraction": {
        // "Name": "eu_fraction",
        // "Index": false,
        // "Type": "TEXT",
        // "Null": "NO",
        // "Key": "",
        // "Default": "",
        // "Extra": ""
      // },
      // "national_party": {
        // "Name": "national_party",
        // "Index": false,
        // "Type": "TEXT",
        // "Null": "NO",
        // "Key": "",
        // "Default": "",
        // "Extra": ""
      // }
    // }
  // },
  // "emails": {
    // "Name": "emails",
    // "Columns": {
      // "mep_id": {
        // "Name": "mep_id",
        // "Index": false,
        // "Type": "INTEGER",
        // "Null": "YES",
        // "Key": "",
        // "Default": "NULL",
        // "Extra": ""
      // },
      // "email": {
        // "Name": "email",
        // "Index": false,
        // "Type": "TEXT",
        // "Null": "NO",
        // "Key": "",
        // "Default": "",
        // "Extra": ""
      // }
    // }
  // },
  // "roles": {
    // "Name": "roles",
    // "Columns": {
      // "mep_id": {
        // "Name": "mep_id",
        // "Index": false,
        // "Type": "INTEGER",
        // "Null": "YES",
        // "Key": "",
        // "Default": "NULL",
        // "Extra": ""
      // },
      // "committee": {
        // "Name": "committee",
        // "Index": false,
        // "Type": "TEXT",
        // "Null": "NO",
        // "Key": "",
        // "Default": "",
        // "Extra": ""
      // },
      // "role": {
        // "Name": "role",
        // "Index": false,
        // "Type": "TEXT",
        // "Null": "NO",
        // "Key": "",
        // "Default": "",
        // "Extra": ""
      // }
    // }
  // },
  // "national_parties": {
    // "Name": "national_parties",
    // "Columns": {
      // "party": {
        // "Name": "party",
        // "Index": false,
        // "Type": "TEXT",
        // "Null": "NO",
        // "Key": "",
        // "Default": "",
        // "Extra": ""
      // },
      // "country": {
        // "Name": "country",
        // "Index": false,
        // "Type": "TEXT",
        // "Null": "NO",
        // "Key": "",
        // "Default": "",
        // "Extra": ""
      // }
    // }
  // }
// }`);

// export default SCHEMA;
