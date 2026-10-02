import React, { useState } from "react";
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    ScrollView,
    StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import KboTitle from "../components/KboTitle";
import TeamLogo from "../components/TeamLogo";

// ===== 디자인 색상 (RankingScreen과 동일) =====
const COLORS = {
    bg: "#181829",
    card: "#222232",
    chip: "#2C2C3E",
    text: "#FFFFFF",
    subText: "#C4C4C4",
    divider: "#2C2C3E",
    accent: "#E8826B",
    rowDirect: "#1E2A4A",
};

const dateList = ["4/13", "4/14", "4/15", "4/16"];
const getDayOfWeek = (dateStr) => {
    const [month, day] = dateStr.split("/");
    const date = new Date(2026, month - 1, day);

    const week = ["일", "월", "화", "수", "목", "금", "토"];
    return week[date.getDay()];
};

const gameData = {
    "4/13": [
        { id: "1", home: "KIA", away: "LG", time: "19:00", aiComment: "KIA의 최근 타선 흐름이 좋습니다." },
        { id: "2", home: "두산", away: "롯데", time: "18:30", aiComment: "롯데의 원정 경기 승률이 높습니다." },
    ],
    "4/14": [
        { id: "3", home: "SSG", away: "NC", time: "18:30", aiComment: "최근 SSG 불펜의 안정감이 좋습니다." },
        { id: "2", home: "두산", away: "롯데", time: "18:30", aiComment: "롯데의 원정 경기 승률이 높습니다." },
    ],
    "4/15": [
        { id: "3", home: "SSG", away: "NC", time: "18:30", aiComment: "최근 SSG 불펜의 안정감이 좋습니다." },
        { id: "4", home: "한화", away: "KT", time: "18:30", aiComment: "한화의 홈 경기 흐름이 좋습니다." },
    ],
    "4/16": [
        { id: "4", home: "한화", away: "KT", time: "18:30", aiComment: "한화의 홈 경기 흐름이 좋습니다." },
        { id: "5", home: "삼성", away: "키움", time: "17:00", aiComment: "삼성의 최근 득점력이 상승세입니다." },
    ],
};

// 팀 원 + 이름 + 홈/원정 표시
function TeamBadge({ team, side }) {
    return (
        <View style={styles.badge}>
            <View style={styles.badgeCircle}>
                <TeamLogo team={team} size={44} />
            </View>
            <Text style={styles.badgeName}>{team}</Text>
            <Text style={styles.badgeSide}>{side}</Text>
        </View>
    );
}

