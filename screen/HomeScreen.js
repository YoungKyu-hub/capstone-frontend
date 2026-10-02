import React from "react";
import { Text, View, Image } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import PredictScreen from "./PredictScreen";
import ScheduleScreen from "./ScheduleScreen";
import ProfileScreen from "./ProfileScreen";
import RecordStack from "./RecordStack";

const Tab = createBottomTabNavigator();

// =======================
// 🏠 Home (Tab Navigator)
// =======================
export default function HomeScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >

      {/* ⚾ Predict */}
      <Tab.Screen
        name="Predict"
        component={PredictScreen}
        options={{
          title: "승부예측",
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../assets/Predict.png")
                  : require("../assets/Predict_gray.png")
              }
              style={{
                width: 30,
                height: 30,
              }}
              style={{ width: 30, height: 30 }}
            />
          ),
        }}
      />

      {/* 🗓️ Schedule */}
      <Tab.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{
          title: "일정",
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../assets/Ranking.png")
                  : require("../assets/Ranking_gray.png")
              }
              style={{
                width: 30,
                height: 30,
              }}
              style={{ width: 30, height: 30 }}
            />
          ),
        }}
      />

      {/* 📓 Record */}
      <Tab.Screen
        name="Record"
        component={RecordStack}
        options={{
          title: "기록실",
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../assets/Record.png")
                  : require("../assets/Record_gray.png")
              }
              style={{
                width: 30,
                height: 30,
              }}
              style={{ width: 30, height: 30 }}
            />
          ),
        }}
      />

      {/* 👤 Profile */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "프로필",
          tabBarLabel: ({ focused }) => (
            <Text style={{ fontSize: 10, textAlign: "center" }}>
              프로필
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../assets/Profile.png")
                  : require("../assets/Profile_gray.png")
              }
              style={{
                width: 30,
                height: 30,
              }}
              style={{ width: 30, height: 30 }}
            />
          ),
        }}
      />

    </Tab.Navigator>
  );
}

// =======================
// 스타일
// =======================
const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
};