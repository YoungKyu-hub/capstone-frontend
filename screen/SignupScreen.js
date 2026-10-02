import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";

import {
    createUserWithEmailAndPassword,
} from "firebase/auth";

import {
    doc,
    setDoc,
} from "firebase/firestore";

import { auth, db } from "../firebase";

const SignupScreen = ({ navigation }) => {
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] =
        useState("");

    const handleSignup = async () => {
        try {
            // 입력값 검사
            if (
                !nickname ||
                !email ||
                !password ||
                !confirmPassword
            ) {
                Alert.alert(
                    "오류",
                    "모든 항목을 입력해주세요."
                );
                return;
            }

            if (password !== confirmPassword) {
                Alert.alert(
                    "오류",
                    "비밀번호가 일치하지 않습니다."
                );
                return;
            }

            // Firebase Auth 회원가입
            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            const uid = userCredential.user.uid;

            // Firestore 사용자 정보 저장
            await setDoc(doc(db, "users", uid), {
                nickname: nickname,
                email: email,

                // 포인트 시스템
                point: 1000,

                // 예측 통계
                successRate: 0,
                streak: 0,
                totalPrediction: 0,
                correctPrediction: 0,

                // 업적
                achievements: [],

                createdAt: new Date(),
            });

            Alert.alert(
                "회원가입 성공",
                "로그인 해주세요."
            );

            navigation.navigate("Login");
        } catch (error) {
            Alert.alert(
                "회원가입 실패",
                error.message
            );
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "padding"}
        >
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.title}>
                    회원가입
                </Text>

                <TextInput
                    placeholder="닉네임"
                    value={nickname}
                    onChangeText={setNickname}
                    style={styles.input}
                />

                <TextInput
                    placeholder="이메일(ID)"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                />

                <TextInput
                    placeholder="비밀번호"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    returnKeyType="next"
                    style={styles.input}
                />

                <TextInput
                    placeholder="비밀번호 확인"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    returnKeyType="done"
                    style={styles.input}
                />

                <TouchableOpacity
                    style={styles.signupButton}
                    onPress={handleSignup}
                >
                    <Text style={styles.buttonText}>
                        회원가입
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default SignupScreen;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#fff",
    },

    title: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 30,
    },

    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
    },
    signupButton: {
        backgroundColor: "#1E88E5",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },

    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});