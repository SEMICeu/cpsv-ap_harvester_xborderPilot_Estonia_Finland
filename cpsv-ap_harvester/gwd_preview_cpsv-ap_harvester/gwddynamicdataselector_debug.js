(function(){
"use strict";
var DebugUtil = {assert:function(condition, opt_message) {
  if (!condition) {
    var error = Error(opt_message || "assertion failed");
    console.error(error);
    throw error;
  }
}, raise:function(error) {
  console.error(error);
  throw error;
}, log:function(var_args) {
  "function" == typeof console.trace ? console.trace.apply(console, arguments) : console.log.apply(console, arguments);
}, error:function(var_args) {
  console.error.apply(console, arguments);
}};
var GwdDynamicDataSelectorConstants = {FEED_ID_KEY:"feed", TAG_NAME:"gwd-dynamic-data-selector", STUDIO_ENABLER_DATA_PROVIDER:"gwd-studio-enabler-data-provider"};
var EventTypes = {ABORT:"abort", ATTACHED:"attached", CAN_PLAY:"canplay", CLICK:"click", DETACHED:"detached", DRAG_END:"dragend", ERROR:"error", HOVER:"hover", HOVER_END:"hoverend", LOAD:"load", MOUSE_DOWN:"mousedown", MOUSE_MOVE:"mousemove", MOUSE_OUT:"mouseout", MOUSE_OVER:"mouseover", MOUSE_UP:"mouseup", PAGE_LOAD:"pageload", POINTER_CANCEL:"pointercancel", POINTER_DOWN:"pointerdown", POINTER_MOVE:"pointermove", POINTER_OUT:"pointerout", POINTER_OVER:"pointerover", POINTER_UP:"pointerup", READY:"ready", 
RESIZE:"resize", ROTATE_TO_PORTRAIT:"rotatetoportrait", ROTATE_TO_LANDSCAPE:"rotatetolandscape", SHAKE:"shake", SUBMIT:"submit", TAP:"tap", TILT:"tilt", TOUCH_END:"touchend", TOUCH_MOVE:"touchmove", TOUCH_START:"touchstart", TRACK:"track", TRACK_END:"trackend", TRACK_START:"trackstart", SWIPE_LEFT:"swipeleft", SWIPE_RIGHT:"swiperight", SWIPE_UP:"swipeup", SWIPE_DOWN:"swipedown", TRANSITION_END:"transitionend", WEB_COMPONENTS_READY:"WebComponentsReady", WEBGL_CONTEXT_LOST:"webglcontextlost", WEBGL_CONTEXT_RESTORED:"webglcontextrestored", 
WEBKIT_TRANSITION_END:"webkitTransitionEnd"};
var GwdDoubleClickConstants = {EVENT_DETAIL_URL:"url", EVENT_DETAIL_EXIT_ID:"exit-id", EXPANDED_PAGE:"data-gwd-expanded", FULLSCREEN_CLASS_NAME:"fs", GWD_DATABINDER:"gwd-data-binder", GWD_YOUTUBE:"gwd-youtube", HANDLED:"handled", HTML_AUDIO:"audio", HTML_VIDEO:"video", START_PAGE_TRANSITION_DELAY:30, TAG_NAME:"gwd-doubleclick", Attributes:{DATA_PROVIDER:"data-provider", FULLSCREEN:"fullscreen", POLITE_LOAD:"polite-load"}, Events:{AD_INITIALIZED:"adinitialized", COLLAPSE_FINISH:"collapsefinish", COLLAPSE_START:"collapsestart", 
EXPAND_FINISH:"expandfinish", EXPAND_START:"expandstart", FULLSCREEN_SUPPORT:"fullscreensupport"}};
var BrowserUtil = {Orientation:{PORTRAIT:1, LANDSCAPE:2}, getUserAgentString_:function() {
  return window.navigator.userAgent || "";
}, isWebKit:function() {
  return -1 != BrowserUtil.getUserAgentString_().indexOf("WebKit");
}, isAndroid:function() {
  return -1 != BrowserUtil.getUserAgentString_().indexOf("Android");
}, isFirefox:function() {
  var userAgent = BrowserUtil.getUserAgentString_();
  return -1 != userAgent.indexOf("rv:") && -1 != userAgent.indexOf("Gecko");
}, isIE:function() {
  var userAgent = BrowserUtil.getUserAgentString_();
  return -1 < userAgent.indexOf("Trident") || -1 < userAgent.indexOf("MSIE");
}, isGwdDoubleClick_:function(element) {
  return element.tagName.toLowerCase() == GwdDoubleClickConstants.TAG_NAME;
}, openUrl:function(url) {
  window.open(url);
}, getOrientation:function() {
  return BrowserUtil.isPortrait_() ? BrowserUtil.Orientation.PORTRAIT : BrowserUtil.Orientation.LANDSCAPE;
}, isPortrait_:function() {
  return window.innerHeight >= window.innerWidth;
}, getQueryString:function() {
  return window.location.search;
}, setQueryString:function(queryString) {
  window.location.search = queryString;
}};
function hasCustomFeeds_() {
  return window.gwd && gwd.dynamic && gwd.dynamic.feeds;
}
var GWDDynamicDataSelectorImpl = function() {
};
goog.inherits(GWDDynamicDataSelectorImpl, HTMLElement);
GWDDynamicDataSelectorImpl.prototype.createdCallback = function() {
  this.dropdown_ = document.createElement("select");
  this.appendChild(this.dropdown_);
  var arrow = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  arrow.setAttribute("viewBox", "0 0 24 24");
  arrow.setAttribute("preserveAspectRatio", "xMidYMid meet");
  var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M7 10l5 5 5-5z");
  arrow.appendChild(path);
  this.appendChild(arrow);
  window.addEventListener(EventTypes.WEB_COMPONENTS_READY, this.handleWebComponentsReadyEvent_.bind(this), !1);
  this.selectionHandler_ = this.handleSelectionChange_.bind(this);
};
GWDDynamicDataSelectorImpl.prototype.attachedCallback = function() {
  "interactive" == document.readyState || "complete" == document.readyState ? this.handleDomContentLoaded_() : (DebugUtil.assert("loading" == document.readyState), window.addEventListener("DOMContentLoaded", this.handleDomContentLoaded_.bind(this), !1));
  this.dropdown_.addEventListener("change", this.selectionHandler_);
};
GWDDynamicDataSelectorImpl.prototype.handleDomContentLoaded_ = function() {
  if (this.isUsingStudioStandardSchema_()) {
    var datasetId = this.getQueryStringParameter_(GwdDynamicDataSelectorConstants.FEED_ID_KEY);
    if (datasetId && hasCustomFeeds_()) {
      var dataset = gwd.dynamic.feeds[datasetId];
      if (dataset) {
        var jsonString = JSON.stringify(dataset.feed), jsonString = encodeURIComponent(jsonString);
        Enabler.setAdParameters("layoutsConfig=" + jsonString);
      }
    }
  }
};
GWDDynamicDataSelectorImpl.prototype.rebind = function() {
  window.Enabler && window.Enabler.setAdParameters("layoutsConfig={}");
  window.onAdData && window.onAdData({google_template_data:{adData:[{}]}});
  this.handleDomContentLoaded_();
  this.handleWebComponentsReadyEvent_();
};
GWDDynamicDataSelectorImpl.prototype.isUsingStudioStandardSchema_ = function() {
  return !!document.querySelector(GwdDynamicDataSelectorConstants.STUDIO_ENABLER_DATA_PROVIDER);
};
GWDDynamicDataSelectorImpl.prototype.handleWebComponentsReadyEvent_ = function() {
  var datasetId = this.getQueryStringParameter_(GwdDynamicDataSelectorConstants.FEED_ID_KEY);
  if (datasetId) {
    var dataset;
    hasCustomFeeds_() && (dataset = gwd.dynamic.feeds[datasetId]) && this.useDataset_(dataset);
  }
  this.populateDropdown_(datasetId);
  window.removeEventListener(EventTypes.WEB_COMPONENTS_READY, this.handleWebComponentsReadyEvent_.bind(this), !1);
};
GWDDynamicDataSelectorImpl.prototype.detachedCallback = function() {
  this.dropdown_.removeEventListener("change", this.selectionHandler_);
};
GWDDynamicDataSelectorImpl.prototype.useDataset_ = function(dataset) {
  if ("function" == typeof window.onAdData) {
    window.onAdData(dataset.feed);
  }
};
GWDDynamicDataSelectorImpl.prototype.getQueryStringParameter_ = function(name) {
  var queryString = BrowserUtil.getQueryString(), match = (new RegExp("[?&]" + name + "=([^&]*)")).exec(queryString);
  return match && decodeURIComponent(match[1].replace(/\+/g, " "));
};
GWDDynamicDataSelectorImpl.prototype.populateDropdown_ = function(currentSelectionId) {
  var emptyOption = document.createElement("option");
  emptyOption.textContent = "No Feed";
  emptyOption.value = "";
  this.dropdown_.appendChild(emptyOption);
  if (hasCustomFeeds_()) {
    var option, id;
    for (id in gwd.dynamic.feeds) {
      option = document.createElement("option"), option.textContent = gwd.dynamic.feeds[id].name, option.value = encodeURIComponent(id), id == currentSelectionId && option.setAttribute("selected", ""), this.dropdown_.appendChild(option);
    }
  }
};
GWDDynamicDataSelectorImpl.prototype.handleSelectionChange_ = function() {
  var selectedIndex = this.dropdown_.selectedIndex, datasetId = this.dropdown_.options[selectedIndex].value;
  BrowserUtil.setQueryString("?feed=" + datasetId);
};
GWDDynamicDataSelectorImpl.prototype.attributeChangedCallback = null;
document.registerElement(GwdDynamicDataSelectorConstants.TAG_NAME, {prototype:GWDDynamicDataSelectorImpl.prototype});

})();
