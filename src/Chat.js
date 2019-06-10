import React, { Component } from "react";
import { View, Text } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import firebase from "firebase";

class Chat extends Component {
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        let titlePage = state.params.name;
        return {
            title: titlePage.charAt(0).toUpperCase() + titlePage.slice(1),
            headerTitleStyle: { textAlign: "center", alignSelf: "center" },
            headerStyle: {
                backgroundColor: "white"
            }
        };
    };

    constructor(props) {
        console.log("Chat Page");
        super(props);

        this.state = {
            messages: []
        };

        this.myUser = firebase.auth().currentUser;
        console.log("My UID:" + this.myUser.uid);

        const { params } = this.props.navigation.state;
        this.uidFriend = params.uid;
        this.nameFriend = params.name;
        this.avatarFriend = params.avatarIMG
            ? params.avatarIMG
            : require("../src/images/avatar.jpg");
        console.log("Friend UID: " + this.uidFriend);
        console.log("Friend Name: " + this.nameFriend);
    }

    // Generate ChatId works cause when you are the user sending chat you take user.uid and your friend takes uid
    // when your friend is using the app to send message s/he takes user.uid and you take the uid cause you are the friend
    generateChatId() {
        if (this.myUser.uid > this.uidFriend)
            return this.myUser.uid + "-" + this.uidFriend;
        // return `${this.myUser.uid}-${this.uidFriend}`;
        else return this.uidFriend + "-" + this.myUser.uid;
        // return `${this.uidFriend}-${this.myUser.uid}`;
    }

    componentDidMount() {
        this.chatRef = firebase.database().ref("chat/" + this.generateChatId());

        const onReceive = data => {
            // C1:
            let messData = data.val();
            this.setState(previousState => {
                return {
                    messages: GiftedChat.append(previousState.messages, {
                        _id: messData.createdAt,
                        text: messData.text,
                        createdAt: new Date(messData.createdAt),
                        user: {
                            _id: messData.uid,
                            name: this.nameFriend,
                            avatar: this.avatarFriend
                        }
                    })
                };
            });

            // C2:
            // get children as an array
            // var items = [];
            // data.forEach(child => {
            //     items.push({
            //         _id: child.createdAt,
            //         text: child.text,
            //         createdAt: new Date(child.createdAt),
            //         user: {
            //             _id: child.uid
            //         }
            //     });
            // });

            // this.setState({
            //     messages: items.reverse()
            // });
        };
        this.chatRef.orderByChild("order").on("child_added", onReceive);
    }

    componentWillUnmount() {
        this.chatRef.off();
    }

    sendMessage = messages => {
        messages.forEach(mess => {
            var now = firebase.database.ServerValue.TIMESTAMP;
            this.chatRef.push({
                _id: now,
                text: mess.text,
                uid: this.myUser.uid,
                createdAt: now,
                order: now
            });
        });
    };

    render() {
        return (
            <GiftedChat
                messages={this.state.messages}
                onSend={messages => {
                    this.sendMessage(messages);
                }}
                user={{
                    _id: this.myUser.uid
                }}
            />
        );
    }
}

export default Chat;
