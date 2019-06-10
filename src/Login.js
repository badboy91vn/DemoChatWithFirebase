import React, { Component } from "react";
import {
    StyleSheet,
    View,
    Text,
    Image,
    ImageBackground,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Keyboard,
    Platform,
    // KeyboardAvoidingView,
    TouchableWithoutFeedback
} from "react-native";
import * as firebase from "firebase";
import KeyboardSpacer from "react-native-keyboard-spacer";
import DismissKeyboard from "dismissKeyboard";
import Spinner from "react-native-loading-spinner-overlay";

import Home from "../src/Home";

class Login extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            loading: false
        };
    }

    componentDidMount() {}

    btnLogin = () => {
        Keyboard.dismiss();

        const { email, password } = this.state;

        if (email == "" || password == "") {
            alert("Email or Password is empty");
            return;
        }
        this.setState({ loading: true });
        console.log(email, password);

        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(succ => {
                this.setState({ loading: false });
                this.props.navigation.replace("HomePage");
            })
            .catch(err => {
                alert(err.message);
                this.setState({ password: "", loading: false });
            });
    };

    render() {
        return (
            <TouchableWithoutFeedback
                onPress={() => {
                    DismissKeyboard();
                }}
            >
                {/* <KeyboardAvoidingView style={styles.container} behavior="padding"> */}
                <View style={styles.container}>
                    <ImageBackground
                        source={require("./images/bg_login.jpg")}
                        style={styles.imgBG}
                    >
                        <View style={styles.content}>
                            <Text style={styles.txtTilte}>Login Page</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    onChangeText={email =>
                                        this.setState({ email })
                                    }
                                    value={this.state.email}
                                    underlineColorAndroid="transparent"
                                    style={styles.txtInput}
                                    placeholder="Email"
                                    returnKeyType="next"
                                    keyboardType="email-address"
                                    onSubmitEditing={() => {
                                        this.passwordInput.focus();
                                    }}
                                />
                                <TextInput
                                    onChangeText={password =>
                                        this.setState({ password })
                                    }
                                    value={this.state.password}
                                    secureTextEntry={true}
                                    underlineColorAndroid="transparent"
                                    style={styles.txtInput}
                                    placeholder="Password"
                                    ref={input => {
                                        this.passwordInput = input;
                                    }}
                                    onSubmitEditing={() => {
                                        this.btnLogin();
                                    }}
                                />
                            </View>

                            <TouchableOpacity
                                onPress={this.btnLogin}
                                style={styles.btnContainerLogin}
                            >
                                <Text style={styles.btnLogin}>Login</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() =>
                                    this.props.navigation.navigate(
                                        "RegisterPage"
                                    )
                                }
                                style={styles.btnContainerRegister}
                            >
                                <Text style={styles.btnLogin}>Register</Text>
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>

                    <KeyboardSpacer />
                    <Spinner visible={this.state.loading} />
                </View>
                {/* </KeyboardAvoidingView> */}
            </TouchableWithoutFeedback>
        );
    }
}

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    imgBG: {
        flex: 1,
        alignSelf: "stretch",
        width: null,
        justifyContent: "center"
    },
    content: {
        alignItems: "center"
    },
    txtTilte: {
        color: "white",
        fontSize: 40,
        fontWeight: "bold",
        textShadowColor: "#252525",
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 15,
        marginBottom: 10
    },
    inputContainer: {
        margin: 20,
        marginBottom: 0,
        padding: 20,
        paddingBottom: 10,
        alignSelf: "stretch",
        borderWidth: 1,
        borderColor: "#fff",
        backgroundColor: "rgba(255,255,255,0.2)"
    },
    txtInput: {
        fontSize: 16,
        height: 40,
        padding: 10,
        marginBottom: 10,
        backgroundColor: "rgba(255,255,255,1)"
    },
    btnContainerLogin: {
        alignSelf: "stretch",
        margin: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: "#fff",
        backgroundColor: "blue",
        backgroundColor: "rgba(255,255,255,0.6)"
    },
    btnContainerRegister: {
        alignSelf: "stretch",
        marginHorizontal: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: "#fff",
        backgroundColor: "blue",
        backgroundColor: "rgba(255,255,255,0.6)"
    },
    btnLogin: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center"
    }
});
