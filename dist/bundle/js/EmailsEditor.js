(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.emailsEditor = factory());
}(this, (function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var isDomElement = function isDomElement() {
    console.log('test');
  };
  var Polyfill = {
    isDomElement: isDomElement
  };

  var emailsEditor = function emailsEditor() {
    _classCallCheck(this, emailsEditor);
    alert('test');
    console.log('test');
    console.log(Polyfill.isDomElement(null));
  };

  return emailsEditor;

})));
//# sourceMappingURL=EmailsEditor.js.map
