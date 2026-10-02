import React from "react";
import { Text, View, Image, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PredictScreen from "./PredictScreen";
import ScheduleScreen from "./ScheduleScreen";
import ProfileScreen from "./ProfileScreen";
import RecordStack from "./RecordStack";

const Tab = createBottomTabNavigator();

// ===== 디자인 색상 (RankingScreen과 동일) =====
const COLORS = {
  bar: "#181829",
  border: "#2C2C3E",
  active: "#E8826B",
  inactive: "#8A8A9A",
  indicator: "#E8826B",
};

// true로 바꾸면 assets 폴더의 기존 일러스트 아이콘을 사용
const USE_IMAGE_ICONS = false;

// 탭 정보 (아이콘은 이모지, 기존 이미지는 images에 보관)
const TABS = [
  {
    name: "Predict",
    component: PredictScreen,
    label: "승부예측",
    emoji: "⚾",
    images: [require("../assets/Predict.png"), require("../assets/Predict_gray.png")],
  },
  {
    name: "Schedule",
    component: ScheduleScreen,
    label: "일정",
    emoji: "📅",
    // 일정 전용 이미지가 없어 기존처럼 Ranking 이미지 사용
    images: [require("../assets/Ranking.png"), require("../assets/Ranking_gray.png")],
  },
  {
    name: "Record",
    component: RecordStack,
    label: "기록실",
    emoji: "📊",
    images: [require("../assets/Record.png"), require("../assets/Record_gray.png")],
  },
  {
    name: "Profile",
    component: ProfileScreen,
    label: "프로필",
    emoji: "👤",
    images: [require("../assets/Profile.png"), require("../assets/Profile_gray.png")],
  },
];

function TabIcon({ tab, focused }) {
  return (
    <View style={styles.iconWrap}>
      {/* 선택된 탭 위쪽 주황색 표시줄 */}
      <View style={[styles.indicator, focused && styles.indicatorActive]} />
      {USE_IMAGE_ICONS ? (
        <Image
          source={focused ? tab.images[0] : tab.images[1]}
          style={styles.image}
          resizeMode="contain"
        />
      ) : (
        <Text style={[styles.emoji, { opacity: focused ? 1 : 0.4 }]}>{tab.emoji}</Text>
      )}
    </View>
  );
}

// =======================
// 🏠 Home (Tab Navigator)
// =======================
export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.active,
        tabBarInactiveTintColor: COLORS.inactive,
        tabBarStyle: {
          backgroundColor: COLORS.bar,
          borderTopColor: COLORS.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: 62 + insets.bottom,
          paddingTop: 0,
          paddingBottom: insets.bottom + 6,
          elevation: 0, // 안드로이드 그림자 제거
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
        },
      }}
    >
      {TABS.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            title: tab.label,
            tabBarIcon: ({ focused }) => <TabIcon tab={tab} focused={focused} />,
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

// =======================
// 스타일
// =======================
const styles = StyleSheet.create({
  iconWrap: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: 48,
    height: 34,
  },
  indicator: {
    width: 24,
    height: 3,
    borderRadius: 2,
    backgroundColor: "transparent",
    marginBottom: 6,
  },
  indicatorActive: { backgroundColor: COLORS.indicator },
  emoji: { fontSize: 20, lineHeight: 24 },
  image: { width: 26, height: 24 },
});
