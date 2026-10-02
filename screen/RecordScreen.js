import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function RecordScreen({ navigation }) {
    return (
        <View style={styles.container}>

            <Text style={styles.header}>📊 기록실</Text>

            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate("Ranking")}
            >
                <Text style={styles.title}>🏆 팀 순위</Text>
                <Text style={styles.desc}>시즌별 팀 순위 확인</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate("HeadToHead")}
            >
                <Text style={styles.title}>⚔️ 상대전적 비교</Text>
                <Text style={styles.desc}>두 팀 전력 비교 분석</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate("SeasonRecord")}
            >
                <Text style={styles.title}>📈 시즌 기록</Text>
                <Text style={styles.desc}>타자 / 투수 / 팀 기록</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#111",
        padding: 20,
        paddingTop: 70,
    },
    header: {
        color: "white",
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
    },
    card: {
        backgroundColor: "#1E1E1E",
        padding: 18,
        borderRadius: 15,
        marginBottom: 15,
    },
    title: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    desc: {
        color: "#aaa",
        marginTop: 5,
    },
});