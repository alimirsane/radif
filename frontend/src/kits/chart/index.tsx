import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { ChartType } from "chart.js";
import { chartType } from "./type";
import { Card } from "@kit/card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);
// export const options = {
//   responsive: true,
//   legend: {
//     display: false,
//   },
// };

const Chart = (props: chartType) => {
  const { data_obj, labels, type, title, options } = props;
  // Define valid color keys
  type ColorKeys =
    | "primary"
    | "secondary"
    | "secondary-light"
    | "error"
    | "info"
    | "success"
    | "warning"
    | "black"
    | "white"
    | "paper";
  const colorMapping: Record<ColorKeys, string> = useMemo(
    () => ({
      primary: "#bab5f5",
      secondary: "#e7d5ff",
      "secondary-light": "#e7d5ff",
      error: "#f5a2a2",
      info: "#a9c7f1",
      success: "#a1ecd3",
      warning: "#e7cd8b",
      black: "#000000",
      white: "#ffffff",
      paper: "#d3d3d3",
    }),
    [],
  );

  // Mapping background colors for the pie chart or bar chart
  let data_completed = useMemo(() => {
    return data_obj?.map((item) => {
      let backgroundColor;

      // Handle pie chart: assign different colors for each slice
      if (type === "pie") {
        backgroundColor = item.backgroundColor.map(
          (colorName: ColorKeys) => colorMapping[colorName] || colorName,
        );
      } else {
        // Handle bar chart: assign a single color for the whole dataset
        backgroundColor =
          colorMapping[item.backgroundColor as ColorKeys] ||
          item.backgroundColor;
      }

      return {
        ...item,
        backgroundColor, // Pie: array of colors, Bar: single color
      };
    });
  }, [data_obj, type, colorMapping]);

  // let data_completed = useMemo(() => {
  //   let color_chart = data_obj?.map((item) => {
  //     switch (item.backgroundColor) {
  //       case "white":
  //         return { ...item, backgroundColor: "#ffffff" };
  //       case "black":
  //         return { ...item, backgroundColor: "#000000" };
  //       case "error":
  //         return { ...item, backgroundColor: "#FF0000" };
  //       case "info":
  //         return { ...item, backgroundColor: "#0D6DF2" };
  //       case "paper":
  //         return { ...item, backgroundColor: "#C6C6C6" };
  //       case "primary":
  //         return { ...item, backgroundColor: "#4E46B4" };
  //       case "secondary":
  //         return { ...item, backgroundColor: "#9747FF" };
  //       case "secondary-light":
  //         return { ...item, backgroundColor: "#E1CAFF" };
  //       case "success":
  //         return { ...item, backgroundColor: "#07A570" };
  //       case "warning":
  //         return { ...item, backgroundColor: "#C68F00" };
  //       default:
  //         return item;
  //     }
  //   });
  //   return color_chart;
  // }, [data_obj]);

  // Data for the chart
  const data = { datasets: data_completed, labels };

  // Determine which chart type to render
  let chart_type = useMemo(() => {
    switch (type) {
      case "bar":
        return <Bar options={options as any} data={data as any} />;
      case "pie":
        return <Pie options={options as any} data={data as any} />;
      default:
        return null; // Handle unsupported chart types
    }
  }, [type, data, options]);

  return (
    <Card className="w-full">
      <p className="mb-[8px] text-[14px] font-medium text-typography-main">
        {title}
      </p>
      <Card
        color={"paper"}
        variant={"outline"}
        className="bg-opacity-80 px-[32px] py-[24px]"
      >
        {chart_type}
      </Card>
    </Card>
  );
};

export default Chart;
