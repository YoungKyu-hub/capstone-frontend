import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { UserContext } from "../context/UserContext";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function ProfileScreen() {
  const [nickname, setNickname] =
    useState("로딩중...");

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
    <ScrollView style={styles.container}>
      {/* 프로필 */}
      <View style={styles.profileBox}>
        <Text style={styles.name}>👤 {nickname}</Text>
      </View>

      {/* 포인트 */}
      <View style={styles.card}>
        <Text style={styles.title}>💰 포인트</Text>
        <Text style={styles.bigValue}>{point}P</Text>
      </View>

      {/* 랭킹 */}
      <View style={styles.card}>
        <Text style={styles.title}>🏆 현재 순위</Text>

        <ScrollView
          style={styles.rankContainer}
          nestedScrollEnabled={true}
        >
          {rankingData.map((item) => (
            <View
              key={item.rank}
              style={[
                styles.rankRow,
                item.rank === myRank &&
                styles.myRankRow,
              ]}
            >
              <Text style={styles.rankText}>
                {item.rank}위
              </Text>

              <Text style={styles.nicknameText}>
                {item.nickname}
              </Text>

              <Text style={styles.scoreText}>
                {item.score}점
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* 성공률 + 연속적중 */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>
            예측 성공률
          </Text>
          <Text style={styles.statValue}>
            68%
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statTitle}>
            최고 연속 적중
          </Text>
          <Text style={styles.statValue}>
            7회
          </Text>
        </View>
      </View>

      {/* 업적 */}
      <View style={styles.card}>
        <Text style={styles.title}>
          🏅 획득 업적
        </Text>

        <Text style={styles.achievement}>
          🏆 첫 적중
        </Text>

        <Text style={styles.achievement}>
          🔥 5연속 적중
        </Text>

        <Text style={styles.achievement}>
          ⚾ 승률 60% 달성
        </Text>

        <Text style={styles.achievement}>
          🎯 예측 100회 참여
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f5f5f5",
  },

  profileBox: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 15,
  },

  name: {
    fontSize: 22,
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },

  bigValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E88E5",
    textAlign: "center",
  },

  rankContainer: {
    maxHeight: 250,
  },

  rankRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  myRankRow: {
    backgroundColor: "#FFF3CD",
    borderRadius: 10,
  },

  rankText: {
    fontSize: 15,
    fontWeight: "600",
  },

  scoreText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#444",
  },

  nicknameText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 15,
    fontWeight: "500",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  statCard: {
    width: "48%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
  },

  statTitle: {
    fontSize: 14,
    color: "#666",
  },

  statValue: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: "bold",
  },

  achievement: {
    fontSize: 15,
    marginBottom: 10,
  },
});