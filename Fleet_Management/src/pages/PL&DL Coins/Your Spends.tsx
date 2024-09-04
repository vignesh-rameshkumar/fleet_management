import React, { useState, useEffect } from "react";
import { CSmartTable } from "@coreui/react-pro";
import {
  Box,
  Drawer,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Select,
  Card,
  FormControl,
  MenuItem,
  CardContent,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { MdOutlineVisibility, MdDeleteForever } from "react-icons/md";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { DirectionsCar, Route, CreditCard } from "@mui/icons-material";
import dayjs from "dayjs";

import {
  useFrappeGetDocList,
  useFrappeUpdateDoc,
  useFrappeGetCall,
} from "frappe-react-sdk";
import { CFormSelect } from "@coreui/react";

interface YourSpendsProps {
  darkMode: boolean;
  onCloseDrawer: () => void;
  userEmailId: string;
  employeeID: string;
  userName: string;
}

const YourSpends: React.FC<YourSpendsProps> = ({
  darkMode,
  onCloseDrawer,
  userEmailId,
}) => {
  // State
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [drawerDetails, setDrawerDetails] = useState<any>({});
  const [tableData, setTableData] = useState<any[]>([]);
  const [travelData, setTravelData] = useState<any[]>([]);

  const [view, setView] = useState<boolean>(false);
  const [coinsData, setCoinData] = useState<any[]>([]);
  const [documentName, setDocumentName] = useState<string>("");
  const [doctypeName, setDoctypeName] = useState<string>("");
  // States for pagination
  const [currentPage, setCurrentPage] = useState(1); // Start from the first page
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page

  const [activeLog, setActiveLog] = useState("bookRide");
  const [calendarView, setCalendarView] = useState("day"); // Default to "day"
  const [selectedDay, setSelectedDay] = useState(dayjs().format("YYYY-MM-DD")); // Current date
  const [selectedWeek, setSelectedWeek] = useState({
    start: dayjs().startOf("week").format("YYYY-MM-DD"),
    end: dayjs().endOf("week").format("YYYY-MM-DD"),
  });
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("MMMM"));
  const [selectedYear, setSelectedYear] = useState(dayjs().year());

  const totalcoinBookedAmount = tableData.reduce(
    (acc, item) => acc + parseFloat(item.bill_amount || 0),
    0
  );

  const totalcointTravelAmount = travelData.reduce(
    (acc, item) => acc + parseFloat(item.cost || 0),
    0
  );

  // Calculate car counts
  const bookedCarCount = tableData.length;
  const travelRouteCount = travelData.length;

  // Update cardData
  const cardData = [
    {
      title: "Booked",
      car: bookedCarCount,
      coins: totalcoinBookedAmount,
      icon: MonetizationOnIcon,
      bgColor: "#F0F0F0",
    },
    {
      title: "Travel Route",
      car: travelRouteCount,
      coins: totalcointTravelAmount,
      icon: MonetizationOnIcon,
      bgColor: "#FFD6E5",
    },
    {
      title: "Total Coins Consumed",
      coins: totalcoinBookedAmount + totalcointTravelAmount,
      icon: MonetizationOnIcon,
      bgColor: "#FFD6E5",
    },
  ];

  useEffect(() => {
    const filterInput = document.querySelector(".form-control");
    if (filterInput) {
      filterInput.placeholder = "Request Type";
    }
  }, []);
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
    const filters = [
      ["owner", "=", userEmailId], // Filter by user email ID
    ];

    if (calendarView === "day") {
      const startOfDay = selectedDay + " 00:00:00";
      const endOfDay = selectedDay + " 23:59:59";
      filters.push(
        ["creation", ">=", startOfDay],
        ["creation", "<=", endOfDay]
      );
    } else if (calendarView === "week") {
      const startOfWeek = selectedWeek.start + " 00:00:00";
      const endOfWeek = selectedWeek.end + " 23:59:59";
      filters.push(
        ["creation", ">=", startOfWeek],
        ["creation", "<=", endOfWeek]
      );
    } else if (calendarView === "month") {
      const startOfMonth = dayjs()
        .month(months.indexOf(selectedMonth))
        .startOf("month")
        .format("YYYY-MM-DD");
      const endOfMonth = dayjs()
        .month(months.indexOf(selectedMonth))
        .endOf("month")
        .format("YYYY-MM-DD");
      filters.push(
        ["creation", ">=", `${startOfMonth} 00:00:00`],
        ["creation", "<=", `${endOfMonth} 23:59:59`]
      );
    } else if (calendarView === "year") {
      const startOfYear = `${selectedYear}-01-01 00:00:00`;
      const endOfYear = `${selectedYear}-12-31 23:59:59`;
      filters.push(
        ["creation", ">=", startOfYear],
        ["creation", "<=", endOfYear]
      );
    }

    return filters;
  };

  const { data: FM_Request_Master, isLoading } = useFrappeGetDocList(
    "FM_Request_Master",
    {
      fields: ["*"],
      filters: getFilter(),

      orderBy: {
        field: "modified",
        order: "desc",
      },
      limit: itemsPerPage,
      start: (currentPage - 1) * itemsPerPage,
    }
  );

  // Set table data when the fetched data changes
  useEffect(() => {
    if (FM_Request_Master) {
      setTableData(FM_Request_Master);
    }
  }, [
    FM_Request_Master,
    calendarView, // Re-run effect when calendarView changes
    selectedDay,
    selectedWeek,
    selectedMonth,
    selectedYear,
    itemsPerPage,
    currentPage,
  ]);

  console.log("tableData",tableData);

  const { data: employeeCoin, error } = useFrappeGetCall(
    "fleet_management.custom_function.get_combined_document_data",
    {
      doctype_name: doctypeName,
      document_name: documentName,
    }
  );

  useEffect(() => {
    if (employeeCoin) {
      setCoinData(employeeCoin);
    }
    if (error) {
      console.error("Error fetching data:", error);
    }
  }, [employeeCoin, error]);

  const { data: TravelRouteData, error: travelDataError } = useFrappeGetCall(
    "fleet_management.custom_function.get_travel_route_report_by_email",
    {
      employee_email: userEmailId,
      // filters: getFilter(), // Include filters here
    }
  );

  useEffect(() => {
    if (TravelRouteData) {
      // Transform and filter TravelRouteData
      const transformedTravelRouteData = TravelRouteData.message
        .map((item) => ({
          name: item.parent.name,
          date_time: item.parent.date_time,
          route_id: item.parent.route_id,
          bill_amount: item.parent.bill_amount,
          start_point: item.parent.start_point,
          end_point: item.parent.end_point,
          employee_email: item.child.employee_email,
          attendance: item.child.attendance,
          cost: item.child.cost,
          requested_email_id: item.child.employee_email,
          doctypename: "FM_Travel_Route_Report",
          created_on: item.parent.created_on,
        }))
        .filter((item) => {
          const itemDate = new Date(item.created_on);
          const filterDate = new Date();
          if (calendarView === "day") {
            return (
              itemDate >= new Date(selectedDay + " 00:00:00") &&
              itemDate <= new Date(selectedDay + " 23:59:59")
            );
          } else if (calendarView === "week") {
            return (
              itemDate >= new Date(selectedWeek.start + " 00:00:00") &&
              itemDate <= new Date(selectedWeek.end + " 23:59:59")
            );
          } else if (calendarView === "month") {
            const startOfMonth = dayjs()
              .month(months.indexOf(selectedMonth))
              .startOf("month")
              .toDate();
            const endOfMonth = dayjs()
              .month(months.indexOf(selectedMonth))
              .endOf("month")
              .toDate();
            return itemDate >= startOfMonth && itemDate <= endOfMonth;
          } else if (calendarView === "year") {
            const startOfYear = new Date(selectedYear + "-01-01 00:00:00");
            const endOfYear = new Date(selectedYear + "-12-31 23:59:59");
            return itemDate >= startOfYear && itemDate <= endOfYear;
          }
          return true; // No filtering by default
        });

      // Store transformed and filtered TravelRouteData
      setTravelData(transformedTravelRouteData);
    }
  }, [
    TravelRouteData,
    calendarView,
    selectedDay,
    selectedWeek,
    selectedMonth,
    selectedYear,
  ]);

  useEffect(() => {
    if (drawerDetails) {
      setDocumentName(drawerDetails?.name);
      setDoctypeName(drawerDetails?.doctypename);
    }
  }, [drawerDetails]);
  //handle change
  // handle calendar
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

  // Function to handle change in items per page
  const handleItemsPerPageChange = (event) => {
    const newItemsPerPage = parseInt(event.target.value, 10);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  // Function to handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  // Handle drawer toggle
  const toggleDrawer = (open: boolean) => {
    setIsOpen(open);
  };

  const handleCloseDrawer = () => {
    toggleDrawer(false);
  };
  // handle change
  const handleLogClick = (logType) => {
    setActiveLog(logType);
    if (logType === "bookRide") {
      // setDoctypeName("FM_Fine_Log");
      setColumns(BookedRidescolumns);
    } else if (logType === "travelRoute") {
      // setDoctypeName("FM_Fuel_Log");
      setColumns(TravelRoutesColumns);
      // setTableData(travelData || []);
    }
    // Add more conditions if you have other log types
  };
  const BookedRidescolumns = [
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
      key: "creation",
      label: "Date",
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
      key: "name",
      label: "Request ID",
      _style: {
        width: "15%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
      },
      filter: true,
      sorter: true,
    },
    {
      key: "type",
      label: "Request Type",
      _style: {
        width: "15%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
      },
      filter: true,
      sorter: true,
    },
    {
      key: "project_name",
      label: "Project Name",
      _style: {
        width: "15%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
      },
      filter: true,
      sorter: true,
    },

    {
      key: "bill_amount",
      label: "Coins Consumed",
      _style: {
        width: "15%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
      },
      filter: true,
      sorter: true,
    },

    {
      key: "action",
      label: "Action",
      _style: {
        width: "18%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
        borderTopRightRadius: "5px",
      },
      filter: false,
      sorter: false,
    },
  ];
  const TravelRoutesColumns = [
    {
      key: "date_time",
      label: "Travel Date",
      _style: {
        width: "15%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
      },
      filter: true,
      sorter: true,
    },
    {
      key: "route_id",
      label: "Route ID",
      _style: {
        width: "15%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
      },
      filter: true,
      sorter: true,
    },
    {
      key: "start_point",
      label: "Start Point",
      _style: {
        width: "15%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
      },
      filter: true,
      sorter: true,
    },
    {
      key: "end_point",
      label: "End Point",
      _style: {
        width: "15%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
      },
      filter: true,
      sorter: true,
    },
    {
      key: "cost",
      label: "Cost",
      _style: {
        width: "15%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
      },
      filter: true,
      sorter: true,
    },
    {
      key: "action",
      label: "Action",
      _style: {
        width: "18%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
        borderTopRightRadius: "5px",
      },
      filter: false,
      sorter: false,
    },
  ];

  const [columns, setColumns] = useState(BookedRidescolumns);
  // Columns definition for the table

  const handleRowClick = (item: any) => {
    //setSelectedRowItem(item);
    toggleDrawer(true);
    setView(true);
    setDrawerDetails(item);
  };

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
        Coins
      </Box>

      <div
        style={{
          backgroundColor: darkMode ? "#222222" : "#fff",
          padding: "15px",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          {cardData.map((card, index) => (
            <Card key={index} sx={{ flex: 1, backgroundColor: card.bgColor }}>
              <CardContent>
                <Typography variant="h6" component="div">
                  {card.title}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                  {card.car && (
                    <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
                      <DirectionsCar sx={{ mr: 1 }} />
                      <Typography variant="body1">{card.car}</Typography>
                    </Box>
                  )}
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <card.icon sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      {card.coins.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
        {/* Calendar Control Section */}
        {/* <Box sx={{ marginTop: "20px" }}>
           <Grid container spacing={2} alignItems="center"> */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            p: 2,
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}
        >
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

          {/* Buttons Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              onClick={() => handleLogClick("bookRide")}
              sx={{
                backgroundColor:
                  activeLog === "bookRide" ? "#E5F3E6" : "#f5f5f5",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "4px 4px 0 0",
                display: "flex",
                justifyContent: "center",
                fontSize: { xs: "12px", md: "14px" },
                fontWeight: 600,
                color: activeLog === "bookRide" ? "#375d33" : "#A1A1A1",
                height: "8vh",
                borderBottom:
                  activeLog === "bookRide"
                    ? "2px solid #487644"
                    : "2px solid transparent",
              }}
            >
              Booked Rides
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography
              onClick={() => handleLogClick("travelRoute")}
              sx={{
                backgroundColor:
                  activeLog === "travelRoute" ? "#E5F3E6" : "#f5f5f5",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "4px 4px 0 0",
                display: "flex",
                justifyContent: "center",
                fontSize: { xs: "12px", md: "14px" },
                fontWeight: 600,
                color: activeLog === "travelRoute" ? "#375d33" : "#A1A1A1",
                borderBottom:
                  activeLog === "travelRoute"
                    ? "2px solid #487644"
                    : "2px solid transparent",
                height: "8vh",
              }}
            >
              Travel Route
            </Typography>
          </Grid>
        </Box>
        {/* </Grid>
         </Box> */}
        {/* {JSON.stringify(activeLog == "bookRide" ? tableData : travelData)} */}
        <CSmartTable
          cleaner
          clickableRows
          columns={columns}
          columnFilter
          columnSorter
          items={activeLog === "bookRide" ? tableData : travelData}
          activePage={currentPage}
          itemsPerPage={itemsPerPage}
          onActivePageChange={handlePageChange}
          tableFilter
          tableProps={{
            className: "add-this-class red-border",
            responsive: true,
            striped: true,
            hover: true,
          }}
          onRowClick={(item) => handleRowClick(item)}
          tableBodyProps={{
            className: "align-middle tableData",
          }}
          scopedColumns={{
            S_no: (_item: any, index: number) => {
              return <td>{index + 1}</td>;
            },
            project_name: (item: any) => {
              return <td>{item?.project_name || "-"}</td>;
            },
            bill_amount: (item: any) => {
              return <td>{item?.bill_amount || "-"}</td>;
            },

            creation: (item: any) => {
              const date = new Date(item.creation);
              const formattedDate = `${date
                .getDate()
                .toString()
                .padStart(2, "0")}-${(date.getMonth() + 1)
                .toString()
                .padStart(2, "0")}-${date.getFullYear()}`;
              return <td>{formattedDate}</td>;
            },
            action: (item: any) => {
              return (
                <td className="ActionData">
                  <div className="viewicon">
                    <MdOutlineVisibility
                      size={20}
                      onClick={() => {
                        toggleDrawer(true);
                        setView(true);
                        setDrawerDetails(item);
                      }}
                    />
                  </div>
                </td>
              );
            },
          }}
        />
        <div
          style={{
            float: "right",
            display: "flex",
            justifyContent: "flex-end", // Corrected to 'flex-end' for alignment
            width: "15vw",
            alignItems: "center", // Added to align label and select vertically in the center
          }}
        >
          <label
            style={{
              fontSize: "12px",
              fontWeight: "600",
              marginRight: "18px",
              // padding: "10px 20px",
              // backgroundColor: "blue",
              // margin: "10px",
              // width: "10vw",
            }}
          >
            {" "}
            {/* Corrected style */}
            Items per page:
          </label>
          <Box
            sx={{
              width: "40%",
            }}
          >
            <CFormSelect
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              options={[
                { value: 5, label: "5" },
                { value: 10, label: "10" },
                { value: 20, label: "20" },
                { value: 30, label: "30" },
                { value: 50, label: "50" },
                { value: 100, label: "100" },
              ]}
            />
          </Box>
        </div>
      </div>

      <Drawer
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: darkMode ? "#222222" : "#FFF",
            color: darkMode ? "#fff" : "#000",
            width: "50%",
          },
          "@media (max-width: 600px)": {
            "& .MuiPaper-root": {
              width: "80%",
            },
          },
          "@media (max-width: 1024px)": {
            "& .MuiPaper-root": {
              width: "85%",
            },
          },
        }}
        anchor="right"
        open={isOpen}
        onClose={handleCloseDrawer}
      >
        {/* {JSON.stringify(coinsData)} */}

        {view && (
          <>
            <Box sx={{ padding: "20px" }}>
              <Box>
                <div className="m-4">
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      flexGrow={1}
                      className="drawerTitle"
                      sx={{ color: darkMode ? "#d1d1d1" : "#5b5b5b" }}
                    >
                      Request Type - {drawerDetails.type}
                    </Box>
                    <Button
                      className="closeX"
                      sx={{ color: darkMode ? "#d1d1d1" : "#5b5b5b" }}
                      onClick={handleCloseDrawer}
                    >
                      X
                    </Button>
                  </Box>
                  {/* {JSON.stringify(coinsData)} */}
                  {drawerDetails.doctypename ===
                    "FM_Equipment_Vehicle_Request" && (
                    <>
                      <Grid container spacing={2}>
                        {/* Project Name */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            Project Name
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData.message.document_data.project_name ||
                              "N/A"}
                          </Typography>
                        </Grid>

                        {/* Request Date */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            Request Date
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData.message.document_data
                              .request_date_time || "N/A"}
                          </Typography>
                        </Grid>

                        {/* Ride Start Time */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            Ride Start Time
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData.message.document_data.ride_start_time ||
                              "N/A"}
                          </Typography>
                        </Grid>

                        {/* Ride End Time */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            Ride End Time
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData.message.document_data.ride_end_time ||
                              "N/A"}
                          </Typography>
                        </Grid>

                        {/* Type of Services */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            Type of Services
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData.message.document_data.allotment || "N/A"}
                          </Typography>
                        </Grid>

                        {/* Driver Name/No */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            Driver Name/No
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData.message.document_data.driver_name_no ||
                              "N/A"}
                          </Typography>
                        </Grid>

                        {/* Employee Name */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            Employee Name
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData.message.document_data.employee_name ||
                              "N/A"}
                          </Typography>
                        </Grid>

                        {/* Equipment Type */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            Equipment Type
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData.message.document_data.equipment_type ||
                              "N/A"}
                          </Typography>
                        </Grid>

                        {/* Purpose */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            Purpose
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData.message.document_data.purpose || "N/A"}
                          </Typography>
                        </Grid>

                        {/* Vehicle No */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            Vehicle No
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData.message.document_data.vehicle_no ||
                              "N/A"}
                          </Typography>
                        </Grid>
                      </Grid>

                      {/* Coins Calculation Table */}
                      {/* Coins Calculation Table */}
                      <table
                        className="table table-bordered"
                        style={{ marginTop: "16px" }}
                      >
                        <thead>
                          <tr>
                            <th>Parameter</th>
                            <th>Cost per Qty</th>
                            <th>Total Qty</th>
                            <th>Coins</th>
                          </tr>
                        </thead>
                        <tbody>
                          {coinsData.message.bills_data[0].bill_details.map(
                            (bill, index) => {
                              const coins =
                                bill.cost_per_qty * bill.total_quantity;
                              return (
                                <tr key={index}>
                                  <td>{bill.parameter || "N/A"}</td>
                                  <td>{bill.cost_per_qty || "N/A"}</td>
                                  <td>{bill.total_quantity || "N/A"}</td>
                                  <td>{coins || "N/A"}</td>
                                </tr>
                              );
                            }
                          )}
                          {/* Total Coins */}
                          <tr>
                            <td colSpan="3" style={{ textAlign: "right" }}>
                              <strong>Total Coins:</strong>
                            </td>
                            <td>
                              <strong>
                                {coinsData.message.bills_data[0].bill_details.reduce(
                                  (acc, bill) =>
                                    acc +
                                    bill.cost_per_qty * bill.total_quantity,
                                  0
                                )}
                              </strong>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </>
                  )}
                  {drawerDetails.doctypename === "FM_Group_Vehicle_Request" && (
                    <>
                      <Grid container spacing={2}>
                        {/* For */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            For
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData?.message?.document_data?.project_name ||
                              "N/A"}
                          </Typography>
                        </Grid>

                        {/* Type */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            Type
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData?.message?.document_data?.type || "N/A"}
                          </Typography>
                        </Grid>

                        {/* Employee Name */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            Employee Name
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData?.message?.document_data?.employee_name ||
                              "N/A"}
                          </Typography>
                        </Grid>

                        {/* From Location */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            From Location
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData?.message?.document_data?.from_location ||
                              "N/A"}
                          </Typography>
                        </Grid>

                        {/* To Location */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            To Location
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData?.message?.document_data?.to_location ||
                              "N/A"}
                          </Typography>
                        </Grid>

                        {/* Request Date and Time */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            Request Date and Time
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData?.message?.document_data
                              ?.request_date_time || "N/A"}
                          </Typography>
                        </Grid>

                        {/* Purpose */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            Purpose
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData?.message?.document_data?.purpose ||
                              "N/A"}
                          </Typography>
                        </Grid>

                        {/* Passenger Count */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            Passenger Count
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData?.message?.document_data
                              ?.passenger_count || "N/A"}
                          </Typography>
                        </Grid>

                        {/* Vehicle No */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            Vehicle No
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData?.message?.document_data?.vehicle_no ||
                              "N/A"}
                          </Typography>
                        </Grid>

                        {/* Driver No / Name */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            Driver No / Name
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData?.message?.document_data
                              ?.driver_name_no || "N/A"}
                          </Typography>
                        </Grid>

                        {/* Vehicle Allotment */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            Vehicle Allotment
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData?.message?.document_data?.allotment ||
                              "N/A"}
                          </Typography>
                        </Grid>

                        {/* Ride Start Date & Time */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            Ride Start Date & Time
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData?.message?.document_data
                              ?.ride_start_time || "N/A"}
                          </Typography>
                        </Grid>

                        {/* Ride End Date & Time */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            Ride End Date & Time
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData?.message?.document_data?.ride_end_time ||
                              "N/A"}
                          </Typography>
                        </Grid>
                      </Grid>

                      {/* Coins Calculation Table */}
                      <table
                        className="table table-bordered"
                        style={{ marginTop: "16px" }}
                      >
                        <thead>
                          <tr>
                            <th>Parameter</th>
                            <th>Cost per Qty</th>
                            <th>Total Qty</th>
                            <th>Coins</th>
                          </tr>
                        </thead>
                        <tbody>
                          {coinsData?.message?.bills_data?.[0]?.bill_details?.map(
                            (bill, index) => {
                              const coins =
                                bill.cost_per_qty * bill.total_quantity;
                              return (
                                <tr key={index}>
                                  <td>{bill.parameter || "N/A"}</td>
                                  <td>{bill.cost_per_qty || "N/A"}</td>
                                  <td>{bill.total_quantity || "N/A"}</td>
                                  <td>{coins || "N/A"}</td>
                                </tr>
                              );
                            }
                          )}
                          {/* Total Coins */}
                          <tr>
                            <td colSpan="3" style={{ textAlign: "right" }}>
                              <strong>Total Coins:</strong>
                            </td>
                            <td>
                              <strong>
                                {coinsData?.message?.bills_data?.[0]?.bill_details?.reduce(
                                  (acc, bill) =>
                                    acc +
                                    (bill.cost_per_qty * bill.total_quantity ||
                                      0),
                                  0
                                )}
                              </strong>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </>
                  )}

                  {drawerDetails.doctypename ===
                    "FM_Passenger_Vehicle_Request" && (
                    <>
                      <Grid container spacing={2}>
                        {/* For */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            For
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData?.message?.document_data?.project_name ||
                              "N/A"}
                          </Typography>
                        </Grid>

                        {/* Type */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            Type
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData?.message?.document_data?.type || "N/A"}
                          </Typography>
                        </Grid>

                        {/* Employee Name */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            Employee Name
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData?.message?.document_data?.employee_name ||
                              "N/A"}
                          </Typography>
                        </Grid>

                        {/* From Location */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            From Location
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData?.message?.document_data?.from_location ||
                              "N/A"}
                          </Typography>
                        </Grid>

                        {/* To Location */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            To Location
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData?.message?.document_data?.to_location ||
                              "N/A"}
                          </Typography>
                        </Grid>

                        {/* Requesting Date & Time */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            Requesting Date & Time
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData?.message?.document_data
                              ?.request_date_time || "N/A"}
                          </Typography>
                        </Grid>

                        {/* Purpose */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            Purpose
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData?.message?.document_data?.purpose ||
                              "N/A"}
                          </Typography>
                        </Grid>

                        {/* Vehicle No */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            Vehicle No
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData?.message?.document_data?.vehicle_no ||
                              "N/A"}
                          </Typography>
                        </Grid>

                        {/* Driver Name / No */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            Driver Name / No
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData?.message?.document_data
                              ?.driver_name_no || "N/A"}
                          </Typography>
                        </Grid>

                        {/* Vehicle Allotment */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            Vehicle Allotment
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData?.message?.document_data?.allotment ||
                              "N/A"}
                          </Typography>
                        </Grid>

                        {/* Ride Start Date & Time */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            Ride Start Date & Time
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData?.message?.document_data
                              ?.ride_start_time || "N/A"}
                          </Typography>
                        </Grid>

                        {/* Ride End Date & Time */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            Ride End Date & Time
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData?.message?.document_data?.ride_end_time ||
                              "N/A"}
                          </Typography>
                        </Grid>
                      </Grid>

                      {/* Coins Calculation Table */}
                      <table
                        className="table table-bordered"
                        style={{ marginTop: "16px" }}
                      >
                        <thead>
                          <tr>
                            <th>Parameter</th>
                            <th>Cost per Qty</th>
                            <th>Total Qty</th>
                            <th>Coins</th>
                          </tr>
                        </thead>
                        <tbody>
                          {coinsData?.message?.bills_data?.[0]?.bill_details?.map(
                            (bill, index) => {
                              const coins =
                                bill.cost_per_qty * bill.total_quantity;
                              return (
                                <tr key={index}>
                                  <td>{bill.parameter || "N/A"}</td>
                                  <td>{bill.cost_per_qty || "N/A"}</td>
                                  <td>{bill.total_quantity || "N/A"}</td>
                                  <td>{coins || "N/A"}</td>
                                </tr>
                              );
                            }
                          )}
                          {/* Total Coins */}
                          <tr>
                            <td colSpan="3" style={{ textAlign: "right" }}>
                              <strong>Total Coins:</strong>
                            </td>
                            <td>
                              <strong>
                                {coinsData?.message?.bills_data?.[0]?.bill_details?.reduce(
                                  (acc, bill) =>
                                    acc +
                                    (bill.cost_per_qty * bill.total_quantity ||
                                      0),
                                  0
                                )}
                              </strong>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </>
                  )}
                  {drawerDetails.doctypename === "FM_Goods_Vehicle_Request" && (
                    <>
                      <Grid container spacing={2}>
                        {/* For */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            For
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData?.message?.document_data?.project_name ||
                              "N/A"}
                          </Typography>
                        </Grid>

                        {/* Category */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            Category
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData?.message?.document_data?.category ||
                              "N/A"}
                          </Typography>
                        </Grid>

                        {/* Employee Name */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            Employee Name
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData?.message?.document_data?.employee_name ||
                              "N/A"}
                          </Typography>
                        </Grid>

                        {/* From Location */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            From Location
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData?.message?.document_data?.from_location ||
                              "N/A"}
                          </Typography>
                        </Grid>

                        {/* To Location */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            To Location
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData?.message?.document_data?.to_location ||
                              "N/A"}
                          </Typography>
                        </Grid>

                        {/* Requesting Date & Time */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            Requesting Date & Time
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData?.message?.document_data
                              ?.request_date_time || "N/A"}
                          </Typography>
                        </Grid>

                        {/* Purpose */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            Purpose
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData?.message?.document_data?.purpose ||
                              "N/A"}
                          </Typography>
                        </Grid>

                        {/* Vehicle No */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            Vehicle No
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData?.message?.document_data?.vehicle_no ||
                              "N/A"}
                          </Typography>
                        </Grid>

                        {/* Driver Name / No */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            Driver Name / No
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData?.message?.document_data
                              ?.driver_name_no || "N/A"}
                          </Typography>
                        </Grid>

                        {/* Vehicle Allotment */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            Vehicle Allotment
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData?.message?.document_data?.allotment ||
                              "N/A"}
                          </Typography>
                        </Grid>

                        {/* Description */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            Description
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData?.message?.document_data?.description ||
                              "N/A"}
                          </Typography>
                        </Grid>

                        {/* Ride Start Date & Time */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            Ride Start Date & Time
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData?.message?.document_data
                              ?.ride_start_time || "N/A"}
                          </Typography>
                        </Grid>

                        {/* Ride End Date & Time */}
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            Ride End Date & Time
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {coinsData?.message?.document_data?.ride_end_time ||
                              "N/A"}
                          </Typography>
                        </Grid>
                      </Grid>

                      {/* Coins Calculation Table */}
                      <table
                        className="table table-bordered"
                        style={{ marginTop: "16px" }}
                      >
                        <thead>
                          <tr>
                            <th>Parameter</th>
                            <th>Cost per Qty</th>
                            <th>Total Qty</th>
                            <th>Coins</th>
                          </tr>
                        </thead>
                        <tbody>
                          {coinsData?.message?.bills_data?.[0]?.bill_details?.map(
                            (bill, index) => {
                              const coins =
                                bill.cost_per_qty * bill.total_quantity;
                              return (
                                <tr key={index}>
                                  <td>{bill.parameter || "N/A"}</td>
                                  <td>{bill.cost_per_qty || "N/A"}</td>
                                  <td>{bill.total_quantity || "N/A"}</td>
                                  <td>{coins || "N/A"}</td>
                                </tr>
                              );
                            }
                          )}
                          {/* Total Coins */}
                          <tr>
                            <td colSpan="3" style={{ textAlign: "right" }}>
                              <strong>Total Coins:</strong>
                            </td>
                            <td>
                              <strong>
                                {coinsData?.message?.bills_data?.[0]?.bill_details?.reduce(
                                  (acc, bill) =>
                                    acc +
                                    (bill.cost_per_qty * bill.total_quantity ||
                                      0),
                                  0
                                )}
                              </strong>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </>
                  )}
                  {activeLog === "travelRoute" && (
                    <>
                      {/* Display raw travelData JSON */}
                      {/* <pre>{JSON.stringify(travelData, null, 2)}</pre> */}

                      <Grid container spacing={2}>
                        {travelData.map((item, index) => (
                          <React.Fragment key={index}>
                            <Grid item xs={12} sm={6}>
                              <Typography sx={{ padding: 1, color: "#848484" }}>
                                Route ID
                              </Typography>
                              <Typography sx={{ padding: 1, color: "#000" }}>
                                {item.route_id || "N/A"}
                              </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <Typography sx={{ padding: 1, color: "#848484" }}>
                                From Location
                              </Typography>
                              <Typography sx={{ padding: 1, color: "#000" }}>
                                {item.start_point || "N/A"}
                              </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <Typography sx={{ padding: 1, color: "#848484" }}>
                                To Location
                              </Typography>
                              <Typography sx={{ padding: 1, color: "#000" }}>
                                {item.end_point || "N/A"}
                              </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <Typography sx={{ padding: 1, color: "#848484" }}>
                                Cost
                              </Typography>
                              <Typography sx={{ padding: 1, color: "#000" }}>
                                {item.cost || "N/A"}
                              </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <Typography sx={{ padding: 1, color: "#848484" }}>
                                Date
                              </Typography>
                              <Typography sx={{ padding: 1, color: "#000" }}>
                                {item.date_time || "N/A"}
                              </Typography>
                            </Grid>
                          </React.Fragment>
                        ))}
                      </Grid>
                    </>
                  )}
                  <br />
                  {drawerDetails?.status === "Rejected" ||
                  drawerDetails?.status === "Project Lead Rejected" ? (
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="left"
                    >
                      <Box
                        width={{ xs: "100%", sm: "100%", md: "90%" }}
                        marginBottom="16px"
                        textAlign={"left"}
                      >
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          Reject Reason
                        </Typography>
                        <Typography variant="body1" sx={{ color: "red" }}>
                          {drawerDetails?.reason}
                        </Typography>
                      </Box>
                    </Box>
                  ) : null}
                  {drawerDetails.status === "Pending" && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "20px",
                      }}
                    ></Box>
                  )}
                </div>
              </Box>
            </Box>
          </>
        )}
      </Drawer>
    </>
  );
};

export default YourSpends;
