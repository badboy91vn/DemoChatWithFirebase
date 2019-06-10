import React, { Component } from "react";
import {
    StyleSheet,
    View,
    Image,
    ListView,
    ScrollView,
    TouchableHighlight
} from "react-native";
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
import * as firebase from "firebase";

class FriendView extends Component {
    render() {
        return (
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    margin: 2,
                    padding: 5
                }}
            >
                <View>
                    <Image
                        style={styles.avatar}
                        source={this.props.avatarIMG}
                    />
                    <View style={styles.onlinePoint} />
                    {/* <View style={styles.offlinePoint} /> */}
                </View>
                <Text style={{ margin: 10 }}>{this.props.name}</Text>
            </View>
        );
    }
}
class FriendListPage extends Component {
    static navigationOptions = {
        header: null
    };

    constructor() {
        super();

        this.ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        this.state = {
            friendList: []
        };

        console.log("Friend List");
        this.myUser = firebase.auth().currentUser;
        console.log("My UID: " + this.myUser.uid);

        this.friendRef = this.getRef().child(this.myUser.uid + "/friendlist");
        this.friendRefData = this.friendRef.orderByChild("friendlist");
    }

    getRef() {
        return firebase.database().ref("users");
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
                // switch (error.code_) {
                //     case "storage/object-not-found":
                //         // console.log("File doesn't exist");
                //         break;
                //     case "storage/unauthorized":
                //         // console.log(
                //         //     "User doesn't have permission to access the object"
                //         // );
                //         break;
                //     case "storage/canceled":
                //         // console.log("User canceled the upload");
                //         break;
                //     case "storage/unknown":
                //         // console.log(
                //         //     "Unknown error occurred, inspect the server response"
                //         // );
                //         break;
                // }
            });
    };

    getdataFriend = async (items, callback) => {
        let itemNew = [];
        for (let child of items) {
            await this.downloadAvatar(child.uid, resolve => {
                child.avatarIMG =
                    resolve == "error"
                        ? require("../../src/images/avatar.jpg")
                        : { uri: resolve };
            });
            itemNew.push(child);
        }
        callback({
            data: itemNew
        });
    };

    componentDidMount() {
        this.friendRefData.on("value", snap => {
            let items = [];
            snap.forEach(child => {
                items.push({
                    uid: child.key,
                    nickname: this.upperFirstChar(child.val().nickname)
                });
            });

            this.getdataFriend(items, resolve => {
                this.setState({ friendList: resolve.data });
            });
        });
    }

    componentWillUnmount() {
        this.friendRefData.off();
    }

    render() {
        return (
            <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
                <View style={{ flex: 1 }}>
                    <ListView
                        enableEmptySections
                        dataSource={this.ds.cloneWithRows(
                            this.state.friendList
                        )}
                        renderRow={rowData => {
                            return (
                                <TouchableHighlight
                                    underlayColor="#d9d9d9"
                                    onPress={() => {
                                        this.props.screenProps.navigationHome.navigate(
                                            "ChatPage",
                                            {
                                                uid: rowData.uid,
                                                name: rowData.nickname,
                                                avatarIMG: rowData.avatarIMG.uri
                                            }
                                        );
                                    }}
                                >
                                    <FriendView
                                        name={rowData.nickname}
                                        avatarIMG={rowData.avatarIMG}
                                    />
                                </TouchableHighlight>
                            );
                        }}
                    />
                </View>
            </ScrollView>
        );
    }
}

export default FriendListPage;

const styles = StyleSheet.create({
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18
    },
    onlinePoint: {
        position: "absolute",
        left: 22,
        top: 25,
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: "white",
        backgroundColor: "#3dfa5f"
    },
    offlinePoint: {
        position: "absolute",
        left: 22,
        top: 25,
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: "white",
        backgroundColor: "#c4c9cf"
    }
});
