var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
                    return React.createElement(
                        "li",
                        { key: i, className: "media my-2" },
                        React.createElement(
                            "div",
                            { className: "media-body text-right" },
                            isAnonymous ? React.createElement(
                                "h6",
                                { className: "d-inline small" },
                                message.author.username
                            ) : React.createElement(
                                "a",
                                { href: "/users/" + message.author.id._id },
                                React.createElement(
                                    "h6",
                                    { className: "d-inline small" },
                                    message.author.username
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "row m-0 justify-content-end" },
                                React.createElement(
                                    "div",
                                    { className: "col-12 col-lg-8 p-0" },
                                    React.createElement(
                                        "p",
                                        { className: "text-break text-left mb-1 p-2 send_cotainer" },
                                        message.text
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "mr-2 small text-secondary time_container" },
                                        moment(message.date).fromNow()
                                    )
                                )
                            )
                        ),
                        isAnonymous ? React.createElement("img", { className: "avatar-sm mt-3 ml-2 rounded-circle", src: "/stylesheets/avatar-placeholder.jpg" }) : React.createElement(
                            "a",
                            { href: "/users/" + message.author.id._id },
                            React.createElement("img", { className: "avatar-sm mt-3 ml-2 rounded-circle", src: message.author.id.avatar })
                        )
                    );
                } else {
                    return React.createElement(
                        "li",
                        { key: i, className: "media my-2" },
                        isAnonymous ? React.createElement("img", { className: "avatar-sm mt-3 mr-2 rounded-circle", src: "/stylesheets/avatar-placeholder.jpg" }) : React.createElement(
                            "a",
                            { href: "/users/" + message.author.id._id },
                            React.createElement("img", { className: "avatar-sm mt-3 mr-2 rounded-circle", src: message.author.id.avatar })
                        ),
                        React.createElement(
                            "div",
                            { className: "media-body" },
                            isAnonymous ? React.createElement(
                                "h6",
                                { className: "d-inline small" },
                                message.author.username
                            ) : React.createElement(
                                "a",
                                { href: "/users/" + message.author.id._id },
                                React.createElement(
                                    "h6",
                                    { className: "d-inline small" },
                                    message.author.username
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "row m-0" },
                                React.createElement(
                                    "div",
                                    { className: "col-12 col-lg-8 p-0" },
                                    React.createElement(
                                        "div",
                                        null,
                                        React.createElement(
                                            "p",
                                            { className: "text-break mb-1 p-2 receive_cotainer" },
                                            message.text
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "ml-2 small text-secondary time_container" },
                                            moment(message.date).fromNow()
                                        )
                                    )
                                )
                            )
                        )
                    );
                }
            });
            return React.createElement(
                "div",
                { className: "messages" },
                messages
            );
        }
    }]);

    return Messages;
}(React.Component);

export default Messages;