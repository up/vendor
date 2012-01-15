/** 
  * Vendor JS
  *
  * Adding the current browser's prefix for
  * - CSS Backgrounds and Borders
  * - CSS 2D Transforms 
  * - CSS Animations
  * in specific "text/vendor" stylesheets
  * internal (<style>) or external (<link>) 
  *
  * Copyright: 2012 Uli Preuss
  *  
*/

(function(){
  
  var s = 'STYLE', l = 'LINK', h = 'HEAD', ct = 'text/css',
    sVendorPrefix, prefix = 'vendor', sEOL = '\n',
    $$ = function(name) { return doc.getElementsByTagName(name); },
    doc = document, dbody = doc.body, dhead = $$(h)[0], 
    append = function(node) { dhead.appendChild(node); };
  
  function fnRequest(oCSSElement, sURL) {
    var oXHR = window.XMLHttpRequest ? 
      new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    oXHR.open('POST', sURL, true);
    oXHR.setRequestHeader('Content-Type', ct);
    oXHR.onreadystatechange = function() {
      if (oXHR.readyState == 4) {
        fnRequestCallback(oCSSElement, oXHR.responseText);
      }
    }
    oXHR.send();
  };

  function fnRequestCallback(oCSSElement, sStyleRules){

    var sCache = "", n1, oSTYLENew,
      sLines = sStyleRules.split(sEOL), 
      sType = oCSSElement.nodeName.toUpperCase(),
      aPrefixes = ["-webkit-","-moz-","-o-","-ms-",""];
    
    for(n1=0; n1<sLines.length; n1++) {

      if(sLines[n1].match("" + prefix + "") !== null) {
        sCache+= sEOL + sLines[n1].replace("-" + prefix + "-", sVendorPrefix);          
      }
      else {
        sCache+= sEOL + sLines[n1];          
      }

    }

    if(sType === s) {
      oCSSElement.type = ct;
      oCSSElement.innerHTML = sCache; 
    } else if (sType === l) {
      oSTYLENew = doc.createElement(s);
      oSTYLENew.type = ct;
      oSTYLENew.innerHTML = sCache; 
      addLineBreak();
      append(oSTYLENew);
      addLineBreak();
      oCSSElement.parentNode.removeChild(oCSSElement);      
    }
    
  };
  
  function addLineBreak() {
    append(doc.createTextNode(sEOL));    
  };
  
  function fnProcessCSSElements(sType){
    
    var sInternalStyles = $$(s), 
      sExternalStyles = $$(l),
      sStyleRules, oCSSElements = sType === l ? 
        sExternalStyles : sType === s ? 
          sInternalStyles : {};

    for(nI=0; nI<oCSSElements.length; nI++) {
      if(oCSSElements[nI].type === 'text/' + prefix) {
        if(sType === l) {
          sStyleRules = fnRequest(oCSSElements[nI], oCSSElements[nI].href);
        } else if(sType === s) {
          sStyleRules = fnRequestCallback(oCSSElements[nI], oCSSElements[nI].innerHTML);
        }
      }
    }

  };
  
  function fnGetVendorPrefix(){

    var aVendorPrefixes = ["Webkit","Moz","O","Ms",""];
    
    for(n1=0; n1<aVendorPrefixes.length; n1++) {
      if(aVendorPrefixes[n1] + 'Transform' in dbody.style) {
        sVendorPrefix = "-" +aVendorPrefixes[n1].toLowerCase() + "-";
      }
    }

    return sVendorPrefix;

  };

  
  (function () { // Initiation
    sVendorPrefix = fnGetVendorPrefix();
    fnProcessCSSElements(s);
    fnProcessCSSElements(l);
  }());
   
}());