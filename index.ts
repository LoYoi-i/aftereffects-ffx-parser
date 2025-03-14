console.log(hexToFileString("30000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"));
var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
function hexToFileString(hex) {
  var fileString = "";
  for (var i = 0; i < hex.length / 2; i++) {
    var bit = hex.substr(i * 2, 2);
    var s = String.fromCharCode("0x" + bit);
    fileString += s;
  }
  return fileString;
}
// function _atob(input) {
//   var str = String(input).replace(/[=]+$/, "");
//   if (str.length % 4 === 1) {
//     throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
//   }
//   for (
//     var bc = 0, bs, buffer, idx = 0, output = "";
//     (buffer = str.charAt(idx++));
//     ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
//       ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
//       : 0
//   ) {
//     buffer = b64.indexOf(buffer);
//   }
//   return output;
// }
function createPart2Name(text) {
  var nameString = "";
  nameString += hexToFileString((text.length + 1).toString(16));
  nameString += text;
  nameString += text.length % 2 == 0 ? hexToFileString("0000") : hexToFileString("00");
  return nameString;
}

// const text = "Pseudo/444488";
// var controlName = decodeURIComponent(text);
// const a = createPart2Name(controlName)

// let hexString = Array.from(a).map(char => 
//    char.charCodeAt(0).toString(16).padStart(2, '0')
// ).join('');
// console.log(hexString);
// console.log(a);
