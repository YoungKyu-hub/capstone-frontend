import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
} from "react-native";

// ===== 2026 시즌 데이터 =====
const rankingData = [
    {
        id: 1,
        team: "LG",
        game: 31,
        win: 20,
        lose: 10,
        draw: 1,
        streak: "3승",
        last10: "7승3패",
        home: "10-5",
        away: "10-5",
    },
    {
        id: 2,
        team: "두산",
        game: 30,
        win: 17,
        lose: 12,
        draw: 1,
        streak: "1패",
        last10: "5승5패",
        home: "9-6",
        away: "9-6",
    },
    {
        id: 3,
        team: "SSG",
        game: 30,
        win: 22,
        lose: 8,
        draw: 0,
        streak: "2승",
        last10: "6승4패",
        home: "8-7",
        away: "9-6",
    },
    {
        id: 4,
        team: "롯데",
        game: 30,
        win: 8,
        lose: 21,
        draw: 1,
        streak: "1승",
        last10: "5승5패",
        home: "7-8",
        away: "8-7",
    },
    {
        id: 5,
        team: "삼성",
        game: 31,
        win: 14,
        lose: 16,
        draw: 1,
        streak: "2패",
        last10: "4승6패",
        home: "7-9",
        away: "7-7",
    },
    {
        id: 6,
        team: "KIA",
        game: 31,
        win: 10,
        lose: 20,
        draw: 1,
        streak: "1패",
        last10: "4승6패",
        home: "8-9",
        away: "7-7",
    },
];

// ===== 시즌별 데이터 =====
const seasonData = {
    2026: rankingData,

    2025: [
        {
            id: 1,
            team: "한화",
            game: 144,
            win: 80,
            lose: 60,
            draw: 4,
            streak: "2승",
            last10: "7승3패",
            home: "40-30",
            away: "40-30",
        },
    ],

    2024: [
        {
            id: 1,
            team: "기아",
            game: 144,
            win: 85,
            lose: 55,
            draw: 4,
            streak: "1승",
            last10: "8승2패",
            home: "42-28",
            away: "43-27",
        },
    ],
};

const getWinRate = (win, lose) => win / (win + lose);

function RankingScreen() {
    const [season, setSeason] = useState(2026);
    const [showSeasonList, setShowSeasonList] = useState(false);

    const currentData = seasonData[season] || [];

    const sortedData = [...currentData]
        .sort(
            (a, b) =>
                getWinRate(b.win, b.lose) -
                getWinRate(a.win, a.lose)
        )
        .map((item, index, arr) => {
            const topWinRate =
                getWinRate(arr[0].win, arr[0].lose);

            const currentWinRate =
                getWinRate(item.win, item.lose);

            return {
                ...item,
                rank: index + 1,
                winRate: currentWinRate.toFixed(3),
                gb:
                    index === 0
                        ? "-"
                        : Math.round(
                              ((topWinRate -
                                  currentWinRate) *
                                  item.game) *
                                  2
                          ) / 2,
            };
        });

    const renderItem = ({ item }) => {
        let bgColor = "white";

        if (item.rank <= 4) bgColor = "#d0ebff";
        else if (item.rank === 5) bgColor = "#e7f5ff";

        return (
            <View
                style={[
                    styles.row,
                    { backgroundColor: bgColor },
                ]}
            >
                <Text style={styles.cell}>{item.rank}</Text>
                <Text style={styles.cell}>{item.team}</Text>
                <Text style={styles.cell}>{item.game}</Text>
                <Text style={styles.cell}>{item.winRate}</Text>
                <Text style={styles.cell}>{item.win}</Text>
                <Text style={styles.cell}>{item.lose}</Text>
                <Text style={styles.cell}>{item.draw}</Text>
                <Text style={styles.cell}>{item.gb}</Text>
                <Text style={styles.cell}>{item.last10}</Text>
                <Text style={styles.cell}>{item.streak}</Text>
                <Text style={styles.cell}>{item.home}</Text>
                <Text style={styles.cell}>{item.away}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                {/* 시즌 헤더 */}
                <View style={styles.seasonHeader}>
                    <TouchableOpacity
                        onPress={() => {
                            if (season > 2010)
                                setSeason(season - 1);
                        }}
                    >
                        <Text style={styles.arrow}>◀</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() =>
                            setShowSeasonList(
                                !showSeasonList
                            )
                        }
                    >
                        <Text style={styles.title}>
                            {season} 시즌 순위
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            if (season < 2026)
                                setSeason(season + 1);
                        }}
                    >
                        <Text style={styles.arrow}>▶</Text>
                    </TouchableOpacity>
                </View>

                {/* 시즌 목록 */}
                {showSeasonList && (
                    <View style={styles.dropdown}>
                        <ScrollView
                            style={{ maxHeight: 250 }}
                        >
                            {[...Array(17)].map(
                                (_, index) => {
                                    const year =
                                        2026 - index;

                                    return (
                                        <TouchableOpacity
                                            key={year}
                                            style={
                                                styles.dropdownItem
                                            }
                                            onPress={() => {
                                                setSeason(
                                                    year
                                                );
                                                setShowSeasonList(
                                                    false
                                                );
                                            }}
                                        >
                                            <Text>
                                                {year} 시즌
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                }
                            )}
                        </ScrollView>
                    </View>
                )}

                <ScrollView horizontal>
                    <View>
                        <View
                            style={[
                                styles.row,
                                styles.header,
                            ]}
                        >
                            <Text style={styles.cell}>
                                순위
                            </Text>
                            <Text style={styles.cell}>
                                팀
                            </Text>
                            <Text style={styles.cell}>
                                경기
                            </Text>
                            <Text style={styles.cell}>
                                승률
                            </Text>
                            <Text style={styles.cell}>
                                승
                            </Text>
                            <Text style={styles.cell}>
                                패
                            </Text>
                            <Text style={styles.cell}>
                                무
                            </Text>
                            <Text style={styles.cell}>
                                게임차
                            </Text>
                            <Text style={styles.cell}>
                                최근10
                            </Text>
                            <Text style={styles.cell}>
                                연속
                            </Text>
                            <Text style={styles.cell}>
                                홈
                            </Text>
                            <Text style={styles.cell}>
                                어웨이
                            </Text>
                        </View>

                        <FlatList
                            data={sortedData}
                            keyExtractor={(item) =>
                                item.id.toString()
                            }
                            renderItem={renderItem}
                        />
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

export default RankingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        paddingTop: 40,
        backgroundColor: "#f5f5f5",
    },

    seasonHeader: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
    },

    title: {
        fontSize: 22,
        fontWeight: "bold",
    },

    arrow: {
        fontSize: 22,
        fontWeight: "bold",
        marginHorizontal: 20,
    },

    dropdown: {
        backgroundColor: "white",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        marginBottom: 10,
    },

    dropdownItem: {
        padding: 12,
        borderBottomWidth: 0.5,
        borderColor: "#eee",
    },

    row: {
        flexDirection: "row",
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderBottomWidth: 0.5,
        borderColor: "#ccc",
    },

    header: {
        backgroundColor: "#ddd",
    },

    cell: {
        width: 70,
        textAlign: "center",
        fontSize: 13,
    },
});