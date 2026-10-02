import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import KboTitle from "../components/KboTitle";
import { UserContext } from "../context/UserContext";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

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
  rowMine: "#3A1E1E",
};

const achievements = [
  { icon: "🏆", label: "첫 적중" },
  { icon: "🔥", label: "5연속 적중" },
  { icon: "⚾", label: "승률 60% 달성" },
  { icon: "🎯", label: "예측 100회 참여" },
];

export default function ProfileScreen() {
  const [nickname, setNickname] = useState("로딩중...");

  const { point } = useContext(UserContext);

  const myRank = 23;

  const rankingData = Array.from({ length: 25 }, (_, i) => ({
    rank: i + 1,
    nickname: i + 1 === myRank ? nickname : `유저${i + 1}`,
    score: 2600 - i * 50,
  }));

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const uid = auth.currentUser?.uid;

        if (!uid) return;

        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setNickname(data.nickname);
        }
      } catch (error) {
        console.log(error);
      }
    };

    loadUserData();
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* 상단 바 */}
        <View style={styles.topBar}>
          <KboTitle />
        </View>

        {/* 프로필 */}
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>👤</Text>
        </View>
        <Text style={styles.name}>{nickname}</Text>
        <View style={styles.pointPill}>
          <Text style={styles.pointText}>{point}P</Text>
        </View>

        {/* 성공률 + 연속적중 + 순위 */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>68%</Text>
            <Text style={styles.statTitle}>예측 성공률</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>7회</Text>
            <Text style={styles.statTitle}>최고 연속 적중</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{myRank}위</Text>
            <Text style={styles.statTitle}>현재 순위</Text>
          </View>
        </View>

        {/* 랭킹 */}
        <Text style={styles.sectionTitle}>유저 랭킹</Text>
        <View style={styles.tableHeader}>
          <Text style={[styles.headCell, styles.colRank]}>#</Text>
          <Text style={[styles.headCell, styles.colName]}>닉네임</Text>
          <Text style={[styles.headCell, styles.colScore]}>점수</Text>
        </View>

        <ScrollView style={styles.rankContainer} nestedScrollEnabled={true}>
          {rankingData.map((item) => {
            const mine = item.rank === myRank;
            return (
              <View
                key={item.rank}
                style={[
                  styles.rankRow,
                  item.rank <= 3 && styles.rowTop,
                  mine && styles.rowMine,
                ]}
              >
                <Text style={[styles.cell, styles.colRank]}>{item.rank}</Text>
                <Text style={[styles.cell, styles.colName]} numberOfLines={1}>
                  {item.nickname}
                  {mine && <Text style={styles.meTag}>  나</Text>}
                </Text>
                <Text style={[styles.scoreText, styles.colScore]}>{item.score}</Text>
              </View>
            );
          })}
        </ScrollView>

        {/* 업적 */}
        <Text style={styles.sectionTitle}>획득 업적</Text>
        <View style={styles.achieveGrid}>
          {achievements.map((a) => (
            <View key={a.label} style={styles.achieveCard}>
              <View style={styles.achieveIcon}>
                <Text style={{ fontSize: 20 }}>{a.icon}</Text>
              </View>
              <Text style={styles.achieveText}>{a.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  content: { paddingHorizontal: 20, paddingBottom: 40 },

  // 상단 바
  topBar: {
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },

  // 프로필
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
  name: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 16,
  },
  pointPill: {
    alignSelf: "center",
    height: 30,
    paddingHorizontal: 16,
    borderRadius: 15,
    backgroundColor: COLORS.accent,
    justifyContent: "center",
    marginTop: 10,
  },
  pointText: { color: COLORS.text, fontSize: 14, fontWeight: "700" },

  // 통계 카드
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  statCard: {
    width: "31.5%",
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  statValue: { color: COLORS.accent, fontSize: 20, fontWeight: "700" },
  statTitle: { color: COLORS.subText, fontSize: 12, marginTop: 6 },

  // 섹션 제목
  sectionTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 28,
  },

  // 랭킹 표
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginTop: 8,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderColor: COLORS.divider,
  },
  headCell: { color: COLORS.subText, fontSize: 12 },
  rankContainer: { maxHeight: 300 },
  rankRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 46,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  rowTop: { backgroundColor: COLORS.rowDirect },
  rowMine: { backgroundColor: COLORS.rowMine, borderWidth: 1, borderColor: COLORS.accent },
  cell: { color: COLORS.text, fontSize: 14 },
  scoreText: { color: COLORS.text, fontSize: 14, fontWeight: "700" },
  meTag: { color: COLORS.accent, fontSize: 12, fontWeight: "700" },
  colRank: { width: 32 },
  colName: { flex: 1 },
  colScore: { width: 60, textAlign: "right" },

  // 업적
  achieveGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 12,
  },
  achieveCard: {
    width: "48.5%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  achieveIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.chip,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  achieveText: { color: COLORS.text, fontSize: 13, fontWeight: "600", flexShrink: 1 },
});
