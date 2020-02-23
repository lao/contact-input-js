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

  var REMOVE_SVG = "<svg class=\"remove-icon-svg\" width=\"8\" height=\"8\" viewBox=\"0 0 8 8\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M8 0.8L7.2 0L4 3.2L0.8 0L0 0.8L3.2 4L0 7.2L0.8 8L4 4.8L7.2 8L8 7.2L4.8 4L8 0.8Z\" fill=\"#050038\"/>\n</svg>";
  var emailsEditor =
  function () {
    function emailsEditor(config) {
      _classCallCheck(this, emailsEditor);
      config = config || {};
      if (!config || !config.container) {
        console.log('invalid config exiting...');
        return;
      }
      this.initValues(config).renderMainContainer().initListeners();
    }
    _createClass(emailsEditor, [{
      key: "initValues",
      value: function initValues(config) {
        this.emails = {};
        this.onChange = config.onChange;
        this.container = config.container;
        this.onGetCount = config.onGetCount;
        return this;
      }
    }, {
      key: "getEmails",
      value: function getEmails() {
        return Object.keys(this.emails);
      }
    }, {
      key: "setEmails",
      value: function setEmails(emails) {
        var _this = this;
        if (!emails || !emails.length) {
          return;
        }
        var emailsTemp = emails.reduce(function (email, nonRendered) {
          if (_this.isValidEmail(email)) {
            nonRendered.append(email);
            _this.emails[email] = true;
          }
          return nonRendered;
        }, []);
        this.renderEmails(emailsTemp.list);
      }
    }, {
      key: "dispatchOnChange",
      value: function dispatchOnChange() {
        console.log('hello');
        return this;
      }
    }, {
      key: "initListeners",
      value: function initListeners() {
        var _this2 = this;
        var container = this.container;
        var input = container.querySelector('input');
        var ballonsContainer = container.querySelector('.ballons-container');
        var getCountBtn = container.querySelector('.btn-count');
        var keys = {
          ENTER: 13,
          COMMA: 188
        };
        var keyUpListener = function keyUpListener(e) {
          var _ref = e || {},
              keyCode = _ref.keyCode,
              currentTarget = _ref.currentTarget,
              ctrlKey = _ref.ctrlKey,
              metaKey = _ref.metaKey;
          if (keyCode === keys.COMMA || keyCode === keys.ENTER) {
            var emailsBefore = Object.keys(_this2.emails);
            _this2.renderEmails(currentTarget.value).dispatchOnChange(emailsBefore, currentTarget.value).cleanInput();
          }
          if (metaKey || ctrlKey) {
            return false;
          }
          return e;
        };
        var pasteListener = function pasteListener(e) {
          var _ref2 = e || {},
              currentTarget = _ref2.currentTarget,
              clipboardData = _ref2.clipboardData;
          var clipBoardText = clipboardData.getData('text');
          _this2.renderEmails(currentTarget.value + clipBoardText).cleanInput();
          e.preventDefault();
        };
        var ballonsClickHandler = function ballonsClickHandler(e) {
          var isClickOnSvg = e.target.getAttribute('class') === 'remove-icon-svg';
          var target = isClickOnSvg ? e.target.parentElement : e.target;
          if (target.className === 'remove-icon') {
            if (target.parentElement.className !== 'invalid ballon') {
              delete _this2.emails[target.parentElement.getAttribute('data-email')];
            }
            ballonsContainer.removeChild(target.parentElement);
          }
        };
        input.addEventListener('paste', pasteListener);
        input.addEventListener('keyup', keyUpListener);
        ballonsContainer.addEventListener('click', ballonsClickHandler);
        if (this.onGetCount && this.onGetCount instanceof Function) {
          getCountBtn.addEventListener('click', function () {
            var emails = Object.keys(_this2.emails);
            _this2.onGetCount(emails.length);
          });
        }
        return this;
      }
    }, {
      key: "renderEmailBlock",
      value: function renderEmailBlock(string, valid) {
        var removeIconDiv = document.createElement('div');
        removeIconDiv.className = !valid ? 'invalid ballon' : 'ballon';
        removeIconDiv.innerHTML = "".concat(string, " <div class=\"remove-icon\">").concat(REMOVE_SVG, "</div>");
        removeIconDiv.setAttribute('data-email', valid ? string : '');
        return removeIconDiv;
      }
    }, {
      key: "isValidEmail",
      value: function isValidEmail(string) {
        var emailRegx = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g;
        return !!emailRegx.exec(string);
      }
    }, {
      key: "renderEmails",
      value: function renderEmails(stringValue, values) {
        var _this3 = this;
        var blocks = values || (stringValue || '').split(',');
        var ballonsBlockFrag = document.createDocumentFragment();
        blocks.map(function (block) {
          if (!(block + '').trim()) {
            return;
          }
          var isEmail = _this3.isValidEmail(block);
          ballonsBlockFrag.appendChild(_this3.renderEmailBlock(block, isEmail));
          if (isEmail) {
            _this3.emails[block] = true;
          }
        });
        var inputEl = this.container.querySelector('.input-container');
        this.container.querySelector('.ballons-container').insertBefore(ballonsBlockFrag, inputEl);
        return this;
      }
    }, {
      key: "cleanInput",
      value: function cleanInput() {
        var container = this.container;
        var input = container.querySelector('input');
        input.value = '';
        return this;
      }
    }, {
      key: "renderMainContainer",
      value: function renderMainContainer() {
        var container = this.container;
        var template = "\n      <div class=\"container\">\n        <div class=\"top\">\n          <h1>Share <strong>Board name</strong> with others</h1>\n          <div class=\"text-container\">\n            <div class=\"ballons-container\">\n              <div class=\"input-container\"><input placeholder=\"add more people...\"/></div>\n            </div>\n          </div>\n        </div>\n        <div class=\"bottom\">\n          <button>\n            Add email\n          </button>  \n          <button class=\"btn-count\">\n            Get emails count\n          </button>\n        </div>\n      </div>\n    ";
        container.innerHTML = template;
        return this;
      }
    }]);
    return emailsEditor;
  }();

  return emailsEditor;

})));
//# sourceMappingURL=EmailsEditor.js.map
