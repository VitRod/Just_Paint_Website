"use strict";


if (!window.jscolor) { window.jscolor = (function () {

    var jsc = {


        register : function () {
            jsc.attachDOMReadyEvent(jsc.init);
            jsc.attachEvent(document, 'mousedown', jsc.onDocumentMouseDown);
            jsc.attachEvent(document, 'touchstart', jsc.onDocumentTouchStart);
            jsc.attachEvent(window, 'resize', jsc.onWindowResize);
        },