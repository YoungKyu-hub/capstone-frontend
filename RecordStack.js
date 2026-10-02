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
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="Ranking"
                component={RankingScreen}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="HeadToHead"
                component={HeadToHeadScreen}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="SeasonRecord"
                component={SeasonRecordScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}