// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"messages.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (_typeof(call) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + _typeof(superClass));
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var Messages = function (_React$Component) {
  _inherits(Messages, _React$Component);

  function Messages() {
    _classCallCheck(this, Messages);

    return _possibleConstructorReturn(this, (Messages.__proto__ || Object.getPrototypeOf(Messages)).apply(this, arguments));
  }

  _createClass(Messages, [{
    key: "render",
    value: function render() {
      var author = this.props.author;
      var messages = this.props.messages.map(function (message, i) {
        var isAnonymous = message.author.id != null ? false : true;
        var isAuthor = message.isAuthor || !isAnonymous && author.id != null && message.author.id._id === author.id._id;

        if (isAuthor) {
          return React.createElement("li", {
            key: i,
            className: "media my-2"
          }, React.createElement("div", {
            className: "media-body text-right"
          }, isAnonymous ? React.createElement("h6", {
            className: "d-inline small"
          }, message.author.username) : React.createElement("a", {
            href: "/users/" + message.author.id._id
          }, React.createElement("h6", {
            className: "d-inline small"
          }, message.author.username)), React.createElement("div", {
            className: "row m-0 justify-content-end"
          }, React.createElement("div", {
            className: "col-12 col-lg-8 p-0"
          }, React.createElement("p", {
            className: "text-break text-left mb-1 p-2 send_cotainer"
          }, message.text), React.createElement("div", {
            className: "mr-2 small text-secondary time_container"
          }, moment(message.date).fromNow())))), isAnonymous ? React.createElement("img", {
            className: "avatar-sm mt-3 ml-2 rounded-circle",
            src: "/stylesheets/avatar-placeholder.jpg"
          }) : React.createElement("a", {
            href: "/users/" + message.author.id._id
          }, React.createElement("img", {
            className: "avatar-sm mt-3 ml-2 rounded-circle",
            src: message.author.id.avatar
          })));
        } else {
          return React.createElement("li", {
            key: i,
            className: "media my-2"
          }, isAnonymous ? React.createElement("img", {
            className: "avatar-sm mt-3 mr-2 rounded-circle",
            src: "/stylesheets/avatar-placeholder.jpg"
          }) : React.createElement("a", {
            href: "/users/" + message.author.id._id
          }, React.createElement("img", {
            className: "avatar-sm mt-3 mr-2 rounded-circle",
            src: message.author.id.avatar
          })), React.createElement("div", {
            className: "media-body"
          }, isAnonymous ? React.createElement("h6", {
            className: "d-inline small"
          }, message.author.username) : React.createElement("a", {
            href: "/users/" + message.author.id._id
          }, React.createElement("h6", {
            className: "d-inline small"
          }, message.author.username)), React.createElement("div", {
            className: "row m-0"
          }, React.createElement("div", {
            className: "col-12 col-lg-8 p-0"
          }, React.createElement("div", null, React.createElement("p", {
            className: "text-break mb-1 p-2 receive_cotainer"
          }, message.text), React.createElement("div", {
            className: "ml-2 small text-secondary time_container"
          }, moment(message.date).fromNow()))))));
        }
      });
      return React.createElement("div", {
        className: "messages"
      }, messages);
    }
  }]);

  return Messages;
}(React.Component);

