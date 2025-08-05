declare module 'paytmchecksum' {
  export default class PaytmChecksum {
    static generateSignature(params: any, merchantKey: string): Promise<string>;
    static verifySignature(params: any, merchantKey: string, checksum: string): boolean;
  }
} 