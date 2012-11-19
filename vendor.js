/** 
 * Vendor JS
 *
 * Adding the current browser's prefix for
 * - CSS Gradients
 * - CSS Box-shadow
 * - CSS Borders
 * - CSS 2D Transforms 
 * - CSS Animations
 * in specific "text/vendor" stylesheets
 * internal (<style>) or external (<link>) 
 *
 * Copyright: 2012 Uli Preuss
 * Licensed under the MIT license.
 */

(function () {

  var 
    s = 'STYLE',
    l = 'LINK',
    h = 'HEAD',
    ct = 'text/css',
    sVendorPrefix, sGlobalPrefix = 'vendor',
    sEOL = '\n',
    $T = function (name) {
      return doc.getElementsByTagName(name);
    },
    doc = document,
    dbody = doc.body,
    dhead = $T(h)[0],
    fnAppend = function (node) {
      dhead.appendChild(node);
    }
  ;

  if (!String.prototype.trim) {
    String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/g, "");
    };
  }

  function fnRequest(oCSSElement, sURL) {
    var oXHR = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    oXHR.open('GET', sURL, true);
    oXHR.setRequestHeader('Content-Type', oCSSElement.type);
    oXHR.onreadystatechange = function () {
      if (oXHR.readyState === 4) {
        fnRequestCallback(oCSSElement, oXHR.responseText);
      }
    };
    oXHR.send();
  };

  function fnRequestCallback(oCSSElement, sStyleRules) {

    var 
      sCache = "",
      n1 = 0,
      oSTYLENew, sLine, sLines = sStyleRules.split(sEOL),
      sType = oCSSElement.nodeName.toUpperCase(),
      sLen = sLines.length,
      sBg = "background"
    ;

    function fnVendorBackground(sLine) {
      var sIndent, sParams, aParams, sNewRule, re;
      sIndent = sLine.substring(0, sLine.indexOf(sBg));
      sParams = sLine.substring(sLine.indexOf('(') + 1, sLine.indexOf(')'));
      aParams = sParams.split(',');
      sNewRule = fnGradient('linear', sIndent, aParams[0].trim(), aParams[1].trim(), aParams[2].trim());
      re = new RegExp("background.*$");
      return sEOL + sLine.replace(re, sNewRule);
    }

    for (; n1 < sLen; n1++) {
      sLine = sLines[n1];
      if (sLine.match(sBg + ": -" + sGlobalPrefix + "-linear-gradient") !== null) {
        sCache += fnVendorBackground(sLine);
      } else if (sLine.match("" + sGlobalPrefix + "") !== null) {
        sCache += sEOL + sLine.replace("-" + sGlobalPrefix + "-", sVendorPrefix);
        // adding non vendor prefix version
        if (sVendorPrefix !== "" && ((/box-shadow/.test(sLine)) || (/border-radius/.test(sLine)))) {
          sCache += sEOL + sLine.replace("-" + sGlobalPrefix + "-", "");
        }
      }
      else {
        sCache += sEOL + sLine;
      }

    }

    if (sType === s) {
      oCSSElement.type = ct;
      oCSSElement.innerHTML = sCache;
    } else if (sType === l) {
      oSTYLENew = doc.createElement(s);
      oSTYLENew.type = ct;
      oSTYLENew.innerHTML = sCache;
      fnAddLineBreak();
      fnAppend(oSTYLENew);
      fnAddLineBreak();
      oCSSElement.parentNode.removeChild(oCSSElement);
    }

  };

  function fnProcessCSSElements(sType) {

    var 
      sInternalStyles = $T(s),
      sExternalStyles = $T(l),
      sStyleRules, oCSSElements = sType === l ? sExternalStyles : sType === s ? sInternalStyles : {}
    ;

    for (nI = 0; nI < oCSSElements.length; nI++) {
      if (oCSSElements[nI].type === 'text/' + sGlobalPrefix) {
        if (sType === l) {
          sStyleRules = fnRequest(oCSSElements[nI], oCSSElements[nI].href);
        } else if (sType === s) {
          sStyleRules = fnRequestCallback(oCSSElements[nI], oCSSElements[nI].innerHTML);
        }
      }
    }

  };

  function fnGetVendorPrefix() {

    var aVendorPrefixes = ["Webkit", "Moz", "O", "Ms", ""];

    for (n1 = 0; n1 < aVendorPrefixes.length; n1++) {
      if (aVendorPrefixes[n1] + 'Transform' in dhead.style) { //in dbody.style
        sVendorPrefix = "-" + aVendorPrefixes[n1].toLowerCase() + "-";
      }
    }

    return sVendorPrefix;

  };

  function fnCreateVendorFileCache() {
	  var meta = document.createElement('meta');
	  meta.name = 'vendor-cache';
	  meta.content = 'test';
    fnAppend(meta);
  };

  function fnAddLineBreak() {
    fnAppend(doc.createTextNode(sEOL));
  };

  function fnLinearGradient(sIndent, sDir, sc, so, ec, eo) {

    var sVendorRules, aVo = [/* 'Modern', 'Chrome,Safari4+', 'IE6-9' */];

    switch (sDir) {
    case 'to top':
    case '0deg':
      aVo = ['bottom', 'right top, right bottom', '0'];
      break;
    case 'to right':
    case '90deg':
      aVo = ['left', 'left top, right top', '1'];
      break;
    case 'to bottom':
    case '180deg':
      aVo = ['top', 'left top, left bottom', '0'];
      break;
    case 'to left':
    case '270deg':
      aVo = ['right', 'left bottom, right bottom', '1'];
      break;
    default:
      aVo = [sDir, sDir, '1']; // IE ???
    }

    sVendorRules = "background: " + sc + ";" + sEOL + sIndent;
    sVendorRules += "background: -moz-linear-gradient(" + aVo[0] + ", " + sc + " " + so + ", " + ec + " " + eo + ");" + sEOL + sIndent;
    sVendorRules += "background: -webkit-gradient(linear, " + aVo[1] + ", color-stop(" + so + "," + sc + "), color-stop(" + eo + "," + ec + "));" + sEOL + sIndent;
    sVendorRules += "background: -webkit-linear-gradient(" + aVo[0] + ", " + sc + " " + so + "," + ec + " " + eo + ");" + sEOL + sIndent;
    sVendorRules += "background: -o-linear-gradient(" + aVo[0] + ", " + sc + " " + so + "," + ec + " " + eo + ");" + sEOL + sIndent;
    sVendorRules += "background: -ms-linear-gradient(" + aVo[0] + ", " + sc + " " + so + "," + ec + " " + eo + ");" + sEOL + sIndent;
    sVendorRules += "background: linear-gradient(" + aVo[0] + ", " + sc + " " + so + "," + ec + " " + eo + ");" + sEOL + sIndent;
    sVendorRules += "filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='" + sc + "', endColorstr='" + ec + "',GradientType=" + aVo[2] + " );";

    return sVendorRules;

  };

  function fnGradient(sType, sIndent, sOrientation, sStart, sEnd) {

    var
      sStartParts = sStart.split(' '),
      sStartColor = sStartParts[0],
      sStartOpacity = sStartParts[1] || '',
      sEndParts = sEnd.split(' '),
      sEndColor = sEndParts[0],
      sEndOpacity = sEndParts[1] || ''
    ;

    switch (sType) {
    case 'linear':
      return fnLinearGradient(sIndent, sOrientation, sStartColor, sStartOpacity, sEndColor, sEndOpacity);
    case 'radial':
      alert('radial gradient is not supported yet');
      break;
    case 'repeating-linear':
      alert('repeating-linear gradient is not supported yet');
      break;
    }

  }

  (function () { // Initiation
    sVendorPrefix = fnGetVendorPrefix();
    fnCreateVendorFileCache();
    fnProcessCSSElements(s);
    fnProcessCSSElements(l);
  }());

}());
