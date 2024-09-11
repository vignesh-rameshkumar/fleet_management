// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Typography,
//   IconButton,
//   Grid,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel,
// } from "@mui/material";
// import { BiSolidLeftArrowCircle } from "react-icons/bi";
// import { BiSolidRightArrowCircle } from "react-icons/bi";

// import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
// import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
// import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
// import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
// import { People, Group, ArrowBack, ArrowForward } from "@mui/icons-material";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import { useFrappeGetDocCount, useFrappeGetDocList } from "frappe-react-sdk";
// import dayjs from "dayjs";
// import { BarChart } from "@mui/x-charts/BarChart";

// const Dashboard = () => {
//   const [activeButton, setActiveButton] = React.useState("Day");
//   const [startDate, setStartDate] = React.useState(
//     dayjs().startOf("day").format("YYYY-MM-DD")
//   );
//   const [endDate, setEndDate] = React.useState(dayjs().format("YYYY-MM-DD"));
//   const [activeAssignment, setActiveAssignment] =
//     React.useState("FM_Request_Master");
//   const [clickedValue, setClickedValue] = useState(null);
//   const [activeValue, setActiveValue] = React.useState(null);

//   const handleRoleClick = (value: any) => {
//     setClickedValue(value);
//     setActiveValue(value);
//   };
//   //---------------------------Role Fetcher------------------------
//   const [data1, setData1] = useState({ message: { values: [] } });

//   const [chartData, setChartData] = React.useState([]);

//   const updateDateRange = (period: any) => {
//     const today = dayjs();
//     switch (period) {
//       case "Day":
//         setStartDate(today.startOf("day").format("YYYY-MM-DD"));
//         setEndDate(today.endOf("day").format("YYYY-MM-DD"));
//         break;
//       case "Week":
//         setStartDate(today.startOf("week").format("YYYY-MM-DD"));
//         setEndDate(today.endOf("week").format("YYYY-MM-DD"));
//         break;
//       case "Month":
//         setStartDate(today.startOf("month").format("YYYY-MM-DD"));
//         setEndDate(today.endOf("month").format("YYYY-MM-DD"));
//         break;
//       case "Year":
//         setStartDate(today.startOf("year").format("YYYY-MM-DD"));
//         setEndDate(today.endOf("year").format("YYYY-MM-DD"));
//         break;
//       default:
//         break;
//     }
//   };

//   React.useEffect(() => {
//     updateDateRange(activeButton);
//   }, [activeButton]);

//   React.useEffect(() => {
//     generateChartData(startDate, endDate);
//   }, [startDate, endDate]);

//   // Card All Request

//   const { data: allRequestCount } = useFrappeGetDocCount(activeAssignment, [
//     // ["DATE_FORMAT(request_date_time, '%Y-%m-%d')", ">=", startDate],
//     // ["DATE_FORMAT(request_date_time, '%Y-%m-%d')", "<=", endDate],
//   ]);

//   const { data: allApprovedCount } = useFrappeGetDocCount(activeAssignment, [
//     ["status", "IN", ["Project Lead Approved", "Approved"]],
//   ]);
//   const { data: allRejectedCount } = useFrappeGetDocCount(activeAssignment, [
//     ["status", "IN", ["Project Lead Rejected", "Rejected", "Cancelled"]],
//   ]);

//   const { data: allPendingCount } = useFrappeGetDocCount(activeAssignment, [
//     ["status", "=", "Pending"],
//   ]);

//   //-------------Line Chart -----------------------------------------
//   useEffect(() => {
//     if (
//       allRequestCount !== undefined &&
//       allApprovedCount !== undefined &&
//       allRejectedCount !== undefined &&
//       allPendingCount !== undefined
//     ) {
//       const data = [
//         {
//           name: startDate,
//           All_Requests: allRequestCount,
//           Approved_Request: allApprovedCount,
//           Rejected_Request: allRejectedCount,
//           Pending_Request: allPendingCount,
//         },
//       ];
//       setChartData(data);
//     }
//   }, [
//     allRequestCount,
//     allApprovedCount,
//     allRejectedCount,
//     allPendingCount,
//     startDate,
//   ]);

//   function generateChartData(sDate: any, eDate: any) {
//     const start = dayjs(sDate);
//     const end = dayjs(eDate);
//     const data = [];
//     let currentDate = start;

