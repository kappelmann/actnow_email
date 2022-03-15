export type DatabaseLocation = {
  URL: string,
  filename: string
};

export const DATABASE_LOCATIONS : Record<string, DatabaseLocation> = {
  MEPS: {
    URL: "/databases/meps",
    filename: "meps"
  }
};

export default DATABASE_LOCATIONS;
