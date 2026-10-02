import React, { useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    Modal,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    ScrollView,
    StatusBar,
} from "react-native";

const dateList = ["4/13", "4/14", "4/15", "4/16"];
const getDayOfWeek = (dateStr) => {
    const [month, day] = dateStr.split("/");
    const date = new Date(2026, month - 1, day);

    const week = ["일", "월", "화", "수", "목", "금", "토"];
    return week[date.getDay()];
};

const gameData = {
    "4/13": [
        {
            id: "1",
            home: "KIA",
            away: "LG",
            time: "19:00",
            aiComment: "KIA의 최근 타선 흐름이 좋습니다.",
        },
        {
            id: "2",
            home: "두산",
            away: "롯데",
            time: "18:30",
            aiComment: "롯데의 원정 경기 승률이 높습니다.",
        },
    ],

    "4/14": [
        {
            id: "3",
            home: "SSG",
            away: "NC",
            time: "18:30",
            aiComment: "최근 SSG 불펜의 안정감이 좋습니다.",
        },
        {
            id: "2",
            home: "두산",
            away: "롯데",
            time: "18:30",
            aiComment: "롯데의 원정 경기 승률이 높습니다.",
        },
    ],

    "4/15": [
        {
            id: "3",
            home: "SSG",
            away: "NC",
            time: "18:30",
            aiComment: "최근 SSG 불펜의 안정감이 좋습니다.",
        },
        {
            id: "4",
            home: "한화",
            away: "KT",
            time: "18:30",
            aiComment: "한화의 홈 경기 흐름이 좋습니다.",
        },
    ],

    "4/16": [
        {
            id: "4",
            home: "한화",
            away: "KT",
            time: "18:30",
            aiComment: "한화의 홈 경기 흐름이 좋습니다.",
        },
        {
            id: "5",
            home: "삼성",
            away: "키움",
            time: "17:00",
            aiComment: "삼성의 최근 득점력이 상승세입니다.",
        },
    ],
};

