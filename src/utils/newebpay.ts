import { createCipheriv, createDecipheriv, createHash } from 'crypto';

export type GenDataChain = {
  MerchantOrderNo: string;
  TimeStamp: number;
  Amt: number;
  ItemDesc: string;
  Email: string;
};

export type NewebpayReturnData = {
  MerchantID: string;
  Amt: number;
  TradeNo: string;
  MerchantOrderNo: string;
  RespondType: string;
  IP: string;
  EscrowBank: string;
  ItemDesc: string;
  PaymentType: string;
  PayTime: string;
  PayerAccount5Code: string;
  PayBankCode: string;
};

export type NewebpayReturnResponse = {
  Status: 'SUCCESS' | 'FAILURE';
  Message: string;
  Result: NewebpayReturnData;
};

const { NEWEBPAY_MERCHANT_ID, NEWEBPAY_HASH_KEY, NEWEBPAY_HASH_IV, NEWEBPAY_VERSION } = process.env;

const encodeParams = (params: Record<string, string | number>): string => {
  return Object.keys(params)
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
};

/**
 * Generates a data string for NewebPay API requests.
 */
const generateDataChain = (data: GenDataChain) => {
  const params = {
    MerchantID: NEWEBPAY_MERCHANT_ID,
    Version: NEWEBPAY_VERSION,
    RespondType: 'JSON',
    ...data,
  };

  return encodeParams(params);
};

/**
 * Encrypts data using AES algorithm.
 */
export const createMpgAesEncrypt = (tradeInfo: GenDataChain) => {
  const encrypt = createCipheriv('aes256', NEWEBPAY_HASH_KEY, NEWEBPAY_HASH_IV);
  const enc = encrypt.update(generateDataChain(tradeInfo), 'utf8', 'hex');
  return enc + encrypt.final('hex');
};

/**
 * Creates an SHA256 hash of the encrypted data.
 */
export const createMpgShaEncrypt = (aesEncrypt: string) => {
  const sha = createHash('sha256');
  const plainText = `HashKey=${NEWEBPAY_HASH_KEY}&${aesEncrypt}&HashIV=${NEWEBPAY_HASH_IV}`;
  return sha.update(plainText).digest('hex').toUpperCase();
};

/**
 * Decrypts AES encrypted data back into plain text.
 */
export const createMpgAesDecrypt = (tradeInfo: string) => {
  const decrypt = createDecipheriv('aes256', NEWEBPAY_HASH_KEY, NEWEBPAY_HASH_IV);
  decrypt.setAutoPadding(false);
  const text = decrypt.update(tradeInfo, 'hex', 'utf8');
  const plainText = text + decrypt.final('utf8');
  // eslint-disable-next-line no-control-regex
  const result = plainText.replace(/[\x00-\x20]+/g, '');
  return JSON.parse(result) as NewebpayReturnResponse;
};