//     while (currentDate <= end) {
//       const dateKey = currentDate.format("YYYY-MM-DD");
//       data.push({
//         name: dateKey,
//         All_Requests: 0,
//         Approved_Request: 0,
//         Rejected_Request: 0,
//         Pending_Request: 0,
//       });
//       currentDate = currentDate.add(1, "day");
//     }

//     setChartData(data);
//   }
//   console.log("Chart Data:", chartData);

//   //-----------Bar Chart API---------------------------------
//   const { data: PendingOnboarding } = useFrappeGetDocCount("Employee", [
//     ["date_of_joining", ">=", startDate],
//     ["date_of_joining", "<=", endDate],
//     ["assign_to", "=", clickedValue],
//     ["status_hr", "=", "Pending Onboarding"],
//   ]);
//   const { data: PendingDeboarding } = useFrappeGetDocCount("Employee", [
//     ["status", "!=", "Active"],
//     ["date_of_joining", ">=", startDate],
//     ["date_of_joining", "<=", endDate],
//     ["assign_to", "=", clickedValue],
//     ["status_hr", "=", "Pending Deboarding"],
//   ]);

//   const { data: OnboardingCompleted } = useFrappeGetDocCount("Employee", [
//     ["date_of_joining", ">=", startDate],
//     ["date_of_joining", "<=", endDate],
//     ["assign_to", "=", clickedValue],
//     ["status_hr", "=", "Completed Onboarding"],
//   ]);
//   const { data: DeboardingCompleted } = useFrappeGetDocCount("Employee", [
//     ["date_of_joining", ">=", startDate],
//     ["date_of_joining", "<=", endDate],
//     ["assign_to", "=", clickedValue],
//     ["status_hr", "=", "Completed Deboarding"],
//   ]);

//   const handleDateChange = (direction) => {
//     const newStartDate = dayjs(startDate)
//       .add(direction, activeButton.toLowerCase())
//       .format("YYYY-MM-DD");
//     const newEndDate = dayjs(endDate)
//       .add(direction, activeButton.toLowerCase())
//       .format("YYYY-MM-DD");
//     setStartDate(newStartDate);
//     setEndDate(newEndDate);
//   };

//   const cardData = [
//     {
//       title: "All Requests",
//       count: allRequestCount,
//       color: "#6D57FA",
//       icon: (
//         <DescriptionOutlinedIcon sx={{ color: "#6D57FA", fontSize: "30px" }} />
//       ),
//     },
//     {
//       title: "Approved Request",
//       count: allApprovedCount,
//       color: "#5C8A58",
//       icon: (
//         <CheckCircleOutlineIcon sx={{ color: "#5C8A58", fontSize: "30px" }} />
//       ),
//     },
//     {
//       title: "Rejected Request",
//       count: allRejectedCount,
//       color: "#BA3B34",
//       icon: <CancelOutlinedIcon sx={{ color: "#BA3B34", fontSize: "30px" }} />,
//     },
//     {
//       title: "Pending Request",
//       count: allPendingCount,
//       color: "#FFCC00",
//       icon: (
//         <HourglassEmptyOutlinedIcon
//           sx={{ color: "#FFCC00", fontSize: "30px" }}
//         />
//       ),
//     },
//   ];
//   return (
//     <Box
//       sx={{
//         padding: 3,
//         backgroundColor: "#FFF",
//         minHeight: "fit-content",
//       }}
//     >
//       {chartData?.map((e, i) => (
//         <Dummy e={e} i={i} setChartData={setChartData} />
//       ))}

