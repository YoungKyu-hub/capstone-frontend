import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

// ===== 디자인 색상 (로그인 화면과 동일) =====
const COLORS = {
    bg: "#181829",
    card: "#222232",
    input: "#1A1A2B",
    text: "#FFFFFF",
    subText: "#8A8A9A",
    placeholder: "#6E6E80",
    accent: "#E8826B",
    ok: "#5BD69A",
    error: "#FF7A7A",
};

const MIN_PASSWORD = 6; // Firebase 최소 비밀번호 길이

// Firebase 에러 코드를 한국어 메시지로 변환
const getErrorMessage = (code) => {
    switch (code) {
        case "auth/email-already-in-use":
            return "이미 가입된 이메일입니다.";
        case "auth/invalid-email":
            return "이메일 형식이 올바르지 않습니다.";
        case "auth/weak-password":
            return `비밀번호는 ${MIN_PASSWORD}자 이상이어야 합니다.`;
        case "auth/network-request-failed":
            return "네트워크 연결을 확인해 주세요.";
        default:
            return "회원가입에 실패했습니다. 다시 시도해 주세요.";
    }
};

// 아이콘이 붙은 입력 칸
function InputField({ icon, secure, rightIcon, onPressRight, ...props }) {
    return (
        <View style={styles.inputBox}>
            <Ionicons name={icon} size={20} color={COLORS.placeholder} />
            <TextInput
                placeholderTextColor={COLORS.placeholder}
                style={styles.input}
                secureTextEntry={secure}
                autoCapitalize="none"
                autoCorrect={false}
                {...props}
            />
            {rightIcon && (
                <TouchableOpacity
                    onPress={onPressRight}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name={rightIcon} size={20} color={COLORS.placeholder} />
                </TouchableOpacity>
            )}
        </View>
    );
}

