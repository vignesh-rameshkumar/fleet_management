import React, { useState, useEffect } from "react";
import { CSmartTable } from "@coreui/react-pro";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Grid,
  FormControl,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  MenuItem,
} from "@mui/material";
import { useFrappeGetDocList, useFrappeUpdateDoc } from "frappe-react-sdk";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { borderRadius } from "@mui/system";
import { PiCoins } from "react-icons/pi";
import dayjs from "dayjs";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

interface CoinsDashBoardProps {
  darkMode: boolean;
  onCloseDrawer: () => void;
  userEmailId: string;
  employeeID: string;
  userName: string;
}

const CoinsDashBoard: React.FC<CoinsDashBoardProps> = ({
  darkMode,
  onCloseDrawer,
  userEmailId,
}) => {
  // State
  const [tableData, setTableData] = useState<any[]>([]);
  const [coinsData, setCoinsData] = useState<any[]>([]);
  const [calendarView, setCalendarView] = useState("day"); // Default to "day"
  const [selectedDay, setSelectedDay] = useState(dayjs().format("YYYY-MM-DD")); // Current date
  const [selectedWeek, setSelectedWeek] = useState({
    start: dayjs().startOf("week").format("YYYY-MM-DD"),
    end: dayjs().endOf("week").format("YYYY-MM-DD"),
  });
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("MMMM"));
  const [selectedYear, setSelectedYear] = useState(dayjs().year());

  // States for pagination
  const [currentPage, setCurrentPage] = useState(1); // Start from the first page
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page

  // handle change calendar
  // handle calendar
  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
  };

  const handleWeekChange = (start, end) => {
    setSelectedWeek({ start, end });
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const renderMonths = () => {
    return months.map((month) => (
      <MenuItem key={month} value={month}>
        {month}
      </MenuItem>
    ));
  };
  const renderYears = () => {
    const currentYear = dayjs().year();
    const startYear = 2000;
    const years = [];
    for (let year = startYear; year <= currentYear; year++) {
      years.push(year);
    }
    return years.map((year) => (
      <MenuItem key={year} value={year}>
        {year}
      </MenuItem>
    ));
  };
  const getFilter = () => {
    if (calendarView === "day") {
      const startOfDay = selectedDay + " 00:00:00";
      const endOfDay = selectedDay + " 23:59:59";
      return [
        ["creation", ">=", startOfDay],
        ["creation", "<=", endOfDay],
      ];
    } else if (calendarView === "week") {
      const startOfWeek = selectedWeek.start + " 00:00:00";
      const endOfWeek = selectedWeek.end + " 23:59:59";
      return [
        ["creation", ">=", startOfWeek],
        ["creation", "<=", endOfWeek],
      ];
    } else if (calendarView === "month") {
      const startOfMonth = dayjs()
        .month(months.indexOf(selectedMonth))
        .startOf("month")
        .format("YYYY-MM-DD");
      const endOfMonth = dayjs()
        .month(months.indexOf(selectedMonth))
        .endOf("month")
        .format("YYYY-MM-DD");
      return [
        ["creation", ">=", `${startOfMonth} 00:00:00`],
        ["creation", "<=", `${endOfMonth} 23:59:59`],
      ];
    } else if (calendarView === "year") {
      const startOfYear = `${selectedYear}-01-01 00:00:00`;
      const endOfYear = `${selectedYear}-12-31 23:59:59`;
      return [
        ["creation", ">=", startOfYear],
        ["creation", "<=", endOfYear],
      ];
    }
    return [];
  };
  const { data: FM_Bills, isLoading } = useFrappeGetDocList("FM_Bills", {
    fields: ["*"],
    filters: getFilter(),
    orderBy: {
      field: "modified",
      order: "desc",
    },
    limit: itemsPerPage,
    start: (currentPage - 1) * itemsPerPage,
  });

  useEffect(() => {
    if (FM_Bills) {
      setTableData(FM_Bills);
    }
  }, [FM_Bills, currentPage, itemsPerPage]);

  const { data: FM_Manager_Coins, isLoading: coinsLoading } =
    useFrappeGetDocList("FM_Manager_Coins", {
      fields: ["*"],
      filters: getFilter(),
      orderBy: {
        field: "modified",
        order: "desc",
      },
    });

  // Set table data when the fetched data changes
  useEffect(() => {
    if (FM_Manager_Coins) {
      setCoinsData(FM_Manager_Coins);
    }
  }, [FM_Manager_Coins]);

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  // Functions to handle changes in calendar views and pagination
  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setCalendarView(newView);
      if (newView === "day") {
        setSelectedDay(dayjs().format("YYYY-MM-DD"));
      } else if (newView === "week") {
        setSelectedWeek({
          start: dayjs().startOf("week").format("YYYY-MM-DD"),
          end: dayjs().endOf("week").format("YYYY-MM-DD"),
        });
      } else if (newView === "month") {
        setSelectedMonth(dayjs().format("MMMM"));
      } else if (newView === "year") {
        setSelectedYear(dayjs().year());
      }
    }
  };
  // pichart
  const aggregateData = (data, key) => {
    const counts = data.reduce((acc, item) => {
      acc[item[key]] = (acc[item[key]] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(counts),
      datasets: [
        {
          data: Object.values(counts),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
          ], // Add more colors if needed
        },
      ],
    };
  };

  const typeData = aggregateData(tableData, "type");
  const deptData = aggregateData(tableData, "pro_dept_name");

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right", // Position the legend on the right
        labels: {
          color: darkMode ? "#FFF" : "#222222",
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            const label = tooltipItem.label || "";
            const value = tooltipItem.raw || 0;
            const total = tooltipItem.dataset.data.reduce(
              (acc: number, val: number) => acc + val,
              0
            );
            const percentage = ((value / total) * 100).toFixed(2);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  // Columns definition for the table
  const servicecolumns = [
    {
      key: "S_no",
      label: "S.No",
      _style: {
        width: "7%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
        borderTopLeftRadius: "5px",
      },
      filter: false,
      sorter: false,
    },

    {
      key: "type",
      label: "Type of Service",
      _style: {
        width: "10%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
      },
      filter: true,
      sorter: true,
    },
    {
      key: "total_amount",
      label: "Coins Spent",
      _style: {
        width: "15%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
        borderTopRightRadius: "5px",
      },
      filter: true,
      sorter: true,
    },
  ];
  const projectcolumns = [
    {
      key: "S_no",
      label: "S.No",
      _style: {
        width: "7%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
        borderTopLeftRadius: "5px",
      },
      filter: false,
      sorter: false,
    },

    {
      key: "pro_dept_name",
      label: "Pl / Dl",
      _style: {
        width: "10%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
      },
      filter: true,
      sorter: true,
    },
    {
      key: "total_amount",
      label: "Coins Spent",
      _style: {
        width: "15%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
        borderTopRightRadius: "5px",
      },
      filter: true,
      sorter: true,
    },
  ];

  // Calculate the total coins
  const totalCoins = coinsData.reduce(
    (acc, item) => acc + (item.coins || 0),
    0
  );
  // Calculate the total spent coins
  const totalCoinsSpent = tableData.reduce(
    (acc, item) => acc + (item.total_amount || 0),
    0
  );
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#FFF",
          backgroundColor: "#4D8C52",
          padding: "10px",
          borderRadius: "5px",
          fontSize: "18px",
          fontWeight: 600,
          marginBottom: "10px",
        }}
      >
        Coins Dashboard
      </Box>

      <div
        style={{
          backgroundColor: "#effaef",
          padding: "15px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,

            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          {/* Total Coins Card */}
          <Card
            sx={{
              display: "flex",
              alignItems: "center",
              padding: 1.5,
              borderLeft: "4px solid #81C784",
              backgroundColor: "#FFFFFF",
              width: "200px",
              height: "80px",
            }}
          >
            <PiCoins
              style={{ fontSize: 32, marginRight: 12, color: "#81C784" }}
            />
            <CardContent sx={{ padding: "0 !important" }}>
              <Typography
                variant="subtitle2"
                sx={{ color: "#000000", fontWeight: "bold" }}
              >
                Total Coins
              </Typography>
              <Typography variant="h6" sx={{ color: "#000000" }}>
                {totalCoins}
              </Typography>
            </CardContent>
          </Card>

          {/* Total Coins Spent Card */}
          <Card
            sx={{
              display: "flex",
              alignItems: "center",
              padding: 1.5,
              borderLeft: "4px solid #FF80AB",
              backgroundColor: "#FFFFFF",
              width: "200px",
              height: "80px",
            }}
          >
            <PiCoins
              style={{ fontSize: 32, marginRight: 12, color: "#FF80AB" }}
            />
            <CardContent sx={{ padding: "0 !important" }}>
              <Typography
                variant="subtitle2"
                sx={{ color: "#000000", fontWeight: "bold" }}
              >
                Total Coins Spent
              </Typography>
              <Typography variant="h6" sx={{ color: "#000000" }}>
                {totalCoinsSpent}
              </Typography>
            </CardContent>
          </Card>
          <br />

          {/* Calendar Control Section */}
          <Box
            sx={{
              display: "flex",
              // flexDirection: "column",
              gap: 5,
              minWidth: "250px",
              padding: "23px",
            }}
          >
            <ToggleButtonGroup
              value={calendarView}
              exclusive
              onChange={handleViewChange}
              aria-label="Calendar View Selector"
              size="small"
              sx={{
                "& .MuiToggleButton-root": {
                  padding: "4px 8px",
                  fontSize: "0.8rem",
                },
                "& .MuiToggleButton-root.Mui-selected": {
                  backgroundColor: "#5C8A58",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#4A7046",
                  },
                },
              }}
            >
              <ToggleButton value="day">Day</ToggleButton>
              <ToggleButton value="week">Week</ToggleButton>
              <ToggleButton value="month">Month</ToggleButton>
              <ToggleButton value="year">Year</ToggleButton>
            </ToggleButtonGroup>

            <Box sx={{ width: "100%" }}>
              {calendarView === "day" && (
                <input
                  type="date"
                  value={selectedDay}
                  onChange={handleDayChange}
                  style={{ width: "100%", padding: "4px", fontSize: "14px" }}
                />
              )}

              {calendarView === "week" && (
                <Box sx={{ display: "flex", gap: "4px" }}>
                  <input
                    type="date"
                    value={selectedWeek.start}
                    onChange={(e) =>
                      handleWeekChange(e.target.value, selectedWeek.end)
                    }
                    style={{ flex: 1, padding: "4px", fontSize: "14px" }}
                  />
                  <input
                    type="date"
                    value={selectedWeek.end}
                    onChange={(e) =>
                      handleWeekChange(selectedWeek.start, e.target.value)
                    }
                    style={{ flex: 1, padding: "4px", fontSize: "14px" }}
                  />
                </Box>
              )}

              {calendarView === "month" && (
                <FormControl variant="outlined" fullWidth size="small">
                  <Select
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    fullWidth
                  >
                    {renderMonths()}
                  </Select>
                </FormControl>
              )}

              {calendarView === "year" && (
                <FormControl variant="outlined" fullWidth size="small">
                  <Select
                    value={selectedYear}
                    onChange={handleYearChange}
                    fullWidth
                  >
                    {renderYears()}
                  </Select>
                </FormControl>
              )}
            </Box>
          </Box>
        </Box>

        <br />
        <Box
          sx={{
            display: "flex",
            backgroundColor: "#fff",
            padding: "10px",
            borderRadius: "5px",
            flexDirection: { xs: "column", md: "row" }, // Responsive stacking
          }}
        >
          <Box sx={{ width: { xs: "100%", md: "60%" } }}>
            <CSmartTable
              // cleaner
              clickableRows
              columns={servicecolumns}
              columnFilter
              columnSorter
              items={tableData}
              // tableFilter
              itemsPerPageSelect={{
                label: "Items per page",
                values: [10, 20, 30, 50, 100],
                onItemsPerPageChange: handleItemsPerPageChange,
              }}
              itemsPerPage={itemsPerPage}
              activePage={currentPage}
              onActivePageChange={handlePageChange}
              tableProps={{
                className: "add-this-class red-border",
                responsive: true,
                striped: true,
                hover: true,
              }}
              tableBodyProps={{
                className: "align-middle tableData",
              }}
              scopedColumns={{
                S_no: (_item: any, index: number) => <td>{index + 1}</td>,
              }}
            />
          </Box>
          <Box
            sx={{
              padding: "20px",
              width: { xs: "100%", md: "40%" },
              display: "flex",
              justifyContent: "center", // Center the chart horizontally
              alignItems: "center", // Vertically align the chart
            }}
          >
            <Container sx={{ maxWidth: "350px" }}>
              {" "}
              {/* Increased maxWidth to improve alignment */}
              <Typography variant="h6" align="center">
                Pie Chart based on Type Of Service
              </Typography>
              <Pie data={typeData} options={pieOptions} />
            </Container>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            backgroundColor: "#fff",
            padding: "10px",
            marginTop: "20px",
            borderRadius: "5px",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Box sx={{ width: { xs: "100%", md: "60%" } }}>
            <CSmartTable
              clickableRows
              columns={projectcolumns}
              items={tableData}
              itemsPerPageSelect
              itemsPerPage={10}
              pagination
              tableProps={{
                className: "add-this-class red-border",
                responsive: true,
                striped: true,
                hover: true,
              }}
              tableBodyProps={{
                className: "align-middle tableData",
              }}
              scopedColumns={{
                S_no: (_item: any, index: number) => <td>{index + 1}</td>,
              }}
            />
          </Box>
          <Box
            sx={{
              padding: "20px",
              width: { xs: "100%", md: "40%" },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Container sx={{ maxWidth: "350px" }}>
              <Typography variant="h6" align="center">
                Chart based on Project / Department Name
              </Typography>
              <Pie data={deptData} options={pieOptions} />
            </Container>
          </Box>
        </Box>
      </div>
    </>
  );
};

export default CoinsDashBoard;
