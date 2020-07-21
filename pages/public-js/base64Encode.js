
const base64Encode = (str1) => { // 编码，配合encodeURIComponent使用
  var c1, c2, c3;
  var str = utf8Eecode(str1)
  var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var i = 0,
      len = str.length,
      strin = '';
  while (i < len) {
      c1 = str.charCodeAt(i++) & 0xff;
      if (i == len) {
          strin += base64EncodeChars.charAt(c1 >> 2);
          strin += base64EncodeChars.charAt((c1 & 0x3) << 4);
          strin += "==";
          break;
      }
      c2 = str.charCodeAt(i++);
      if (i == len) {
          strin += base64EncodeChars.charAt(c1 >> 2);
          strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
          strin += base64EncodeChars.charAt((c2 & 0xF) << 2);
          strin += "=";
          break;
      }
      c3 = str.charCodeAt(i++);
      strin += base64EncodeChars.charAt(c1 >> 2);
      strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
      strin += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
      strin += base64EncodeChars.charAt(c3 & 0x3F)
  }
  return strin
}
const base64Decode = (str) => {
  var base64DecodeChars = new Array(
      -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
      52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
      -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
      15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
      -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
      41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
  var c1, c2, c3, c4;
  var i, len, out;

  len = str.length;
  i = 0;
  out = "";
  while (i < len) {
      /* c1 */
      do {
          c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
      } while (i < len && c1 == -1);
      if (c1 == -1)
          break;

      /* c2 */
      do {
          c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
      } while (i < len && c2 == -1);
      if (c2 == -1)
          break;

      out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

      /* c3 */
      do {
          c3 = str.charCodeAt(i++) & 0xff;
          if (c3 == 61) {
              return utf8Decode(out);
          }

          c3 = base64DecodeChars[c3];
      } while (i < len && c3 == -1);
      if (c3 == -1)
          break;

      out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

      /* c4 */
      do {
          c4 = str.charCodeAt(i++) & 0xff;
          if (c4 == 61) {
              return utf8Decode(out);
          }
          c4 = base64DecodeChars[c4];
      } while (i < len && c4 == -1);
      if (c4 == -1)
          break;
      out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
  }
  return utf8Decode(out);
}
const utf8Decode = (string) => {
  if (typeof string !== 'string') return string;
  var output = "", i = 0, charCode = 0;

  while (i < string.length) {
      charCode = string.charCodeAt(i);

      if (charCode < 128)
          output += String.fromCharCode(charCode),
              i++;
      else if ((charCode > 191) && (charCode < 224))
          output += String.fromCharCode(((charCode & 31) << 6) | (string.charCodeAt(i + 1) & 63)),
              i += 2;
      else
          output += String.fromCharCode(((charCode & 15) << 12) | ((string.charCodeAt(i + 1) & 63) << 6) | (string.charCodeAt(i + 2) & 63)),
              i += 3;
  }

  return output;
}

const utf8Eecode = (string) => {
  if (typeof string !== 'string') return string;
  else string = string.replace(/\r\n/g, "\n");
  var output = "", i = 0, charCode;

  for (i; i < string.length; i++) {
      charCode = string.charCodeAt(i);

      if (charCode < 128)
          output += String.fromCharCode(charCode);
      else if ((charCode > 127) && (charCode < 2048))
          output += String.fromCharCode((charCode >> 6) | 192),
              output += String.fromCharCode((charCode & 63) | 128);
      else
          output += String.fromCharCode((charCode >> 12) | 224),
              output += String.fromCharCode(((charCode >> 6) & 63) | 128),
              output += String.fromCharCode((charCode & 63) | 128);
  }

  return output;
}


module.exports = {
  encode: base64Encode,
  utf8Encode: utf8Eecode,
  utf8Decode: utf8Decode,
  decode: base64Decode,
}