//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           mb: 3,
//           backgroundColor: "white",
//           padding: "5px",
//           borderRadius: "5px",
//           boxShadow:
//             "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
//         }}
//       >
//         <Box sx={{ display: "flex", gap: 1 }}>
//           <Box>
//             <FormControl
//               variant="outlined"
//               sx={{ width: { xs: "100%", sm: "100%", md: "90%" } }}
//             >
//               <Select
//                 sx={{
//                   width: "150px",
//                   textTransform: "capitalize",
//                   "& .MuiSelect-select": {
//                     backgroundColor:
//                       activeAssignment === "FM_Request_Master"
//                         ? "#5C8A58"
//                         : "transparent",
//                     color:
//                       activeAssignment === "FM_Request_Master"
//                         ? "#fff"
//                         : "#5C8A58",
//                     borderRadius: "5px",
//                   },
//                   "& .MuiSelect-select:hover": {
//                     backgroundColor:
//                       activeAssignment === "FM_Request_Master"
//                         ? "#4CAF50"
//                         : "transparent",
//                   },
//                   "& .MuiOutlinedInput-notchedOutline": {
//                     borderColor:
//                       activeAssignment === "FM_Request_Master"
//                         ? "#5C8A58"
//                         : "#ccc",
//                   },
//                   "& .MuiSelect-select.MuiSelect-select": {
//                     borderRadius: "5px",
//                   },
//                 }}
//                 value={activeAssignment}
//                 onChange={(e) => setActiveAssignment(e.target.value)}
//               >
//                 <MenuItem value="FM_Request_Master">All Request</MenuItem>
//                 <MenuItem value="FM_Passenger_Vehicle_Request">
//                   Passenger
//                 </MenuItem>
//                 <MenuItem value="FM_Goods_Vehicle_Request">Good</MenuItem>
//                 <MenuItem value="FM_Equipment_Vehicle_Request">
//                   Equipment
//                 </MenuItem>
//                 <MenuItem value="FM_Group_Vehicle_Request">Group Ride</MenuItem>
//               </Select>
//             </FormControl>
//           </Box>

//           <Button
//             variant={
//               activeAssignment === "Assigned Work" ? "contained" : "outlined"
//             }
//             // onClick={() => setActiveAssignment("Assigned Work")}
//             sx={{
//               textTransform: "capitalize",

//               "&.MuiButton-contained": {
//                 backgroundColor: "#5C8A58",
//                 borderRadius: "5px",
//               },
//               "&.MuiButton-outlined": {
//                 borderColor: "#5C8A58",
//                 color: "#5C8A58",
//                 borderRadius: "5px",
//               },
//               "&.MuiButton-contained:hover": {
//                 backgroundColor: "#4CAF50",
//                 borderRadius: "5px",
//               },
//             }}
//           >
//             Fleet Logs
//           </Button>
//           <Button
//             variant={
//               activeAssignment === "Assigned Work" ? "contained" : "outlined"
//             }
//             // onClick={() => setActiveAssignment("Assigned Work")}
//             sx={{
//               textTransform: "capitalize",

//               "&.MuiButton-contained": {
//                 backgroundColor: "#5C8A58",
//                 borderRadius: "5px",
//               },
//               "&.MuiButton-outlined": {
//                 borderColor: "#5C8A58",
//                 color: "#5C8A58",
//                 borderRadius: "5px",
//               },
//               "&.MuiButton-contained:hover": {
//                 backgroundColor: "#4CAF50",
//                 borderRadius: "5px",
//               },
//             }}
//           >
//             Coins
//           </Button>
//         </Box>

//         <>
//           <Box>
//             <IconButton onClick={() => handleDateChange(-1)} sx={{ mr: 2 }}>
//               <BiSolidLeftArrowCircle color="#5C8A58" />
//             </IconButton>
//             <span>
//               {dayjs(startDate).format("MMM DD, YYYY")} -{" "}
//               {dayjs(endDate).format("MMM DD, YYYY")}
//             </span>
//             <IconButton onClick={() => handleDateChange(1)} sx={{ ml: 2 }}>
//               <BiSolidRightArrowCircle color="#5C8A58" />
//             </IconButton>
//           </Box>
//         </>
//         <Box sx={{ display: "flex", gap: 1 }}>
//           {["Day", "Week", "Month", "Year"].map((period) => (
//             <Button
//               key={period}
//               variant={activeButton === period ? "contained" : "outlined"}
//               onClick={() => {
//                 setActiveButton(period);
//                 updateDateRange(period);
//               }}
//               sx={{
//                 textTransform: "capitalize",
//                 fontSize: "14px",
//                 fontWeight: 500,
//                 "&.MuiButton-contained": {
//                   backgroundColor: "#5C8A58",
//                   borderRadius: "5px",
//                 },
//                 "&.MuiButton-outlined": {
//                   borderColor: "#5C8A58",
//                   color: "#5C8A58",
//                   borderRadius: "5px",
//                 },
//                 "&.MuiButton-contained:hover": {
//                   backgroundColor: "#4CAF50",
//                   borderRadius: "5px",
//                 },
//               }}
//             >
//               {period}
//             </Button>
//           ))}
//         </Box>
//       </Box>
//       {activeAssignment === "Assigned Work" && (
//         <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
//           {values.map((value, index) => (
//             <Card
//               key={index}
//               sx={{
//                 backgroundColor: value === activeValue ? "#5C8A58" : "white",

