import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import RecordScreen from "./RecordScreen";
import RankingScreen from "./RankingScreen";
import HeadToHeadScreen from "./HeadToHeadScreen";
import SeasonRecordScreen from "./SeasonRecordScreen";

const Stack = createNativeStackNavigator();

export default function RecordStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="RecordHome"
                component={RecordScreen}
                options={{ title: "기록실" }}
            />

            <Stack.Screen
                name="Ranking"
                component={RankingScreen}
                options={{ title: "팀 순위" }}
            />

            <Stack.Screen
                name="HeadToHead"
                component={HeadToHeadScreen}
                options={{ title: "상대전적 비교" }}
            />

            <Stack.Screen
                name="SeasonRecord"
                component={SeasonRecordScreen}
                options={{ title: "시즌 기록" }}
            />
        </Stack.Navigator>
    );
}