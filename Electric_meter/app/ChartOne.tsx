import { generateMonthlyData } from "@/constants/DummyData";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { BarChart } from "react-native-gifted-charts";
interface BarData {
  value: number;
  label?: string;
  [key: string]: any;
}

export default function ChartOne () {
  const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

      const monthlyData = useMemo(
      () => generateMonthlyData(currentYear, currentMonth),
      [currentYear, currentMonth]
  );

      const getMonthName = (month: number) => {
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];
    return months[month - 1] ?? "";
  };



      const navigateMonth = (direction: number) => {
      let newMonth = currentMonth + direction;
      let newYear = currentYear;
      if (newMonth > 12) { newMonth = 1; newYear++; }
      else if (newMonth < 1) { newMonth = 12; newYear--; }
      setCurrentMonth(newMonth);
      setCurrentYear(newYear);
      setSelectedBarIndex(null);
  };

  const chartData = monthlyData.map((item, index) => ({
      ...item,
      topLabelComponent: () =>
      selectedBarIndex === index ? (
        <Text style={{ color: "#000", fontSize: 10, fontWeight: "600", marginBottom: 4 }}>
          {item.value} kWh
        </Text>
      ) : null,
  }));


  return(
    <ScrollView>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16, }}>
          <TouchableOpacity onPress={() => navigateMonth(-1)} hitSlop={20}>
            <MaterialIcons name="chevron-left" size={24} color={"#000"} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: "600", color: "#000" }}>
            {getMonthName(currentMonth)} {currentYear}
          </Text>
          <TouchableOpacity onPress={() => navigateMonth(1)} hitSlop={20}>
            <MaterialIcons name="chevron-right" size={24} color={"#000"} />
          </TouchableOpacity>
        </View>

    <BarChart 
    data={chartData}
    gradientColor={"#4c669f"}
    frontColor={"#3b5998"}
    barBorderRadius={4}
    yAxisThickness={0}
    xAxisThickness={0}
    />
    </ScrollView>
  );
}