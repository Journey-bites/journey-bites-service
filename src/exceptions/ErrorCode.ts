const enum ErrorCode {
  NORMAL = 0,
  ROUTE_NOT_FOUND = 1001,
  PERMISSION_DENIED = 1002,
  ILLEGAL_PAYLOAD = 1003,
  ILLEGAL_QUERY_STRING = 1004,
  ILLEGAL_PATH_PARAMETER = 1005,
  INVALID_ID = 1006,
  USER_NOT_FOUND = 2001,
  USER_ALREADY_EXISTS = 2002,
  USER_NOT_AUTHORIZED = 2003,
  USER_NOT_VERIFIED = 2004,
  USER_NOT_ACTIVE = 2005,
  USER_NOT_VERIFIED_EMAIL = 2006,
  USER_NOT_VERIFIED_PHONE = 2007,
  USER_PASSWORD_NOT_MATCH = 2008,
  INTERNAL_SERVER_ERROR = 9999,
}

export default ErrorCode;
