import React, { Component } from "react";
import {
    StyleSheet,
    View,
    Text,
    Image,
    TextInput,
    Platform,
    StatusBar,
    TouchableOpacity
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import IconEntypo from "react-native-vector-icons/Entypo";

class HomeHeader extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View
                style={[
                    styles.androidHeader,
                    styles.headerStyle,
                    { backgroundColor: this.props.bgColor }
                ]}
            >
                {/* Avatar */}
                <TouchableOpacity onPress={this.props.btnLogout}>
                    <Image
                        source={this.props.avatar}
                        style={{
                            width: 34,
                            height: 34,
                            borderRadius: 17
                        }}
                    />
                </TouchableOpacity>
                {/* Search Bar */}
                <View style={styles.searchBarStyle}>
                    <Icon
                        color="#b0b0b0"
                        size={18}
                        name="search"
                        onPress={() => console.log("onPress")}
                    />
                    <TextInput
                        clearButtonMode="always"
                        onFocus={() => console.log("onFocus")}
                        placeholder="Search"
                        placeholderTextColor="#b0b0b0"
                        style={{
                            flex: 1,
                            marginHorizontal: 5,
                            color: "#b0b0b0"
                        }}
                        underlineColorAndroid="transparent"
                        onChangeText={text => {
                            this.props.onChangeTextSearch(text);
                        }}
                        onSubmitEditing={this.props.btnSearch}
                        returnKeyType="search"
                    />
                </View>
                {/* New Message */}
                <TouchableOpacity onPress={this.props.btnNewMess}>
                    <IconEntypo size={22} name="new-message" />
                </TouchableOpacity>
            </View>
        );
    }
}

export default HomeHeader;

const styles = StyleSheet.create({
    androidHeader: {
        ...Platform.select({
            android: {
                paddingTop: StatusBar.currentHeight
            }
        })
    },
    headerStyle: {
        marginTop: Platform.OS === "ios" ? 0 : 10,
        paddingHorizontal: 10,
        flexDirection: "row",
        alignItems: "center"
    },
    searchBarStyle: {
        flex: 1,
        flexDirection: "row",
        borderRadius: 30,
        alignItems: "center",
        marginHorizontal: 10,
        padding: 10,
        backgroundColor: "#dbdbdb"
    }
});
