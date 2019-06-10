import firebase from "firebase";

class Backend {
    uid = "";
    messagesRef = null;

    constructor() {}

    setUid(value) {
        this.uid = value;
    }

    getUid() {
        return this.uid;
    }

    // retrieve the messages from the Backend
    loadMessages(callback) {
        // C1:
        this.messagesRef = firebase.database().ref("messages");
        this.messagesRef.off();
        const onReceive = data => {
            const message = data.val();
            console.log(message);
            callback({
                _id: data.key,
                text: message.text,
                createdAt: new Date(message.createdAt),
                user: {
                    _id: message.user._id
                    // name: message.user.name
                }
            });
        };
        this.messagesRef.limitToLast(20).on("child_added", onReceive);

        // C2:
        // this.messagesRef = firebase.database().ref("messages");
        // this.messagesRef.off();
        // const onReceive = data => {
        //     const message = data.val();

        //     let messList = [];
        //     data.forEach(mess => {
        //         let messObj = mess.val();
        //         messList.push({
        //             _id: mess.key,
        //             text: messObj.text,
        //             createdAt: new Date(messObj.createdAt),
        //             user: {
        //                 _id: messObj.user._id
        //             }
        //         });
        //     });

        //     callback(messList.reverse());
        // };
        // this.messagesRef.limitToLast(20).on("value", onReceive);
    }
    // send the message to the Backend
    sendMessage(message) {
        for (let i = 0; i < message.length; i++) {
            this.messagesRef.push({
                text: message[i].text,
                user: message[i].user,
                createdAt: firebase.database.ServerValue.TIMESTAMP
            });
        }
    }
    // close the connection to the Backend
    closeChat() {
        if (this.messagesRef) {
            this.messagesRef.off();
        }
    }
}

export default new Backend();
