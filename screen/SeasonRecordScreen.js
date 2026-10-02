import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

export default function SeasonRecordScreen() {

    // 한글 기준 UI 상태
    const [mainTab, setMainTab] = useState("타자");
    const [subTab, setSubTab] = useState("타율");

    // 내부 데이터 (영어 key 유지)
    const data = {
        batter: {
            avg: [
                { name: "김도영", team: "KIA", value: ".347" },
                { name: "홍창기", team: "LG", value: ".338" },
            ],
            hr: [
                { name: "김도영", team: "KIA", value: "35" },
                { name: "노시환", team: "한화", value: "31" },
            ]
        },
        pitcher: {
            era: [
                { name: "네일", team: "KIA", value: "2.11" },
                { name: "원태인", team: "삼성", value: "2.43" },
            ]
        },
        team: {
            winrate: [
                { name: "KIA", value: ".650" },
                { name: "LG", value: ".620" },
            ]
        }
    };

    // 🔥 한글 → 데이터 키 매핑
    const mainMap = {
        "타자": "batter",
        "투수": "pitcher",
        "팀": "team"
    };

    // 서브탭도 한글화
    const subMap = {
        batter: {
            "타율": "avg",
            "홈런": "hr"
        },
        pitcher: {
            "평균자책": "era"
        },
        team: {
            "승률": "winrate"
        }
    };

    const mainKey = mainMap[mainTab];
    const subKey = subMap[mainKey]?.[subTab];

    const current = data[mainKey]?.[subKey] || [];

    return (
        <ScrollView style={styles.container}>

            <Text style={styles.title}>📈 시즌 기록</Text>

            {/* 메인 탭 */}
            <View style={styles.row}>
                {["타자", "투수", "팀"].map(t => (
                    <TouchableOpacity
                        key={t}
                        onPress={() => {
                            setMainTab(t);
                            setSubTab(Object.keys(subMap[mainMap[t]])[0]); // 첫 서브탭 자동 설정
                        }}
                        style={[
                            styles.tab,
                            mainTab === t && { backgroundColor: "#008cff" }
                        ]}
                    >
                        <Text style={{ color: "white" }}>{t}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* 서브 탭 */}
            <View style={styles.row}>
                {Object.keys(subMap[mainKey]).map(t => (
                    <TouchableOpacity
                        key={t}
                        onPress={() => setSubTab(t)}
                        style={[
                            styles.sub,
                            subTab === t && { backgroundColor: "#00ff99" }
                        ]}
                    >
                        <Text>{t}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* 데이터 */}
            {current.map((item, i) => (
                <View key={i} style={styles.card}>
                    <Text style={{ color: "white" }}>
                        {item.name} {item.team ? `(${item.team})` : ""}
                    </Text>
                    <Text style={{ color: "#00ff99" }}>{item.value}</Text>
                </View>
            ))}

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#111", padding: 15 },
    title: { color: "white", fontSize: 24, fontWeight: "bold", marginBottom: 20 },
    row: { flexDirection: "row", marginBottom: 10 },
    tab: { backgroundColor: "#333", padding: 10, marginRight: 8, borderRadius: 8 },
    sub: { backgroundColor: "#444", padding: 8, marginRight: 8, borderRadius: 8 },
    card: { backgroundColor: "#1E1E1E", padding: 12, marginBottom: 8, borderRadius: 10 }
});