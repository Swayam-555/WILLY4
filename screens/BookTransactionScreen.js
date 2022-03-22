import * as React from 'react';
import { Text, TextInput, View, StyleSheet, TouchableOpacity, ImageBackground, Image, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import db from '../config';

export default class TransactionScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            domState: "normal",
            hasCameraPermission: null,
            scanned: false,
            scannedData: "",
            bookId: "",
            studentId: ""
        }
    }
    handleCameraPermission = async domstate => {
        const { status } = await Camera.getCameraPermissionsAsync();
        this.setState({
            hasCameraPermission: status === "granted",
            scanned: false,
            domState: domstate
        })
    }
    handleBarCode = async ({ type, data }) => {
        const { domState } = this.state;
        if (domState === "bookId") {
            this.setState({
                bookId: data,
                scanned: true,
                domState: "normal"
            })
        }
        else if (domState === "studentId") {
            this.setState({
                studentId: data,
                scanned: true,
                domState: "normal"
            })
        }

    }

    handleTransaction = () => {
        db.collection("Books")
            .doc(this.state.bookId)
            .get()
            .then(doc => {
                console.log(doc.data())
                var book = doc.data();
                if (book.BookAvailability) {
                    this.initiateBookIssue();
                }
                else {
                    this.initiateBookReturn();
                }
            })
    }
    initiateBookIssue = () => {
        Alert.alert("Book issued to the student")
    }
    initiateBookReturn = () => {
        Alert.alert("Book returned to the library")
    }
    render() {
        const { domState, hasCameraPermission, scanned, scannedData } = this.state;
        if (domState != "normal") {
            return (
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : this.handleBarCode} />
            )
        }
        return (

            <ImageBackground
                source={require("../assets/background2.png")}
                style={{ resizeMode: "cover", flex: 1, justifyContent: "center" }}>
                <View style={{
                    flex: 0.5, justifyContent: "center", alignItems: "center"
                }}>
                    <Image source={require("../assets/appIcon.png")} />
                    <Image source={require("../assets/appName.png")} />
                </View>
                <View style={{ flex: 0.5, justifyContent: "center", alignItems: "center" }}>
                    <View style={{ flexDirection: "row" }}>
                        <TextInput
                            style={{ width: 150, height: 20, borderWidth: 2 }}
                            placeholder="Book Id"
                            placeholderTextColor="white"
                            value={this.state.bookId} />
                        <TouchableOpacity style={{ backgroundColor: "red" }}
                            onPress={() => this.handleCameraPermission("bookId")}>
                            <Text>Scan</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                        <TextInput
                            style={{ width: 150, height: 20, borderWidth: 2 }}
                            placeholder="Student Id"
                            placeholderTextColor="white"
                            value={this.state.studentId} />
                        <TouchableOpacity style={{ backgroundColor: "red" }}
                            onPress={() => this.handleCameraPermission("studentId")}>
                            <Text>Scan</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{ backgroundColor: "red" }}
                        onPress={() => this.handleTransaction()}>
                        <Text style={{ fontFamily: "Rajdhani_700Bold" }}>Submit</Text>
                    </TouchableOpacity>
                </View>


            </ImageBackground>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
})
