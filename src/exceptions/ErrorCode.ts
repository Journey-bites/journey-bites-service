/** Enum type for defining possible error codes in the system */
const enum ErrorCode {
  /** No error, operation is successful */
  NORMAL = 0,
  /** Specified route not found, possibly a bad URL */
  ROUTE_NOT_FOUND = 1001,
  /** Access denied due to insufficient permissions */
  PERMISSION_DENIED = 1002,
  /** Payload in request is illegal or malformed */
  ILLEGAL_PAYLOAD = 1003,
  /** Query string in the URL is illegal or malformed */
  ILLEGAL_QUERY_STRING = 1004,
  /** Path parameter in the URL is illegal or incorrect */
  ILLEGAL_PATH_PARAMETER = 1005,
  /** Provided identifier is invalid */
  INVALID_ID = 1006,
  /** Specified resource could not be found */
  RESOURCE_NOT_FOUND = 1007,
  /** General bad request error */
  BAD_REQUEST = 1008,
  /** Form data in request is illegal or malformed   */
  ILLEGAL_FORM_DATA = 1009,
  /** User not found in the db */
  USER_NOT_FOUND = 2001,
  /** User already exists in the db */
  USER_ALREADY_EXISTS = 2002,
  /** User is not authorized for the requested operation */
  USER_NOT_AUTHORIZED = 2003,
  /** User has not verified their account */
  USER_NOT_VERIFIED = 2004,
  /** User account is not active */
  USER_NOT_ACTIVE = 2005,
  /** User's email has not been verified */
  USER_NOT_VERIFIED_EMAIL = 2006,
  /** User's phone number has not been verified */
  USER_NOT_VERIFIED_PHONE = 2007,
  /** User's password does not match */
  USER_PASSWORD_NOT_MATCH = 2008,
  /** User duplicate follow */
  DUPLICATE_FOLLOW = 3001,
  /** User  duplicate subscription */
  DUPLICATE_SUBSCRIPTION = 3002,
  /** An unspecified internal server error has occurred */
  INTERNAL_SERVER_ERROR = 9999,
}

export default ErrorCode;
