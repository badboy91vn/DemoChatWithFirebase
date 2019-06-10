import React, { Component } from "react";
import { View, Text, SafeAreaView } from "react-native";
import {
    Container,
    Form,
    Content,
    Item,
    Label,
    Input,
    Button
} from "native-base";
import { TabNavigator } from "react-navigation";
// import ImagePicker from "react-native-image-picker";
import { ImagePicker, Permissions } from "expo";
import firebase from "firebase";
import FileSystem from "react-native-filesystem";
// import RNFetchBlob from "react-native-fetch-blob";

import HomeHeader from "../src/HomeHeader";
import MessagePage from "../src/HomeTabNavigator/MessagePage";
import FriendListPage from "../src/HomeTabNavigator/FriendListPage";
import GlobalChat from "../src/HomeTabNavigator/GlobalChat";
import Backend from "../src/HomeTabNavigator/Backend";

// const Blob = RNFetchBlob.polyfill.Blob;
// const fs = RNFetchBlob.fs;
// window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
// window.Blob = Blob;

const HomeTabNavigator = TabNavigator(
    {
        Message: {
            screen: MessagePage
        },
        FriendList: {
            screen: FriendListPage
        },
        GlobalChat: {
            screen: GlobalChat
        }
    },
    {
        ...TabNavigator.Presets.AndroidTopTabs,
        tabBarPosition: "top",
        tabBarOptions: {
            activeTintColor: "#428ce0",
            inactiveTintColor: "black",
            // showIcon: true,
            showLabel: true,
            lazyLoad: true,
            upperCaseLabel: false,
            indicatorStyle: {
                backgroundColor: "#428ce0"
            },
            style: {
                backgroundColor: "white"
            }
        }
    }
);

class Home extends Component {
    // static navigationOptions = ({ navigation }) => {
    //     const { params = {} } = navigation.state;
    //     return {
    //         header: (
    //             <HomeHeader
    //                 value={params.search}
    //                 onChangeTextSearch={search => {
    //                     params.handleTextChangeSearch(search);
    //                 }}
    //                 btnSearch={params.handleBtnSearch}
    //             />
    //         )
    //     };
    // };

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        // // Bind param function
        // this.props.navigation.setParams({
        //     handleTextChangeSearch: this.onChangeTextSearch,
        //     handleBtnSearch: this.btnSearch
        // });

        this.state = {
            avatarSource: this.props.avatarIMG
                ? { uri: this.props.avatarIMG }
                : require("../src/images/avatar.jpg"),
            search: ""
        };
    }

    btnSearch = () => {
        console.log("Search " + this.state.search);
    };

    onChangeTextSearch = search => {
        console.log(search);
        this.setState({ search });
    };

    btnLogout = () => {
        console.log("Logout");
        firebase
            .auth()
            .signOut()
            .then(() => {
                console.log("Loginpage");
                this.props.navigationApp.replace("LoginPage");
            });
    };

    btnNewMess = () => {
        var options = {
            title: "Select Avatar",
            customButtons: [
                { name: "fb", title: "Choose Photo from Facebook" }
            ],
            storageOptions: {
                skipBackup: true,
                path: "images"
            }
        };
        ImagePicker.showImagePicker(options, response => {
            console.log("Response = ", response);

            if (response.didCancel) {
                console.log("User cancelled image picker");
            } else if (response.error) {
                console.log("ImagePicker Error: ", response.error);
            } else if (response.customButton) {
                console.log(
                    "User tapped custom button: ",
                    response.customButton
                );
            } else {
                let source = { uri: response.uri };

                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                    avatarSource: source
                });
            }
        });
    };

    btnNewMessExpo = () => {
        console.log("New Message");
        Permissions.askAsync(Permissions.CAMERA_ROLL)
            .then(succ => {
                ImagePicker.launchImageLibraryAsync({
                    allowsEditing: true,
                    aspect: [3, 4]
                    // base64: true
                })
                    .then(response => {
                        console.log("Response = ", response);
                        if (response.cancelled) return;
                        let source = { uri: response.uri };

                        this.uploadAvatar(response.uri);
                        this.setState({
                            avatarSource: source
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    });
            })
            .catch(err => {
                alert(err.error);
            });
    };

    uploadAvatar = async uri => {
        const response = await fetch(uri);
        const blob = await response.blob();
        let imageRef = await firebase
            .storage()
            .ref("avatars")
            .child(Backend.getUid() + ".jpg")
            .put(blob, {
                contentType: "image/jpeg"
            })
            .then(succ => {
                console.log("succ");
            })
            .catch(err => {
                console.log("err");
            });
    };

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
                <HomeHeader
                    bgColor="white"
                    value={this.state.search}
                    onChangeTextSearch={search => {
                        this.onChangeTextSearch(search);
                    }}
                    avatar={this.state.avatarSource}
                    btnSearch={this.btnSearch}
                    btnLogout={this.btnLogout}
                    btnNewMess={this.btnNewMessExpo}
                />
                <HomeTabNavigator
                    screenProps={{ navigationHome: this.props.navigationApp }}
                />
            </SafeAreaView>
        );
    }
}

export default Home;