//                 cursor: "pointer",
//                 padding: 2,
//                 minWidth: 200,
//                 textAlign: "center",
//                 "&:hover": {
//                   backgroundColor:
//                     value === activeValue ? "#4CAF50" : "#f0f0f0",
//                 },
//                 color: value === activeValue ? "white" : "black",
//                 borderRadius: "5px",
//               }}
//               onClick={() => handleRoleClick(value)}
//             >
//               <Typography variant="body1">{value}</Typography>
//             </Card>
//           ))}
//         </Box>
//       )}

//       {/* Third row: Cards */}
//       <Grid container spacing={2} sx={{ borderRadius: "10px" }}>
//         {cardData.map((data, index) => (
//           <Grid item xs={12} sm={6} md={3} key={index}>
//             <Box
//               sx={{
//                 borderLeft: `6px solid ${data.color}`,
//                 backgroundColor: "#f9f9f9",
//                 borderRadius: "5px",
//                 padding: "2px 10px",
//                 boxShadow:
//                   "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
//               }}
//             >
//               <CardContent>
//                 <div style={{ color: "#5B5B5B", fontWeight: "500" }}>
//                   {data.title}
//                 </div>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     fontSize: "20px",
//                     fontWeight: 600,
//                   }}
//                 >
//                   {data.count} {data.icon}
//                 </Box>
//               </CardContent>
//             </Box>
//           </Grid>
//         ))}
//       </Grid>
//       <br />

//       {activeAssignment !== "Assigned Work" && (
//         <Card
//           sx={{
//             borderRadius: "5px",
//             boxShadow:
//               "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
//           }}
//         >
//           <CardContent>
//             <ResponsiveContainer width="100%" height={400}>
//               <LineChart
//                 data={chartData}
//                 margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis
//                   dataKey="name"
//                   tickFormatter={(tick) =>
//                     dayjs(tick).format(
//                       activeButton === "Day" ? "MMM DD" : "MMM DD, YYYY"
//                     )
//                   }
//                 />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Line
//                   type="linear"
//                   dataKey="All_Requests"
//                   stroke="#6D57FA"
//                   strokeWidth={2}
//                   dot={{ r: 6 }}
//                 />
//                 <Line
//                   type="linear"
//                   dataKey="Approved_Request"
//                   stroke="#5C8A58"
//                   strokeWidth={2}
//                   dot={{ r: 6 }}
//                 />
//                 <Line
//                   type="linear"
//                   dataKey="Rejected_Request"
//                   stroke="#BA3B34"
//                   strokeWidth={2}
//                   dot={{ r: 6 }}
//                 />
//                 <Line
//                   type="linear"
//                   dataKey="Pending_Request"
//                   stroke="#FFCC00"
//                   strokeWidth={2}
//                   dot={{ r: 6 }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//       )}

//       {activeAssignment === "Assigned Work" && (
//         <Card
//           sx={{
//             borderRadius: "5px",
//             boxShadow:
//               "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
//           }}
//         >
//           <CardContent>
//             <ResponsiveContainer width="100%" height={450}>
//               <BarChart
//                 xAxis={[
//                   {
//                     scaleType: "band",
//                     data: [
//                       "Pending-Onboarding",
//                       "Pending-Deboarding",
//                       "Onboarding Completed",
//                       "Deboarding Completed",
//                     ],
//                   },
//                 ]}
//                 series={[
//                   {
//                     data: [
//                       PendingOnboarding || 0,
//                       PendingDeboarding || 0,
//                       OnboardingCompleted || 0,
//                       DeboardingCompleted || 0,
//                     ],
//                   },
//                 ]}
//                 // width={1500}
//                 // height={300}
//                 borderRadius={5}
//               />
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//       )}
//     </Box>
//   );
// };

