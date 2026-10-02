import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

const teams = ["LG", "두산", "SSG", "롯데", "삼성", "KIA", "NC", "한화", "키움", "KT"];

const getResult = (score1, score2) => {
    if (score1 > score2) return "team1";
    if (score1 < score2) return "team2";
    return "draw";
};

const getColor = (result, target) => {
    if (result === "draw") return "white";

    if (result === "team1") {
        return target === "team1" ? "red" : "blue";
    }

    if (result === "team2") {
        return target === "team2" ? "red" : "blue";
    }

    return "white";
};

export default function HeadToHeadScreen() {

    const [team1, setTeam1] = useState("LG");
    const [team2, setTeam2] = useState("두산");
    const [show, setShow] = useState(false);

    const data = [
        { label: "상대전적", left: "12승", right: "8승" },
        { label: "최근 10경기", left: "6승4패", right: "4승6패" },
        { label: "승률", left: "0.610", right: "0.390" },
        { label: "타율", left: "0.289", right: "0.271" },
        { label: "ERA", left: "3.45", right: "4.10" },
    ];

    const team1Score = 5;
    const team2Score = 3;

    const result = getResult(team1Score, team2Score);

    const recentColor =
        result === "draw"
            ? "white"
            : result === "team1"
                ? "red"
                : "blue";

    return (
        <ScrollView style={styles.container}>

            <Text style={styles.title}>⚔️ 상대전적 비교</Text>

            <Text style={styles.sub}>팀 1</Text>
            <ScrollView horizontal>
                {teams.map(t => (
                    <TouchableOpacity
                        key={t}
                        onPress={() => setTeam1(t)}
                        style={[styles.btn, team1 === t && styles.active]}
                    >
                        <Text>{t}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <Text style={styles.vs}>VS</Text>

            <Text style={styles.sub}>팀 2</Text>
            <ScrollView horizontal>
                {teams.map(t => (
                    <TouchableOpacity
                        key={t}
                        onPress={() => setTeam2(t)}
                        style={[styles.btn, team2 === t && styles.active]}
                    >
                        <Text>{t}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <TouchableOpacity
                style={styles.compareBtn}
                onPress={() => setShow(true)}
            >
                <Text style={{ fontWeight: "bold" }}>비교하기</Text>
            </TouchableOpacity>

            {show && (
                <View>

                    <View style={styles.headerRow}>
                        <Text style={styles.team}>{team1}</Text>
                        <Text style={styles.mid}>VS</Text>
                        <Text style={styles.team}>{team2}</Text>
                    </View>

                    <View style={styles.recentBox}>
                        <Text style={styles.recentTitle}>📌 최근 맞대결</Text>

                        <Text style={[styles.recentText, { color: recentColor }]}>
                            - 2026.05.12 {team1} 5 - 3 {team2} ({team1} 승)
                        </Text>
                    </View>

                    {data.map((d, i) => (
                        <View key={i} style={styles.row}>
                            <Text style={styles.left}>{d.left}</Text>
                            <Text style={styles.label}>{d.label}</Text>
                            <Text style={styles.right}>{d.right}</Text>
                        </View>
                    ))}

                </View>
            )}

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#111", padding: 15 },
    title: { color: "white", fontSize: 24, fontWeight: "bold", marginBottom: 20 },
    sub: { color: "#aaa", marginTop: 10, marginBottom: 5 },
    btn: { backgroundColor: "#333", padding: 10, marginRight: 8, borderRadius: 10 },
    active: { backgroundColor: "#FFD700" },
    vs: { color: "white", textAlign: "center", marginVertical: 10, fontSize: 18 },
    compareBtn: {
        backgroundColor: "#FFD700",
        padding: 15,
        marginVertical: 15,
        borderRadius: 10,
        alignItems: "center"
    },

    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20
    },
    team: { color: "white", fontSize: 20, fontWeight: "bold" },
    mid: { color: "#FFD700", fontSize: 18 },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 12,
        backgroundColor: "#1E1E1E",
        marginBottom: 8,
        borderRadius: 10
    },
    left: { color: "white", width: 70, textAlign: "center" },
    right: { color: "white", width: 70, textAlign: "center" },
    label: { color: "#aaa", flex: 1, textAlign: "center" },

    recentBox: {
        backgroundColor: "#1E1E1E",
        padding: 12,
        borderRadius: 10,
        marginBottom: 8
    },
    recentTitle: {
        color: "white",
        fontWeight: "bold",
        marginBottom: 6
    },
    recentText: {
        fontSize: 13
    }
});