var _default = Messages;
exports.default = _default;
},{}],"chats.js":[function(require,module,exports) {
"use strict";

var _messages = _interopRequireDefault(require("./messages"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    return Array.from(arr);
  }
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (_typeof(call) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + _typeof(superClass));
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var socket = io();
// document ready
$(function () {
  $("#top_jumbotron p").text("Chat with artists from all over the world!");
  $(window).unbind("scroll");
  $(".navbar").addClass("navbar-shrink");
  $("#brand-title").addClass("brand-invisible");
  $("#bottom-footer").addClass("d-none");
});

if (currentUser) {
  var author = {
    id: {
      avatar: currentUser.avatar,
      _id: currentUser._id
    },
    username: currentUser.username
  };
} else {
  var author = {
    id: null,
    username: "Anonymous"
  };
}

var Chat = function (_React$Component) {
  _inherits(Chat, _React$Component);

  function Chat(props) {
    _classCallCheck(this, Chat);

    var _this = _possibleConstructorReturn(this, (Chat.__proto__ || Object.getPrototypeOf(Chat)).call(this, props));

    _this.state = {
      author: author,
      text: "",
      messages: [],
      disabled_btn: true
    };

    var receiveBatch = _this.receiveBatch.bind(_this); //Initial get


    $(function () {
      $.get("/chats/messages", function (data) {
        if (data.error) {
          console.log("A server error occurs.");
          return;
        }

        receiveBatch(data);
        $("#message_container").scrollTop($("#message_container")[0].scrollHeight);
      });
    });

    var receive = _this.receive.bind(_this);

    socket.on("received", function (data) {
      receive(data);
    });
    _this.send = _this.send.bind(_this);
    _this.handleMessageChange = _this.handleMessageChange.bind(_this);
    return _this;
  }

  _createClass(Chat, [{
    key: "send",
    value: function send(e) {
      e.preventDefault();

      if (!/\S/.test(this.state.text)) {
        // empty text
        return;
      }

      var data = {
        author: this.state.author,
        text: this.state.text
      };
      socket.emit("message", data);
      data.isAuthor = true;
      this.setState({
        text: "",
        messages: [].concat(_toConsumableArray(this.state.messages), [data]),
        disabled_btn: true
      });
      $("#message_container").stop().animate({
        scrollTop: $('#message_container')[0].scrollHeight
      }, 300);
    }
  }, {
    key: "receiveBatch",
    value: function receiveBatch(data) {
      this.setState({
        messages: [].concat(_toConsumableArray(data))
      });
    }
  }, {
    key: "receive",
    value: function receive(data) {
      this.setState({
        messages: [].concat(_toConsumableArray(this.state.messages), [data])
      });
    }
  }, {
    key: "handleMessageChange",
    value: function handleMessageChange(e) {
      var text = e.target.value;

      if (/\S/.test(text)) {
        // valid text
        this.setState({
          disabled_btn: false
        });
      } else {
        // empty text
        this.setState({
          disabled_btn: true
        });
      }

      this.setState({
        text: e.target.value
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("div", {
        className: "container"
      }, React.createElement("div", {
        className: "row justify-content-center"
      }, React.createElement("div", {
        className: "col-12 col-lg-8 p-0"
      }, React.createElement("div", {
        className: "card border-top-0"
      }, React.createElement("div", {
        id: "message_container",
        className: "card-body"
      }, React.createElement(_messages.default, {
        messages: this.state.messages,
        author: this.state.author
      })), React.createElement("div", {
        className: "card-footer"
      }, React.createElement("form", {
        onSubmit: this.send
      }, React.createElement("div", {
        className: "row"
      }, React.createElement("div", {
        className: "col-10 col-lg-11 p-0 px-1"
      }, React.createElement("input", {
        type: "text",
        placeholder: "Write a message",
        value: this.state.text,
        onChange: this.handleMessageChange,
        className: "form-control"
      })), React.createElement("div", {
        className: "col-2 col-lg-1 p-0 px-1"
      }, React.createElement("div", {
        id: "message_submit_btn_container"
      }, React.createElement("button", {
        className: "align-self-center btn btn-primary",
        disabled: this.state.disabled_btn
      }, React.createElement("i", {
        className: "far fa-paper-plane"
      })))))))))));
    }
  }]);

  return Chat;
}(React.Component);

var domContainer = document.querySelector('#root');
ReactDOM.render(React.createElement(Chat, null), domContainer);
},{"./messages":"messages.js"}],"../../../../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "51818" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","chats.js"], null)
//# sourceMappingURL=/chats.js.map