import React from "react";
import { View, Text } from "react-native";
import { StackNavigator } from "react-navigation";
import * as firebase from "firebase";

import Login from "./src/Login";
import Register from "./src/Register";
import Home from "./src/Home";
import Chat from "./src/Chat";
import Backend from "./src/HomeTabNavigator/Backend";

console.ignoredYellowBox = ["Warning: ", "Setting a timer"];

class Main extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor() {
        super();

        this.state = {
            loading: true,
            authenticated: false,
            avatarIMG: ""
        };

        var firebaseConfig = {
            apiKey: "AIzaSyDodc-hH05LJu_L_0VEPGnWDujHK42GB-g",
            authDomain: "beerinfo-37e7b.firebaseapp.com",
            databaseURL: "https://beerinfo-37e7b.firebaseio.com",
            projectId: "beerinfo-37e7b",
            storageBucket: "gs://beerinfo-37e7b.appspot.com",
            messagingSenderId: "305533605616"
        };
        firebase.initializeApp(firebaseConfig);
    }

    downloadAvatar = async (uid, callback) => {
        let avatarIMG = await firebase
            .storage()
            .ref("avatars/" + uid + ".jpg")
            .getDownloadURL()
            .then(function(url) {
                // `url` is the download URL for 'images/stars.jpg'

                console.log("avatarURL: " + url);

                // // This can be downloaded directly:
                // var xhr = new XMLHttpRequest();
                // xhr.responseType = "blob";
                // xhr.onload = function(event) {
                //     var blob = xhr.response;
                // };
                // xhr.open("GET", url);
                // xhr.send();

                callback(url);
            })
            .catch(function(error) {
                console.log(error);
                switch (error.code) {
                    case "storage/object_not_found":
                        // File doesn't exist
                        break;
                    case "storage/unauthorized":
                        // User doesn't have permission to access the object
                        break;
                    case "storage/canceled":
                        // User canceled the upload
                        break;
                    case "storage/unknown":
                        // Unknown error occurred, inspect the server response
                        break;
                }
            });
    };

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.downloadAvatar(user.uid, succ => {
                    // console.log("HomePage");
                    this.setState({
                        loading: false,
                        authenticated: true,
                        avatarIMG: succ
                    });
                    // this.props.navigation.navigate("HomePage");
                    Backend.setUid(user.uid);
                });
            } else {
                // console.log("LoginPage");
                this.setState({ loading: false, authenticated: false });
                // this.props.navigation.navigate("LoginPage");
            }
        });
    }

    render() {
        // return (
        //     <View
        //         style={{
        //             flex: 1,
        //             alignItems: "center",
        //             justifyContent: "center",
        //             backgroundColor: "gray"
        //         }}
        //     >
        //         <Text style={{ color: "white", fontSize:40 }}>Splash screen</Text>
        //     </View>
        // );
        if (this.state.loading) return null;
        if (!this.state.authenticated) {
            return <Login navigationApp={this.props.navigation} />;
        }
        return (
            <Home
                navigationApp={this.props.navigation}
                avatarIMG={this.state.avatarIMG}
            />
        );
    }
}

const AppStackNavigator = StackNavigator({
    MainPage: {
        screen: Main,
        navigationOptions: {
            title: "Main"
        }
    },
    LoginPage: {
        screen: Login,
        navigationOptions: {
            title: "Login"
        }
    },
    RegisterPage: {
        screen: Register,
        navigationOptions: {
            title: "Register"
        }
    },
    HomePage: {
        screen: Home,
        navigationOptions: {
            title: "Home"
        }
    },
    ChatPage: {
        screen: Chat
    }
});
export default class App extends React.Component {
    render() {
        return <AppStackNavigator />;
    }
}
