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

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var emailsEditor =
  function () {
    function emailsEditor(config) {
      _classCallCheck(this, emailsEditor);
      var _ref = config || {},
          container = _ref.container;
      if (!this.validConfig(config)) {
        console.log('config invalid');
      }
      this.emails = {};
      this.render(container);
      var input = container.querySelector('input');
      var listener = function listener(e) {
        return e;
      };
      input.addEventListener('change', listener);
      input.addEventListener('keyup', listener);
    }
    _createClass(emailsEditor, [{
      key: "validConfig",
      value: function validConfig(config) {
        return config && config.container;
      }
    }, {
      key: "render",
      value: function render(el) {
        var template = "\n      <div class=\"container\">\n        <div class=\"top\">\n          <h1>Share <strong>Board name</strong> with others</h1>\n          <div class=\"text-container\">\n            <div class=\"ballons-container\">\n              <div class=\"ballon\">dfdff</div>\n            </div>\n            <input placeholder=\"add more people...\"/>\n          </div>\n        </div>\n        <div class=\"bottom\">\n          <button>\n            Add email\n          </button>  \n          <button>\n            Get emails count\n          </button>\n        </div>\n      </div>\n    ";
        el.innerHTML = template;
        return el;
      }
    }]);
    return emailsEditor;
  }();

  return emailsEditor;

})));
//# sourceMappingURL=EmailsEditor.js.map
