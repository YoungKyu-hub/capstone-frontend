import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

// 상단 바 가운데 "KBO 엠블럼 + KBO" 타이틀 (모든 화면 공통)
export default function KboTitle() {
    return (
        <View style={styles.row}>
            <Image
                source={require("../assets/kbo_emblem.png")}
                style={styles.emblem}
                resizeMode="contain"
            />
            <Text style={styles.text}>KBO</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: "row", alignItems: "center" },
    emblem: { width: 22, height: 22, marginRight: 6 },
    text: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});
