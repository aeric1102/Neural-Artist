class Messages extends React.Component{
    render(){
        var author = this.props.author;
        var messages = this.props.messages.map(function(message, i){
            var isAnonymous = (message.author.id != null) ? false : true;
            var isAuthor = (message.isAuthor || (
                !isAnonymous && author.id != null 
                && message.author.id._id === author.id._id)
            );
            if(isAuthor){
                return(
                    <li key={i} className="media my-2">
                        <div className="media-body text-right">
                            {
                                (isAnonymous) ? ( 
                                    <h6 className="d-inline small">{message.author.username}</h6>
                                ) : (
                                    <a href={"/users/"+message.author.id._id}>
                                        <h6 className="d-inline small">{message.author.username}</h6>
                                    </a>
                                )
                            }
                            <div className="row m-0 justify-content-end">
                                <div className="col-12 col-lg-8 p-0">
                                    <p className="text-break text-left mb-1 p-2 send_cotainer">
                                            {message.text}
                                    </p>
                                    <div className="mr-2 small text-secondary time_container">
                                        {moment(message.date).fromNow()}
                                    </div>
                                </div>
                            </div>

                        </div>
                        {
                            (isAnonymous) ? ( 
                                <img className="avatar-sm mt-3 ml-2 rounded-circle" src="/stylesheets/avatar-placeholder.jpg" />
                            ) : (
                                <a href={"/users/"+message.author.id._id}>
                                    <img className="avatar-sm mt-3 ml-2 rounded-circle" src={message.author.id.avatar} />
                                </a>
                            )
                        }
                    </li>
                );
            }
            else{
                return(
                    <li key={i} className="media my-2">
                        {
                            (isAnonymous) ? ( 
                                <img className="avatar-sm mt-3 mr-2 rounded-circle" src="/stylesheets/avatar-placeholder.jpg" />
                            ) : (
                                <a href={"/users/"+message.author.id._id}>
                                    <img className="avatar-sm mt-3 mr-2 rounded-circle" src={message.author.id.avatar} />
                                </a>
                            )
                        }
                        <div className="media-body">
                            {
                                (isAnonymous) ? ( 
                                    <h6 className="d-inline small">{message.author.username}</h6>
                                ) : (
                                    <a href={"/users/"+message.author.id._id}>
                                        <h6 className="d-inline small">{message.author.username}</h6>
                                    </a>
                                )

                            }
                            <div className="row m-0">
                                <div className="col-12 col-lg-8 p-0">
                                    <div>
                                        <p className="text-break mb-1 p-2 receive_cotainer">
                                            {message.text}
                                        </p>
                                        <div className="ml-2 small text-secondary time_container">
                                            {moment(message.date).fromNow()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                );
            }
        });
        return (
            <div className="messages">
                {messages}
            </div>
        )
    }
}
export default Messages;