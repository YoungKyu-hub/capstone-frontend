import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Modal,
    FlatList
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// 경기 데이터
const gameData = {
    "2026-06-03": [
        { home: "LG", away: "두산", time: "18:30", stadium: "잠실" },
        { home: "SSG", away: "KIA", time: "18:30", stadium: "문학" }
    ],
    "2026-06-07": [
        { home: "롯데", away: "삼성", time: "17:00", stadium: "사직" }
    ],
    "2026-06-12": [
        { home: "NC", away: "한화", time: "18:30", stadium: "창원" }
    ]
};

const teams = ["ALL", "LG", "두산", "SSG", "롯데", "삼성", "KIA", "NC", "한화", "키움", "KT"];

const getDaysInMonth = (year, month) => {
    const date = new Date(year, month, 1);
    const days = [];

    while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }

    return days;
};

export default function ScheduleScreen() {
    const navigation = useNavigation();
    const today = new Date();

    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());
    const [selectedDate, setSelectedDate] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [filterTeam, setFilterTeam] = useState("ALL");

    const days = getDaysInMonth(year, month);

    // 날짜 포맷
    const formatDate = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    };

    // 월 이동
    const prevMonth = () => {
        setMonth(prev => {
            if (prev === 0) {
                setYear(y => y - 1);
                return 11;
            }
            return prev - 1;
        });
    };

    const nextMonth = () => {
        setMonth(prev => {
            if (prev === 11) {
                setYear(y => y + 1);
                return 0;
            }
            return prev + 1;
        });
    };

    // 날짜별 경기 필터
    const getGamesByDate = (key) => {
        const games = gameData[key] || [];
        if (filterTeam === "ALL") return games;
        return games.filter(g => g.home === filterTeam || g.away === filterTeam);
    };

    const selectedKey = selectedDate ? formatDate(selectedDate) : null;
    const selectedGames = selectedKey ? getGamesByDate(selectedKey) : [];

    // 경기 있는 날 체크
    const hasGameOnDate = (key) => {
        return getGamesByDate(key).length > 0;
    };

    // 홈/원정 색
    const getTeamColor = (team, game) => {
        if (team === game.home) return "#ff4d4d";
        if (team === game.away) return "#4da6ff";
        return "white";
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>📅 경기 일정</Text>

            {/* 월 이동 */}
            <View style={styles.monthBar}>
                <TouchableOpacity onPress={prevMonth}>
                    <Text style={styles.monthBtn}>◀</Text>
                </TouchableOpacity>

                <Text style={styles.monthText}>
                    {year}년 {month + 1}월
                </Text>

                <TouchableOpacity onPress={nextMonth}>
                    <Text style={styles.monthBtn}>▶</Text>
                </TouchableOpacity>
            </View>

            {/* 💡 완전히 고정된 높이 컨테이너로 감싸 영역 폭주를 막음 */}
            <View style={styles.filterContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterScrollContent}
                >
                    {teams.map(t => (
                        <TouchableOpacity
                            key={t}
                            onPress={() => setFilterTeam(t)}
                            style={[
                                styles.filterBtn,
                                filterTeam === t && styles.filterActive
                            ]}
                        >
                            <Text style={styles.filterBtnText}>{t}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* 캘린더 */}
            <View style={styles.calendar}>
                {days.map((date, index) => {
                    const key = formatDate(date);
                    const hasGame = hasGameOnDate(key);

                    return (
                        <TouchableOpacity
                            key={index}
                            style={styles.dayBox}
                            onPress={() => {
                                const games = getGamesByDate(key);
                                if (games.length === 0) return;

                                setSelectedDate(date);
                                setModalVisible(true);
                            }}
                        >
                            <Text style={styles.dayText}>
                                {date.getDate()}
                            </Text>

                            {hasGame && <View style={styles.dot} />}
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* 팝업 */}
            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.modalBg}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>📌 {selectedKey}</Text>

                        {selectedGames.length === 0 ? (
                            <Text style={{ color: "white" }}>경기 없음</Text>
                        ) : (
                            <FlatList
                                data={selectedGames}
                                keyExtractor={(item, i) => i.toString()}
                                renderItem={({ item }) => (
                                    <View style={styles.gameBox}>
                                        <Text style={{ color: "white" }}>🕒 {item.time}</Text>
                                        <Text style={{ color: "white" }}>🏟 {item.stadium}</Text>
                                        <Text>
                                            <Text style={{ color: getTeamColor(item.home, item) }}>{item.home}</Text>
                                            {" vs "}
                                            <Text style={{ color: getTeamColor(item.away, item) }}>{item.away}</Text>
                                        </Text>

                                        <TouchableOpacity
                                            onPress={() => {
                                                setModalVisible(false);
                                                navigation.navigate("GameDetail", { game: item });
                                            }}
                                        >
                                            <Text style={{ color: "#FFD700", marginTop: 5 }}>상세보기 →</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        )}

                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                            <Text style={{ fontWeight: "bold" }}>닫기</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#111",
        padding: 15,
        paddingBottom: 0,
    },
    title: {
        color: "white",
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 15
    },
    monthBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10
    },
    monthBtn: {
        color: "white",
        fontSize: 20
    },
    monthText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold"
    },

    /* 💡 필터 영역 전용 고정 높이 컨테이너 추가 */
    filterContainer: {
        height: 40,            // 전체 필터 바의 높이를 딱 40으로 잠금
        marginBottom: 15,      // 아래 캘린더와의 여백
        justifyContent: "center",
    },
    filterScrollContent: {
        alignItems: "center",  // 내부 버튼들을 세로 중앙 정렬
    },

    filterBtn: {
        backgroundColor: "#333",
        paddingVertical: 2,
        paddingHorizontal: 10,
        marginRight: 6,
        borderRadius: 8,
        height: 34,            // 버튼 자체의 높이
        justifyContent: "center",
        alignItems: "center"
    },
    filterBtnText: {
        fontSize: 13,
        color: "white",
        fontWeight: "500"
    },
    filterActive: {
        backgroundColor: "#FFD700"
    },

    calendar: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    dayBox: {
        width: "14.28%",       // 7일 분할 정밀 조절
        height: 60,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 0.3,
        borderColor: "#333"
    },
    dayText: {
        color: "white"
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "red",
        marginTop: 4
    },
    modalBg: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center"
    },
    modalBox: {
        width: "85%",
        backgroundColor: "#222",
        padding: 20,
        borderRadius: 12
    },
    modalTitle: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10
    },
    closeBtn: {
        marginTop: 15,
        backgroundColor: "#FFD700",
        padding: 10,
        alignItems: "center",
        borderRadius: 8
    },
    gameBox: {
        backgroundColor: "#333",
        padding: 10,
        marginBottom: 10,
        borderRadius: 8
    }
});