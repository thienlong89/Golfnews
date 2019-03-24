/**
 * 
 * @param string 
 */
export function md5(string?: string): string;
/**
 * 
 * @param string 
 */
export function sha256(string?: string): string;

export function formatString(format?: string, args?: any): string;

export function getFormatAgoTime(timestamp?: any): any;

export function getFormatTime(timestamp?: any): any;

export function convertSolarToLunar(dd = 0, mm = 0, yy = 0, timezone = 7): any;

/**
 * Fomat time
 * @param input timestamp
 * @param reference 
 */
export function relativeDate(input ? : Number,reference? : any);