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

        isCanvasSupported : (function () {
            var elm = document.createElement('canvas');
            return !!(elm.getContext && elm.getContext('2d'));
        })(),

        fetchElement : function (mixed) {
            return typeof mixed === 'string' ? document.getElementById(mixed) : mixed;
        },
    
    
        isElementType : function (elm, type) {
            return elm.nodeName.toLowerCase() === type.toLowerCase();
        },
    
    
        getDataAttr : function (el, name) {
            var attrName = 'data-' + name;
            var attrValue = el.getAttribute(attrName);
            if (attrValue !== null) {
                return attrValue;
            }
            return null;
        }, 

        _attachedGroupEvents : {},



        attachGroupEvent : function (groupName, el, evnt, func) {
            if (!jsc._attachedGroupEvents.hasOwnProperty(groupName)) {
                jsc._attachedGroupEvents[groupName] = [];
            }
            jsc._attachedGroupEvents[groupName].push([el, evnt, func]);
            jsc.attachEvent(el, evnt, func);
        },


        detachGroupEvents : function (groupName) {
            if (jsc._attachedGroupEvents.hasOwnProperty(groupName)) {
                for (var i = 0; i < jsc._attachedGroupEvents[groupName].length; i += 1) {
                    var evt = jsc._attachedGroupEvents[groupName][i];
                    jsc.detachEvent(evt[0], evt[1], evt[2]);
                }
                delete jsc._attachedGroupEvents[groupName];
            }
        },

        attachDOMReadyEvent : function (func) {
            var fired = false;
            var fireOnce = function () {
                if (!fired) {
                    fired = true;
                    func();
                }
            };
    
            if (document.readyState === 'complete') {
                setTimeout(fireOnce, 1); // async
                return;
            }
    
            if (document.addEventListener) {
                document.addEventListener('DOMContentLoaded', fireOnce, false);
    
                // Fallback
                window.addEventListener('load', fireOnce, false);
    
            } else if (document.attachEvent) {
                // IE
                document.attachEvent('onreadystatechange', function () {
                    if (document.readyState === 'complete') {
                        document.detachEvent('onreadystatechange', arguments.callee);
                        fireOnce();
                    }
                })
    
                // Fallback
                window.attachEvent('onload', fireOnce);
    
                // IE7/8
                if (document.documentElement.doScroll && window == window.top) {
                    var tryScroll = function () {
                        if (!document.body) { return; }
                        try {
                            document.documentElement.doScroll('left');
                            fireOnce();
                        } catch (e) {
                            setTimeout(tryScroll, 1);
                        }
                    };
                    tryScroll();
                }
            }
        },

        warn : function (msg) {
            if (window.console && window.console.warn) {
                window.console.warn(msg);
            }
        },

        preventDefault : function (e) {
            if (e.preventDefault) { e.preventDefault(); }
            e.returnValue = false;
        },

        captureTarget : function (target) {
            // IE
            if (target.setCapture) {
                jsc._capturedTarget = target;
                jsc._capturedTarget.setCapture();
            }
        },

        releaseTarget : function () {
            // IE
            if (jsc._capturedTarget) {
                jsc._capturedTarget.releaseCapture();
                jsc._capturedTarget = null;
            }
        },

        fireEvent : function (el, evnt) {
            if (!el) {
                return;
            }
            if (document.createEvent) {
                var ev = document.createEvent('HTMLEvents');
                ev.initEvent(evnt, true, true);
                el.dispatchEvent(ev);
            } else if (document.createEventObject) {
                var ev = document.createEventObject();
                el.fireEvent('on' + evnt, ev);
            } else if (el['on' + evnt]) { // alternatively use the traditional event model
                el['on' + evnt]();
            }
        },

        classNameToList : function (className) {
            return className.replace(/^\s+|\s+$/g, '').split(/\s+/);
        },


        // The className parameter (str) can only contain a single class name
	hasClass : function (elm, className) {
		if (!className) {
			return false;
		}
		return -1 != (' ' + elm.className.replace(/\s+/g, ' ') + ' ').indexOf(' ' + className + ' ');
	},



    // The className parameter (str) can contain multiple class names separated by whitespace
	setClass : function (elm, className) {
		var classList = jsc.classNameToList(className);
		for (var i = 0; i < classList.length; i += 1) {
			if (!jsc.hasClass(elm, classList[i])) {
				elm.className += (elm.className ? ' ' : '') + classList[i];
			}
		}
	},

    // The className parameter (str) can contain multiple class names separated by whitespace
	unsetClass : function (elm, className) {
		var classList = jsc.classNameToList(className);
		for (var i = 0; i < classList.length; i += 1) {
			var repl = new RegExp(
				'^\\s*' + classList[i] + '\\s*|' +
				'\\s*' + classList[i] + '\\s*$|' +
				'\\s+' + classList[i] + '(\\s+)',
				'g'
			);
			elm.className = elm.className.replace(repl, '$1');
		}
	},