// const Dummy = (props: any) => {
//   const { data: onBoard } = useFrappeGetDocCount("Employee", [
//     ["date_of_joining", "=", props.e.name],
//   ]);
//   const { data: deBoard } = useFrappeGetDocCount("Employee", [
//     ["status", "!=", "Active"],
//     ["date_of_joining", "=", props.e.name],
//   ]);
//   useEffect(
//     () =>
//       props.setChartData((pre) => {
//         pre[props.i]["Onboarding"] = onBoard;
//         pre[props.i]["Deboarding"] = deBoard;
//         return [...pre];
//       }),
//     [onBoard, deBoard]
//   );
//   return <div style={{ display: "none" }}></div>;
// };
// export default Dashboard;

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { BiSolidLeftArrowCircle } from "react-icons/bi";
import { BiSolidRightArrowCircle } from "react-icons/bi";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
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
import {
  useFrappeGetCall,
  useFrappeGetDocCount,
  useFrappeGetDocList,
} from "frappe-react-sdk";
import dayjs from "dayjs";

import { Container } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart"; // Import MUI charts

const Dashboard = () => {
  const [activeButton, setActiveButton] = React.useState("Day");
  const [startDate, setStartDate] = React.useState(
    dayjs().startOf("day").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = React.useState(dayjs().format("YYYY-MM-DD"));
  const [activeAssignment, setActiveAssignment] = React.useState(
    "FM_Passenger_Vehicle_Request"
  );
  const [clickedValue, setClickedValue] = useState(null);
  const [activeValue, setActiveValue] = React.useState(null);

  const handleRoleClick = (value: any) => {
    setClickedValue(value);
    setActiveValue(value);
  };
  //---------------------------Role Fetcher------------------------

  const [chartData, setChartData] = React.useState([]);
  const [barChartVisible, setBarChartVisible] = React.useState(false);
  const [lineChartVisible, setLineChartVisible] = React.useState(true);

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
  }, [activeButton, activeAssignment]);

  React.useEffect(() => {
    generateChartData(startDate, endDate);
  }, [startDate, endDate, activeAssignment]);

  // Card All Request

  const { data: allRequestCount } = useFrappeGetDocCount(activeAssignment, [
    ["creation", ">=", `${startDate} 00:00:00`],
    ["creation", "<=", `${endDate} 23:59:59`],
  ]);

  const { data: allApprovedCount } = useFrappeGetDocCount(activeAssignment, [
    ["status", "IN", ["Project Lead Approved", "Approved"]],
    ["creation", ">=", `${startDate} 00:00:00`],
    ["creation", "<=", `${endDate} 23:59:59`],
  ]);
  const { data: allRejectedCount } = useFrappeGetDocCount(activeAssignment, [
    ["status", "IN", ["Project Lead Rejected", "Rejected", "Cancelled"]],
    ["creation", ">=", `${startDate} 00:00:00`],
    ["creation", "<=", `${endDate} 23:59:59`],
  ]);

  const { data: allPendingCount } = useFrappeGetDocCount(activeAssignment, [
    ["status", "=", "Pending"],
    ["creation", ">=", `${startDate} 00:00:00`],
    ["creation", "<=", `${endDate} 23:59:59`],
  ]);

  //-------------Line Chart -----------------------------------------
  useEffect(() => {
    if (
      allRequestCount !== undefined &&
      allApprovedCount !== undefined &&
      allRejectedCount !== undefined &&
      allPendingCount !== undefined
    ) {
      const data = [
        {
          name: startDate,
          All_Requests: allRequestCount,
          Approved_Request: allApprovedCount,
          Rejected_Request: allRejectedCount,
          Pending_Request: allPendingCount,
        },
      ];
      setChartData(data);
    }
  }, [
    allRequestCount,
    allApprovedCount,
    allRejectedCount,
    allPendingCount,
    startDate,
  ]);

  function generateChartData(sDate: any, eDate: any) {
    const start = dayjs(sDate);
    const end = dayjs(eDate);
    const data = [];
    let currentDate = start;

    while (currentDate <= end) {
      const dateKey = currentDate.format("YYYY-MM-DD");
      data.push({
        date: dateKey,
        All_Requests: 0,
        Approved_Request: 0,
        Rejected_Request: 0,
        Pending_Request: 0,
      });
      currentDate = currentDate.add(1, "day");
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
  };

  const cardData = [
    {
      title: "All Requests",
      count: allRequestCount,
      color: "#6D57FA",
      icon: (
        <DescriptionOutlinedIcon sx={{ color: "#6D57FA", fontSize: "30px" }} />
      ),
    },
    {
      title: "Approved Request",
      count: allApprovedCount,
      color: "#5C8A58",
      icon: (
        <CheckCircleOutlineIcon sx={{ color: "#5C8A58", fontSize: "30px" }} />
      ),
    },
    {
      title: "Rejected Request",
      count: allRejectedCount,
      color: "#BA3B34",
      icon: <CancelOutlinedIcon sx={{ color: "#BA3B34", fontSize: "30px" }} />,
    },
    {
      title: "Pending Request",
      count: allPendingCount,
      color: "#FFCC00",
      icon: (
        <HourglassEmptyOutlinedIcon
          sx={{ color: "#FFCC00", fontSize: "30px" }}
        />
      ),
    },
  ];

  // Fetch data using Frappe API hook

  const { data: DashboardFleet } = useFrappeGetCall(
    "fleet_management.custom_function.get_daily_counts",
    {
      doctype: activeAssignment,
      start_date: startDate, // use snake_case for the parameter names
      end_date: endDate,
    }
  );
  console.log("Raw DashboardFleet Data:", DashboardFleet);
  if (!DashboardFleet || !DashboardFleet.message) {
    return <div>Loading...</div>;
  }

  const transformedData = Object.entries(DashboardFleet.message)?.map(
    ([date, counts]) => ({
      name: date,
      Approved: counts.Approved,
      Pending: counts.Pending,
      Rejected: counts.Rejected,
    })
  );

  //------------Bar Chart API and Const----------------
  const data = [
    {
      time: "08:00AM",
      odoMeter: 100,
      fuelLitres: 80,
      fuelAmount: 50,
      fineAmount: 30,
    },
    {
      time: "16:00PM",
      odoMeter: 150,
      fuelLitres: 120,
      fuelAmount: 100,
      fineAmount: 90,
    },
    {
      time: "24:00AM",
      odoMeter: 130,
      fuelLitres: 100,
      fuelAmount: 80,
      fineAmount: 60,
    },
  ];

  const barColors = ["#4caf50", "#ff5722", "#3f51b5", "#ffc107"];

  //------------Bar Chart API and Const End----------------

  return (
    <Box
      sx={{
        padding: 3,
        backgroundColor: "#FFF",
        minHeight: "fit-content",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
          backgroundColor: "white",
          padding: "5px",
          borderRadius: "5px",
          boxShadow:
            "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
        }}
      >
        <Box sx={{ display: "flex", gap: 1 }}>
          <Box>
            <FormControl
              variant="outlined"
              sx={{ width: { xs: "100%", sm: "100%", md: "90%" } }}
            >
              <Select
                sx={{
                  width: "150px",
                  textTransform: "capitalize",
                  "& .MuiSelect-select": {
                    backgroundColor:
                      activeAssignment === "FM_Request_Master"
                        ? "#5C8A58"
                        : "transparent",
                    color:
                      activeAssignment === "FM_Request_Master"
                        ? "#fff"
                        : "#5C8A58",
                    borderRadius: "5px",
                  },
                  "& .MuiSelect-select:hover": {
                    backgroundColor:
                      activeAssignment === "FM_Request_Master"
                        ? "#4CAF50"
                        : "transparent",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor:
                      activeAssignment === "FM_Request_Master"
                        ? "#5C8A58"
                        : "#ccc",
                  },
                  "& .MuiSelect-select.MuiSelect-select": {
                    borderRadius: "5px",
                  },
                }}
                value={activeAssignment}
                onChange={(e) => {
                  setActiveAssignment(e.target.value);
                  setBarChartVisible(false);
                  setLineChartVisible(true);
                }}
              >
                <MenuItem value="FM_Passenger_Vehicle_Request">
                  Passenger
                </MenuItem>
                <MenuItem value="FM_Goods_Vehicle_Request">Good</MenuItem>
                <MenuItem value="FM_Equipment_Vehicle_Request">
                  Equipment
                </MenuItem>
                <MenuItem value="FM_Group_Vehicle_Request">Group Ride</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Button
            variant={
              activeAssignment === "Assigned Work" ? "contained" : "outlined"
            }
            sx={{
              textTransform: "capitalize",

              "&.MuiButton-contained": {
                backgroundColor: "#5C8A58",
                borderRadius: "5px",
              },
              "&.MuiButton-outlined": {
                borderColor: "#5C8A58",
                color: "#5C8A58",
                borderRadius: "5px",
              },
              "&.MuiButton-contained:hover": {
                backgroundColor: "#4CAF50",
                borderRadius: "5px",
              },
            }}
            onClick={() => {
              setBarChartVisible(true);
              setLineChartVisible(false);
            }}
          >
            Fleet Logs
          </Button>
          <Button
            variant={
              activeAssignment === "Assigned Work" ? "contained" : "outlined"
            }
            // onClick={() => setActiveAssignment("Assigned Work")}
            sx={{
              textTransform: "capitalize",

              "&.MuiButton-contained": {
                backgroundColor: "#5C8A58",
                borderRadius: "5px",
              },
              "&.MuiButton-outlined": {
                borderColor: "#5C8A58",
                color: "#5C8A58",
                borderRadius: "5px",
              },
              "&.MuiButton-contained:hover": {
                backgroundColor: "#4CAF50",
                borderRadius: "5px",
              },
            }}
          >
            Coins
          </Button>
        </Box>

        <>
          <Box>
            <IconButton onClick={() => handleDateChange(-1)} sx={{ mr: 2 }}>
              <BiSolidLeftArrowCircle color="#5C8A58" />
            </IconButton>
            <span>
              {dayjs(startDate).format("MMM DD, YYYY")} -{" "}
              {dayjs(endDate).format("MMM DD, YYYY")}
            </span>
            <IconButton onClick={() => handleDateChange(1)} sx={{ ml: 2 }}>
              <BiSolidRightArrowCircle color="#5C8A58" />
            </IconButton>
          </Box>
        </>
        <Box sx={{ display: "flex", gap: 1 }}>
          {["Day", "Week", "Month", "Year"]?.map((period) => (
            <Button
              key={period}
              variant={activeButton === period ? "contained" : "outlined"}
              onClick={() => {
                setActiveButton(period);
                updateDateRange(period);
              }}
              sx={{
                textTransform: "capitalize",
                fontSize: "14px",
                fontWeight: 500,
                "&.MuiButton-contained": {
                  backgroundColor: "#5C8A58",
                  borderRadius: "5px",
                },
                "&.MuiButton-outlined": {
                  borderColor: "#5C8A58",
                  color: "#5C8A58",
                  borderRadius: "5px",
                },
                "&.MuiButton-contained:hover": {
                  backgroundColor: "#4CAF50",
                  borderRadius: "5px",
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
          {values?.map((value, index) => (
            <Card
              key={index}
              sx={{
                backgroundColor: value === activeValue ? "#5C8A58" : "white",

                cursor: "pointer",
                padding: 2,
                minWidth: 200,
                textAlign: "center",
                "&:hover": {
                  backgroundColor:
                    value === activeValue ? "#4CAF50" : "#f0f0f0",
                },
                color: value === activeValue ? "white" : "black",
                borderRadius: "5px",
              }}
              onClick={() => handleRoleClick(value)}
            >
              <Typography variant="body1">{value}</Typography>
            </Card>
          ))}
        </Box>
      )}

      {/* Third row: Cards */}
      {lineChartVisible && (
        <>
          <Grid container spacing={2} sx={{ borderRadius: "10px" }}>
            {cardData?.map((data, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box
                  sx={{
                    borderLeft: `6px solid ${data.color}`,
                    backgroundColor: "#f9f9f9",
                    borderRadius: "5px",
                    padding: "2px 10px",
                    boxShadow:
                      "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
                  }}
                >
                  <CardContent>
                    <div style={{ color: "#5B5B5B", fontWeight: "500" }}>
                      {data.title}
                    </div>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "20px",
                        fontWeight: 600,
                      }}
                    >
                      {data.count} {data.icon}
                    </Box>
                  </CardContent>
                </Box>
              </Grid>
            ))}
          </Grid>
          <br />
          <Card
            sx={{
              borderRadius: "5px",
              boxShadow:
                "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
            }}
          >
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={transformedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" /> {/* Use "name" for XAxis */}
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Approved" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="Pending" stroke="#8884d8" />
                  <Line type="monotone" dataKey="Rejected" stroke="#ff7300" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>{" "}
        </>
      )}

      {/* Bar Chart Tag*/}
      {barChartVisible && (
        <Container sx={{ marginTop: 4 }}>
          {/* Dropdown for Vehicle Selection */}
          <Select
            defaultValue=""
            sx={{
              marginBottom: "20px",
              width: "300px",
              backgroundColor: "white",
              boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
              borderRadius: "8px",
            }}
          >
            <MenuItem value="">Select Vehicle Number</MenuItem>
            <MenuItem value="Vehicle 1">Vehicle 1</MenuItem>
            <MenuItem value="Vehicle 2">Vehicle 2</MenuItem>
          </Select>

          {/* Grid Layout for Charts */}
          <Grid container spacing={3}>
            {/* First Chart: Odo Meter */}
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
                  borderRadius: "12px",
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    align="center"
                    sx={{ color: "green", marginBottom: "20px" }}
                  >
                    Odo Meter
                  </Typography>
                  <Box
                    height={250}
                    sx={{
                      backgroundColor: "#f4f6f8",
                      padding: "20px",
                      borderRadius: "12px",
                    }}
                  >
                    <BarChart
                      dataset={data}
                      xAxis={[{ dataKey: "time", scaleType: "band" }]}
                      series={[
                        {
                          dataKey: "odoMeter",
                          color: barColors[0],
                          animation: { easing: "ease-in-out", duration: 500 }, // Add animation for bar
                        },
                      ]}
                      width={400}
                      height={200}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Second Chart: Fuel in Litres */}
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
                  borderRadius: "12px",
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    align="center"
                    sx={{ color: "green", marginBottom: "20px" }}
                  >
                    Fuel in Litres
                  </Typography>
                  <Box
                    height={250}
                    sx={{
                      backgroundColor: "#f4f6f8",
                      padding: "20px",
                      borderRadius: "12px",
                    }}
                  >
                    <BarChart
                      dataset={data}
                      xAxis={[{ dataKey: "time", scaleType: "band" }]}
                      series={[
                        {
                          dataKey: "fuelLitres",
                          color: barColors[1],
                          animation: { easing: "ease-in-out", duration: 500 }, // Add animation for bar
                        },
                      ]}
                      width={400}
                      height={200}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Third Chart: Fuel Amount */}
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
                  borderRadius: "12px",
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    align="center"
                    sx={{ color: "green", marginBottom: "20px" }}
                  >
                    Fuel Amount
                  </Typography>
                  <Box
                    height={250}
                    sx={{
                      backgroundColor: "#f4f6f8",
                      padding: "20px",
                      borderRadius: "12px",
                    }}
                  >
                    <BarChart
                      dataset={data}
                      xAxis={[{ dataKey: "time", scaleType: "band" }]}
                      series={[
                        {
                          dataKey: "fuelAmount",
                          color: barColors[2],
                          animation: { easing: "ease-in-out", duration: 500 }, // Add animation for bar
                        },
                      ]}
                      width={400}
                      height={200}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Fourth Chart: Fine Amount */}
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
                  borderRadius: "12px",
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    align="center"
                    sx={{ color: "green", marginBottom: "20px" }}
                  >
                    Fine Amount
                  </Typography>
                  <Box
                    height={250}
                    sx={{
                      backgroundColor: "#f4f6f8",
                      padding: "20px",
                      borderRadius: "12px",
                    }}
                  >
                    <BarChart
                      dataset={data}
                      xAxis={[{ dataKey: "time", scaleType: "band" }]}
                      series={[
                        {
                          dataKey: "fineAmount",
                          color: barColors[3],
                          animation: { easing: "ease-in-out", duration: 500 }, // Add animation for bar
                        },
                      ]}
                      width={400}
                      height={200}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      )}
      {/* Bar Chart Tag End*/}
    </Box>
  );
};

export default Dashboard;
