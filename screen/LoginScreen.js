import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
  ActivityIndicator,
  Alert,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

// ===== 디자인 색상 (다른 화면과 동일) =====
const COLORS = {
  bg: "#181829",
  card: "#222232",
  input: "#1A1A2B",
  text: "#FFFFFF",
  subText: "#8A8A9A",
  placeholder: "#6E6E80",
  accent: "#E8826B",
  dotAccent: "#E8826B",
};

const REMEMBER_KEY = "pickbo:rememberEmail";
const SCREEN_HEIGHT = Dimensions.get("window").height;

// Firebase 에러 코드를 한국어 메시지로 변환
const getErrorMessage = (code) => {
  switch (code) {
    case "auth/invalid-email":
      return "이메일 형식이 올바르지 않습니다.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "이메일 또는 비밀번호가 맞지 않습니다.";
    case "auth/too-many-requests":
      return "시도 횟수가 너무 많습니다. 잠시 후 다시 시도해 주세요.";
    case "auth/network-request-failed":
      return "네트워크 연결을 확인해 주세요.";
    default:
      return "로그인에 실패했습니다. 다시 시도해 주세요.";
  }
};

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  // 바텀시트 애니메이션 (0: 닫힘, 1: 열림)
  const anim = useRef(new Animated.Value(0)).current;

  // 저장된 이메일 불러오기 (아이디 기억하기)
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(REMEMBER_KEY);
        if (saved) {
          setEmail(saved);
          setRemember(true);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  const openSheet = () => {
    setSheetOpen(true);
    Animated.timing(anim, {
      toValue: 1,
      duration: 280,
      useNativeDriver: true,
    }).start();
  };

  const closeSheet = () => {
    Animated.timing(anim, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start(() => setSheetOpen(false));
  };

  // 안드로이드 뒤로가기 버튼으로 바텀시트 닫기
  useEffect(() => {
    if (!sheetOpen) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      closeSheet();
      return true;
    });
    return () => sub.remove();
  }, [sheetOpen]);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("로그인", "이메일과 비밀번호를 입력해 주세요.");
      return;
    }

    setLoading(true);
    try {
      // 1️⃣ 로그인
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const uid = userCredential.user.uid;

      // 2️⃣ Firestore 유저 확인
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      // 3️⃣ 없으면 자동 생성
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          nickname: "new user",
          point: 1000,
          successRate: 0,
          streak: 0,
          achievements: [],
          createdAt: new Date(),
        });
      }

      // 4️⃣ 아이디 기억하기
      if (remember) await AsyncStorage.setItem(REMEMBER_KEY, email.trim());
      else await AsyncStorage.removeItem(REMEMBER_KEY);

      // 5️⃣ 화면 이동
      navigation.replace("Home");
    } catch (error) {
      Alert.alert("로그인 실패", getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert("비밀번호 찾기", "이메일을 먼저 입력해 주세요.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert("비밀번호 찾기", "비밀번호 재설정 메일을 보냈습니다.");
    } catch (error) {
      Alert.alert("비밀번호 찾기", getErrorMessage(error.code));
    }
  };

  const goSignup = () => {
    if (sheetOpen) closeSheet();
    navigation.navigate("Signup");
  };

  const overlayOpacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.75],
  });
  const sheetTranslate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_HEIGHT, 0],
  });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* ===== 시작 화면 ===== */}
      <SafeAreaView style={styles.splash} edges={["top", "bottom"]}>
        {/* 메인 이미지 카드 + 장식 원 */}
        <View style={styles.heroWrap}>
          <View style={[styles.deco, styles.decoTopLeft]} />
          <View style={[styles.deco, styles.decoRight]} />
          <View style={[styles.deco, styles.decoBottomLeft]} />
          {/* 뒤쪽 둥근 카드 */}
          <View style={styles.heroCard} />
          {/* 선수 이미지 (카드 위로 튀어나오게) */}
          <Image
            source={require("../assets/login_hero.png")}
            style={styles.heroImage}
            resizeMode="contain"
          />
        </View>

        {/* 문구 */}
        <View style={styles.textBlock}>
          <Text style={styles.title}>KBO의 모든 것을{"\n"}한눈에</Text>
          <Text style={styles.subtitle}>
            경기 예측부터 팀 순위, 시즌 기록까지.{"\n"}
            지금 PICK-BO와 함께 시작해 보세요!
          </Text>
        </View>

        {/* 버튼 */}
        <View style={styles.splashButtons}>
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.85}
            onPress={openSheet}
          >
            <Text style={styles.primaryText}>로그인</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.textButton} onPress={goSignup}>
            <Text style={styles.textButtonLabel}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* ===== 로그인 바텀시트 ===== */}
      {sheetOpen && (
        <>
          <TouchableWithoutFeedback onPress={closeSheet}>
            <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
          </TouchableWithoutFeedback>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.sheetContainer}
            pointerEvents="box-none"
          >
            <Animated.View
              style={[styles.sheet, { transform: [{ translateY: sheetTranslate }] }]}
            >
              <View style={styles.handle} />
              <Text style={styles.sheetTitle}>환영합니다</Text>

              {/* 이메일 */}
              <View style={styles.inputBox}>
                <Ionicons name="mail-outline" size={20} color={COLORS.placeholder} />
                <TextInput
                  placeholder="이메일"
                  placeholderTextColor={COLORS.placeholder}
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                />
              </View>

              {/* 비밀번호 */}
              <View style={styles.inputBox}>
                <Ionicons name="key-outline" size={20} color={COLORS.placeholder} />
                <TextInput
                  placeholder="비밀번호"
                  placeholderTextColor={COLORS.placeholder}
                  value={password}
                  onChangeText={setPassword}
                  style={styles.input}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color={COLORS.placeholder}
                  />
                </TouchableOpacity>
              </View>

              {/* 아이디 기억하기 / 비밀번호 찾기 */}
              <View style={styles.optionRow}>
                <TouchableOpacity
                  style={styles.rememberRow}
                  onPress={() => setRemember(!remember)}
                >
                  <Ionicons
                    name={remember ? "checkbox" : "square-outline"}
                    size={20}
                    color={remember ? COLORS.accent : COLORS.placeholder}
                  />
                  <Text style={styles.rememberText}>아이디 기억하기</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleForgotPassword}>
                  <Text style={styles.forgotText}>비밀번호 찾기</Text>
                </TouchableOpacity>
              </View>

              {/* 로그인 버튼 */}
              <TouchableOpacity
                style={[styles.primaryButton, styles.sheetButton]}
                activeOpacity={0.85}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.text} />
                ) : (
                  <Text style={styles.primaryText}>로그인</Text>
                )}
              </TouchableOpacity>

              {/* 회원가입 안내 */}
              <View style={styles.signupRow}>
                <Text style={styles.signupText}>계정이 없으신가요? </Text>
                <TouchableOpacity onPress={goSignup}>
                  <Text style={styles.signupLink}>회원가입</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </KeyboardAvoidingView>
        </>
      )}
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },

  // ===== 시작 화면 =====
  splash: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: "space-between",
  },

  heroWrap: {
    alignSelf: "center",
    width: "88%",
    aspectRatio: 1,
    marginTop: 40,
  },
  heroCard: {
    position: "absolute",
    top: "14%",
    left: "6%",
    right: "6%",
    bottom: "4%",
    borderRadius: 40,
    backgroundColor: COLORS.card,
  },
  heroImage: {
    position: "absolute",
    top: 0,
    left: "-4%",
    width: "108%",
    height: "100%",
    zIndex: 1,
  },

  // 장식 원
  deco: { position: "absolute", borderRadius: 999, zIndex: 2 },
  decoTopLeft: {
    width: 14,
    height: 14,
    backgroundColor: COLORS.text,
    top: "4%",
    left: "4%",
  },
  decoRight: {
    width: 22,
    height: 22,
    backgroundColor: COLORS.dotAccent,
    top: "52%",
    right: "1%",
  },
  decoBottomLeft: {
    width: 14,
    height: 14,
    backgroundColor: COLORS.text,
    bottom: "10%",
    left: "2%",
  },

  textBlock: { marginTop: 24 },
  title: {
    color: COLORS.text,
    fontSize: 34,
    fontWeight: "700",
    lineHeight: 44,
  },
  subtitle: {
    color: COLORS.subText,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 14,
  },

  splashButtons: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 32,
  },
  primaryButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: { color: COLORS.text, fontSize: 16, fontWeight: "700" },
  textButton: { paddingHorizontal: 28, height: 56, justifyContent: "center" },
  textButtonLabel: { color: COLORS.text, fontSize: 16 },

  // ===== 바텀시트 =====
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },
  sheetContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 36,
  },
  handle: {
    alignSelf: "center",
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#4A4A5C",
    marginBottom: 24,
  },
  sheetTitle: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 24,
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    borderRadius: 14,
    backgroundColor: COLORS.input,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 15,
    marginLeft: 12,
    paddingVertical: 0,
  },

  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
    marginTop: 4,
    marginBottom: 28,
  },
  rememberRow: { flexDirection: "row", alignItems: "center" },
  rememberText: { color: COLORS.subText, fontSize: 14, marginLeft: 8 },
  forgotText: { color: COLORS.text, fontSize: 13 },

  sheetButton: { flex: 0 },

  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signupText: { color: COLORS.subText, fontSize: 14 },
  signupLink: { color: COLORS.accent, fontSize: 14, fontWeight: "700" },
});
