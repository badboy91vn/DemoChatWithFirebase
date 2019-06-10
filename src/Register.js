import React, { Component } from "react";
import {
    StyleSheet,
    View,
    Text,
    ImageBackground,
    Dimensions,
    TouchableWithoutFeedback,
    AsyncStorage
} from "react-native";
import {
    Container,
    Header,
    Content,
    Form,
    Item,
    Label,
    Input,
    Body,
    Button
} from "native-base";
import * as firebase from "firebase";
import KeyboardSpacer from "react-native-keyboard-spacer";
import DismissKeyboard from "dismissKeyboard";
import Spinner from "react-native-loading-spinner-overlay";

const { height, width } = Dimensions.get("window");

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            email: "",
            password: "",
            loading: false
        };
    }

    static navigationOptions = {
        header: null
    };

    btnRegister = async () => {
        let { name, email, password } = this.state;

        if (name == "" || email == "" || password == "") {
            alert("Email or name or Password is empty.");
            return;
        }

        this.setState({ loading: true });
        await firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(succ => {
                console.log(succ);
                alert("Register success!!!");
                this.setState({ loading: false });

                let userId = firebase.auth().currentUser.uid;
                console.log("uid: " + userId);
                firebase
                    .database()
                    .ref("users/" + userId + "/")
                    .set({
                        info: { name: name, email: email, password: password }
                    });

                this.props.navigation.navigate("LoginPage");
            })
            .catch(err => {
                alert(err.message);
                this.setState({ loading: false });
            });

        await AsyncStorage.setItem("name", name);
        await AsyncStorage.setItem("email", email);
        await AsyncStorage.setItem("password", password);
    };

    render() {
        return (
            <Container>
                <Content>
                    <TouchableWithoutFeedback
                        onPress={() => {
                            DismissKeyboard();
                        }}
                    >
                        <ImageBackground
                            source={require("./images/bg_login.jpg")}
                            style={[
                                styles.backgroundImage,
                                { height: height, width: width }
                            ]}
                        >
                            <View style={{ alignItems: "center" }}>
                                <Text style={styles.txtTilte}>
                                    Register Page
                                </Text>
                            </View>
                            <View style={styles.inputContainer}>
                                {/* Name */}
                                <Item floatingLabel style={styles.inputText}>
                                    <Label
                                        style={{ fontSize: 15, color: "white" }}
                                    >
                                        Name
                                    </Label>
                                    <Input
                                        value={this.state.name}
                                        onChangeText={name => {
                                            this.setState({
                                                name: name.trim()
                                            });
                                        }}
                                        returnKeyType="next"
                                        onSubmitEditing={() =>
                                            this.emailInput._root.focus()
                                        }
                                    />
                                </Item>

                                {/* Email */}
                                <Item
                                    floatingLabel
                                    style={[
                                        styles.inputText,
                                        { marginTop: 15 }
                                    ]}
                                >
                                    <Label
                                        style={{ fontSize: 15, color: "white" }}
                                    >
                                        Email
                                    </Label>
                                    <Input
                                        value={this.state.email}
                                        onChangeText={email => {
                                            this.setState({
                                                email: email.trim()
                                            });
                                        }}
                                        returnKeyType="next"
                                        getRef={input =>
                                            (this.emailInput = input)
                                        }
                                        onSubmitEditing={() =>
                                            this.passwordInput._root.focus()
                                        }
                                    />
                                </Item>

                                {/* Password */}
                                <Item
                                    floatingLabel
                                    style={[
                                        styles.inputText,
                                        { marginTop: 15 }
                                    ]}
                                >
                                    <Label
                                        style={{ fontSize: 15, color: "white" }}
                                    >
                                        Password
                                    </Label>
                                    <Input
                                        value={this.state.password}
                                        secureTextEntry={true}
                                        onChangeText={password => {
                                            this.setState({ password });
                                        }}
                                        returnKeyType="go"
                                        getRef={input =>
                                            (this.passwordInput = input)
                                        }
                                        onSubmitEditing={this.btnRegister.bind(
                                            this
                                        )}
                                    />
                                </Item>
                            </View>

                            <Button
                                full
                                style={styles.btnRegister}
                                onPress={this.btnRegister.bind(this)}
                            >
                                <Text>Register</Text>
                            </Button>
                            <Button
                                full
                                style={styles.btnBack}
                                onPress={() => {
                                    this.props.navigation.goBack();
                                }}
                            >
                                <Text>Back</Text>
                            </Button>

                            <KeyboardSpacer />
                        </ImageBackground>
                    </TouchableWithoutFeedback>
                </Content>
                <Spinner visible={this.state.loading} />
            </Container>
        );
    }
}

export default Register;

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: null,
        justifyContent: "center"
        // backgroundColor: "transparent"
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
        justifyContent: "center",
        margin: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: "#fff",
        backgroundColor: "rgba(255,255,255,0.2)"
    },
    inputText: {
        marginLeft: 20,
        marginRight: 20
    },
    btnRegister: {
        backgroundColor: "blue",
        margin: 20,
        borderWidth: 1,
        borderColor: "#fff",
        backgroundColor: "rgba(255,255,255,0.6)"
    },
    btnBack: {
        marginHorizontal: 20,
        backgroundColor: "blue",
        borderWidth: 1,
        borderColor: "#fff",
        backgroundColor: "rgba(255,255,255,0.6)"
    }
});
