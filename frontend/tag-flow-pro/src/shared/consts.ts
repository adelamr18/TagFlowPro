const ORIGIN =
  (typeof window !== "undefined" && window.location.origin) ||
  process.env.REACT_APP_MAIN_HOST || // CRA
  process.env.VITE_MAIN_HOST || // Fallback for Vite
  "http://localhost:5500";

export const MAIN_HOST = ORIGIN;
export const API_URL = `${MAIN_HOST.replace(/\/+$/, "")}/api`;

export const ITEMS_PER_PAGE = 5;
export const ADMIN_ROLE_ID = 1;
export const USERS_TABLE_TYPE = "Users";
export const ADMINS_TABLE_TYPE = "Admins";
export const USERS_AND_ADMINS_SEARCH_PLACEHOLDER =
  "Search with a username or an email";
export const TAGS_TABLE_TYPE = "Tags";
export const PROJECTS_TABLE_TYPE = "Projects";
export const PATIENT_TYPES_TABLE_TYPE = "PatientTypes";
export const TAGS_PLACEHOLDER = "Search with a tag name";
export const OPERATOR_ROLE_ID = 2;
export const VIEWER_ROLE_ID = 3;
export const UNPROCESSED_FILE_STATUS = "Unprocessed";
export const FILENAME_SEARCH_PLACEHOLDER = "Search with a file name";
export const PROJECTS_PLACEHOLDER = "Search with a project name";
export const PATIENT_TYPES_PLACEHOLDER = "Search with a patient type";
