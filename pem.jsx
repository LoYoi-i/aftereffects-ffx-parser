function getObjectKeys() {
  "use strict";
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var hasDontEnumBug = !{ toString: null }.propertyIsEnumerable("toString");
  var dontEnums = [
    "toString",
    "toLocaleString",
    "valueOf",
    "hasOwnProperty",
    "isPrototypeOf",
    "propertyIsEnumerable",
    "constructor",
  ];
  var dontEnumsLength = dontEnums.length;
  return function (obj) {
    if (typeof obj !== "function" && (typeof obj !== "object" || obj === null)) {
      throw new TypeError("Object.keys called on non-object");
    }
    var result = [];
    for (var prop in obj) {
      if (hasOwnProperty.call(obj, prop)) {
        result.push(prop);
      }
    }
    if (hasDontEnumBug) {
      for (var i = 0; i < dontEnumsLength; i++) {
        if (hasOwnProperty.call(obj, dontEnums[i])) {
          result.push(dontEnums[i]);
        }
      }
    }
    return result;
  };
}
function addEmptyItem(mn, num) {
  var h = "(" + mn + "-" + num;
  h += hexToFileString(
    "00000000000000000000000000000070617264000000940000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000074646D6E000000"
  );
  return h;
}
function createItemHeader(index) {
  var header = "";
  header += hexToFileString("28");
  header += createMatchName(index);
  header += hexToFileString("706172640000009400000000000000");
  header += hexToFileString("00");
  header += hexToFileString("00000000000000");
  return header;
}
function createMatchName(index, matchname) {
  if (typeof matchname === "undefined") {
    matchname = getMatchName();
  }

  if (index != -1) {
    var mnLen = matchname.length + 5;
    return matchname + "-" + index + hexToFileString(zeroPairs(40 - mnLen));
  } else {
    return matchname + hexToFileString(zeroPairs(40 - matchname.length));
  }
}
function createPart2Header(index) {
  var header = "";
  header += hexToFileString("28");
  header += createMatchName(index);
  header += hexToFileString("4C495354");
  return header;
}

function createPart2Name(text) {
  var nameString = "";
  nameString += hexToFileString((text.length + 1).toString(16));
  nameString += text;
  nameString += text.length % 2 == 0 ? hexToFileString("0000") : hexToFileString("00");
  return nameString;
}

