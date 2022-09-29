"use strict";


if (!window.jscolor) { window.jscolor = (function () {

    var jsc = {


        register : function () {
            jsc.attachDOMReadyEvent(jsc.init);
            jsc.attachEvent(document, 'mousedown', jsc.onDocumentMouseDown);
            jsc.attachEvent(document, 'touchstart', jsc.onDocumentTouchStart);
            jsc.attachEvent(window, 'resize', jsc.onWindowResize);
        },

        init : function () {
            if (jsc.jscolor.lookupClass) {
                jsc.jscolor.installByClassName(jsc.jscolor.lookupClass);
            }
        },

        tryInstallOnElements : function (elms, className) {
            var matchClass = new RegExp('(^|\\s)(' + className + ')(\\s*(\\{[^}]*\\})|\\s|$)', 'i');
    
            for (var i = 0; i < elms.length; i += 1) {
                if (elms[i].type !== undefined && elms[i].type.toLowerCase() == 'color') {
                    if (jsc.isColorAttrSupported) {
                        // skip inputs of type 'color' if supported by the browser
                        continue;
                    }
                }
                var m;
                if (!elms[i].jscolor && elms[i].className && (m = elms[i].className.match(matchClass))) {
                    var targetElm = elms[i];
                    var optsStr = null;
    
                    var dataOptions = jsc.getDataAttr(targetElm, 'jscolor');
                    if (dataOptions !== null) {
                        optsStr = dataOptions;
                    } else if (m[4]) {
                        optsStr = m[4];
                    }
    
                    var opts = {};
                    if (optsStr) {
                        try {
                            opts = (new Function ('return (' + optsStr + ')'))();
                        } catch(eParseError) {
                            jsc.warn('Error parsing jscolor options: ' + eParseError + ':\n' + optsStr);
                        }
                    }
                    targetElm.jscolor = new jsc.jscolor(targetElm, opts);
                }
            }
        },

        isColorAttrSupported : (function () {
            var elm = document.createElement('input');
            if (elm.setAttribute) {
                elm.setAttribute('type', 'color');
                if (elm.type.toLowerCase() == 'color') {
                    return true;
                }
            }
            return false;
        })(),