export default function PredictScreen() {
    const [selectedDate, setSelectedDate] = useState("4/13");
    const [selectedPredict, setSelectedPredict] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState(null);

    const renderGameCard = ({ item }) => {
        return (
            <View style={styles.card}>

                {/* 상단 영역 */}
                <View style={styles.topRow}>

                    <Text style={styles.matchText}>
                        {item.home} VS {item.away}
                    </Text>

                    <TouchableOpacity
                        style={styles.analysisButton}
                        onPress={() => {
                            setSelectedMatch(item);
                            setModalVisible(true);
                        }}
                    >
                        <Text style={styles.analysisButtonText}>
                            전력분석
                        </Text>
                    </TouchableOpacity>

                </View>

                <Text style={styles.timeText}>
                    경기 시간 : {item.time}
                </Text>

                <View style={styles.buttonContainer}>

                    <TouchableOpacity
                        style={[
                            styles.predictButton,
                            selectedPredict[item.id] === item.home &&
                            styles.selected,
                        ]}
                        onPress={() =>
                            setSelectedPredict({
                                ...selectedPredict,
                                [item.id]: item.home,
                            })
                        }
                    >
                        <Text style={styles.buttonText}>
                            {item.home} 승
                        </Text>
                    </TouchableOpacity>

                    {/* ⚖️ 무승부 추가 */}
                    <TouchableOpacity
                        style={[
                            styles.predictButton,
                            selectedPredict[item.id] === "draw" &&
                            styles.selected,
                        ]}
                        onPress={() =>
                            setSelectedPredict({
                                ...selectedPredict,
                                [item.id]: "draw",
                            })
                        }
                    >
                        <Text style={styles.buttonText}>
                            무승부
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.predictButton,
                            selectedPredict[item.id] === item.away &&
                            styles.selected,
                        ]}
                        onPress={() =>
                            setSelectedPredict({
                                ...selectedPredict,
                                [item.id]: item.away,
                            })
                        }
                    >
                        <Text style={styles.buttonText}>
                            {item.away} 승
                        </Text>
                    </TouchableOpacity>

                </View>

                <View style={styles.aiBox}>
                    <Text style={styles.aiTitle}>
                        AI 참고 멘트
                    </Text>

                    <Text style={styles.aiComment}>
                        {item.aiComment}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            <Text style={styles.header}>승부예측</Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.dateContainer}
            >
                {dateList.map((date) => (
                    <TouchableOpacity
                        key={date}
                        style={[
                            styles.dateButton,
                            selectedDate === date && styles.selectedDate,
                        ]}
                        onPress={() => setSelectedDate(date)}
                    >
                        <Text style={styles.dateText}>
                            {date} ({getDayOfWeek(date)})
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <FlatList
                data={gameData[selectedDate] || []}
                keyExtractor={(item) => item.id}
                renderItem={renderGameCard}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 30,
                }}
            />
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
            >

                <View style={styles.modalOverlay}>

                    <View style={styles.modalContainer}>

                        <Text style={styles.modalTitle}>
                            전력 분석
                        </Text>

                        {selectedMatch && (
                            <>
                                <Text style={styles.modalMatch}>
                                    {selectedMatch.home} VS {selectedMatch.away}
                                </Text>

                                <Text style={styles.modalText}>
                                    최근 경기력과 팀 흐름을 분석한 결과
                                    {selectedMatch.home}의 우세가 예상됩니다.
                                </Text>

                                <Text style={styles.modalText}>
                                    • 최근 승률 우세
                                </Text>

                                <Text style={styles.modalText}>
                                    • 타선 흐름 안정적
                                </Text>

                                <Text style={styles.modalText}>
                                    • 홈 경기 이점 존재
                                </Text>
                            </>
                        )}

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>
                                닫기
                            </Text>
                        </TouchableOpacity>

                    </View>

                </View>

            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#111",
        paddingTop: 20,
        paddingHorizontal: 16,
    },

    header: {
        color: "white",
        fontSize: 38,
        fontWeight: "bold",
        marginTop: 40,
        marginBottom: 20,
    },

    dateContainer: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 30,
    },

    dateButton: {
        width: 85,
        height: 45,
        backgroundColor: "#333",
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },

    selectedDate: {
        backgroundColor: "#FFD700",
    },

    dateText: {
        color: "white",
        fontSize: 15,
        fontWeight: "bold",
    },

    card: {
        backgroundColor: "#1E1E1E",
        borderRadius: 24,
        padding: 20,
        marginTop: 12,
        marginBottom: 20,
    },

    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },

    matchText: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
    },

    analysisButton: {
        backgroundColor: "#FFD700",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
    },

    analysisButtonText: {
        color: "#111",
        fontSize: 12,
        fontWeight: "bold",
    },

    timeText: {
        color: "#AAA",
        fontSize: 15,
        marginBottom: 24,
    },

    buttonContainer: {
        flexDirection: "row",
        marginBottom: 20,
    },

    predictButton: {
        flex: 1,
        backgroundColor: "#333",
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: "center",
        marginHorizontal: 5,
    },

    selected: {
        backgroundColor: "#00C896",
    },

    buttonText: {
        color: "white",
        fontSize: 17,
        fontWeight: "bold",
    },

    aiBox: {
        backgroundColor: "#2A2A2A",
        borderRadius: 16,
        padding: 16,
    },

    aiTitle: {
        color: "#FFD700",
        fontSize: 15,
        fontWeight: "bold",
        marginBottom: 8,
    },

    aiComment: {
        color: "white",
        fontSize: 13,
        lineHeight: 24,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.7)",
        justifyContent: "center",
        alignItems: "center",
    },

    modalContainer: {
        width: "85%",
        backgroundColor: "#1E1E1E",
        borderRadius: 20,
        padding: 25,
    },

    modalTitle: {
        color: "#FFD700",
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },

    modalMatch: {
        color: "white",
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },

    modalText: {
        color: "white",
        fontSize: 16,
        marginBottom: 12,
        lineHeight: 24,
    },

    closeButton: {
        marginTop: 20,
        backgroundColor: "#FFD700",
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
    },

    closeButtonText: {
        color: "#111",
        fontWeight: "bold",
        fontSize: 16,
    },
});