function decodeIEEE32(value) {
  if (typeof value !== "number") {
    throw new TypeError("value must be a Number");
  }
  var result = { exponent: 0, isNegative: false, mantissa: 0 };
  if (value === 0) {
    return result;
  }
  if (!isFinite(value)) {
    result.exponent = 255;
    if (isNaN(value)) {
      result.isNegative = false;
      result.mantissa = 4194304;
    } else {
      result.isNegative = value === -Infinity;
      result.mantissa = 0;
    }
    return result;
  }
  if (value < 0) {
    result.isNegative = true;
    value = -value;
  }
  var e = 0;
  if (value >= Math.pow(2, -126)) {
    var r = value;
    while (r < 1) {
      e--;
      r *= 2;
    }
    while (r >= 2) {
      e++;
      r /= 2;
    }
    e += 127;
  }
  result.exponent = e;
  if (e != 0) {
    var f = value / Math.pow(2, e - 127);
    result.mantissa = Math.floor((f - 1) * Math.pow(2, 23));
  } else {
    result.mantissa = Math.floor(value / Math.pow(2, -149));
  }
  return result;
}
function decodeIEEE64(value) {
  value = parseFloat(value);
  if (isNaN(value)) {
    throw new TypeError("value must be a Number");
  }
  if (typeof value !== "number") {
    throw new TypeError("value must be a Number");
  }
  var result = { exponent: 0, isNegative: false, mantissa: 0 };
  if (value === 0) {
    return result;
  }
  if (!isFinite(value)) {
    result.exponent = 2047;
    if (isNaN(value)) {
      result.isNegative = false;
      result.mantissa = 2251799813685248;
    } else {
      result.isNegative = value === -Infinity;
      result.mantissa = 0;
    }
    return result;
  }
  if (value < 0) {
    result.isNegative = true;
    value = -value;
  }
  var e = 0;
  if (value >= Math.pow(2, -1022)) {
    var r = value;
    while (r < 1) {
      e--;
      r *= 2;
    }
    while (r >= 2) {
      e++;
      r /= 2;
    }
    e += 1023;
  }
  result.exponent = e;
  if (e != 0) {
    var f = value / Math.pow(2, e - 1023);
    result.mantissa = Math.floor((f - 1) * Math.pow(2, 52));
  } else {
    result.mantissa = Math.floor(value / Math.pow(2, -1074));
  }
  return result;
}
function formatIEEE32(value) {
  var ieee32 = decodeIEEE32(value);
  var e = ieee32.exponent;
  var m = ieee32.mantissa;
  var sBit = ieee32.isNegative ? "1" : "0";
  var eBit = e.toString(2);
  var mBit = m.toString(2);
  while (eBit.length < 8) {
    eBit = "0" + eBit;
  }
  while (mBit.length < 23) {
    mBit = "0" + mBit;
  }
  var binary = sBit + eBit + mBit;
  if (parseInt(binary, 2).toString(16) != "0") {
    return parseInt(binary, 2).toString(16);
  } else {
    return "00000000";
  }
}
function formatIEEE64(value) {
  var ieee64 = decodeIEEE64(value);
  var e = ieee64.exponent;
  var m = ieee64.mantissa;
  var b7 = ieee64.isNegative ? 128 : 0 | (e >> 4);
  var b6 = ((e & 15) << 4) | (m / 281474976710656);
  var b5 = 0 | ((m % 281474976710656) / 1099511627776);
  var b4 = 0 | ((m % 1099511627776) / 4294967296);
  var b3 = 0 | ((m % 4294967296) / 16777216);
  var b2 = 0 | ((m % 16777216) / 65536);
  var b1 = 0 | ((m % 65536) / 256);
  var b0 = 0 | m % 256;
  var decArray = [b7, b6, b5, b4, b3, b2, b1, b0];
  var rString = "";
  for (var i = 0; i < decArray.length; i++) {
    rString += pad2(decArray[i].toString(16));
  }
  return rString;
}
function hexToFileString(hex) {
  var fileString = "";
  for (var i = 0; i < hex.length / 2; i++) {
    var bit = hex.substr(i * 2, 2);
    var s = String.fromCharCode("0x" + bit);
    fileString += s;
  }
  return fileString;
}
function randomString(length) {
  var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var result = "";
  for (var i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}
function zeroPairs(num) {
  var zeros = "";
  for (var m = 0; m < num; m++) {
    zeros += "00";
  }
  return zeros;
}
function btoa(string) {
  string = String(string);
  var result = "";
  var i = 0;
  var rest = string.length % 3;
  for (; i < string.length; ) {
    if (
      (a = string.charCodeAt(i++)) > 255 ||
      (b = string.charCodeAt(i++)) > 255 ||
      (c = string.charCodeAt(i++)) > 255
    ) {
      throw new Error(
        "Failed to execute 'btoa' on 'Window': The string to be encoded contains characters outside of the Latin1 range."
      );
    }
    bitmap = (a << 16) | (b << 8) | c;
    result +=
      b64.charAt((bitmap >> 18) & 63) +
      b64.charAt((bitmap >> 12) & 63) +
      b64.charAt((bitmap >> 6) & 63) +
      b64.charAt(bitmap & 63);
  }
  return rest ? result.slice(0, rest - 3) + "===".substring(rest) : result;
}
function atob(input) {
  var str = String(input).replace(/[=]+$/, "");
  if (str.length % 4 === 1) {
    throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
  }
  for (
    var bc = 0, bs, buffer, idx = 0, output = "";
    (buffer = str.charAt(idx++));
    ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
      ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
      : 0
  ) {
    buffer = b64.indexOf(buffer);
  }
  return output;
}
function openColorPicker(color) {
  return $.colorPicker(color);
}
function getSelectedLayerDimensions() {
  if (app.project.numItems === 0) {
    return null;
  }
  var layers = app.project.activeItem.selectedLayers;
  if (typeof layers === "undefined" || layers.length === 0) {
    return null;
  }
  var main = layers[0];
  if (!(main instanceof AVLayer || main instanceof TextLayer || main instanceof ShapeLayer)) {
    return null;
  }
  return JSON.stringify({ height: main.height, width: main.width });
}
function getProjectBPC() {
  return JSON.stringify({ bpc: app.project.bitsPerChannel });
}
function decimalHexTwosComplement(decimal, size) {
  if (size === void 0) {
    size = 8;
  }
  var hexadecimal = Math.abs(decimal).toString(16);
  while (hexadecimal.length < size) {
    hexadecimal = "0" + hexadecimal;
  }
  return decimal >= 0 ? hexadecimal : (4294967296 - parseInt(hexadecimal, 16)).toString(16);
}
function showCustomMap(source_array, target_array, suggestion, initializeAuto) {
  function rebuildConnectionList() {
    listbox1.removeAll();
    var keyList = [];
    for (var c = 0; c < source.items.length; c++) {
      source.items[c].checked = false;
    }
    for (var sm in selectionMap) {
      if (sm !== "keys") {
        source.find(sm).checked = true;
        keyList.push(sm);
      }
    }
    keyList.sort(function (a, b) {
      return parseInt(a) - parseInt(b);
    });
    for (var i = 0; i < keyList.length; i++) {
      addConnectionListItem(keyList[i], selectionMap[keyList[i]]);
    }
  }
  function addConnectionListItem(source, target) {
    listbox1.add("item", source).subItems[0].text = target;
  }
  function filter(list, curArray) {
    return function () {
      var temp = this.text.toLowerCase();
      list.removeAll();
      var added = false;
      for (var i = 0; i < curArray.length; i++) {
        if (curArray[i].toLowerCase().indexOf(temp) !== -1) {
          list.add("item", curArray[i]);
          added = true;
        }
      }
      if (!added) {
        var empty = list.add("item", "No Matching Controls");
        empty.enabled = false;
      }
    };
  }
  if (suggestion === void 0) {
    suggestion = {};
  }
  if (initializeAuto === void 0) {
    initializeAuto = false;
  }
  var SEARCH_PLACEHOLDER = "Search...";
  var dialog = new Window("dialog");
  dialog.text = "Custom Mapping";
  dialog.orientation = "column";
  dialog.alignChildren = ["center", "top"];
  dialog.spacing = 10;
  dialog.margins = 16;
  var group1 = dialog.add("group");
  group1.orientation = "row";
  group1.alignChildren = ["left", "top"];
  group1.spacing = 10;
  group1.margins = 0;
  var group2 = group1.add("group");
  group2.orientation = "column";
  group2.alignChildren = ["left", "center"];
  group2.spacing = 10;
  group2.margins = 0;
  var statictext1 = group2.add("statictext");
  statictext1.text = "Current";
  var searchCurrent = group2.add("edittext");
  searchCurrent.text = SEARCH_PLACEHOLDER;
  searchCurrent.preferredSize.width = 200;
  var source = group2.add("listbox", undefined, source_array);
  source.preferredSize.width = 200;
  source.preferredSize.height = 200;
  for (var c = 0; c < source.items.length; c++) {
    source.items[c].checked = false;
  }
  var actions = group2.add("group");
  actions.orientation = "row";
  actions.alignChildren = ["left", "center"];
  actions.spacing = 10;
  actions.margins = 0;
  var buttonConnect = actions.add("button");
  buttonConnect.text = "Connect";
  buttonConnect.justify = "center";
  var buttonBreak = actions.add("button");
  buttonBreak.text = "Break";
  buttonBreak.justify = "center";
  buttonBreak.enabled = false;
  var group3 = group1.add("group");
  group3.orientation = "column";
  group3.alignChildren = ["left", "center"];
  group3.spacing = 10;
  group3.margins = [0, 0, 0, 10];
  var statictext2 = group3.add("statictext");
  statictext2.text = "New";
  var searchTarget = group3.add("edittext");
  searchTarget.text = SEARCH_PLACEHOLDER;
  searchTarget.preferredSize.width = 200;
  var target = group3.add("listbox", undefined, target_array);
  target.preferredSize.width = 200;
  target.preferredSize.height = 200;
  var group4 = group3.add("group");
  group4.preferredSize.width = 200;
  group4.orientation = "row";
  group4.alignChildren = ["right", "center"];
  group4.spacing = 10;
  group4.margins = 0;
  var buttonAuto = group4.add("button");
  buttonAuto.text = "Auto";
  buttonAuto.justify = "center";
  var group4 = dialog.add("group");
  group4.preferredSize.height = 101;
  group4.orientation = "column";
  group4.alignChildren = ["left", "center"];
  group4.spacing = 10;
  group4.margins = [0, 0, 0, 10];
  var statictext3 = group4.add("statictext");
  statictext3.text = "Results";
  var listbox1_array = [];
  var listbox1 = group4.add("listbox", undefined, listbox1_array, {
    columnTitles: ["From", "To"],
    columnWidths: [195, 195],
    numberOfColumns: 2,
    showHeaders: true,
  });
  listbox1.preferredSize.width = 410;
  listbox1.preferredSize.height = 100;
  var group5 = dialog.add("group");
  group5.orientation = "row";
  group5.alignChildren = ["left", "center"];
  group5.spacing = 10;
  group5.margins = 0;
  var button2 = group5.add("button", undefined, undefined, { name: "Ok" });
  button2.text = "Replace";
  button2.justify = "center";
  var button3 = group5.add("button", undefined, undefined, { name: "Cancel" });
  button3.text = "Cancel";
  button3.justify = "center";
  var selectionMap = {};
  source.onChange = function () {
    if (typeof selectionMap[source.selection.text] !== "undefined") {
      target.revealItem(selectionMap[source.selection.text]);
      target.selection = target.find(selectionMap[source.selection.text]);
      buttonBreak.enabled = true;
    } else {
      target.selection = null;
      buttonBreak.enabled = false;
    }
  };
  buttonConnect.onClick = function () {
    var sourceSelection = source.selection.text;
    var targetSelection = target.selection.text;
    if (sourceSelection && targetSelection) {
      var alreadyUsed = false;
      var alreadyUsedKey = "";
      for (var s in selectionMap) {
        if (selectionMap[s] === targetSelection) {
          alreadyUsed = true;
          alreadyUsedKey = s;
          break;
        }
      }
      if (
        !alreadyUsed ||
        confirm(
          "This target has already been connected. \n\n" +
            s +
            " \u2192 " +
            targetSelection +
            "\n\n Are you sure you want to change the connection?"
        )
      ) {
        selectionMap[sourceSelection] = targetSelection;
        addConnectionListItem(sourceSelection, targetSelection);
        buttonBreak.enabled = true;
        if (alreadyUsedKey !== "") {
          delete selectionMap[alreadyUsedKey];
        }
      }
      rebuildConnectionList();
    } else {
      alert("You must make a selection from both lists.");
      return;
    }
  };
  buttonBreak.onClick = function () {
    buttonBreak.enabled = false;
    var sourceSelection = source.selection.text;
    delete selectionMap[sourceSelection];
    target.selection = null;
    rebuildConnectionList();
  };
  var searchActivate = function () {
    if (this.text === SEARCH_PLACEHOLDER) {
      this.text = "";
    }
  };
  var searchDeactivate = function () {
    if (this.text === "") {
      this.text = SEARCH_PLACEHOLDER;
    }
  };
  searchCurrent.onActivate = searchActivate;
  searchCurrent.onDeactivate = searchDeactivate;
  searchTarget.onActivate = searchActivate;
  searchTarget.onDeactivate = searchDeactivate;
  searchCurrent.onChanging = filter(source, source_array);
  searchTarget.onChanging = filter(target, target_array);
  listbox1.onChange = function () {
    var temp = this.selection.text;
    source.revealItem(temp);
    source.selection = source.find(temp);
  };
  buttonAuto.onClick = function () {
    var count = 0;
    for (var smi in selectionMap) {
      if (selectionMap.hasOwnProperty(smi)) {
        count++;
      }
    }
    var doReset = true;
    if (count > 0) {
      if (!confirm("This will remove any existing connections. Are you sure you want to reset?")) {
        doReset = false;
      }
    }
    if (doReset) {
      selectionMap = suggestion;
      rebuildConnectionList();
    }
  };
  if (initializeAuto) {
    selectionMap = suggestion;
    rebuildConnectionList();
  }
  var done = dialog.show();
  if (done === 2) {
    return -1;
  }
  return selectionMap;
}
function copyProperties(from, to) {
  var issues = [];
  if (from.propertyValueType === PropertyValueType.NO_VALUE || typeof from.propertyValueType === "undefined") {
    return issues;
  }
  var possibleCompatibilityIssue = false;
  if (from.propertyValueType !== to.propertyValueType) {
    possibleCompatibilityIssue = true;
  }
  try {
    if (from.numKeys > 0) {
      if (!to.canVaryOverTime) {
        issues.push("Attempting to set keyframes on non-keyframable controls");
        return issues;
      }
      for (var k = 1; k <= from.numKeys; k++) {
        var t = from.keyTime(k);
        var v = from.keyValue(k);
        if (to.hasMax && v > to.maxValue) {
          v = to.maxValue;
        }
        if (to.hasMin && v < to.minValue) {
          v = to.minValue;
        }
        to.setValueAtTime(t, v);
        if (from.isSpatial) {
          if (!to.isSpatial) {
            issues.push("Some spatial properties do not match");
            return issues;
          }
          try {
            var ist = from.keyInSpatialTangent(k);
            var ost = from.keyOutSpatialTangent(k);
            to.setSpatialTangentsAtKey(k, ist, ost);
          } catch (_a) {}
          try {
            var sab = from.keySpatialAutoBezier(k);
            to.setSpatialAutoBezierAtKey(k, sab);
          } catch (_b) {}
          try {
            var sc = from.keySpatialContinuous(k);
            to.setSpatialContinuousAtKey(k, sc);
          } catch (_c) {}
          try {
            var kr = from.keyRoving(k);
            to.setRovingAtKey(k, kr);
          } catch (_d) {}
        }
        if (to.isInterpolationTypeValid(KeyframeInterpolationType.BEZIER)) {
          var ite = from.keyInTemporalEase(k);
          var ote = from.keyOutTemporalEase(k);
          to.setTemporalEaseAtKey(k, ite, ote);
        }
        try {
          var tab = from.keyTemporalAutoBezier(k);
          to.setTemporalAutoBezierAtKey(k, tab);
        } catch (_e) {}
        try {
          var tc = from.keyTemporalContinuous(k);
          to.setTemporalContinuousAtKey(k, tc);
        } catch (_f) {}
        try {
          var iit = from.keyInInterpolationType(k);
          var oit = from.keyOutInterpolationType(k);
          to.setInterpolationTypeAtKey(k, iit, oit);
        } catch (_g) {}
      }
    } else {
      try {
        var v = from.valueAtTime(0, true);
        to.setValue(v);
      } catch (err) {
        if (!to.canSetExpression) {
          if (from.expression != "") {
            issues.push(
              "Expressions can not be applied to invisible controls. To achieve a similar result, place this control into a new group and make the group invisible, rather than the control itself. `Undo` to recover any expressions that have been removed."
            );
          }
          return issues;
        }
        throw err;
      }
    }
  } catch (err) {
    if (possibleCompatibilityIssue) {
      issues.push("Values cannot be copied to incompatible controls");
    } else {
      alert(err.message);
      issues.push("An unknown error has occurred");
    }
  }
  if (from.canSetExpression) {
    try {
      to.expression = from.expression;
      to.expressionEnabled = from.expressionEnabled;
    } catch (err) {
      if (from.expression !== "") {
        issues.push(
          "Expressions can not be applied to invisible controls. To achieve a similar result, place this control into a new group and make the group invisible, rather than the control itself. `Undo` to recover any expressions that have been removed."
        );
      }
    }
  }
  return issues;
}
function compareAndUpdate(a1, a2) {
  if (typeof a2[0] === "undefined") {
    return [];
  }
  if (typeof a1[0] === "undefined") {
    return [a2];
  }
  if (a1[0].eq > a2[0].eq) {
    a2.shift();
  } else {
    a1.shift();
  }
  return [a1, a2];
}
function hasDuplicateBestMatch(totals) {
  try {
    var bestMatches = {};
    for (var i = 0; i < totals.length; i++) {
      var e = totals[i];
      if (typeof e === "undefined" || typeof e[0] === "undefined") {
        continue;
      }
      if (typeof bestMatches[e[0].index] !== "undefined") {
        return true;
      }
      bestMatches[e[0].index] = true;
    }
  } catch (err) {
    alert("HERE??: " + err.toString());
  }
  return false;
}
function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}
function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();
  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0) {
        costs[j] = j;
      } else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) {
      costs[s2.length] = lastValue;
    }
  }
  return costs[s2.length];
}
function generateEffectDetails(effect) {
  var numProperties = effect.numProperties;
  var currentData = [];
  for (var i = 1; i <= numProperties; i++) {
    var curProp = effect.property(i);
    var curControlData = {};
    curControlData.propertyType = curProp.propertyType;
    curControlData.propertyValueType = curProp.propertyValueType;
    if (curProp.propertyValueType !== PropertyValueType.NO_VALUE) {
      curControlData.value = curProp.value;
    }
    curControlData.canVaryOverTime = curProp.canVaryOverTime;
    curControlData.propertyDepth = curProp.propertyDepth;
    curControlData.isSpatial = curProp.isSpatial;
    curControlData.name = curProp.name;
    curControlData.name1 = curProp.name;
    curControlData.name2 = curProp.name;
    curControlData.unitsText = curProp.unitsText;
    curControlData.unitsText2 = curProp.unitsText;
    curControlData.propertyIndex = curProp.propertyIndex;
    curControlData.propertyIndex2 = curProp.propertyIndex;
    if (curProp.hasMax) {
      curControlData.maxValue = curProp.maxValue;
      curControlData.maxValue2 = curProp.maxValue;
    }
    if (curProp.hasMin) {
      curControlData.minValue = curProp.minValue;
      curControlData.minValue2 = curProp.minValue;
    }
    currentData.push(curControlData);
  }
  return currentData;
}
function shiftDuplicates(totals) {
  var matchingIndexes = {};
  totals.forEach(function (e, i) {
    if (typeof e === "undefined" || typeof e[0] === "undefined") {
      return;
    }
    var firstIndex = e[0].index;
    if (typeof matchingIndexes[firstIndex] === "undefined") {
      matchingIndexes[firstIndex] = i;
    } else {
      if (typeof totals[matchingIndexes[firstIndex]] === "undefined") {
        return;
      }
      try {
        var newVals = compareAndUpdate(e, totals[matchingIndexes[firstIndex]]);
        totals[i] = newVals[0];
        totals[matchingIndexes[firstIndex]] = newVals[1];
      } catch (err) {
        alert("Compare and Update" + err.toString());
      }
    }
  });
  return totals;
}
function rateEquality(o1, o2) {
  var k1 = getObjectKeys()(o1);
  var k2 = getObjectKeys()(o2);
  var possiblePoints = 0;
  var points = 0;
  if (k1.length !== k2.length) {
    return 0;
  }
  if (o1.propertyType !== o2.propertyType) {
    return 0;
  }
  for (var i = 0; i < k1.length; i++) {
    var k = k1[i];
    if (k === "name") {
      continue;
    }
    if (typeof o1[k] === typeof o2[k]) {
      points += 2;
    }
    possiblePoints += 2;
    if (k === "propertyIndex") {
      var distance = Math.abs(o1[k] - o2[k]) + 1;
      points += 1 / distance;
      possiblePoints++;
    }
    if (["object", "function"].indexOf(typeof o1[k]) === -1) {
      if (k === "minValue" || k === "maxValue") {
        possiblePoints += 3;
        if (o1[k] === o2[k]) {
          points += 3;
        }
      }
      if (o1[k] === o2[k]) {
        points++;
      }
      possiblePoints++;
    }
  }
  if (o1.name === o2.name) {
    points += 5;
  }
  points += similarity(o1.name, o2.name);
  possiblePoints++;
  return points / possiblePoints;
}
function getSelectableProps(input) {
  var props = [];
  for (var se = 1; se <= input.numProperties; se++) {
    var curProp = input.property(se);
    if (curProp.propertyValueType !== PropertyValueType.NO_VALUE && typeof curProp.propertyValueType !== "undefined") {
      props.push(curProp.propertyIndex + ". " + curProp.name);
    }
  }
  return props;
}
function replace(selectedEffect, compareEffect, manualMatching) {
  if (manualMatching === void 0) {
    manualMatching = true;
  }
  try {
    if (typeof selectedEffect === "undefined") {
      alert("You must select an effect");
      return;
    }
    if (!selectedEffect.isEffect) {
      alert("You must select only the effect you would like to update");
      return;
    }
  } catch (err) {
    alert("Verify" + err.toString());
    return;
  }
  var totals = [];
  try {
    var e1 = generateEffectDetails(selectedEffect);
    var e2 = generateEffectDetails(compareEffect);
  } catch (err) {
    alert("GenerateEffectDetails" + err.toString());
  }
  try {
    for (var i = 0; i + 1 < e1.length; i++) {
      var compare = [];
      for (var j = 0; j + 1 < e2.length; j++) {
        var equalityRating = rateEquality(e1[i], e2[j]);
        if (equalityRating > 0.4) {
          compare.push({ eq: equalityRating, index: e2[j].propertyIndex });
        }
      }
      totals.push(
        compare.sort(function (a, b) {
          return b.eq - a.eq;
        })
      );
    }
  } catch (err) {
    alert("Matching Error: " + err.toString());
  }
  try {
    while (hasDuplicateBestMatch(totals)) {
      totals = shiftDuplicates(totals);
    }
  } catch (err) {
    alert("ShiftDuplicates: " + err.toString());
  }
  if (manualMatching) {
    var source = getSelectableProps(selectedEffect);
    var target = getSelectableProps(compareEffect);
    var suggestions_1 = {};
    totals.forEach(function (e, i) {
      var mi = parseInt((e && e[0] && e[0].index) || "NO MATCH");
      if (!isNaN(mi)) {
        var curProp = selectedEffect.property(i + 1);
        if (
          curProp.propertyValueType === PropertyValueType.NO_VALUE ||
          typeof curProp.propertyValueType === "undefined"
        ) {
          return;
        }
        suggestions_1[curProp.propertyIndex + ". " + curProp.name] =
          compareEffect.property(mi).propertyIndex + ". " + compareEffect.property(mi).name;
      }
    });
    var response = showCustomMap(source, target, suggestions_1);
    if (response === -1) {
      var reselect = selectedEffect.propertyIndex;
      var pg = selectedEffect.parentProperty;
      compareEffect.remove();
      pg.property(reselect).selected = true;
      return;
    }
    totals = [];
    for (var c = 0; c < selectedEffect.numProperties; c++) {
      totals.push([]);
    }
    for (var r in response) {
      totals[parseInt(r) - 1] = [{ eq: 1, index: parseInt(response[r]) }];
    }
  }
  var issuesList = [];
  try {
    totals.forEach(function (e, i) {
      var mi = parseInt((e && e[0] && e[0].index) || "NO MATCH");
      if (!isNaN(mi)) {
        curIssue = copyProperties(selectedEffect.property(i + 1), compareEffect.property(mi));
        if (curIssue.length > 0) {
          curIssue.forEach(function (e) {
            if (issuesList.indexOf(e) === -1) {
              issuesList.push(e);
            }
          });
        }
      }
    });
  } catch (err) {
    alert("Copy Error" + err.toString());
  }
  try {
    var newName = compareEffect.name;
    var oldName = selectedEffect.name;
    var nameDiff = newName.replace(oldName, "");
    if (/\s\d/.test(nameDiff)) {
      compareEffect.name = selectedEffect.name;
    }
    var newIndex = selectedEffect.propertyIndex;
    var p = compareEffect.parentProperty;
    selectedEffect.remove();
    p.property(p.numProperties).moveTo(newIndex);
    p.property(newIndex).selected = true;
    if (issuesList.length > 0) {
      alert(
        "There were some issues while replacing your effect. \n\n" +
          issuesList.join("\n") +
          "\n\nIf you are using auto-matching, try using manual matching for better results. (See readme for details)",
        "Replacement Issues"
      );
    }
  } catch (err) {
    alert("Move Error" + err.toString());
  }
}
function create3DPointItem(index, last, text, xPercent, yPercent, zPercent, keys, hold, invisible) {
  var part1 = "";
  part1 += createItemHeader(index);
  part1 += hexToFileString("12");
  part1 += text;
  part1 += hexToFileString(zeroPairs(35 - text.length));
  part1 += hexToFileString(keys ? "00" : "02");
  part1 += hexToFileString(zeroPairs(4));
  part1 += hexToFileString(formatIEEE64(xPercent));
  part1 += hexToFileString(formatIEEE64(yPercent));
  part1 += hexToFileString(formatIEEE64(zPercent));
  part1 += hexToFileString(formatIEEE64(xPercent * 100));
  part1 += hexToFileString(formatIEEE64(yPercent * 100));
  part1 += hexToFileString(formatIEEE64(zPercent * 100));
  part1 += hexToFileString(zeroPairs(44));
  if (!last) {
    part1 += hexToFileString("74646D6E000000");
  }
  var part2 = "";
  part2 += createPart2Header(index);
  var p2Content = hexToFileString("746462737464736200000004000000");
  if (!invisible) {
    p2Content += hexToFileString("01");
  } else {
    p2Content += hexToFileString("03");
  }
  p2Content += hexToFileString("7464736E000000");
  p2Content += createPart2Name(text);
  p2Content += hexToFileString("746462340000007CDB990003000F0003FFFFFF");
  p2Content += hexToFileString(hold ? "04" : "FF");
  p2Content += hexToFileString(
    "00005DA83D9B7CDFD9D7BDBC3FF00000000000003FF00000000000003FF00000000000003FF000000000000000000008090000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000006364617400000048"
  );
  var width = 0;
  var height = 0;
  if (app.project.activeItem && app.project.activeItem.selectedLayers.length > 0) {
    var l = app.project.activeItem.selectedLayers[0];
    width = l.width;
    height = l.height;
  }
  p2Content += hexToFileString(formatIEEE64((width * xPercent) / 100));
  p2Content += hexToFileString(formatIEEE64((height * yPercent) / 100));
  p2Content += hexToFileString(formatIEEE64((height * zPercent) / 100));
  p2Content += hexToFileString(zeroPairs(48));
  var p2ContentLength = pad(p2Content.length.toString(16), 8);
  part2 += hexToFileString(p2ContentLength);
  part2 += p2Content;
  part2 += hexToFileString("74646D6E000000");
  return [part1, part2];
}
function hexFraction(num) {
  var limit = 0;
  var out = "";
  while (num != 0) {
    var all = num * 16;
    var i = Math.floor(all);
    var num = all - i;
    out += i.toString(16);
    if (limit > 10) {
      break;
    }
  }
  return out;
}
function createAngleItem(index, last, text, totalDegrees, keys, hold) {
  var part1 = "";
  part1 += createItemHeader(index);
  part1 += hexToFileString("03");
  part1 += text;
  part1 += hexToFileString(zeroPairs(35 - text.length));
  part1 += hexToFileString(keys ? "00" : "02");
  part1 += hexToFileString(zeroPairs(8));
  var split = totalDegrees.toString().split(".");
  if (split[1] && parseFloat(split[1]) !== 0 && parseInt(split[0]) < 0) {
    split[0] = (parseInt(split[0]) - 1).toString();
    split[1] = (1 - parseFloat("0." + split[1])).toString().substr(2);
  }
  if (split[0] < 0) {
    part1 += hexToFileString(pad4((parseInt(split[0]) >>> 0).toString(16)));
  } else {
    part1 += hexToFileString(pad4(parseInt(split[0]).toString(16)));
  }
  var hexFrac = "";
  if (split[1]) {
    hexFrac = hexFraction(parseFloat("0." + split[1]));
    while (hexFrac.length < 14) {
      hexFrac += "0";
    }
  } else {
    hexFrac = "00000000000000";
  }
  $;
  part1 += hexToFileString(hexFrac);
  part1 += hexToFileString(zeroPairs(79));
  if (!last) {
    part1 += hexToFileString("74646D6E000000");
  }
  var part2 = "";
  part2 += createPart2Header(index);
  var p2Content = hexToFileString("746462737464736200000004000000017464736E000000");
  p2Content += createPart2Name(text);
  p2Content += hexToFileString("746462340000007CBD99000100010000000100");
  p2Content += hexToFileString(hold ? "04" : "FF");
  p2Content += hexToFileString(
    "00005DA80000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006364617400000028"
  );
  p2Content += hexToFileString(formatIEEE64(totalDegrees));
  p2Content += hexToFileString(zeroPairs(32));
  var p2ContentLength = pad(p2Content.length.toString(16), 8);
  part2 += hexToFileString(p2ContentLength);
  part2 += p2Content;
  part2 += hexToFileString("74646D6E000000");
  return [part1, part2];
}
function createCheckboxControl(index, last, text, boxText, checked, keys, hold, invisible) {
  var part1 = "";
  part1 += createItemHeader(index);
  part1 += hexToFileString("04");
  part1 += text;
  part1 += hexToFileString(zeroPairs(35 - text.length));
  part1 += hexToFileString(keys ? "00" : "02");
  part1 += hexToFileString(zeroPairs(7));
  part1 += hexToFileString(checked ? "0001" : "0000");
  part1 += hexToFileString(zeroPairs(87));
  part1 += hexToFileString("70646E6D000000");
  part1 += createPart2Name(boxText);
  if (!last) {
    part1 += hexToFileString("74646D6E000000");
  }
  var part2 = "";
  part2 += createPart2Header(index);
  var p2Content = hexToFileString("746462737464736200000004000000");
  if (!invisible) {
    p2Content += hexToFileString("01");
  } else {
    p2Content += hexToFileString("03");
  }
  p2Content += hexToFileString("7464736E000000");
  p2Content += createPart2Name(text);
  p2Content += hexToFileString("746462340000007CDB99000100010000000100");
  p2Content += hexToFileString(hold ? "04" : "FF");
  p2Content += hexToFileString(
    "00005DA83F1A36E2EB1C432D3FF00000000000003FF00000000000003FF00000000000003FF000000000000000000004040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006364617400000028"
  );
  if (checked) {
    p2Content += hexToFileString("3FF0" + zeroPairs(38));
  } else {
    p2Content += hexToFileString(zeroPairs(40));
  }
  var p2ContentLength = pad(p2Content.length.toString(16), 8);
  part2 += hexToFileString(p2ContentLength);
  part2 += p2Content;
  part2 += hexToFileString("74646D6E000000");
  return [part1, part2];
}
function createColorItem(index, last, text, red, green, blue, keys, hold, invisible) {
  var part1 = "";
  part1 += createItemHeader(index);
  part1 += hexToFileString("05");
  part1 += text;
  part1 += hexToFileString(zeroPairs(35 - text.length));
  part1 += hexToFileString(keys ? "00" : "02");
  part1 += hexToFileString(zeroPairs(6));
  part1 += hexToFileString("FF");
  part1 += hexToFileString("FF");
  part1 += hexToFileString("FF");
  part1 += hexToFileString(red <= 255 ? red.toString(16) : "FF");
  part1 += hexToFileString(green <= 255 ? green.toString(16) : "FF");
  part1 += hexToFileString(blue <= 255 ? blue.toString(16) : "FF");
  part1 += hexToFileString(zeroPairs(84));
  if (!last) {
    part1 += hexToFileString("74646D6E000000");
  }
  var part2 = "";
  part2 += createPart2Header(index);
  var p2Content = hexToFileString("746462737464736200000004000000");
  if (!invisible) {
    p2Content += hexToFileString("01");
  } else {
    p2Content += hexToFileString("03");
  }
  p2Content += hexToFileString("7464736E000000");
  p2Content += createPart2Name(text);
  p2Content += hexToFileString("746462340000007CBD990004000700010002FF");
  p2Content += hexToFileString(hold ? "04" : "FF");
  p2Content += hexToFileString(
    "00005DA80000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006364617400000060"
  );
  p2Content += hexToFileString(formatIEEE64(255));
  p2Content += hexToFileString(formatIEEE64(red));
  p2Content += hexToFileString(formatIEEE64(green));
  p2Content += hexToFileString(formatIEEE64(blue));
  p2Content += hexToFileString(zeroPairs(64));
  var p2ContentLength = pad(p2Content.length.toString(16), 8);
  part2 += hexToFileString(p2ContentLength);
  part2 += p2Content;
  part2 += hexToFileString("74646D6E000000");
  return [part1, part2];
}
function createEmptyItem(index, first, last, controlName) {
  var p1Start = hexToFileString("28");
  var p1End = "7061726400000094000000000000000000000000000000";
  p1End += first ? "00" : "0E";
  p1End +=
    "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
  if (!last) {
    p1End += "74646D6E000000";
  }
  p1End = hexToFileString(p1End);
  var part1 = p1Start + createMatchName(index) + p1End;
  var p2Prefix = "28";
  var p2Suffix = "000000000000000000000000000000000000";
  var p2List = "4C495354";
  var p2Data = "746462737464736200000004000000017464736E000000";
  var p2Name = createPart2Name(controlName);
  var p2Data2 =
    "746462340000007CBD990001000100000001000400005DA800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000063646174000000280000000000000000000000000000000000000000000000000000000000000000000000000000000074647069000000040000000E";
  var p2Tdmn = "74646D6E000000";
  var length = (hexToFileString(p2Data) + p2Name + hexToFileString(p2Data2)).length.toString(16);
  length = pad(length, 8);
  var part2 =
    hexToFileString(p2Prefix) +
    createMatchName(index) +
    hexToFileString(p2List) +
    hexToFileString(length) +
    hexToFileString(p2Data) +
    p2Name +
    hexToFileString(p2Data2) +
    hexToFileString(p2Tdmn);
  return [part1, part2];
}
function createFirstItem(index, first, last) {
  var p1Start = hexToFileString("28");
  var p1End =
    "706172640000009400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000E0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000FFFFFFFF00000000000000000000000000000000";
  if (!last) {
    p1End += "74646D6E000000";
  }
  p1End = hexToFileString(p1End);
  var part1 = p1Start + createMatchName(index) + p1End;
  var p2Prefix = "28";
  var p2Suffix = "000000000000000000000000000000000000";
  var p2List = "4C495354";
  var p2Data = "746462737464736200000004000000037464736E000000";
  var p2Name = "010000";
  var p2Data2 =
    "746462340000007CDB9900010001000000010000000002583F1A36E2EB1C432D3FF00000000000003FF00000000000003FF00000000000003FF00000000000000000000404C0C0C0FFC0C0C0000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000063646174000000280000000000000000000000000000000000000000000000000000000000000000000000000000000074647069000000040000000E";
  var p2Tdmn = "74646D6E000000";
  var length = (hexToFileString(p2Data) + hexToFileString(p2Name) + hexToFileString(p2Data2)).length.toString(16);
  length = pad(length, 8);
  var part2 =
    hexToFileString(p2Prefix) +
    createMatchName(index) +
    hexToFileString(p2List) +
    hexToFileString(length) +
    hexToFileString(p2Data) +
    hexToFileString(p2Name) +
    hexToFileString(p2Data2) +
    hexToFileString(p2Tdmn);
  return [part1, part2];
}
function createLayerItem(index, last, text, self, keys, hold, invisible) {
  var part1 = "";
  part1 += createItemHeader(index);
  part1 += hexToFileString("00");
  part1 += text;
  part1 += hexToFileString(zeroPairs(35 - text.length));
  part1 += hexToFileString(keys ? "00" : "02");
  part1 += hexToFileString(zeroPairs(76));
  if (self) {
    part1 += hexToFileString("FFFFFFFF" + zeroPairs(16));
  } else {
    part1 += hexToFileString(zeroPairs(20));
  }
  if (!last) {
    part1 += hexToFileString("74646D6E000000");
  }
  var part2 = "";
  part2 += createPart2Header(index);
  var p2Content = hexToFileString("746462737464736200000004000000");
  if (!invisible) {
    p2Content += hexToFileString("01");
  } else {
    p2Content += hexToFileString("03");
  }
  p2Content += hexToFileString("7464736E000000");
  p2Content += createPart2Name(text);
  p2Content += hexToFileString("746462340000007CDB99000100010000000100");
  p2Content += hexToFileString(hold ? "04" : "FF");
  p2Content += hexToFileString(
    "00005DA83F1A36E2EB1C432D3FF00000000000003FF00000000000003FF00000000000003FF000000000000000000004040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006364617400000028"
  );
  p2Content += hexToFileString(zeroPairs(40));
  if (self) {
    p2Content += hexToFileString("74647069000000040000000E");
  } else {
    p2Content += hexToFileString("746470690000000400000000");
  }
  var p2ContentLength = pad(p2Content.length.toString(16), 8);
  part2 += hexToFileString(p2ContentLength);
  part2 += p2Content;
  part2 += hexToFileString("74646D6E000000");
  return [part1, part2];
}
function createPointItem(index, last, text, xPercent, yPercent, keys, hold, invisible) {
  var part1 = "";
  part1 += createItemHeader(index);
  part1 += hexToFileString("06");
  part1 += text;
  part1 += hexToFileString(zeroPairs(35 - text.length));
  part1 += hexToFileString(keys ? "00" : "02");
  part1 += hexToFileString(zeroPairs(4));
  part1 += hexToFileString(pad((65536 * xPercent).toString(16), 8));
  part1 += hexToFileString(pad((65536 * yPercent).toString(16), 8));
  part1 += hexToFileString(zeroPairs(4));
  part1 += hexToFileString(decimalHexTwosComplement(xPercent * 100 * 65536));
  part1 += hexToFileString(decimalHexTwosComplement(yPercent * 100 * 65536));
  part1 += hexToFileString(zeroPairs(72));
  if (!last) {
    part1 += hexToFileString("74646D6E000000");
  }
  var part2 = "";
  part2 += createPart2Header(index);
  var p2Content = hexToFileString("746462737464736200000004000000");
  if (!invisible) {
    p2Content += hexToFileString("01");
  } else {
    p2Content += hexToFileString("03");
  }
  p2Content += hexToFileString("7464736E000000");
  p2Content += createPart2Name(text);
  p2Content += hexToFileString("746462340000007CDB990002000F0003FFFFFF");
  p2Content += hexToFileString(hold ? "04" : "FF");
  p2Content += hexToFileString(
    "00005DA83D9B7CDFD9D7BDBC3FF00000000000003FF00000000000003FF00000000000003FF000000000000000000004060000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000006364617400000030"
  );
  var width = 0;
  var height = 0;
  if (app.project.activeItem && app.project.activeItem.selectedLayers.length > 0) {
    var l = app.project.activeItem.selectedLayers[0];
    width = l.width;
    height = l.height;
  }
  p2Content += hexToFileString(formatIEEE64((width * xPercent) / 100));
  p2Content += hexToFileString(formatIEEE64((height * yPercent) / 100));
  p2Content += hexToFileString(zeroPairs(32));
  var p2ContentLength = pad(p2Content.length.toString(16), 8);
  part2 += hexToFileString(p2ContentLength);
  part2 += p2Content;
  part2 += hexToFileString("74646D6E000000");
  return [part1, part2];
}
function createPopupItem(index, last, text, options, def, keys, hold, invisible) {
  def = parseInt(def);
  var part1 = "";
  part1 += createItemHeader(index);
  part1 += hexToFileString("07");
  part1 += text;
  part1 += hexToFileString(zeroPairs(35 - text.length));
  part1 += hexToFileString(keys ? "00" : "02");
  part1 += hexToFileString(zeroPairs(6));
  part1 += hexToFileString(pad4(def.toString(16)));
  part1 += hexToFileString(pad4((3).toString(16)));
  part1 += hexToFileString(pad4(def.toString(16)));
  part1 += hexToFileString(zeroPairs(84));
  part1 += hexToFileString("70646E6D000000");
  part1 += createPart2Name(options);
  if (!last) {
    part1 += hexToFileString("74646D6E000000");
  }
  var part2 = "";
  part2 += createPart2Header(index);
  var p2Content = hexToFileString("746462737464736200000004000000");
  if (!invisible) {
    p2Content += hexToFileString("01");
  } else {
    p2Content += hexToFileString("03");
  }
  p2Content += hexToFileString("7464736E000000");
  p2Content += createPart2Name(text);
  p2Content += hexToFileString("746462340000007CDB99000100010000000100");
  p2Content += hexToFileString(hold ? "04" : "FF");
  p2Content += hexToFileString(
    "00005DA83F1A36E2EB1C432D3FF00000000000003FF00000000000003FF00000000000003FF000000000000000000004040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006364617400000028"
  );
  p2Content += hexToFileString(formatIEEE64(def));
  p2Content += hexToFileString(zeroPairs(32));
  var p2ContentLength = pad(p2Content.length.toString(16), 8);
  part2 += hexToFileString(p2ContentLength);
  part2 += p2Content;
  part2 += hexToFileString("74646D6E000000");
  return [part1, part2];
}
function createSliderItem(index, last, text, min, max, sMin, sMax, def, pre, per, pix, keys, hold, invisible) {
  var part1 = "";
  part1 += hexToFileString("28");
  part1 += createMatchName(index);
  part1 += hexToFileString("7061726400000094000000000000");
  if (invisible) {
    part1 += hexToFileString("02");
  } else {
    part1 += hexToFileString("00");
  }
  part1 += hexToFileString("00");
  part1 += hexToFileString("00000000000000");
  part1 += hexToFileString("0A");
  part1 += text;
  var numNulls = 35 - text.length;
  var addNulls = "";
  for (var i = 0; i < numNulls; i++) {
    addNulls += "00";
  }
  part1 += hexToFileString(addNulls);
  part1 += hexToFileString(keys ? "00" : "02");
  part1 += hexToFileString(zeroPairs(52));
  part1 += hexToFileString(formatIEEE32(min));
  part1 += hexToFileString(formatIEEE32(max));
  part1 += hexToFileString(formatIEEE32(sMin));
  part1 += hexToFileString(formatIEEE32(sMax));
  part1 += hexToFileString(formatIEEE32(def));
  part1 += hexToFileString("000" + pre);
  var sOption = "0000";
  if (per && pix) {
    sOption = "0003";
  } else if (per) {
    sOption = "0001";
  } else {
    if (pix) {
      sOption = "0002";
    }
  }
  part1 += hexToFileString(sOption);
  part1 += hexToFileString(zeroPairs(20));
  if (!last) {
    part1 += hexToFileString("74646D6E000000");
  }
  var part2 = "";
  part2 += hexToFileString("28");
  part2 += createMatchName(index);
  part2 += hexToFileString("4C495354");
  var p2Content = hexToFileString("746462737464736200000004000000");
  if (!invisible) {
    p2Content += hexToFileString("01");
  } else {
    p2Content += hexToFileString("03");
  }
  p2Content += hexToFileString("7464736E000000");
  p2Content += hexToFileString((text.length + 1).toString(16));
  p2Content += text;
  p2Content += text.length % 2 == 0 ? hexToFileString("0000") : hexToFileString("00");
  p2Content += hexToFileString("746462340000007CBD99000100010000000100");
  p2Content += hexToFileString(hold ? "04" : "FF");
  p2Content += hexToFileString(
    "00005DA80000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006364617400000028"
  );
  p2Content += hexToFileString(padEnd(formatIEEE64(def), 80));
  p2Content += hexToFileString("7464756D000000");
  p2Content += hexToFileString("08");
  p2Content += hexToFileString(formatIEEE64(sMin));
  p2Content += hexToFileString("7464754D000000");
  p2Content += hexToFileString("08");
  p2Content += hexToFileString(formatIEEE64(sMax));
  var p2ContentLength = pad(p2Content.length.toString(16), 8);
  part2 += hexToFileString(p2ContentLength);
  part2 += p2Content;
  part2 += hexToFileString("74646D6E000000");
  return [part1, part2];
}
function createTextItem(index, text, dim, invisible) {
  var part1 = "";
  part1 += hexToFileString("28");
  part1 += createMatchName(index);
  part1 += hexToFileString("706172640000009400000000000000");
  part1 += dim ? hexToFileString("20") : hexToFileString("00");
  part1 += hexToFileString("00000000000000");
  part1 += hexToFileString("0D");
  part1 += text;
  var numNulls = 132 - text.length;
  var addNulls = "";
  for (var i = 0; i < numNulls; i++) {
    addNulls += "00";
  }
  part1 += hexToFileString(addNulls);
  part1 += hexToFileString("74646D6E000000");
  var part2 = "";
  part2 += hexToFileString("28");
  part2 += createMatchName(index);
  part2 += hexToFileString("4C495354");
  var p2Content = hexToFileString("746462737464736200000004000000");
  if (!invisible) {
    p2Content += hexToFileString("01");
  } else {
    p2Content += hexToFileString("03");
  }
  p2Content += hexToFileString("7464736E000000");
  p2Content += hexToFileString((text.length + 1).toString(16));
  p2Content += text;
  p2Content += text.length % 2 == 0 ? hexToFileString("0000") : hexToFileString("00");
  p2Content += hexToFileString(
    "746462340000007CBD990001000100000001000400005DA8000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000636461740000002800000000000000000000000000000000000000000000000000000000000000000000000000000000"
  );
  var p2ContentLength = p2Content.length.toString(16);
  while (p2ContentLength.length < 8) {
    p2ContentLength = "0" + p2ContentLength;
  }
  part2 += hexToFileString(p2ContentLength);
  part2 += p2Content;
  part2 += hexToFileString("74646D6E000000");
  return [part1, part2];
}
function applyPreset(props) {
  var name = props.replace ? "Replace Pseudo Effect" : "Apply Pseudo Effect";
  app.beginUndoGroup(name);
  createFile(props.controlName, props.matchName, props.controlsArray, true, props.trial, props.replace);
  app.endUndoGroup();
}
function completeSave(f, fullFile) {
  try {
    if (f != null) {
      f.encoding = "BINARY";
      f.open("w");
      f.write(fullFile);
      f.close();
    }
  } catch (err) {
    alert("Error 102: " + err);
  }
}
function getSaveLocation() {
  return USER_WRITE_PATH;
}
function savePreset(props) {
  USER_WRITE_PATH = props.writePath;
  var sp = createFile(props.controlName, props.matchName, props.controlsArray, false, props.trial);
}
function setDistance(hStart, hEnd, fileArray) {
  var length = fileArray.slice(hStart, hEnd - 1).join("").length;
  var hexLength = length.toString(16);
  var leadingZeros = 8 - hexLength.length;
  var lengthOutput = "";
  for (var i = 0; i < leadingZeros; i++) {
    lengthOutput += "0";
  }
  lengthOutput += hexLength;
  fileArray[hStart - 1] = hexToFileString(lengthOutput);
}
function setFileRemain(arrayIndex, fileArray) {
  var length = fileArray.slice(arrayIndex).join("").length;
  var hexLength = length.toString(16);
  var leadingZeros = 8 - hexLength.length;
  var lengthOutput = "";
  for (var i = 0; i < leadingZeros; i++) {
    lengthOutput += "0";
  }
  lengthOutput += hexLength;
  fileArray[arrayIndex - 1] = hexToFileString(lengthOutput);
}
function writeFile(ff, directory, fileName) {
  var f = new File(directory + fileName + ".ffx");
  f.encoding = "BINARY";
  f.open("w");
  f.write(ff);
  f.close();
  return f;
}
function create3dPointJSON(effect, name, curTime, layer) {
  var prop = effect.property(1);
  var value = prop.valueAtTime(curTime, true);
  var percentX = layer.width ? value[0] / layer.width : 0;
  var percentY = layer.height ? value[1] / layer.height : 0;
  var percentZ = layer.height ? value[2] / layer.height : 0;
  return { name: name, percentX: percentX, percentY: percentY, percentZ: percentZ, type: "point3d" };
}
function createAngleJSON(effect, name, curTime) {
  return { default: effect.property(1).valueAtTime(curTime, true), name: name, type: "angle" };
}
function createCheckboxJSON(effect, name, curTime) {
  return { default: effect.property(1).valueAtTime(curTime, true), name: name, type: "checkbox" };
}
function createColorJSON(effect, name, curTime) {
  var colorValue = effect.property(1).valueAtTime(curTime, true);
  return {
    blue: Math.round(colorValue[2] * 255),
    green: Math.round(colorValue[1] * 255),
    name: name,
    red: Math.round(colorValue[0] * 255),
    type: "color",
  };
}
function createEndGroupJSON() {
  return { name: "", type: "endgroup" };
}
function createGroupJSON(name) {
  return { name: name, type: "group" };
}
function createLayerJSON(effect, name, curTime) {
  var prop = effect.property(1);
  return { default: !(prop.valueAtTime(curTime, true) == 0), name: name, type: "layer" };
}
function createPointJSON(effect, name, curTime, layer) {
  var prop = effect.property(1);
  var currentValue = prop.valueAtTime(curTime, true);
  return {
    name: name,
    percentX: layer.width ? currentValue[0] / layer.width : 0,
    percentY: layer.height ? currentValue[1] / layer.height : 0,
    type: "point",
  };
}
function createSliderJSON(effect, name, curTime) {
  var sValue = effect.property(1).valueAtTime(curTime, true);
  return {
    default: sValue,
    name: name,
    sliderMax: sValue > 100 ? sValue + 10 : 100,
    sliderMin: sValue < -0 ? sValue - 10 : 0,
    type: "slider",
    validMax: effect.property(1).maxValue,
    validMin: effect.property(1).minValue,
  };
}
function createPopupJSON(effect, name, curTime) {
  var value = effect.property(1).valueAtTime(curTime, true);
  var numItems = effect.property(1).maxValue;
  var contentList = [];
  for (var i = 1; i < numItems; i++) {
    contentList.push("Item " + i);
  }
  return { content: contentList.join("|"), default: value, hold: true, keyframes: true, name: name, type: "popup" };
}
function pad(num, length) {
  var zeros = "";
  for (var o = 0; o < length; o++) {
    zeros += "0";
  }
  return (zeros + num).substr(-length);
}
function pad2(num) {
  return ("00" + num).substr(-2);
}
function pad4(num) {
  return ("0000" + num).substr(-4);
}
function padEnd(num, length) {
  var curLength = num.length;
  for (var o = 0; o < length - curLength; o++) {
    num += "0";
  }
  return num;
}
function PEMVersion() {
  alert("Version 3.0.0", "Pseudo Effect Maker", false);
}
function readControls() {
  if (app.project.activeItem == null) {
    alert("You must have a layer with expression controls selected.");
    return btoa(JSON.stringify({ controls: [], err: 1, name: "" }));
  }
  var curTime = app.project.activeItem.time;
  var layer = app.project.activeItem.selectedLayers[0];
  if (!(layer instanceof AVLayer)) {
    alert("The selected layer must be an AV Layer");
    return btoa(JSON.stringify({ controls: [], err: 2, name: "" }));
  }
  if (layer == null) {
    alert("You must have a layer with expression controls selected.");
    return btoa(JSON.stringify({ controls: [], err: 1, name: "" }));
  }
  var effects = layer.Effects;
  var numEffects = effects.numProperties;
  if (numEffects == 0) {
    alert(
      "There are no expression controls on the selected layer. If multiple layers are selected, only the first selected layer is read."
    );
    return btoa(JSON.stringify({ controls: [], err: 3, name: "" }));
  }
  var controlsArray = new Array();
  var controls = [
    "ADBE Point3D Control",
    "ADBE Angle Control",
    "ADBE Checkbox Control",
    "ADBE Color Control",
    "ADBE Layer Control",
    "ADBE Point Control",
    "ADBE Slider Control",
    "Pseudo POPUP",
  ];
  var groupArray = new Array();
  var numNonControls = 0;
  var groupLevels = 0;
  for (var e = 1; e <= numEffects; e++) {
    var curEffect = effects.property(e);
    var cName = "";
    var curGroupArray = new Array();
    var validControl = false;
    var controlType = -1;
    for (var i = 0; i < controls.length; i++) {
      if (curEffect.matchName === controls[i]) {
        validControl = true;
        controlType = i;
        break;
      }
    }
    if (curEffect.matchName.substr(0, 9) === "Pseudo/@@" && curEffect.numProperties === 2) {
      var ddProp = curEffect.property(1);
      if (ddProp.hasMax && ddProp.hasMin && ddProp.minValue === 1) {
        validControl = true;
        controlType = 7;
      }
    }
    if (validControl) {
      cName = curEffect.name;
      while (cName.indexOf(">") >= 0) {
        curGroupArray.push(cName.substr(0, cName.indexOf(">")));
        cName = cName.substr(cName.indexOf(">") + 1);
      }
      var maxGrpLen = Math.max(groupArray.length, curGroupArray.length);
      if (maxGrpLen != 0) {
        for (var i = 0; i < maxGrpLen; i++) {
          if (groupArray[i] == curGroupArray[i]) {
          } else {
            if (groupArray[i] == null) {
              groupLevels++;
              controlsArray.push(createGroupJSON(curGroupArray[i]));
            }
          }
        }
        for (var j = maxGrpLen - 1; j >= 0; j--) {
          if (groupArray[j] == null) {
          } else if (curGroupArray[j] == null) {
            groupLevels--;
            controlsArray.push(createEndGroupJSON());
          } else {
            if (groupArray[j] != curGroupArray[j]) {
              controlsArray.push(createEndGroupJSON());
              controlsArray.push(createGroupJSON(curGroupArray[j]));
            }
          }
        }
        groupArray = curGroupArray;
      }
    }
    switch (controlType) {
      case 0:
        controlsArray.push(create3dPointJSON(curEffect, cName, curTime, layer));
        break;
      case 1:
        controlsArray.push(createAngleJSON(curEffect, cName, curTime));
        break;
      case 2:
        controlsArray.push(createCheckboxJSON(curEffect, cName, curTime));
        break;
      case 3:
        controlsArray.push(createColorJSON(curEffect, cName, curTime));
        break;
      case 4:
        controlsArray.push(createLayerJSON(curEffect, cName, curTime));
        break;
      case 5:
        controlsArray.push(createPointJSON(curEffect, cName, curTime, layer));
        break;
      case 6:
        controlsArray.push(createSliderJSON(curEffect, cName, curTime));
        break;
      case 7:
        controlsArray.push(createPopupJSON(curEffect, cName, curTime));
        break;
      default:
        numNonControls++;
    }
  }
  while (groupLevels > 0) {
    controlsArray.push(createEndGroupJSON());
    groupLevels--;
  }
  if (numNonControls == numEffects) {
    alert(
      "There are no expression controls on this layer. Only controls from the 'Effect > Expression Controls' menu can be read. "
    );
    return btoa(JSON.stringify({ controls: [], err: 1, name: "" }));
  }
  return btoa(JSON.stringify({ controls: controlsArray, err: 0, name: layer.name }));
}
function setMatchName(name) {
  M_N = name;
}
function getMatchName() {
  return M_N;
}
function createFile(controlNameB, matchNameB, controlsArrayB, applyIt, isTrial, replaceIt, manualMatch) {
  if (replaceIt === void 0) {
    replaceIt = false;
  }
  if (manualMatch === void 0) {
    manualMatch = true;
  }
  var controlName = decodeURIComponent(atob(controlNameB));
  var matchName = decodeURIComponent(atob(matchNameB));
  var controlsArray = JSON.parse(decodeURIComponent(atob(controlsArrayB)));
  var BETA = false;
  var TRIAL = isTrial;
  var path = Folder.appPackage.toString();
  var start = path.indexOf("After%20Effects");
  var end = path.indexOf("/", start);
  var aeVersion = path.substring(start, end);
  var SAVE_FOLDER = Folder.myDocuments.toString() + "/Adobe/" + aeVersion + "/User Presets/Pseudo Effects Maker/";
  var OUTPUT_FILE_NAME = "PEM-temp";
  var EFFECT_MATCHNAME = matchName;
  setMatchName(EFFECT_MATCHNAME);

  var fileArray = new Array();
  fileArray.push(hexToFileString("52494658"));

  var remain1 = fileArray.push(hexToFileString("00000000"));
  fileArray.push(hexToFileString("466146586865616400000010000000030000004400000001010000004C495354"));
  var remain2 = fileArray.push(hexToFileString("00000000"));

  fileArray.push(
    hexToFileString(
      "626573636265736F0000003800000001000000010000000000005DA8001DF8520000000000640064006400643FF00000000000003FF000000000000000000000FFFFFFFF4C495354"
    )
  );

  fileArray.push(hexToFileString("000000AC7464737074646F7400000004FFFFFFFF7464706C00000004000000024C495354"));
  fileArray.push(hexToFileString("00000040746473697464697800000004FFFFFFFF74646D6E000000"));
  fileArray.push(hexToFileString("2841444245204566666563742050617261646500000000000000000000000000000000000000000000"));

  fileArray.push(hexToFileString("4C495354000000407464736974646978000000040000000074646D6E000000"));

  // 40位
  try {
    fileArray.push(hexToFileString("28"));
    fileArray.push(createMatchName(-1, EFFECT_MATCHNAME));
  } catch (err) {
    alert(err, "Matchname Error");
  }

  fileArray.push(hexToFileString("7464736E000000"));
  fileArray.push(createPart2Name(controlName));
  fileArray.push(hexToFileString("4C495354000000"));

  fileArray.push(
    hexToFileString(
      "647464737074646F7400000004FFFFFFFF7464706C00000004000000014C49535400000040746473697464697800000004FFFFFFFF74646D6E000000284144424520456E64206F6620706174682073656E74696E656C000000000000000000000000000000"
    )
  );

  fileArray.push(hexToFileString("4C495354"));
  var remain3 = fileArray.push(hexToFileString("00000000"));
  fileArray.push(hexToFileString("73737063666E616D000000"));
  fileArray.push(
    hexToFileString(
      "30000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
    )
  );

  fileArray.push(hexToFileString("4C495354"));
  var remain4 = fileArray.push(hexToFileString("00000000"));
  fileArray.push(hexToFileString("706172547061726E00000004000000"));

  var eCounter = 0;
  var eArray = new Array();
  eArray.push(createFirstItem(pad4(eCounter), true, false));
  eCounter++;
  if (BETA) {
    eArray.push(createTextItem(pad4(eCounter), "Pseudo Effects Maker|Beta v0.94", true, false));
    eCounter++;
    eArray.push(createEmptyItem(pad4(eCounter), false, false, controlName));
    eCounter++;
  }
  if (TRIAL) {
    eArray.push(createTextItem(pad4(eCounter), "Pseudo Effects Maker | Trial", true, false));
    eCounter++;
    eArray.push(createEmptyItem(pad4(eCounter), false, false, controlName));
    eCounter++;
    eArray.push(createTextItem(pad4(eCounter), "By BatchFrame", true, false));
    eCounter++;
    eArray.push(createEmptyItem(pad4(eCounter), false, false, controlName));
    eCounter++;
    eArray.push(createTextItem(pad4(eCounter), "Purchase full version to", true, false));
    eCounter++;
    eArray.push(createEmptyItem(pad4(eCounter), false, false, controlName));
    eCounter++;
    eArray.push(createTextItem(pad4(eCounter), "remove watermark", true, false));
    eCounter++;
    eArray.push(createEmptyItem(pad4(eCounter), false, false, controlName));
    eCounter++;
  }
  var SLIDER = "slider";
  var ANGLE = "angle";
  var COLOR = "color";
  var LAYER = "layer";
  var POINT = "point";
  var POINT3D = "point3d";
  var POPUP = "popup";
  var GROUP = "group";
  var TEXT = "text";
  var LABEL = "label";
  var CHECK = "checkbox";
  var END = "endgroup";
  var END_LABEL = "endLabel";
  var lastItem = false;
  var curControl = null;
  for (var e = 0; e < controlsArray.length; e++) {
    if (e + 1 == controlsArray.length) {
      lastItem = true;
    }
    curControl = controlsArray[e];
    switch (curControl.type) {
      case SLIDER:
        eArray.push(
          createSliderItem(
            pad4(eCounter),
            lastItem,
            curControl.name,
            curControl.validMin,
            curControl.validMax,
            curControl.sliderMin,
            curControl.sliderMax,
            curControl.default,
            curControl.precision,
            curControl.percent,
            curControl.pixel,
            curControl.keyframes,
            curControl.hold,
            curControl.invisible
          )
        );
        break;
      case ANGLE:
        eArray.push(
          createAngleItem(
            pad4(eCounter),
            lastItem,
            curControl.name,
            curControl.default,
            curControl.keyframes,
            curControl.hold
          )
        );
        break;
      case COLOR:
        eArray.push(
          createColorItem(
            pad4(eCounter),
            lastItem,
            curControl.name,
            curControl.red,
            curControl.green,
            curControl.blue,
            curControl.keyframes,
            curControl.hold,
            curControl.invisible
          )
        );
        break;
      case LAYER:
        eArray.push(
          createLayerItem(
            pad4(eCounter),
            lastItem,
            curControl.name,
            curControl.default,
            curControl.keyframes,
            curControl.hold,
            curControl.invisible
          )
        );
        break;
      case POINT:
        eArray.push(
          createPointItem(
            pad4(eCounter),
            lastItem,
            curControl.name,
            curControl.percentX,
            curControl.percentY,
            curControl.keyframes,
            curControl.hold,
            curControl.invisible
          )
        );
        break;
      case POINT3D:
        eArray.push(
          create3DPointItem(
            pad4(eCounter),
            lastItem,
            curControl.name,
            curControl.percentX,
            curControl.percentY,
            curControl.percentZ,
            curControl.keyframes,
            curControl.hold,
            curControl.invisible
          )
        );
        break;
      case POPUP:
        eArray.push(
          createPopupItem(
            pad4(eCounter),
            lastItem,
            curControl.name,
            curControl.content,
            curControl.default,
            curControl.keyframes,
            curControl.hold,
            curControl.invisible
          )
        );
        break;
      case GROUP:
        eArray.push(createTextItem(pad4(eCounter), curControl.name, false, curControl.invisible));
        break;
      case CHECK:
        eArray.push(
          createCheckboxControl(
            pad4(eCounter),
            lastItem,
            curControl.name,
            curControl.label,
            curControl.default,
            curControl.keyframes,
            curControl.hold,
            curControl.invisible
          )
        );
        break;
      case LABEL:
        eArray.push(createTextItem(pad4(eCounter), curControl.name, curControl.dim, curControl.invisible));
        break;
      case TEXT:
        eArray.push(createTextItem(pad4(eCounter), curControl.name, curControl.dim, false));
        eCounter++;
      case END:
      case END_LABEL:
        eArray.push(createEmptyItem(pad4(eCounter), false, lastItem, controlName));
        break;
      default:
        alert("Error: This shouldn't happen. Please contact BatchFrame support if this error continues to appear.");
    }
    eCounter++;
  }
  fileArray.push(hexToFileString(pad2(eCounter.toString(16)) + "74646D6E000000"));
  for (var e = 0; e < eArray.length; e++) {
    fileArray.push(eArray[e][0]);
  }
  var parTparnEnd = fileArray.push(hexToFileString("4C495354"));
  var remain5 = fileArray.push(hexToFileString("00000000"));
  fileArray.push(hexToFileString("746467707464736200000004000000017464736E"));
  fileArray.push(hexToFileString("000000"));
  fileArray.push(createPart2Name(controlName));
  fileArray.push(hexToFileString("74646D6E000000"));
  for (var e = 0; e < eArray.length; e++) {
    fileArray.push(eArray[e][1]);
  }
  fileArray.push(hexToFileString("28414442452047726F757020456E640000000000000000000000000000000000000000000000000000"));
  setFileRemain(remain1, fileArray);
  setFileRemain(remain2, fileArray);
  setFileRemain(remain3, fileArray);
  setDistance(remain4, parTparnEnd, fileArray);
  setFileRemain(remain5, fileArray);
  var fullFile = "";
  for (var c = 0; c < fileArray.length; c++) {
    fullFile += fileArray[c];
  }
  var outObj = { controlArray: controlsArray, controlName: controlName, matchname: EFFECT_MATCHNAME, version: 3 };
  fullFile += JSON.stringify(outObj);
  if (applyIt) {
    if (app.project.activeItem != null && app.project.activeItem.selectedLayers[0] != null) {
      var sf = new Folder(SAVE_FOLDER);
      try {
        if (!sf.exists) {
          sf.create();
        }
        var sl = app.project.activeItem.selectedLayers[0];
        var selectedEffectIndex = -1;
        if (replaceIt) {
          if (sl.selectedProperties.length === 0) {
            var applyInstead = confirm(
              "No effect is selected so there is nothing to replace. \n\n Would you like to apply it instead?",
              true,
              "Can't Replace"
            );
            if (!applyInstead) {
              return;
            }
            replaceIt = false;
          } else {
            if (!sl.selectedProperties[0].isEffect) {
              alert("The selected property needs to be the effect you are replacing", "Can't Replace");
              fullFile = "";
              return;
            }
            selectedEffectIndex = sl.selectedProperties[0].propertyIndex;
          }
        }
        app.beginUndoGroup(replaceIt ? "Replace Pseudo Effect" : "Apply Pseudo Effect");
        var wf = writeFile(fullFile, SAVE_FOLDER, OUTPUT_FILE_NAME);
        sl.applyPreset(wf);
        if (replaceIt) {
          var addedEffect = app.project.activeItem.selectedLayers[0].selectedProperties[0];
          replace(sl.effect.property(selectedEffectIndex), addedEffect, manualMatch);
          app.endUndoGroup();
          return "updated";
        }
        app.endUndoGroup();
        return "applied";
      } catch (err) {
        alert("Error 100: " + err.toString());
      }
    } else {
      alert("You must select a layer to apply this Pseudo Effect", "No Layer Selected");
    }
  } else {
    var sd = new File(USER_WRITE_PATH + "pseudo.ffx");
    sd.type = "ffx";
    sd = sd.saveDlg("Save Your Pseudo Effect", "After Effects Preset: *.ffx");
    if (sd != null) {
      USER_WRITE_PATH = sd.path + "/";
      completeSave(sd, fullFile);
      return "saved";
    }
  }
}
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = (function (Object, max, min) {
    "use strict";
    return function indexOf(member, fromIndex) {
      if (this === null || this === undefined) {
        throw TypeError("Array.prototype.indexOf called on null or undefined");
      }
      var that = Object(this);
      var Len = that.length >>> 0;
      var i = min(fromIndex | 0, Len);
      if (i < 0) {
        i = max(0, Len + i);
      } else {
        if (i >= Len) {
          return -1;
        }
      }
      if (member === void 0) {
        for (; i !== Len; ++i) {
          if (that[i] === void 0 && i in that) {
            return i;
          }
        }
      } else if (member !== member) {
        for (; i !== Len; ++i) {
          if (that[i] !== that[i]) {
            return i;
          }
        }
      } else {
        for (; i !== Len; ++i) {
          if (that[i] === member) {
            return i;
          }
        }
      }
      return -1;
    };
  })(Object, Math.max, Math.min);
}
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function (callback) {
    if (this == null) {
      throw new TypeError("this is null or not defined");
    }
    var O = Object(this);
    var len = O.length >>> 0;
    if (typeof callback !== "function") {
      throw new TypeError(callback + " is not a function");
    }
    if (arguments.length > 1) {
      T = arguments[1];
    }
    k = 0;
    while (k < len) {
      if (k in O) {
        kValue = O[k];
        callback.call(T, kValue, k, O);
      }
      k++;
    }
  };
}
if (!Array.prototype.map) {
  Array.prototype.map = function (callback) {
    if (this == null) {
      throw new TypeError("this is null or not defined");
    }
    var O = Object(this);
    var len = O.length >>> 0;
    if (typeof callback !== "function") {
      throw new TypeError(callback + " is not a function");
    }
    if (arguments.length > 1) {
      T = arguments[1];
    }
    A = new Array(len);
    k = 0;
    while (k < len) {
      if (k in O) {
        kValue = O[k];
        mappedValue = callback.call(T, kValue, k, O);
        A[k] = mappedValue;
      }
      k++;
    }
    return A;
  };
}
if (typeof Object.prototype.keys === "undefined") {
  Object.prototype.keys = function () {
    "use strict";
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var hasDontEnumBug = !{ toString: null }.propertyIsEnumerable("toString");
    var dontEnums = [
      "toString",
      "toLocaleString",
      "valueOf",
      "hasOwnProperty",
      "isPrototypeOf",
      "propertyIsEnumerable",
      "constructor",
    ];
    var dontEnumsLength = dontEnums.length;
    return function (obj) {
      if (typeof obj !== "function" && (typeof obj !== "object" || obj === null)) {
        throw new TypeError("Object.keys called on non-object");
      }
      var result = [];
      for (var prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }
      if (hasDontEnumBug) {
        for (var i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  };
}
if (typeof JSON !== "object") {
  JSON = { parse: null, stringify: null };
}
(function () {
  function f(n) {
    return n < 10 ? "0" + n : n;
  }
  function quote(string) {
    escapable.lastIndex = 0;
    return escapable.test(string)
      ? '"' +
          string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
          }) +
          '"'
      : '"' + string + '"';
  }
  function str(key, holder) {
    var mind = gap;
    var value = holder[key];
    if (value && typeof value === "object" && typeof value.toJSON === "function") {
      value = value.toJSON(key);
    }
    if (typeof rep === "function") {
      value = rep.call(holder, key, value);
    }
    switch (typeof value) {
      case "string":
        return quote(value);
      case "number":
        return isFinite(value) ? String(value) : "null";
      case "boolean":
      case "null":
        return String(value);
      case "object":
        if (!value) {
          return "null";
        }
        gap += indent;
        partial = [];
        if (Object.prototype.toString.apply(value) === "[object Array]") {
          length = value.length;
          for (var i = 0; i < length; i++) {
            partial[i] = str(i, value) || "null";
          }
          v =
            partial.length === 0
              ? "[]"
              : gap
              ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]"
              : "[" + partial.join(",") + "]";
          gap = mind;
          return v;
        }
        if (rep && typeof rep === "object") {
          length = rep.length;
          for (var i = 0; i < length; i++) {
            if (typeof rep[i] === "string") {
              k = rep[i];
              v = str(k, value);
              if (v) {
                partial.push(quote(k) + gap ? ": " : ":" + v);
              }
            }
          }
        } else {
          for (var k in value) {
            if (Object.prototype.hasOwnProperty.call(value, k)) {
              v = str(k, value);
              if (v) {
                partial.push(quote(k) + gap ? ": " : ":" + v);
              }
            }
          }
        }
        v =
          partial.length === 0
            ? "{}"
            : gap
            ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}"
            : "{" + partial.join(",") + "}";
        gap = mind;
        return v;
    }
  }
  ("use strict");
  if (typeof Date.prototype.toJSON !== "function") {
    Date.prototype.toJSON = function () {
      return isFinite(this.valueOf())
        ? this.getUTCFullYear() +
            "-" +
            f(this.getUTCMonth() + 1) +
            "-" +
            f(this.getUTCDate()) +
            "T" +
            f(this.getUTCHours()) +
            ":" +
            f(this.getUTCMinutes()) +
            ":" +
            f(this.getUTCSeconds()) +
            "Z"
        : null;
    };
    String.prototype.toJSON =
      Number.prototype.toJSON =
      Boolean.prototype.toJSON =
        function () {
          return this.valueOf();
        };
  }
  if (typeof JSON.stringify !== "function") {
    escapable =
      /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    meta = { "\b": "\\b", "\t": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\" };
    JSON.stringify = function (value, replacer, space) {
      gap = "";
      indent = "";
      if (typeof space === "number") {
        for (var i = 0; i < space; i++) {
          indent += " ";
        }
      } else {
        if (typeof space === "string") {
          indent = space;
        }
      }
      rep = replacer;
      if (
        replacer &&
        typeof replacer !== "function" &&
        (typeof replacer !== "object" || typeof replacer.length !== "number")
      ) {
        throw new Error("JSON.stringify");
      }
      return str("", { "": value });
    };
  }
  if (typeof JSON.parse !== "function" || typeofJSON.parse("{}") !== "object") {
    cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    JSON.parse = function (text, reviver) {
      function walk(holder, key) {
        var value = holder[key];
        if (value && typeof value === "object") {
          for (var k in value) {
            if (Object.prototype.hasOwnProperty.call(value, k)) {
              v = walk(value, k);
              if (v !== undefined) {
                value[k] = v;
              } else {
                delete value[k];
              }
            }
          }
        }
        return reviver.call(holder, key, value);
      }
      text = String(text);
      cx.lastIndex = 0;
      if (cx.test(text)) {
        text = text.replace(cx, function (a) {
          return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
        });
      }
      if (
        /^[\],:{}\s]*$/.test(
          text
            .replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
            .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")
            .replace(/(?:^|:|,)(?:\s*\[)+/g, "")
        )
      ) {
        j = eval("(" + text + ")");
        return typeof reviver === "function" ? walk({ "": j }, "") : j;
      }
      throw new SyntaxError("JSON.parse");
    };
  }
})();

var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
var USER_WRITE_PATH = "";
var M_N = "";
