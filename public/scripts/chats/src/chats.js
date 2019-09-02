var socket = io();
import Messages from "./messages"
// document ready
$(function(){
    $("#top_jumbotron p").text("Chat with artists from all over the world!");
    $(window).unbind("scroll");
    $(".navbar").addClass("navbar-shrink");
    $("#brand-title").addClass("brand-invisible");
    $("#bottom-footer").addClass("d-none");
});
if (currentUser){
    var author = {
        id: {
            avatar: currentUser.avatar,
            _id: currentUser._id
        },
        username: currentUser.username
    }
}
else{
    var author = {
        id: null,
        username: "Anonymous"
    }   
}

class Chat extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            author: author,
            text: "",
            messages: [],
            disabled_btn: true
        }
        var receiveBatch = this.receiveBatch.bind(this); 
        //Initial get
        $(function () {
            $.get("/chats/messages", function(data){
                if(data.error){
                    console.log("A server error occurs.")
                    return;
                }
                receiveBatch(data);
                $("#message_container").scrollTop($("#message_container")[0].scrollHeight);
            });
        });
        var receive = this.receive.bind(this);
        socket.on("received", function(data){
            receive(data);
        });
        this.send = this.send.bind(this);
        this.handleMessageChange = this.handleMessageChange.bind(this);
    }
    send(e){
        e.preventDefault();
        if (!(/\S/.test(this.state.text))){
            // empty text
            return;
        }
        var data = {
            author: this.state.author,
            text: this.state.text
        }
        socket.emit("message", data);
        data.isAuthor = true;
        this.setState({
            text: "", 
            messages: [...this.state.messages, data],
            disabled_btn: true
        });
        $("#message_container").stop().animate({
          scrollTop: $('#message_container')[0].scrollHeight
        }, 300);
    }

    receiveBatch(data){
        this.setState({messages: [...data]});
    }

    receive(data){
        this.setState({messages: [...this.state.messages, data]});
    }

    handleMessageChange(e){
        var text = e.target.value;
        if (/\S/.test(text)){
            // valid text
            this.setState({disabled_btn: false});
        }
        else{
            // empty text
            this.setState({disabled_btn: true});
        }
        this.setState({text: e.target.value});
    }

    render(){
        return(
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-8 p-0">
                        <div className="card border-top-0">
                            <div id="message_container" className="card-body">
                                <Messages messages={this.state.messages} author={this.state.author} />
                            </div>
                            <div className="card-footer">
                                <form onSubmit={this.send}>
                                    <div className="row">
                                        <div className="col-10 col-lg-11 p-0 px-1">
                                            <input type="text" placeholder="Write a message" value={this.state.text} 
                                                onChange={this.handleMessageChange} className="form-control"/>
                                        </div>
                                        <div className="col-2 col-lg-1 p-0 px-1">
                                            <div id="message_submit_btn_container">
                                                <button className="align-self-center btn btn-primary" disabled={this.state.disabled_btn}>
                                                    <i className="far fa-paper-plane"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );  
    }
}



const domContainer = document.querySelector('#root');
ReactDOM.render(<Chat />, domContainer);
