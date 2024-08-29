import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Grid,
} from "@mui/material";
import { People, Group, ArrowBack, ArrowForward } from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useFrappeGetDocCount } from "frappe-react-sdk";
import dayjs from "dayjs";
import { BarChart } from "@mui/x-charts/BarChart";

const Dashboard = () => {
  const [activeButton, setActiveButton] = React.useState("Day");
  const [startDate, setStartDate] = React.useState(
    dayjs().startOf("day").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = React.useState(dayjs().format("YYYY-MM-DD"));
  const [activeAssignment, setActiveAssignment] = React.useState("Assignment");
  const [clickedValue, setClickedValue] = useState(null);
  const [activeValue, setActiveValue] = React.useState(null);

  const handleRoleClick = (value: any) => {
    setClickedValue(value);
    setActiveValue(value);
  };
  //---------------------------Role Fetcher------------------------
  const [data1, setData1] = useState({ message: { values: [] } });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fields = encodeURIComponent(
          JSON.stringify(["`tabUser`.`full_name`"])
        );
        const filters = encodeURIComponent(
          JSON.stringify([["Has Role", "role", "=", "HR User"]])
        );
        const order_by = encodeURIComponent("`tabUser`.`modified` DESC");
        const group_by = encodeURIComponent("`tabUser`.`name`");

        const response = await fetch(
          `/api/method/frappe.desk.reportview.get?doctype=User&fields=${fields}&filters=${filters}&order_by=${order_by}&start=0&page_length=20&view=List&group_by=${group_by}&with_comment_count=true`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const jsonData = await response.json();
        setData1(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const values = data1.message.values.flat();
  console.log("values", values);
  //--------------------------------------API End--------------------------------

  const [chartData, setChartData] = React.useState([]);

  const updateDateRange = (period: any) => {
    const today = dayjs();
    switch (period) {
      case "Day":
        setStartDate(today.startOf("day").format("YYYY-MM-DD"));
        setEndDate(today.endOf("day").format("YYYY-MM-DD"));
        break;
      case "Week":
        setStartDate(today.startOf("week").format("YYYY-MM-DD"));
        setEndDate(today.endOf("week").format("YYYY-MM-DD"));
        break;
      case "Month":
        setStartDate(today.startOf("month").format("YYYY-MM-DD"));
        setEndDate(today.endOf("month").format("YYYY-MM-DD"));
        break;
      case "Year":
        setStartDate(today.startOf("year").format("YYYY-MM-DD"));
        setEndDate(today.endOf("year").format("YYYY-MM-DD"));
        break;
      default:
        break;
    }
  };

  React.useEffect(() => {
    updateDateRange(activeButton);
  }, [activeButton]);

  React.useEffect(() => {
    generateChartData(startDate, endDate);
  }, [startDate, endDate]);
  //---------------Line Chart API----------------------------------------
  const { data: employeeCount } = useFrappeGetDocCount("Employee", []);
  const { data: onboardingCount } = useFrappeGetDocCount("Employee", [
    ["date_of_joining", ">=", startDate],
    ["date_of_joining", "<=", endDate],
  ]);
  const { data: deboardingCount } = useFrappeGetDocCount("Employee", [
    ["status", "!=", "Active"],
    ["date_of_joining", ">=", startDate],
    ["date_of_joining", "<=", endDate],
  ]);

  //-------------Line Chart End-----------------------------------------

  //-----------Bar Chart API---------------------------------
  const { data: PendingOnboarding } = useFrappeGetDocCount("Employee", [
    ["date_of_joining", ">=", startDate],
    ["date_of_joining", "<=", endDate],
    ["assign_to", "=", clickedValue],
    ["status_hr", "=", "Pending Onboarding"],
  ]);
  const { data: PendingDeboarding } = useFrappeGetDocCount("Employee", [
    ["status", "!=", "Active"],
    ["date_of_joining", ">=", startDate],
    ["date_of_joining", "<=", endDate],
    ["assign_to", "=", clickedValue],
    ["status_hr", "=", "Pending Deboarding"],
  ]);

  const { data: OnboardingCompleted } = useFrappeGetDocCount("Employee", [
    ["date_of_joining", ">=", startDate],
    ["date_of_joining", "<=", endDate],
    ["assign_to", "=", clickedValue],
    ["status_hr", "=", "Completed Onboarding"],
  ]);
  const { data: DeboardingCompleted } = useFrappeGetDocCount("Employee", [
    ["date_of_joining", ">=", startDate],
    ["date_of_joining", "<=", endDate],
    ["assign_to", "=", clickedValue],
    ["status_hr", "=", "Completed Deboarding"],
  ]);
  console.log("DeboardingCompleted", DeboardingCompleted);
  console.log("clickedValue", clickedValue);

  //-----------Bar Chart End---------------------------------

  function generateChartData(sDate, eDate) {
    const start = dayjs(sDate);
    const end = dayjs(eDate);
    const data = [];
    let currentDate = start;

    while (currentDate <= end) {
      const dateKey = currentDate.format("YYYY-MM-DD");

      data.push({
        name: dateKey,
        Onboarding: 0, // Use the actual count for each day
        Deboarding: 0, // Use the actual count for each day
      });
      currentDate = currentDate.add(1, "day"); // Increment by day
    }

    setChartData(data);
  }

  const handleDateChange = (direction) => {
    const newStartDate = dayjs(startDate)
      .add(direction, activeButton.toLowerCase())
      .format("YYYY-MM-DD");
    const newEndDate = dayjs(endDate)
      .add(direction, activeButton.toLowerCase())
      .format("YYYY-MM-DD");
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    // generateChartData(newStartDate,newEndDate);
  };

  return (
    <Box
      sx={{
        padding: 3,
        backgroundColor: "#E8F5E9",
        minHeight: "fit-content",
        boxShadow:
          "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
        borderRadius: "20px",
      }}
    >
      {chartData.map((e, i) => (
        <Dummy e={e} i={i} setChartData={setChartData} />
      ))}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
          backgroundColor: "white",
          padding: "15px",
          borderRadius: "20px",
          boxShadow:
            "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant={
              activeAssignment === "Assignment" ? "contained" : "outlined"
            }
            onClick={() => setActiveAssignment("Assignment")}
            sx={{
              "&.MuiButton-contained": {
                backgroundColor: "#5C8A58",
                borderRadius: "20px",
              },
              "&.MuiButton-outlined": {
                borderColor: "#5C8A58",
                color: "#5C8A58",
                borderRadius: "20px",
              },
              "&.MuiButton-contained:hover": {
                backgroundColor: "#4CAF50",
                borderRadius: "20px",
              },
            }}
          >
            Assignment
          </Button>
          <Button
            variant={
              activeAssignment === "Assigned Work" ? "contained" : "outlined"
            }
            onClick={() => setActiveAssignment("Assigned Work")}
            sx={{
              "&.MuiButton-contained": {
                backgroundColor: "#5C8A58",
                borderRadius: "20px",
              },
              "&.MuiButton-outlined": {
                borderColor: "#5C8A58",
                color: "#5C8A58",
                borderRadius: "20px",
              },
              "&.MuiButton-contained:hover": {
                backgroundColor: "#4CAF50",
                borderRadius: "20px",
              },
            }}
          >
            Assigned Work
          </Button>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          {["Day", "Week", "Month", "Year"].map((period) => (
            <Button
              key={period}
              variant={activeButton === period ? "contained" : "outlined"}
              onClick={() => {
                setActiveButton(period);
                updateDateRange(period);
              }}
              sx={{
                "&.MuiButton-contained": {
                  backgroundColor: "#5C8A58",
                  borderRadius: "20px",
                },
                "&.MuiButton-outlined": {
                  borderColor: "#5C8A58",
                  color: "#5C8A58",
                  borderRadius: "20px",
                },
                "&.MuiButton-contained:hover": {
                  backgroundColor: "#4CAF50",
                  borderRadius: "20px",
                },
              }}
            >
              {period}
            </Button>
          ))}
        </Box>
      </Box>
      {activeAssignment === "Assigned Work" && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
          {values.map((value, index) => (
            <Card
              key={index}
              sx={{
                backgroundColor: value === activeValue ? "#5C8A58" : "white",
                borderRadius: "20px",
                cursor: "pointer",
                padding: 2,
                minWidth: 200,
                textAlign: "center",
                "&:hover": {
                  backgroundColor:
                    value === activeValue ? "#4CAF50" : "#f0f0f0",
                },
                color: value === activeValue ? "white" : "black",
                boxShadow:
                  "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
              }}
              onClick={() => handleRoleClick(value)}
            >
              <Typography variant="body1">{value}</Typography>
            </Card>
          ))}
        </Box>
      )}

      {activeAssignment !== "Assigned Work" && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: "20px" }}>
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="div">
                    {employeeCount || 0}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{ fontWeight: "bold" }}
                  >
                    Total No. of Employees
                  </Typography>
                </Box>
                <IconButton
                  sx={{
                    backgroundColor: "#5C8A58",
                    color: "white",
                    width: 40,
                    height: 40,
                  }}
                >
                  <People />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: "20px" }}>
              <CardContent sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="div">
                    {onboardingCount || 0}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{ fontWeight: "bold" }}
                  >
                    Onboarded
                  </Typography>
                </Box>
                <IconButton
                  sx={{
                    backgroundColor: "#5C8A58",
                    color: "white",
                    width: 40,
                    height: 40,
                  }}
                >
                  <Group />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: "20px" }}>
              <CardContent sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="div">
                    {deboardingCount || 0}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{ fontWeight: "bold" }}
                  >
                    Deboarded
                  </Typography>
                </Box>
                <IconButton
                  sx={{
                    backgroundColor: "#5C8A58",
                    color: "white",
                    width: 40,
                    height: 40,
                  }}
                >
                  <Group />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 3,
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "10px 20px",
          boxShadow:
            "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
        }}
      >
        <IconButton onClick={() => handleDateChange(-1)} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, textAlign: "center", fontWeight: "bold" }}
        >
          {dayjs(startDate).format("MMM DD, YYYY")} -{" "}
          {dayjs(endDate).format("MMM DD, YYYY")}
        </Typography>
        <IconButton onClick={() => handleDateChange(1)} sx={{ ml: 2 }}>
          <ArrowForward />
        </IconButton>
      </Box>
      {activeAssignment !== "Assigned Work" && (
        <Card
          sx={{
            borderRadius: "20px",
            boxShadow:
              "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
          }}
        >
          <CardContent>
            {/* <Typography variant="h6" component="div" sx={{ mb: 2 }}>
 Onboarding and Deboarding Trends
 </Typography> */}
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tickFormatter={(tick) =>
                    dayjs(tick).format(
                      activeButton === "Day" ? "MMM DD" : "MMM DD, YYYY"
                    )
                  }
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="linear"
                  dataKey="Onboarding"
                  stroke="#D500F9"
                  strokeWidth={2}
                  dot={{ r: 6 }}
                />
                <Line
                  type="linear"
                  dataKey="Deboarding"
                  stroke="#F0F334"
                  strokeWidth={2}
                  dot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
      {activeAssignment === "Assigned Work" && (
        <Card
          sx={{
            borderRadius: "20px",
            boxShadow:
              "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
          }}
        >
          <CardContent>
            <ResponsiveContainer width="100%" height={450}>
              <BarChart
                xAxis={[
                  {
                    scaleType: "band",
                    data: [
                      "Pending-Onboarding",
                      "Pending-Deboarding",
                      "Onboarding Completed",
                      "Deboarding Completed",
                    ],
                  },
                ]}
                series={[
                  {
                    data: [
                      PendingOnboarding || 0,
                      PendingDeboarding || 0,
                      OnboardingCompleted || 0,
                      DeboardingCompleted || 0,
                    ],
                  },
                ]}
                // width={1500}
                // height={300}
                borderRadius={20}
              />
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

const Dummy = (props: any) => {
  const { data: onBoard } = useFrappeGetDocCount("Employee", [
    ["date_of_joining", "=", props.e.name],
  ]);
  const { data: deBoard } = useFrappeGetDocCount("Employee", [
    ["status", "!=", "Active"],
    ["date_of_joining", "=", props.e.name],
  ]);
  useEffect(
    () =>
      props.setChartData((pre) => {
        pre[props.i]["Onboarding"] = onBoard;
        pre[props.i]["Deboarding"] = deBoard;
        return [...pre];
      }),
    [onBoard, deBoard]
  );
  return <div style={{ display: "none" }}></div>;
};
export default Dashboard;
