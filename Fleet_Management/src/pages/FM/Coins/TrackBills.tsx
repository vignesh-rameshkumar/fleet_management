import React, { useState, useEffect } from "react";
import { CSmartTable } from "@coreui/react-pro";
import {
  Box,
  Drawer,
  Button,
  Grid,
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { MdOutlineVisibility, MdDeleteForever } from "react-icons/md";
import { CFormSelect } from "@coreui/react";
import {
  useFrappeGetDoc,
  useFrappeGetDocList,
  useFrappeUpdateDoc,
} from "frappe-react-sdk";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import dayjs from "dayjs";
interface TrackBillsProps {
  darkMode: boolean;
  onCloseDrawer: () => void;
  userEmailId: string;
  employeeID: string;
  userName: string;
}

const TrackBills: React.FC<TrackBillsProps> = ({
  darkMode,
  onCloseDrawer,
  userEmailId,
}) => {
  // State
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [drawerDetails, setDrawerDetails] = useState<any>({});
  const [tableData, setTableData] = useState<any[]>([]);
  const [doctypeName, setDoctypeName] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [drawerData, setDrawerData] = useState<any[]>([]);

  // const [childData, setchildData] = useState<any[]>([]);
  const [childTravelData, setChildTravelData] = useState<any[]>([]);
  const [view, setView] = useState<boolean>(false);
  const [activeLog, setActiveLog] = useState("bookRide");
  const [totalBillAmount, setTotalBillAmount] = useState(0);
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
  // handle change
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
  const handleLogClick = (logType) => {
    setActiveLog(logType);
    if (logType === "bookRide") {
      // setDoctypeName("FM_Fine_Log");
      setColumns(BookedRidescolumns);
    } else if (logType === "travelRoute") {
      // setDoctypeName("FM_Fuel_Log");
      setColumns(TravelRoutesColumns);
    }
    // Add more conditions if you have other log types
  };

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
  //table columns

  // Columns definition for the table
  const BookedRidescolumns = [
    {
      key: "S_no",
      label: "S.No",
      _style: {
        width: "5%",
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
      key: "request_id",
      label: "Request ID",
      _style: {
        width: "12%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
      },
      filter: true,
      sorter: true,
    },
    {
      key: "requested_by",
      label: "Request By",
      _style: {
        width: "12%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
      },
      filter: true,
      sorter: true,
    },
    {
      key: "pro_dept_name",
      label: "Project Name/Department",
      _style: {
        width: "20%",
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
      label: "Type of Service",
      _style: {
        width: "12%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
      },
      filter: true,
      sorter: true,
    },
    {
      key: "service_type",
      label: "Service",
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
      key: "action",
      label: "Action",
      _style: {
        width: "5%",
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
      key: "total_employees",
      label: "Total Employees",
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
      key: "present_count",
      label: "Present Count",
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

  useEffect(() => {
    const filterInput = document.querySelector(".form-control");
    if (filterInput) {
      filterInput.placeholder = "Request Type";
    }
  }, []);

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

  // Example filter for useFrappeGetDocList based on the 'creation' date range
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

  // Set table data when the fetched data changes
  useEffect(() => {
    if (FM_Bills) {
      setTableData(FM_Bills);
    }
  }, [FM_Bills]);

  const { data: specificData, isLoading: specificDataloading } =
    useFrappeGetDocList(doctypeName, {
      fields: ["*"],
      filters: [["name", "=", documentName]],
      orderBy: {
        field: "modified",
        order: "desc",
      },
      limit: 1,
    });

  // Set table data when the fetched data changes
  useEffect(() => {
    if (specificData && specificData.length > 0) {
      setDrawerData(specificData[0]); // Set the first item from the fetched data
    }
  }, [specificData]);
  // console.log("drawerdata", drawerData, documentName, doctypeName);
  const { data: travelchild, error } = useFrappeGetDoc(
    "FM_Bills",
    drawerDetails?.name,
    {
      fields: ["*"],
      orderBy: {
        field: "modified",
        order: "desc",
      },
      limit: 1,
    }
  );

  // Update the state when travelchild data changes
  useEffect(() => {
    if (travelchild) {
      setChildTravelData(travelchild);
    }
  }, [travelchild, drawerDetails]);
  // console.log("travelchild", childTravelData);
  // Handle errors if the API call fails
  useEffect(() => {
    if (error) {
      console.error("Error fetching travelchild data:", error);
    }
  }, [error]);
  // Handle drawer toggle
  const toggleDrawer = (open: boolean) => {
    setIsOpen(open);
  };

  const handleCloseDrawer = () => {
    toggleDrawer(false);
  };

  const handleRowClick = (item: any) => {
    //setSelectedRowItem(item);
    setDoctypeName(item.doctype_name);
    setDocumentName(item.request_id);
    toggleDrawer(true);
    setView(true);
    setDrawerDetails(item);
  };

  const totalcoinAmount = tableData.reduce(
    (acc, item) => acc + parseFloat(item.bill_amount || 0),
    0
  );
  const filteredData = tableData.filter((item) => {
    if (activeLog === "bookRide") {
      return item.doctype_name !== "FM_Travel_Route_Report";
    } else if (activeLog === "travelRoute") {
      return item.doctype_name === "FM_Travel_Route_Report";
    }
    return true; // In case activeLog has a different value, show all items
  });
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
        Track Bills
      </Box>

      <div
        style={{
          backgroundColor: darkMode ? "#222222" : "#fff",
          padding: "15px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" }, // Stack vertically on small screens, horizontal on medium and up
            justifyContent: "space-between",
            margin: "10px",
            // gap: "10px",
            // backgroundColor: "blue",
          }}
        >
          <Box
            sx={{
              backgroundColor: "#DAEAEA",
              padding: "10px 20px",
              borderRadius: "4px",
              borderTop: "4px solid #5A6868",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "fit-content",
              // gap: "240px",
              marginBottom: { xs: "10px", md: "0" }, // Adjust margin for separation
              // marginRight: "90px",
            }}
          >
            <Typography
              sx={{
                color: "#5A6868",
                fontSize: { xs: "12px", md: "14px" }, // Responsive font size
                fontWeight: 600,
                marginBottom: "8px",
                textAlign: "center",
                width: { xs: "100%", md: "100%" },
              }}
            >
              Bills To Be Generated
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <DirectionsCarFilledIcon
                sx={{ color: "#5A6868", marginRight: "5px" }}
              />
              <Typography
                sx={{
                  fontSize: { xs: "18px", md: "24px" }, // Responsive font size
                  fontWeight: 700,
                  color: "#5A6868",
                }}
              >
                {totalBillAmount}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" }, // Stack vertically on small screens, horizontal on medium and up
              gap: "5px",
              margin: "10px",
              width: "100%", // Full width on small screens
              // justifyContent: "center",
            }}
          >
            <Typography
              onClick={() => handleLogClick("bookRide")}
              sx={{
                backgroundColor:
                  activeLog === "bookRide" ? "#E5F3E6" : "#f5f5f5",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "4px 4px 0 0",
                width: { xs: "100%", sm: "45%", md: "25%" }, // Responsive width
                display: "flex",
                justifyContent: "center",
                fontSize: { xs: "12px", md: "14px" }, // Responsive font size
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
            <Typography
              onClick={() => handleLogClick("travelRoute")}
              sx={{
                backgroundColor:
                  activeLog === "travelRoute" ? "#E5F3E6" : "#f5f5f5",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "4px 4px 0 0",
                width: { xs: "100%", sm: "45%", md: "25%" }, // Responsive width
                display: "flex",
                justifyContent: "center",
                fontSize: { xs: "12px", md: "14px" }, // Responsive font size
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
          </Box>
          {/* Calendar Control */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <ToggleButtonGroup
              value={calendarView}
              exclusive
              onChange={handleViewChange}
              aria-label="Calendar View Selector"
              sx={{ marginBottom: "10px" }}
            >
              <ToggleButton value="day">Day</ToggleButton>
              <ToggleButton value="week">Week</ToggleButton>
              <ToggleButton value="month">Month</ToggleButton>
              <ToggleButton value="year">Year</ToggleButton>
            </ToggleButtonGroup>

            {calendarView === "day" && (
              <FormControl variant="outlined">
                <input
                  type="date"
                  value={selectedDay}
                  onChange={handleDayChange}
                />
              </FormControl>
            )}

            {calendarView === "week" && (
              <Box>
                <Typography>Select Start and End Date for Week:</Typography>
                <input
                  type="date"
                  value={selectedWeek.start}
                  onChange={(e) =>
                    handleWeekChange(e.target.value, selectedWeek.end)
                  }
                />
                <input
                  type="date"
                  value={selectedWeek.end}
                  onChange={(e) =>
                    handleWeekChange(selectedWeek.start, e.target.value)
                  }
                />
              </Box>
            )}

            {calendarView === "month" && (
              <FormControl variant="outlined">
                <Select value={selectedMonth} onChange={handleMonthChange}>
                  {renderMonths()}
                </Select>
              </FormControl>
            )}

            {calendarView === "year" && (
              <FormControl variant="outlined">
                <Select value={selectedYear} onChange={handleYearChange}>
                  {renderYears()}
                </Select>
              </FormControl>
            )}
          </Box>
        </Box>
        {/* {JSON.stringify(drawerDetails)} */}
        <CSmartTable
          cleaner
          clickableRows
          columns={columns}
          columnFilter
          columnSorter
          items={filteredData} // Updated table data based on pagination
          itemsPerPage={itemsPerPage} // Current items per page
          activePage={currentPage} // Current page
          onActivePageChange={handlePageChange} // Handle page change
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
            S_no: (_item, index) => {
              return <td>{index + 1}</td>;
            },
            project_name: (item) => {
              return <td>{item?.project_name || "-"}</td>;
            },

            creation: (item) => {
              const date = new Date(item.creation);
              const formattedDate = `${date
                .getDate()
                .toString()
                .padStart(2, "0")}-${(date.getMonth() + 1)
                .toString()
                .padStart(2, "0")}-${date.getFullYear()}`;
              return <td>{formattedDate}</td>;
            },
            action: (item) => {
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
                      Request Type -{" "}
                      {activeLog === "travelRoute"
                        ? "Travel Route"
                        : drawerDetails.type}{" "}
                    </Box>
                    <Button
                      className="closeX"
                      sx={{ color: darkMode ? "#d1d1d1" : "#5b5b5b" }}
                      onClick={handleCloseDrawer}
                    >
                      X
                    </Button>
                  </Box>
                  {/* {JSON.stringify(childData)} */}
                  <Grid container spacing={2} sx={{ marginTop: 2 }}>
                    {drawerDetails.doctype_name ===
                      "FM_Equipment_Vehicle_Request" && (
                      <>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              For
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerDetails.pro_dept_name || "N/A"}{" "}
                              {/* Display the status or "N/A" if not available */}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              Request Type
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerDetails.type || "N/A"}{" "}
                              {/* Display the status or "N/A" if not available */}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              Service Type
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerDetails.service_type || "N/A"}{" "}
                              {/* Display the status or "N/A" if not available */}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              Request ID
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerDetails.request_id || "N/A"}
                              {/* Display the status or "N/A" if not available */}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              Requested By
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerDetails.requested_by || "N/A"}
                              {/* Display the status or "N/A" if not available */}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              Request Start Date
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerData.request_date_time || "N/A"}{" "}
                              {/* Display the status or "N/A" if not available */}
                            </Typography>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              Request Start Time
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerData.ride_start_time || "N/A"}{" "}
                              {/* Display the status or "N/A" if not available */}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              Request End Time
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerData.ride_end_time || "N/A"}{" "}
                              {/* Display the status or "N/A" if not available */}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              Equipment type
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerData.equipment_type || "N/A"}{" "}
                              {/* Display the status or "N/A" if not available */}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={{ padding: 1, color: "#848484" }}>
                              Ride
                            </Typography>
                            <Typography sx={{ padding: 1, color: "#000" }}>
                              {drawerData.allotment || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={{ padding: 1, color: "#848484" }}>
                              Driver name
                            </Typography>
                            <Typography sx={{ padding: 1, color: "#000" }}>
                              {drawerData.driver_name_no || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={{ padding: 1, color: "#848484" }}>
                              Vehicle Number
                            </Typography>
                            <Typography sx={{ padding: 1, color: "#000" }}>
                              {drawerData.vehicle_no || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              Total Amount
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerDetails.total_amount || "N/A"}{" "}
                              {/* Display the status or "N/A" if not available */}
                            </Typography>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              Purpose
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerDetails.purpose || "N/A"}{" "}
                              {/* Display the status or "N/A" if not available */}
                            </Typography>
                          </Grid>
                        </Grid>
                        {childTravelData && (
                          <>
                            <table className="table table-bordered">
                              <thead>
                                <tr>
                                  <th>Parameter</th>
                                  <th>Cost per Qty</th>
                                  <th>Total Qty</th>
                                  <th>Coins</th>
                                </tr>
                              </thead>
                              <tbody>
                                {childTravelData.bill_details?.map(
                                  (item, index) => {
                                    // Perform the calculation
                                    const calculatedCoins =
                                      item.cost_per_qty * item.total_quantity;

                                    return (
                                      <tr key={index}>
                                        <td>{item.parameter}</td>
                                        <td>{item.cost_per_qty}</td>
                                        <td>{item.total_quantity}</td>
                                        <td>{calculatedCoins}</td>
                                      </tr>
                                    );
                                  }
                                )}

                                {/* Calculate the total coins if there are multiple rows */}
                                <tr>
                                  <td
                                    colSpan="3"
                                    style={{ textAlign: "right" }}
                                  >
                                    <strong>Total Amount:</strong>
                                  </td>
                                  <td>
                                    <strong>
                                      {childTravelData.bill_details?.reduce(
                                        (acc, item) =>
                                          acc +
                                          item.cost_per_qty *
                                            item.total_quantity,
                                        0
                                      )}
                                    </strong>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </>
                        )}
                      </>
                    )}
                    {drawerDetails.doctype_name ===
                      "FM_Group_Vehicle_Request" && (
                      <>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              For
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerData.project_name || "N/A"}{" "}
                              {/* Display the status or "N/A" if not available */}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              Request Type
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerData.type || "N/A"}{" "}
                              {/* Display the status or "N/A" if not available */}
                            </Typography>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              No Of Passenger
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerData.passenger_count || "N/A"}
                              {/* Display the status or "N/A" if not available */}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={{ padding: 1, color: "#848484" }}>
                              Ride
                            </Typography>
                            <Typography sx={{ padding: 1, color: "#000" }}>
                              {drawerData.allotment || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              Request Start Date
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerData.request_date_time || "N/A"}{" "}
                              {/* Display the status or "N/A" if not available */}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              Request End Date
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerData.ride_end_time || "N/A"}{" "}
                              {/* Display the status or "N/A" if not available */}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              Request Start Time
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerData.ride_start_time || "N/A"}{" "}
                              {/* Display the status or "N/A" if not available */}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              Request End Time
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerData.ride_end_time || "N/A"}{" "}
                              {/* Display the status or "N/A" if not available */}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={{ padding: 1, color: "#848484" }}>
                              Driver name
                            </Typography>
                            <Typography sx={{ padding: 1, color: "#000" }}>
                              {drawerData.driver_name_no || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={{ padding: 1, color: "#848484" }}>
                              Vehicle Number
                            </Typography>
                            <Typography sx={{ padding: 1, color: "#000" }}>
                              {drawerData.vehicle_no || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              Purpose
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerData.purpose || "N/A"}{" "}
                              {/* Display the status or "N/A" if not available */}
                            </Typography>
                          </Grid>
                        </Grid>
                        {childTravelData && (
                          <>
                            <table className="table table-bordered">
                              <thead>
                                <tr>
                                  <th>Parameter</th>
                                  <th>Cost per Qty</th>
                                  <th>Total Qty</th>
                                  <th>Coins</th>
                                </tr>
                              </thead>
                              <tbody>
                                {childTravelData.bill_details?.map(
                                  (item, index) => {
                                    // Perform the calculation
                                    const calculatedCoins =
                                      item.cost_per_qty * item.total_quantity;

                                    return (
                                      <tr key={index}>
                                        <td>{item.parameter}</td>
                                        <td>{item.cost_per_qty}</td>
                                        <td>{item.total_quantity}</td>
                                        <td>{calculatedCoins}</td>
                                      </tr>
                                    );
                                  }
                                )}

                                {/* Calculate the total coins if there are multiple rows */}
                                <tr>
                                  <td
                                    colSpan="3"
                                    style={{ textAlign: "right" }}
                                  >
                                    <strong>Total Amount:</strong>
                                  </td>
                                  <td>
                                    <strong>
                                      {childTravelData.bill_details?.reduce(
                                        (acc, item) =>
                                          acc +
                                          item.cost_per_qty *
                                            item.total_quantity,
                                        0
                                      )}
                                    </strong>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </>
                        )}
                      </>
                    )}
                    {drawerDetails.doctype_name ===
                      "FM_Passenger_Vehicle_Request" && (
                      <>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              For
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerData.project_name || "N/A"}{" "}
                              {/* Display the status or "N/A" if not available */}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              Request Type
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerData.type || "N/A"}{" "}
                              {/* Display the status or "N/A" if not available */}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              Request Start Date
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerData.ride_start_time || "N/A"}{" "}
                              {/* Display the status or "N/A" if not available */}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              Request End Date
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerData.ride_end_time || "N/A"}{" "}
                              {/* Display the status or "N/A" if not available */}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              Request Start Time
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerData.ride_start_time || "N/A"}{" "}
                              {/* Display the status or "N/A" if not available */}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              Request End Time
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerData.ride_end_time || "N/A"}{" "}
                              {/* Display the status or "N/A" if not available */}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              From Location
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerData.from_location || "N/A"}
                              {/* Display the status or "N/A" if not available */}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              To Location
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerData.to_location || "N/A"}
                              {/* Display the status or "N/A" if not available */}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={{ padding: 1, color: "#848484" }}>
                              Ride
                            </Typography>
                            <Typography sx={{ padding: 1, color: "#000" }}>
                              {drawerData.allotment || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={{ padding: 1, color: "#848484" }}>
                              Driver name
                            </Typography>
                            <Typography sx={{ padding: 1, color: "#000" }}>
                              {drawerData.driver_name_no || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={{ padding: 1, color: "#848484" }}>
                              Vehicle Number
                            </Typography>
                            <Typography sx={{ padding: 1, color: "#000" }}>
                              {drawerData.vehicle_no || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              Purpose
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerDetails.purpose || "N/A"}{" "}
                              {/* Display the status or "N/A" if not available */}
                            </Typography>
                          </Grid>
                        </Grid>
                        {childTravelData && (
                          <>
                            <table className="table table-bordered">
                              <thead>
                                <tr>
                                  <th>Parameter</th>
                                  <th>Cost per Qty</th>
                                  <th>Total Qty</th>
                                  <th>Coins</th>
                                </tr>
                              </thead>
                              <tbody>
                                {childTravelData.bill_details?.map(
                                  (item, index) => {
                                    // Perform the calculation
                                    const calculatedCoins =
                                      item.cost_per_qty * item.total_quantity;

                                    return (
                                      <tr key={index}>
                                        <td>{item.parameter}</td>
                                        <td>{item.cost_per_qty}</td>
                                        <td>{item.total_quantity}</td>
                                        <td>{calculatedCoins}</td>
                                      </tr>
                                    );
                                  }
                                )}

                                {/* Calculate the total coins if there are multiple rows */}
                                <tr>
                                  <td
                                    colSpan="3"
                                    style={{ textAlign: "right" }}
                                  >
                                    <strong>Total Amount:</strong>
                                  </td>
                                  <td>
                                    <strong>
                                      {childTravelData.bill_details?.reduce(
                                        (acc, item) =>
                                          acc +
                                          item.cost_per_qty *
                                            item.total_quantity,
                                        0
                                      )}
                                    </strong>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </>
                        )}
                      </>
                    )}
                    {drawerDetails.doctype_name ===
                      "FM_Goods_Vehicle_Request" && (
                      <>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              For
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerData.project_name || "N/A"}{" "}
                              {/* Display the status or "N/A" if not available */}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              Request Type
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerData.type || "N/A"}{" "}
                              {/* Display the status or "N/A" if not available */}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              Category
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerData.category || "N/A"}{" "}
                              {/* Display the status or "N/A" if not available */}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              Request Start Date
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerData.request_date_time || "N/A"}{" "}
                              {/* Display the status or "N/A" if not available */}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              Request End Date
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerData.ride_end_time || "N/A"}{" "}
                              {/* Display the status or "N/A" if not available */}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              From Location
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerData.from_location || "N/A"}
                              {/* Display the status or "N/A" if not available */}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              To Location
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerData.to_location || "N/A"}
                              {/* Display the status or "N/A" if not available */}
                            </Typography>
                          </Grid>

                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              Request Start Time
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerData.ride_start_time || "N/A"}{" "}
                              {/* Display the status or "N/A" if not available */}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              Request End Time
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerData.ride_end_time || "N/A"}{" "}
                              {/* Display the status or "N/A" if not available */}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            Ride
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {drawerData.allotment || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            Driver name
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {drawerData.driver_name_no || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography sx={{ padding: 1, color: "#848484" }}>
                            Vehicle Number
                          </Typography>
                          <Typography sx={{ padding: 1, color: "#000" }}>
                            {drawerData.vehicle_no || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography
                            sx={{
                              padding: 1,
                              color: "#848484",
                            }}
                          >
                            Purpose
                          </Typography>
                          <Typography
                            sx={{
                              padding: 1,
                              color: "#000",
                            }}
                          >
                            {drawerDetails.purpose || "N/A"}{" "}
                            {/* Display the status or "N/A" if not available */}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography
                            sx={{
                              padding: 1,
                              color: "#848484",
                            }}
                          >
                            Description
                          </Typography>
                          <Typography
                            sx={{
                              padding: 1,
                              color: "#000",
                            }}
                          >
                            {drawerDetails.description || "N/A"}{" "}
                            {/* Display the status or "N/A" if not available */}
                          </Typography>
                        </Grid>
                        {childTravelData && (
                          <>
                            <table className="table table-bordered">
                              <thead>
                                <tr>
                                  <th>Parameter</th>
                                  <th>Cost per Qty</th>
                                  <th>Total Qty</th>
                                  <th>Coins</th>
                                </tr>
                              </thead>
                              <tbody>
                                {childTravelData.bill_details?.map(
                                  (item, index) => {
                                    // Perform the calculation
                                    const calculatedCoins =
                                      item.cost_per_qty * item.total_quantity;

                                    return (
                                      <tr key={index}>
                                        <td>{item.parameter}</td>
                                        <td>{item.cost_per_qty}</td>
                                        <td>{item.total_quantity}</td>
                                        <td>{calculatedCoins}</td>
                                      </tr>
                                    );
                                  }
                                )}

                                {/* Calculate the total coins if there are multiple rows */}
                                <tr>
                                  <td
                                    colSpan="3"
                                    style={{ textAlign: "right" }}
                                  >
                                    <strong>Total Amount:</strong>
                                  </td>
                                  <td>
                                    <strong>
                                      {childTravelData.bill_details?.reduce(
                                        (acc, item) =>
                                          acc +
                                          item.cost_per_qty *
                                            item.total_quantity,
                                        0
                                      )}
                                    </strong>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </>
                        )}
                      </>
                    )}
                    {activeLog === "travelRoute" && (
                      <>
                        {/* {JSON.stringify(drawerDetails)} */}
                        <Grid container spacing={2}>
                          {/* Travel Date */}
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              Travel Date
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerDetails.date_time
                                ? new Date(
                                    drawerDetails.date_time
                                  ).toLocaleString()
                                : "N/A"}
                              {/* Format the date and time or display "N/A" if not available */}
                            </Typography>
                          </Grid>

                          {/* Route ID */}
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              Route ID
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerDetails.route_id || "N/A"}
                              {/* Display the route ID or "N/A" if not available */}
                            </Typography>
                          </Grid>

                          {/* Start Point */}
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              Start Point
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerDetails.start_point || "N/A"}
                              {/* Display the start point or "N/A" if not available */}
                            </Typography>
                          </Grid>

                          {/* End Point */}
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              End Point
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerDetails.end_point || "N/A"}
                              {/* Display the end point or "N/A" if not available */}
                            </Typography>
                          </Grid>

                          {/* Total Employees */}
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              No of Request
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerDetails.total_employees !== undefined
                                ? drawerDetails.total_employees
                                : "N/A"}
                              {/* Display the total number of employees or "N/A" if not available */}
                            </Typography>
                          </Grid>

                          {/* Present Count */}
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              Present Count
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerDetails.present_count !== undefined
                                ? drawerDetails.present_count
                                : "N/A"}
                              {/* Display the present count or "N/A" if not available */}
                            </Typography>
                          </Grid>
                        </Grid>
                        {childTravelData && (
                          <>
                            <table className="table table-bordered">
                              <thead>
                                <tr>
                                  <th>Parameter</th>
                                  <th>Cost per Qty</th>
                                  <th>Total Qty</th>
                                  <th>Coins</th>
                                </tr>
                              </thead>
                              <tbody>
                                {childTravelData.bill_details?.map(
                                  (item, index) => {
                                    // Perform the calculation
                                    const calculatedCoins =
                                      item.cost_per_qty * item.total_quantity;

                                    return (
                                      <tr key={index}>
                                        <td>{item.parameter}</td>
                                        <td>{item.cost_per_qty}</td>
                                        <td>{item.total_quantity}</td>
                                        <td>{calculatedCoins}</td>
                                      </tr>
                                    );
                                  }
                                )}

                                {/* Calculate the total coins if there are multiple rows */}
                                <tr>
                                  <td
                                    colSpan="3"
                                    style={{ textAlign: "right" }}
                                  >
                                    <strong>Total Amount:</strong>
                                  </td>
                                  <td>
                                    <strong>
                                      {childTravelData.bill_details?.reduce(
                                        (acc, item) =>
                                          acc +
                                          item.cost_per_qty *
                                            item.total_quantity,
                                        0
                                      )}
                                    </strong>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </>
                        )}
                      </>
                    )}
                  </Grid>

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

export default TrackBills;