const SignupScreen = ({ navigation }) => {
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const passwordLongEnough = password.length >= MIN_PASSWORD;
    const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

    const handleSignup = async () => {
        // 입력값 검사
        if (!nickname.trim() || !email.trim() || !password || !confirmPassword) {
            Alert.alert("회원가입", "모든 항목을 입력해 주세요.");
            return;
        }
        if (!passwordLongEnough) {
            Alert.alert("회원가입", `비밀번호는 ${MIN_PASSWORD}자 이상이어야 합니다.`);
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert("회원가입", "비밀번호가 일치하지 않습니다.");
            return;
        }

        setLoading(true);
        try {
            // Firebase Auth 회원가입
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email.trim(),
                password
            );
            const uid = userCredential.user.uid;

            // Firestore 사용자 정보 저장
            await setDoc(doc(db, "users", uid), {
                nickname: nickname.trim(),
                email: email.trim(),

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

            Alert.alert("회원가입 완료", "가입이 완료되었습니다. 로그인해 주세요.", [
                { text: "확인", onPress: () => navigation.navigate("Login") },
            ]);
        } catch (error) {
            Alert.alert("회원가입 실패", getErrorMessage(error.code));
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
            <StatusBar barStyle="light-content" />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* 뒤로가기 */}
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        style={styles.backButton}
                    >
                        <Ionicons name="chevron-back" size={28} color={COLORS.text} />
                    </TouchableOpacity>

                    {/* 제목 */}
                    <Text style={styles.title}>회원가입</Text>
                    <Text style={styles.subtitle}>
                        PICK-BO 계정을 만들고{"\n"}승부예측에 참여해 보세요!
                    </Text>

                    {/* 입력 카드 */}
                    <View style={styles.card}>
                        <InputField
                            icon="person-outline"
                            placeholder="닉네임"
                            value={nickname}
                            onChangeText={setNickname}
                            returnKeyType="next"
                        />
                        <InputField
                            icon="mail-outline"
                            placeholder="이메일"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            returnKeyType="next"
                        />
                        <InputField
                            icon="key-outline"
                            placeholder={`비밀번호 (${MIN_PASSWORD}자 이상)`}
                            value={password}
                            onChangeText={setPassword}
                            secure={!showPassword}
                            rightIcon={showPassword ? "eye-outline" : "eye-off-outline"}
                            onPressRight={() => setShowPassword(!showPassword)}
                            returnKeyType="next"
                        />
                        <InputField
                            icon="shield-checkmark-outline"
                            placeholder="비밀번호 확인"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secure={!showPassword}
                            returnKeyType="done"
                            onSubmitEditing={handleSignup}
                        />

                        {/* 비밀번호 조건 안내 */}
                        <View style={styles.hints}>
                            <View style={styles.hintRow}>
                                <Ionicons
                                    name={passwordLongEnough ? "checkmark-circle" : "ellipse-outline"}
                                    size={16}
                                    color={passwordLongEnough ? COLORS.ok : COLORS.placeholder}
                                />
                                <Text
                                    style={[
                                        styles.hintText,
                                        passwordLongEnough && { color: COLORS.ok },
                                    ]}
                                >
                                    비밀번호 {MIN_PASSWORD}자 이상
                                </Text>
                            </View>
                            <View style={styles.hintRow}>
                                <Ionicons
                                    name={
                                        passwordsMatch
                                            ? "checkmark-circle"
                                            : confirmPassword
                                            ? "close-circle"
                                            : "ellipse-outline"
                                    }
                                    size={16}
                                    color={
                                        passwordsMatch
                                            ? COLORS.ok
                                            : confirmPassword
                                            ? COLORS.error
                                            : COLORS.placeholder
                                    }
                                />
                                <Text
                                    style={[
                                        styles.hintText,
                                        passwordsMatch && { color: COLORS.ok },
                                        !passwordsMatch && confirmPassword && { color: COLORS.error },
                                    ]}
                                >
                                    {!passwordsMatch && confirmPassword
                                        ? "비밀번호가 일치하지 않아요"
                                        : "비밀번호 일치"}
                                </Text>
                            </View>
                        </View>

                        {/* 가입 버튼 */}
                        <TouchableOpacity
                            style={[styles.primaryButton, loading && { opacity: 0.7 }]}
                            activeOpacity={0.85}
                            onPress={handleSignup}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color={COLORS.text} />
                            ) : (
                                <Text style={styles.primaryText}>가입하기</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* 로그인 안내 */}
                    <View style={styles.loginRow}>
                        <Text style={styles.loginText}>이미 계정이 있으신가요? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                            <Text style={styles.loginLink}>로그인</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default SignupScreen;

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.bg },
    content: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 32 },

    backButton: { marginTop: 12, marginLeft: -6, width: 40 },

    title: {
        color: COLORS.text,
        fontSize: 32,
        fontWeight: "700",
        marginTop: 24,
    },
    subtitle: {
        color: COLORS.subText,
        fontSize: 14,
        lineHeight: 21,
        marginTop: 10,
    },

    card: {
        backgroundColor: COLORS.card,
        borderRadius: 28,
        padding: 20,
        paddingTop: 24,
        marginTop: 32,
    },

    inputBox: {
        flexDirection: "row",
        alignItems: "center",
        height: 56,
        borderRadius: 14,
        backgroundColor: COLORS.input,
        paddingHorizontal: 16,
        marginBottom: 14,
    },
    input: {
        flex: 1,
        color: COLORS.text,
        fontSize: 15,
        marginLeft: 12,
        paddingVertical: 0,
    },

    hints: { marginTop: 2, marginBottom: 22, paddingHorizontal: 4 },
    hintRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
    hintText: { color: COLORS.placeholder, fontSize: 13, marginLeft: 6 },

    primaryButton: {
        height: 56,
        borderRadius: 16,
        backgroundColor: COLORS.accent,
        alignItems: "center",
        justifyContent: "center",
    },
    primaryText: { color: COLORS.text, fontSize: 16, fontWeight: "700" },

    loginRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 24,
    },
    loginText: { color: COLORS.subText, fontSize: 14 },
    loginLink: { color: COLORS.accent, fontSize: 14, fontWeight: "700" },
});
