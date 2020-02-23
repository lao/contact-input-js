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

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  var REMOVE_SVG = "<svg class=\"remove-icon-svg\" width=\"8\" height=\"8\" viewBox=\"0 0 8 8\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M8 0.8L7.2 0L4 3.2L0.8 0L0 0.8L3.2 4L0 7.2L0.8 8L4 4.8L7.2 8L8 7.2L4.8 4L8 0.8Z\" fill=\"#050038\"/>\n</svg>";
  var emailsEditor =
  function () {
    function emailsEditor(config) {
      _classCallCheck(this, emailsEditor);
      config = config || {};
      if (!config || !config.container) {
        throw new Error('invalid config exiting...');
      }
      this.initValues(config).renderMainContainer().initListeners();
    }
    _createClass(emailsEditor, [{
      key: "initValues",
      value: function initValues(config) {
        this.emails = [];
        this.onChange = config.onChange;
        this.container = config.container;
        this.onGetCount = config.onGetCount;
        return this;
      }
    }, {
      key: "getEmails",
      value: function getEmails() {
        return this.emails;
      }
    }, {
      key: "setEmails",
      value: function setEmails(emails) {
        var _this = this;
        if (!emails) {
          return;
        }
        var newEmails = emails.reduce(function (validEmails, email) {
          var regexResults = _this.isValidEmail(email);
          if (regexResults) {
            validEmails.push(regexResults[0]);
          }
          return validEmails;
        }, []);
        var emailsBefore = _toConsumableArray(this.emails);
        this.clearEmailBlocks().renderEmailBlocks(null, newEmails).dispatchOnChange(emailsBefore);
      }
    }, {
      key: "clearEmailBlocks",
      value: function clearEmailBlocks() {
        this.emails = [];
        this.container.querySelectorAll('.ballon').forEach(function (el) {
          return el.remove();
        });
        return this;
      }
    }, {
      key: "dispatchOnChange",
      value: function dispatchOnChange(emailsBefore) {
        if (this.onChange instanceof Function) {
          this.onChange(emailsBefore, this.emails);
        }
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
        var addRandomBtn = container.querySelector('.btn-add-random');
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
            var emailsBefore = _toConsumableArray(_this2.emails);
            _this2.renderEmailBlocks(currentTarget.value).dispatchOnChange(emailsBefore).cleanInput();
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
          var emailsBefore = _toConsumableArray(_this2.emails);
          _this2.renderEmailBlocks(currentTarget.value + clipBoardText).dispatchOnChange(emailsBefore).cleanInput();
          e.preventDefault();
        };
        var ballonsClickHandler = function ballonsClickHandler(e) {
          var isClickOnSvg = e.target.getAttribute('class') === 'remove-icon-svg';
          var target = isClickOnSvg ? e.target.parentElement : e.target;
          if (target.className === 'remove-icon') {
            if (target.parentElement.className !== 'invalid ballon') {
              var emailsBefore = _toConsumableArray(_this2.emails);
              _this2.emails.splice(_this2.emails.indexOf(target.parentElement.getAttribute('data-email')), 1);
              _this2.dispatchOnChange(emailsBefore);
            }
            ballonsContainer.removeChild(target.parentElement);
          }
        };
        input.addEventListener('paste', pasteListener);
        input.addEventListener('keyup', keyUpListener);
        input.addEventListener('focusout', function (e) {
          var _ref3 = e || {},
              currentTarget = _ref3.currentTarget;
          var emailsBefore = _toConsumableArray(_this2.emails);
          _this2.renderEmailBlocks(currentTarget.value).dispatchOnChange(emailsBefore).cleanInput();
        });
        ballonsContainer.addEventListener('click', ballonsClickHandler);
        if (this.onGetCount && this.onGetCount instanceof Function) {
          getCountBtn.addEventListener('click', function () {
            _this2.onGetCount(_this2.emails.length);
          });
        }
        addRandomBtn.addEventListener('click', function () {
          var random = "some".concat(new Date().getTime(), "@random.com");
          var emailsBefore = _toConsumableArray(_this2.emails);
          _this2.renderEmailBlocks(random).dispatchOnChange(emailsBefore);
        });
        return this;
      }
    }, {
      key: "renderEmailBlock",
      value: function renderEmailBlock(string, valid) {
        var removeIconDiv = document.createElement('div');
        removeIconDiv.className = !valid ? 'invalid ballon' : 'ballon';
        removeIconDiv.innerHTML = "".concat(valid ? string : "<span>".concat(string, "</span>"), " <div class=\"remove-icon\">").concat(REMOVE_SVG, "</div>");
        removeIconDiv.setAttribute('data-email', valid ? string : '');
        return removeIconDiv;
      }
    }, {
      key: "isValidEmail",
      value: function isValidEmail(string) {
        var emailRegx = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g;
        return emailRegx.exec(string);
      }
    }, {
      key: "renderEmailBlocks",
      value: function renderEmailBlocks(stringValue, values) {
        var _this3 = this;
        var blocks = values || (stringValue || '').split(',');
        var ballonsBlockFrag = document.createDocumentFragment();
        blocks.map(function (block) {
          block = (block + '').trim();
          if (!block) {
            return;
          }
          var isEmail = _this3.isValidEmail(block);
          ballonsBlockFrag.appendChild(_this3.renderEmailBlock(block, isEmail));
          if (isEmail) {
            _this3.emails.push(block);
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
        var template = "\n      <div class=\"container\">\n        <div class=\"top\">\n          <h1>Share <strong>Board name</strong> with others</h1>\n          <div class=\"text-container\">\n            <div class=\"ballons-container\">\n              <div class=\"input-container\"><input placeholder=\"add more people...\"/></div>\n            </div>\n          </div>\n        </div>\n        <div class=\"bottom\">\n          <button class=\"btn-add-random\">\n            Add email\n          </button>  \n          <button class=\"btn-count\">\n            Get emails count\n          </button>\n        </div>\n      </div>\n    ";
        container.innerHTML = template;
        return this;
      }
    }]);
    return emailsEditor;
  }();

  return emailsEditor;

})));
//# sourceMappingURL=EmailsEditor.js.map