export default function PredictScreen() {
    const [selectedDate, setSelectedDate] = useState("4/13");
    const [selectedPredict, setSelectedPredict] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState(null);

    const renderGameCard = ({ item }) => {
        // 날짜 + 경기 id로 예측 저장 (다른 날짜의 같은 id와 섞이지 않게)
        const predictKey = `${selectedDate}-${item.id}`;
        const picked = selectedPredict[predictKey];

        const options = [
            { value: item.home, label: `${item.home} 승` },
            { value: "draw", label: "무승부" },
            { value: item.away, label: `${item.away} 승` },
        ];

        return (
            <View style={styles.card}>
                {/* 상단: 시간 + 전력분석 */}
                <View style={styles.topRow}>
                    <Text style={styles.timeText}>🕒 {item.time}</Text>
                    <TouchableOpacity
                        style={styles.analysisButton}
                        onPress={() => {
                            setSelectedMatch(item);
                            setModalVisible(true);
                        }}
                    >
                        <Text style={styles.analysisButtonText}>전력분석</Text>
                    </TouchableOpacity>
                </View>

                {/* 팀 vs 팀 */}
                <View style={styles.vsRow}>
                    <TeamBadge team={item.home} side="홈" />
                    <Text style={styles.vsText}>VS</Text>
                    <TeamBadge team={item.away} side="원정" />
                </View>

                {/* 예측 버튼 */}
                <View style={styles.buttonContainer}>
                    {options.map((opt) => {
                        const active = picked === opt.value;
                        return (
                            <TouchableOpacity
                                key={opt.value}
                                style={[styles.predictButton, active && styles.selected]}
                                activeOpacity={0.8}
                                onPress={() =>
                                    setSelectedPredict({
                                        ...selectedPredict,
                                        [predictKey]: opt.value,
                                    })
                                }
                            >
                                <Text style={styles.buttonText}>{opt.label}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* AI 코멘트 */}
                <View style={styles.aiBox}>
                    <Text style={styles.aiTitle}>AI 참고 멘트</Text>
                    <Text style={styles.aiComment}>{item.aiComment}</Text>
                </View>
            </View>
        );
    };

    const ListHeader = (
        <View>
            {/* 상단 바 */}
            <View style={styles.topBar}>
                <KboTitle />
            </View>

            {/* 아이콘 + 제목 */}
            <View style={styles.logoCircle}>
                <Text style={styles.logoEmoji}>⚾</Text>
            </View>
            <Text style={styles.screenTitle}>승부예측</Text>

            {/* 날짜 선택 */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.dateContainer}
            >
                {dateList.map((date) => {
                    const active = selectedDate === date;
                    return (
                        <TouchableOpacity
                            key={date}
                            style={[styles.dateButton, active && styles.selectedDate]}
                            onPress={() => setSelectedDate(date)}
                        >
                            <Text style={styles.dateText}>
                                {date} ({getDayOfWeek(date)})
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );

    return (
        <SafeAreaView style={styles.safe} edges={["top"]}>
            <StatusBar barStyle="light-content" />

            <FlatList
                data={gameData[selectedDate] || []}
                keyExtractor={(item) => `${selectedDate}-${item.id}`}
                renderItem={renderGameCard}
                ListHeaderComponent={ListHeader}
                ListEmptyComponent={
                    <Text style={styles.empty}>예정된 경기가 없습니다.</Text>
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            />

            {/* 전력 분석 팝업 */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>전력 분석</Text>

                        {selectedMatch && (
                            <>
                                <View style={styles.modalVsRow}>
                                    <TeamBadge team={selectedMatch.home} side="홈" />
                                    <Text style={styles.vsText}>VS</Text>
                                    <TeamBadge team={selectedMatch.away} side="원정" />
                                </View>

                                <View style={styles.modalBox}>
                                    <Text style={styles.modalText}>
                                        최근 경기력과 팀 흐름을 분석한 결과{" "}
                                        <Text style={styles.modalStrong}>
                                            {selectedMatch.home}
                                        </Text>
                                        의 우세가 예상됩니다.
                                    </Text>
                                </View>

                                {["최근 승률 우세", "타선 흐름 안정적", "홈 경기 이점 존재"].map(
                                    (point) => (
                                        <View key={point} style={styles.pointRow}>
                                            <View style={styles.pointDot} />
                                            <Text style={styles.pointText}>{point}</Text>
                                        </View>
                                    )
                                )}
                            </>
                        )}

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>닫기</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.bg },
    content: { paddingHorizontal: 20, paddingBottom: 30 },

    // 상단 바
    topBar: {
        height: 36,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 12,
    },

    // 아이콘 + 제목
    logoCircle: {
        alignSelf: "center",
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: COLORS.card,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 24,
    },
    logoEmoji: { fontSize: 40 },
    screenTitle: {
        color: COLORS.text,
        fontSize: 24,
        fontWeight: "700",
        textAlign: "center",
        marginTop: 16,
    },

    // 날짜 선택
    dateContainer: { paddingTop: 24, paddingBottom: 8 },
    dateButton: {
        height: 36,
        paddingHorizontal: 16,
        borderRadius: 18,
        backgroundColor: COLORS.chip,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
    },
    selectedDate: { backgroundColor: COLORS.accent },
    dateText: { color: COLORS.text, fontSize: 14, fontWeight: "700" },

    // 경기 카드
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 18,
        marginTop: 16,
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    timeText: { color: COLORS.subText, fontSize: 13 },
    analysisButton: {
        height: 28,
        paddingHorizontal: 12,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: COLORS.accent,
        justifyContent: "center",
    },
    analysisButtonText: { color: COLORS.accent, fontSize: 12, fontWeight: "700" },

    // 팀 vs 팀
    vsRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        marginTop: 16,
        marginBottom: 20,
    },
    badge: { alignItems: "center", width: 90 },
    badgeCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.chip,
        alignItems: "center",
        justifyContent: "center",
    },
    badgeName: { color: COLORS.text, fontSize: 17, fontWeight: "700", marginTop: 8 },
    badgeSide: { color: COLORS.subText, fontSize: 11, marginTop: 2 },
    vsText: { color: COLORS.accent, fontSize: 18, fontWeight: "700" },

    // 예측 버튼
    buttonContainer: { flexDirection: "row", marginHorizontal: -4, marginBottom: 16 },
    predictButton: {
        flex: 1,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.chip,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 4,
    },
    selected: { backgroundColor: COLORS.accent },
    buttonText: { color: COLORS.text, fontSize: 14, fontWeight: "700" },

    // AI 코멘트
    aiBox: {
        backgroundColor: COLORS.rowDirect,
        borderRadius: 12,
        padding: 14,
    },
    aiTitle: { color: COLORS.accent, fontSize: 13, fontWeight: "700", marginBottom: 6 },
    aiComment: { color: COLORS.text, fontSize: 13, lineHeight: 20 },

    empty: { color: COLORS.subText, textAlign: "center", marginTop: 40 },

    // 전력 분석 팝업
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.7)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "88%",
        backgroundColor: COLORS.bg,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.divider,
        padding: 22,
    },
    modalTitle: {
        color: COLORS.text,
        fontSize: 20,
        fontWeight: "700",
        textAlign: "center",
    },
    modalVsRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        marginTop: 18,
        marginBottom: 18,
    },
    modalBox: {
        backgroundColor: COLORS.rowDirect,
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
    },
    modalText: { color: COLORS.text, fontSize: 14, lineHeight: 22 },
    modalStrong: { color: COLORS.accent, fontWeight: "700" },
    pointRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.card,
        borderRadius: 8,
        height: 40,
        paddingHorizontal: 12,
        marginBottom: 8,
    },
    pointDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.accent,
        marginRight: 10,
    },
    pointText: { color: COLORS.text, fontSize: 14 },
    closeButton: {
        marginTop: 12,
        height: 46,
        borderRadius: 23,
        backgroundColor: COLORS.accent,
        alignItems: "center",
        justifyContent: "center",
    },
    closeButtonText: { color: COLORS.text, fontWeight: "700", fontSize: 15 },
});
