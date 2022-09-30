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

    getStyle : function (elm) {
		return window.getComputedStyle ? window.getComputedStyle(elm) : elm.currentStyle;
	},


    setStyle : (function () {
		var helper = document.createElement('div');
		var getSupportedProp = function (names) {
			for (var i = 0; i < names.length; i += 1) {
				if (names[i] in helper.style) {
					return names[i];
				}
			}
		};
		var props = {
			borderRadius: getSupportedProp(['borderRadius', 'MozBorderRadius', 'webkitBorderRadius']),
			boxShadow: getSupportedProp(['boxShadow', 'MozBoxShadow', 'webkitBoxShadow'])
		};
		return function (elm, prop, value) {
			switch (prop.toLowerCase()) {
			case 'opacity':
				var alphaOpacity = Math.round(parseFloat(value) * 100);
				elm.style.opacity = value;
				elm.style.filter = 'alpha(opacity=' + alphaOpacity + ')';
				break;
			default:
				elm.style[props[prop]] = value;
				break;
			}
		};
	})(),


	setBorderRadius : function (elm, value) {
		jsc.setStyle(elm, 'borderRadius', value || '0');
	},


	setBoxShadow : function (elm, value) {
		jsc.setStyle(elm, 'boxShadow', value || 'none');
	},


	getElementPos : function (e, relativeToViewport) {
		var x=0, y=0;
		var rect = e.getBoundingClientRect();
		x = rect.left;
		y = rect.top;
		if (!relativeToViewport) {
			var viewPos = jsc.getViewPos();
			x += viewPos[0];
			y += viewPos[1];
		}
		return [x, y];
	},


	getElementSize : function (e) {
		return [e.offsetWidth, e.offsetHeight];
	},

    // get pointer's X/Y coordinates relative to viewport
	getAbsPointerPos : function (e) {
		if (!e) { e = window.event; }
		var x = 0, y = 0;
		if (typeof e.changedTouches !== 'undefined' && e.changedTouches.length) {
			// touch devices
			x = e.changedTouches[0].clientX;
			y = e.changedTouches[0].clientY;
		} else if (typeof e.clientX === 'number') {
			x = e.clientX;
			y = e.clientY;
		}
		return { x: x, y: y };
	},

    // get pointer's X/Y coordinates relative to target element
	getRelPointerPos : function (e) {
		if (!e) { e = window.event; }
		var target = e.target || e.srcElement;
		var targetRect = target.getBoundingClientRect();

		var x = 0, y = 0;

		var clientX = 0, clientY = 0;
		if (typeof e.changedTouches !== 'undefined' && e.changedTouches.length) {
			// touch devices
			clientX = e.changedTouches[0].clientX;
			clientY = e.changedTouches[0].clientY;
		} else if (typeof e.clientX === 'number') {
			clientX = e.clientX;
			clientY = e.clientY;
		}

		x = clientX - targetRect.left;
		y = clientY - targetRect.top;
		return { x: x, y: y };
	},


    getViewPos : function () {
		var doc = document.documentElement;
		return [
			(window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0),
			(window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)
		];
	},

    getViewSize : function () {
		var doc = document.documentElement;
		return [
			(window.innerWidth || doc.clientWidth),
			(window.innerHeight || doc.clientHeight),
		];
	},


    redrawPosition : function () {

		if (jsc.picker && jsc.picker.owner) {
			var thisObj = jsc.picker.owner;

			var tp, vp;

			if (thisObj.fixed) {
				// Fixed elements are positioned relative to viewport,
				// therefore we can ignore the scroll offset
				tp = jsc.getElementPos(thisObj.targetElement, true); // target pos
				vp = [0, 0]; // view pos
			} else {
				tp = jsc.getElementPos(thisObj.targetElement); // target pos
				vp = jsc.getViewPos(); // view pos
			}

			var ts = jsc.getElementSize(thisObj.targetElement); // target size
			var vs = jsc.getViewSize(); // view size
			var ps = jsc.getPickerOuterDims(thisObj); // picker size
			var a, b, c;
			switch (thisObj.position.toLowerCase()) {
				case 'left': a=1; b=0; c=-1; break;
				case 'right':a=1; b=0; c=1; break;
				case 'top':  a=0; b=1; c=-1; break;
				default:     a=0; b=1; c=1; break;
			}
			var l = (ts[b]+ps[b])/2;

			// compute picker position
			if (!thisObj.smartPosition) {
				var pp = [
					tp[a],
					tp[b]+ts[b]-l+l*c
				];
			} else {
				var pp = [
					-vp[a]+tp[a]+ps[a] > vs[a] ?
						(-vp[a]+tp[a]+ts[a]/2 > vs[a]/2 && tp[a]+ts[a]-ps[a] >= 0 ? tp[a]+ts[a]-ps[a] : tp[a]) :
						tp[a],
					-vp[b]+tp[b]+ts[b]+ps[b]-l+l*c > vs[b] ?
						(-vp[b]+tp[b]+ts[b]/2 > vs[b]/2 && tp[b]+ts[b]-l-l*c >= 0 ? tp[b]+ts[b]-l-l*c : tp[b]+ts[b]-l+l*c) :
						(tp[b]+ts[b]-l+l*c >= 0 ? tp[b]+ts[b]-l+l*c : tp[b]+ts[b]-l-l*c)
				];
			}

			var x = pp[a];
			var y = pp[b];
			var positionValue = thisObj.fixed ? 'fixed' : 'absolute';
			var contractShadow =
				(pp[0] + ps[0] > tp[0] || pp[0] < tp[0] + ts[0]) &&
				(pp[1] + ps[1] < tp[1] + ts[1]);

			jsc._drawPosition(thisObj, x, y, positionValue, contractShadow);
		}
	},


    _drawPosition : function (thisObj, x, y, positionValue, contractShadow) {
		var vShadow = contractShadow ? 0 : thisObj.shadowBlur; // px

		jsc.picker.wrap.style.position = positionValue;
		jsc.picker.wrap.style.left = x + 'px';
		jsc.picker.wrap.style.top = y + 'px';

		jsc.setBoxShadow(
			jsc.picker.boxS,
			thisObj.shadow ?
				new jsc.BoxShadow(0, vShadow, thisObj.shadowBlur, 0, thisObj.shadowColor) :
				null);
	},

    getPickerDims : function (thisObj) {
		var displaySlider = !!jsc.getSliderComponent(thisObj);
		var dims = [
			2 * thisObj.insetWidth + 2 * thisObj.padding + thisObj.width +
				(displaySlider ? 2 * thisObj.insetWidth + jsc.getPadToSliderPadding(thisObj) + thisObj.sliderSize : 0),
			2 * thisObj.insetWidth + 2 * thisObj.padding + thisObj.height +
				(thisObj.closable ? 2 * thisObj.insetWidth + thisObj.padding + thisObj.buttonHeight : 0)
		];
		return dims;
	},

    getPickerOuterDims : function (thisObj) {
		var dims = jsc.getPickerDims(thisObj);
		return [
			dims[0] + 2 * thisObj.borderWidth,
			dims[1] + 2 * thisObj.borderWidth
		];
	},

    getPadToSliderPadding : function (thisObj) {
		return Math.max(thisObj.padding, 1.5 * (2 * thisObj.pointerBorderWidth + thisObj.pointerThickness));
	},


	getPadYComponent : function (thisObj) {
		switch (thisObj.mode.charAt(1).toLowerCase()) {
			case 'v': return 'v'; break;
		}
		return 's';
	},

    getSliderComponent : function (thisObj) {
		if (thisObj.mode.length > 2) {
			switch (thisObj.mode.charAt(2).toLowerCase()) {
				case 's': return 's'; break;
				case 'v': return 'v'; break;
			}
		}
		return null;
	},

    onDocumentMouseDown : function (e) {
		if (!e) { e = window.event; }
		var target = e.target || e.srcElement;

		if (target._jscLinkedInstance) {
			if (target._jscLinkedInstance.showOnClick) {
				target._jscLinkedInstance.show();
			}
		} else if (target._jscControlName) {
			jsc.onControlPointerStart(e, target, target._jscControlName, 'mouse');
		} else {
			// Mouse is outside the picker controls -> hide the color picker!
			if (jsc.picker && jsc.picker.owner) {
				jsc.picker.owner.hide();
			}
		}
	},

    onDocumentTouchStart : function (e) {
		if (!e) { e = window.event; }
		var target = e.target || e.srcElement;

		if (target._jscLinkedInstance) {
			if (target._jscLinkedInstance.showOnClick) {
				target._jscLinkedInstance.show();
			}
		} else if (target._jscControlName) {
			jsc.onControlPointerStart(e, target, target._jscControlName, 'touch');
		} else {
			if (jsc.picker && jsc.picker.owner) {
				jsc.picker.owner.hide();
			}
		}
	},

    onWindowResize : function (e) {
		jsc.redrawPosition();
	},


	onParentScroll : function (e) {
		// hide the picker when one of the parent elements is scrolled
		if (jsc.picker && jsc.picker.owner) {
			jsc.picker.owner.hide();
		}
	},


    pointerMoveEvent : {
		mouse: 'mousemove',
		touch: 'touchmove'
	},
	_pointerEndEvent : {
		mouse: 'mouseup',
		touch: 'touchend'
	},


	_pointerOrigin : null,
	_capturedTarget : null,

    onControlPointerStart : function (e, target, controlName, pointerType) {
		var thisObj = target._jscInstance;

		jsc.preventDefault(e);
		jsc.captureTarget(target);

		var registerDragEvents = function (doc, offset) {
			jsc.attachGroupEvent('drag', doc, jsc._pointerMoveEvent[pointerType],
				jsc.onDocumentPointerMove(e, target, controlName, pointerType, offset));
			jsc.attachGroupEvent('drag', doc, jsc._pointerEndEvent[pointerType],
				jsc.onDocumentPointerEnd(e, target, controlName, pointerType));
		};

		registerDragEvents(document, [0, 0]);

		if (window.parent && window.frameElement) {
			var rect = window.frameElement.getBoundingClientRect();
			var ofs = [-rect.left, -rect.top];
			registerDragEvents(window.parent.window.document, ofs);
		}

		var abs = jsc.getAbsPointerPos(e);
		var rel = jsc.getRelPointerPos(e);
		jsc._pointerOrigin = {
			x: abs.x - rel.x,
			y: abs.y - rel.y
		};

		switch (controlName) {
		case 'pad':
			// if the slider is at the bottom, move it up
			switch (jsc.getSliderComponent(thisObj)) {
			case 's': if (thisObj.hsv[1] === 0) { thisObj.fromHSV(null, 100, null); }; break;
			case 'v': if (thisObj.hsv[2] === 0) { thisObj.fromHSV(null, null, 100); }; break;
			}
			jsc.setPad(thisObj, e, 0, 0);
			break;

		case 'sld':
			jsc.setSld(thisObj, e, 0);
			break;
		}

		jsc.dispatchFineChange(thisObj);
	},

    onDocumentPointerMove : function (e, target, controlName, pointerType, offset) {
		return function (e) {
			var thisObj = target._jscInstance;
			switch (controlName) {
			case 'pad':
				if (!e) { e = window.event; }
				jsc.setPad(thisObj, e, offset[0], offset[1]);
				jsc.dispatchFineChange(thisObj);
				break;

			case 'sld':
				if (!e) { e = window.event; }
				jsc.setSld(thisObj, e, offset[1]);
				jsc.dispatchFineChange(thisObj);
				break;
			}
		}
	},

    onDocumentPointerEnd : function (e, target, controlName, pointerType) {
		return function (e) {
			var thisObj = target._jscInstance;
			jsc.detachGroupEvents('drag');
			jsc.releaseTarget();
			// Always dispatch changes after detaching outstanding mouse handlers,
			// in case some user interaction will occur in user's onchange callback
			// that would intrude with current mouse events
			jsc.dispatchChange(thisObj);
		};
	},

    dispatchChange : function (thisObj) {
		if (thisObj.valueElement) {
			if (jsc.isElementType(thisObj.valueElement, 'input')) {
				jsc.fireEvent(thisObj.valueElement, 'change');
			}
		}
	},


	dispatchFineChange : function (thisObj) {
		if (thisObj.onFineChange) {
			var callback;
			if (typeof thisObj.onFineChange === 'string') {
				callback = new Function (thisObj.onFineChange);
			} else {
				callback = thisObj.onFineChange;
			}
			callback.call(thisObj);
		}
	},

    setPad : function (thisObj, e, ofsX, ofsY) {
		var pointerAbs = jsc.getAbsPointerPos(e);
		var x = ofsX + pointerAbs.x - jsc._pointerOrigin.x - thisObj.padding - thisObj.insetWidth;
		var y = ofsY + pointerAbs.y - jsc._pointerOrigin.y - thisObj.padding - thisObj.insetWidth;

		var xVal = x * (360 / (thisObj.width - 1));
		var yVal = 100 - (y * (100 / (thisObj.height - 1)));

		switch (jsc.getPadYComponent(thisObj)) {
		case 's': thisObj.fromHSV(xVal, yVal, null, jsc.leaveSld); break;
		case 'v': thisObj.fromHSV(xVal, null, yVal, jsc.leaveSld); break;
		}
	},




    setSld : function (thisObj, e, ofsY) {
		var pointerAbs = jsc.getAbsPointerPos(e);
		var y = ofsY + pointerAbs.y - jsc._pointerOrigin.y - thisObj.padding - thisObj.insetWidth;

		var yVal = 100 - (y * (100 / (thisObj.height - 1)));

		switch (jsc.getSliderComponent(thisObj)) {
		case 's': thisObj.fromHSV(null, yVal, null, jsc.leavePad); break;
		case 'v': thisObj.fromHSV(null, null, yVal, jsc.leavePad); break;
		}
	},


	_vmlNS : 'jsc_vml_',
	_vmlCSS : 'jsc_vml_css_',
	_vmlReady : false,