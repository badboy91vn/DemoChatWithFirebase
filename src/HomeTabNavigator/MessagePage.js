import React, { Component } from "react";
import { View } from "react-native";
import {
    Container,
    Header,
    Content,
    List,
    ListItem,
    Left,
    Body,
    Right,
    Thumbnail,
    Text
} from "native-base";
import firebase from "firebase";

class MessagePage extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        this.state = {
            messages: []
        };

        console.log("Message Page");
        this.myUser = firebase.auth().currentUser;
        console.log("My UID: " + this.myUser.uid);

        this.chatRef = this.getRef().child("chat");
        this.chatRefData = this.chatRef.orderByChild("order");
    }

    getRef() {
        return firebase.database().ref();
    }

    upperFirstChar(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    downloadAvatar = async (uid, callback) => {
        await firebase
            .storage()
            .ref("avatars/" + uid + ".jpg")
            .getDownloadURL()
            .then(function(url) {
                // console.log("avatarURL: " + url);
                callback(url);
            })
            .catch(function(error) {
                // console.log(error);
                callback("error");
                switch (error.code_) {
                    case "storage/object-not-found":
                        // console.log("File doesn't exist");
                        break;
                    case "storage/unauthorized":
                        // console.log(
                        //     "User doesn't have permission to access the object"
                        // );
                        break;
                    case "storage/canceled":
                        // console.log("User canceled the upload");
                        break;
                    case "storage/unknown":
                        // console.log(
                        //     "Unknown error occurred, inspect the server response"
                        // );
                        break;
                }
            });
    };

    getNicknameUser = async (myUserUID, items, callback) => {
        let itemsNew = [];
        for (let obj of items) {
            let chatWith = obj.chatWith;
            let friendDataRef = await this.getRef().child(
                "users/" + myUserUID + "/friendlist/" + chatWith
            );
            await friendDataRef.once("child_added", data => {
                obj.nickname = this.upperFirstChar(data.val());
                // itemsNew.push(obj);
            });

            await this.downloadAvatar(chatWith, resolve => {
                obj.avatarIMG =
                    resolve == "error"
                        ? require("../../src/images/avatar.jpg")
                        : { uri: resolve };
            });
            itemsNew.push(obj);
        }
        callback({
            data: itemsNew
        });
    };

    componentDidMount() {
        this.chatRefData.on("value", snap => {
            let items = [];
            let myUserUID = this.myUser.uid;
            snap.forEach(child => {
                // check xem dung uid cua current user ko
                let key = child.key;
                if (key.search(myUserUID) != -1) {
                    let keyNew = key.replace(myUserUID, "").replace("-", "");
                    // console.log("User Chat: " + keyNew);

                    let count = 1;
                    child.forEach(data => {
                        // lay ra mess cuoi cung
                        if (count == child.numChildren()) {
                            items.push({
                                roomChat: key,
                                text: data.val().text,
                                createdAt: new Date(data.val().createdAt),
                                chatWith: keyNew
                            });
                        }
                        count++;
                    });
                }
            });

            // Get nickname by uid
            this.getNicknameUser(myUserUID, items, resolve => {
                this.setState({
                    messages: resolve.data
                });
            });
        });
    }

    componentWillUnmount() {
        this.chatRefData.off();
    }

    render() {
        return (
            <Container>
                <Content style={{ backgroundColor: "white" }}>
                    <List
                        dataArray={this.state.messages}
                        renderRow={item => {
                            return (
                                <ListItem
                                    avatar
                                    onPress={() => {
                                        this.props.screenProps.navigationHome.navigate(
                                            "ChatPage",
                                            {
                                                uid: item.chatWith,
                                                name: item.nickname,
                                                avatarIMG: item.avatarIMG.uri
                                            }
                                        );
                                    }}
                                >
                                    <Left>
                                        <Thumbnail
                                            small
                                            source={item.avatarIMG}
                                        />
                                    </Left>
                                    <Body>
                                        <Text>{item.nickname}</Text>
                                        <Text
                                            note
                                            style={{
                                                color: "gray",
                                                fontSize: 14
                                            }}
                                        >
                                            {item.text}
                                        </Text>
                                    </Body>
                                    <Right>
                                        {/* <Text note>{item.createdAt}</Text> */}
                                    </Right>
                                </ListItem>
                            );
                        }}
                    />
                </Content>
            </Container>
        );
    }
}

export default MessagePage;
