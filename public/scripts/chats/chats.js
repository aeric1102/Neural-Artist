var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var socket = io();
import Messages from "./messages";
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
        var receiveBatch = _this.receiveBatch.bind(_this);
        //Initial get
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
            this.setState({ messages: [].concat(_toConsumableArray(data)) });
        }
    }, {
        key: "receive",
        value: function receive(data) {
            this.setState({ messages: [].concat(_toConsumableArray(this.state.messages), [data]) });
        }
    }, {
        key: "handleMessageChange",
        value: function handleMessageChange(e) {
            var text = e.target.value;
            if (/\S/.test(text)) {
                // valid text
                this.setState({ disabled_btn: false });
            } else {
                // empty text
                this.setState({ disabled_btn: true });
            }
            this.setState({ text: e.target.value });
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "container" },
                React.createElement(
                    "div",
                    { className: "row justify-content-center" },
                    React.createElement(
                        "div",
                        { className: "col-12 col-lg-8 p-0" },
                        React.createElement(
                            "div",
                            { className: "card border-top-0" },
                            React.createElement(
                                "div",
                                { id: "message_container", className: "card-body" },
                                React.createElement(Messages, { messages: this.state.messages, author: this.state.author })
                            ),
                            React.createElement(
                                "div",
                                { className: "card-footer" },
                                React.createElement(
                                    "form",
                                    { onSubmit: this.send },
                                    React.createElement(
                                        "div",
                                        { className: "row" },
                                        React.createElement(
                                            "div",
                                            { className: "col-10 col-lg-11 p-0 px-1" },
                                            React.createElement("input", { type: "text", placeholder: "Write a message", value: this.state.text,
                                                onChange: this.handleMessageChange, className: "form-control" })
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "col-2 col-lg-1 p-0 px-1" },
                                            React.createElement(
                                                "div",
                                                { id: "message_submit_btn_container" },
                                                React.createElement(
                                                    "button",
                                                    { className: "align-self-center btn btn-primary", disabled: this.state.disabled_btn },
                                                    React.createElement("i", { className: "far fa-paper-plane" })
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return Chat;
}(React.Component);

var domContainer = document.querySelector('#root');
ReactDOM.render(React.createElement(Chat, null), domContainer);