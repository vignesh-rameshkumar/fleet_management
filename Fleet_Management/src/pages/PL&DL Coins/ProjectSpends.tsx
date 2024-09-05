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
  InputLabel,
  SvgIcon,
} from "@mui/material";
import dayjs from "dayjs";
import { MdOutlineVisibility, MdDeleteForever } from "react-icons/md";
import {
  useFrappeGetDocList,
  useFrappeUpdateDoc,
  useFrappeGetCall,
} from "frappe-react-sdk";
import { IoCarSportSharp } from "react-icons/io5";
import { PiCoinsBold } from "react-icons/pi";
interface ProjectSpendsProps {
  darkMode: boolean;
  onCloseDrawer: () => void;
  userEmailId: string;
  employeeID: string;
  userName: string;
}

const ProjectSpends: React.FC<ProjectSpendsProps> = ({
  darkMode,
  onCloseDrawer,
  userEmailId,
}) => {
  // State
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [drawerDetails, setDrawerDetails] = useState<any>({});
  const [tableData, setTableData] = useState<any[]>([]);
  const [drawerData, setDrawerData] = useState<any[]>([]);
  const [view, setView] = useState<boolean>(false);
  const [billData, setBillData] = useState<any[]>([]);
  const [calendarView, setCalendarView] = useState("day"); // Default to "day"
  const [selectedDay, setSelectedDay] = useState(dayjs().format("YYYY-MM-DD")); // Current date
  const [selectedWeek, setSelectedWeek] = useState({
    start: dayjs().startOf("week").format("YYYY-MM-DD"),
    end: dayjs().endOf("week").format("YYYY-MM-DD"),
  });
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("MMMM"));
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [projectleadlist, setProjectleadlist] = useState<any[]>([]);
  const [selectedProjectName, setSelectedProjectName] = useState<string>("");
  useEffect(() => {
    const filterInput = document.querySelector(".form-control");
    if (filterInput) {
      filterInput.placeholder = "Request Type";
    }
  }, []);

  // handle calendar
  const handleProjectNameChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setSelectedProjectName(event.target.value as string);
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

  const getFilter = (): [string, string, string][] => {
    let filters: [string, string, string][] = [];

    if (calendarView === "day") {
      const startOfDay = selectedDay + " 00:00:00";
      const endOfDay = selectedDay + " 23:59:59";
      filters = [
        ["creation", ">=", startOfDay],
        ["creation", "<=", endOfDay],
      ];
    } else if (calendarView === "week") {
      const startOfWeek = selectedWeek.start + " 00:00:00";
      const endOfWeek = selectedWeek.end + " 23:59:59";
      filters = [
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
      filters = [
        ["creation", ">=", `${startOfMonth} 00:00:00`],
        ["creation", "<=", `${endOfMonth} 23:59:59`],
      ];
    } else if (calendarView === "year") {
      const startOfYear = `${selectedYear}-01-01 00:00:00`;
      const endOfYear = `${selectedYear}-12-31 23:59:59`;
      filters = [
        ["creation", ">=", startOfYear],
        ["creation", "<=", endOfYear],
      ];
    }
    // Add the ride_status filter
    filters.push(["ride_status", "=", "Completed"]);

    // Add the project_name filter to the existing filters
    if (selectedProjectName) {
      filters.push(["project_name", "=", selectedProjectName]);
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
    }
  );

  // Set table data when the fetched data changes
  useEffect(() => {
    if (FM_Request_Master) {
      setTableData(FM_Request_Master);
    }
  }, [FM_Request_Master]);

  const doctypeName = drawerDetails.doctypename;
  const documentName = drawerDetails.request_id;
  // const bill_details = billData?.message?.bill_details;

  const { data: specificData, isLoading: isLoadingSpecific } =
    useFrappeGetDocList(doctypeName || "", {
      fields: ["*"],
      orderBy: {
        field: "modified",
        order: "desc",
      },
      filters: documentName ? [["name", "=", documentName]] : [],
      limit: 1,
    });

  // Update drawer data when specific data changes
  useEffect(() => {
    if (specificData) {
      setDrawerData(specificData);
    }
  }, [specificData]);

  const { data: FM_Bills_Projectlead } = useFrappeGetCall(
    "fleet_management.custom_function.get_bill_details",
    {
      request_id: drawerDetails.request_id,
    }
  );

  useEffect(() => {
    if (FM_Bills_Projectlead?.message?.bill_details) {
      setBillData(FM_Bills_Projectlead.message.bill_details);
    } else {
      console.error(
        "Bill details are not available",
        FM_Bills_Projectlead?.error
      );
    }
  }, [FM_Bills_Projectlead]);
  console.log("selectedProjectName", selectedProjectName);
  // Fetch and set Project_Lead_List
  const { data: Project_Lead_List, isLoading: projectnameloading } =
    useFrappeGetDocList("RM_Project_Lead", {
      fields: ["*"],
      filters: [["project_lead_email", "=", userEmailId]],
      orderBy: {
        field: "modified",
        order: "desc",
      },
    });

  useEffect(() => {
    if (Project_Lead_List) {
      setProjectleadlist(Project_Lead_List);
      // Set the default selected project to the first project in the list
      if (Project_Lead_List.length > 0) {
        setSelectedProjectName(Project_Lead_List[0].project_name);
      }
    }
  }, [Project_Lead_List]);

  // Handle drawer toggle
  const toggleDrawer = (open: boolean) => {
    setIsOpen(open);
  };

  const handleCloseDrawer = () => {
    toggleDrawer(false);
  };

  // Columns definition for the table
  const columns = [
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

  const handleRowClick = (item: any) => {
    //setSelectedRowItem(item);
    toggleDrawer(true);
    setView(true);
    setDrawerDetails(item);
  };
  const filteredData = tableData.filter(
    (item) =>
      item.bill_amount !== null &&
      item.bill_amount !== 0 &&
      item.bill_amount !== ""
  );

  // Calculate total project spends (number of items)
  const totalProjectSpends = filteredData.length;

  // Calculate total bill amount
  const totalBillAmount = filteredData.reduce((acc, item) => {
    return acc + (item.bill_amount ? Number(item.bill_amount) : 0);
  }, 0);
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
        Department Spends
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
            gap: 2, // Adjusted gap for better spacing
            p: 2,
            flexWrap: "wrap",
            alignItems: "center", // Aligned items to the center
            justifyContent: "space-between", // Distributes items evenly across the row
          }}
        >
          {/* Project Name Dropdown */}
          <Box sx={{ flex: "1 1 20%" }}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Project Name</InputLabel>
              <Select
                value={selectedProjectName}
                onChange={handleProjectNameChange}
                label="Project Name"
              >
                {projectleadlist.map((project, index) => (
                  <MenuItem
                    key={project.name}
                    value={project.project_name}
                    style={{
                      backgroundColor:
                        selectedProjectName === project.project_name
                          ? index === 0
                            ? "#ADD8E6"
                            : "lightgreen"
                          : "transparent",
                    }}
                  >
                    {project.project_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Total Project Spends Card */}
          <Box sx={{ flex: "2 1 20%" }}>
            <Card
              sx={{
                borderLeft: "solid 5px blue",
                backgroundColor: "white",
                width: "100%", // Ensure the card takes up available width within the flexbox
                height: "100px", // Adjusted height for a smaller card
                padding: "4px", // Adjusted padding inside the card
              }}
            >
              <CardContent sx={{ padding: "8px" }}>
                <Typography
                  variant="h6"
                  align="center"
                  sx={{ mb: 1, fontSize: "0.875rem" }}
                >
                  Total Project Spends
                </Typography>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Grid item>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <IoCarSportSharp />
                      <Typography
                        variant="body1"
                        sx={{ ml: 1, fontSize: "0.875rem" }}
                      >
                        {totalProjectSpends}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <PiCoinsBold />
                      <Typography
                        variant="body1"
                        sx={{ ml: 1, fontSize: "0.875rem" }}
                      >
                        {totalBillAmount.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>

          {/* Calendar View Selector and Date Input */}
          <Box
            sx={{
              display: "flex",
              flex: "1 1 40%", // Adjusted flex properties for better scaling
              gap: 2,
              alignItems: "center", // Center items vertically
              justifyContent: "flex-end", // Align to the right
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

            <Box sx={{ flex: 1 }}>
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

        {/* {JSON.stringify(FM_Bills_Projectlead)} */}
        <CSmartTable
          cleaner
          clickableRows
          columns={columns}
          columnFilter
          columnSorter
          items={filteredData}
          itemsPerPageSelect
          itemsPerPage={10}
          pagination
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
                  <Grid container spacing={2} sx={{ marginTop: 2 }}>
                    {doctypeName !== "FM_Equipment_Vehicle_Request" && (
                      <>
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                            }}
                          >
                            From Location
                          </Typography>
                          <Typography variant="body1">
                            {drawerData[0]?.from_location || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                            }}
                          >
                            To Location
                          </Typography>
                          <Typography variant="body1">
                            {drawerData[0]?.to_location || "N/A"}
                          </Typography>
                        </Grid>
                      </>
                    )}
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        Request Date
                      </Typography>
                      <Typography variant="body1">
                        {`${new Date(drawerDetails.creation)
                          .getDate()
                          .toString()
                          .padStart(2, "0")}-${(
                          new Date(drawerDetails.creation).getMonth() + 1
                        )
                          .toString()
                          .padStart(2, "0")}-${new Date(
                          drawerDetails.creation
                        ).getFullYear()}`}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        Request Time
                      </Typography>
                      <Typography variant="body1">
                        {new Date(drawerDetails.creation).toLocaleTimeString()}
                      </Typography>
                    </Grid>

                    {doctypeName === "FM_Equipment_Vehicle_Request" && (
                      <>
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                            }}
                          >
                            From Time
                          </Typography>
                          <Typography variant="body1">
                            {drawerData[0]?.from_time || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                            }}
                          >
                            To Time
                          </Typography>
                          <Typography variant="body1">
                            {drawerData[0]?.to_time || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                            }}
                          >
                            Equipment Type:
                          </Typography>
                          <Typography variant="body1">
                            {drawerData[0]?.equipment_type || "N/A"}
                          </Typography>
                        </Grid>
                      </>
                    )}

                    <Grid item xs={6}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        Project Name
                      </Typography>
                      <Typography variant="body1">
                        {drawerDetails.project_name}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        Coins Consumed
                      </Typography>
                      <Typography variant="body1">
                        {drawerDetails?.bill_amount}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        Ride Type
                      </Typography>
                      <Typography variant="body1">
                        {drawerDetails?.type}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        Payment Status
                      </Typography>
                      <Typography variant="body1">
                        {drawerDetails.payment_status}
                      </Typography>
                    </Grid>

                    {drawerData[0]?.mod === 1 && (
                      <>
                        <Grid item xs={12}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                            }}
                          >
                            Travel More Than One Day Dates:
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ color: "blue", fontStyle: "italic" }}
                          >
                            {drawerData[0]?.mod_dates.split(",").join(" | ")}
                          </Typography>
                        </Grid>
                      </>
                    )}
                    <Grid item xs={12}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        Purpose
                      </Typography>
                      <Typography variant="body1">
                        {drawerData[0]?.purpose}
                      </Typography>
                    </Grid>
                    {doctypeName === "FM_Goods_Vehicle_Request" && (
                      <>
                        <Grid item xs={12}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                            }}
                          >
                            Description:
                          </Typography>
                          <Typography variant="body1">
                            {drawerData[0]?.description || "N/A"}
                          </Typography>
                        </Grid>
                      </>
                    )}
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
                        {billData?.map((item, index) => {
                          const calculatedCoins =
                            item?.cost_per_qty * item?.total_quantity;

                          return (
                            <tr key={index}>
                              <td>{item?.parameter || "N/A"}</td>
                              <td>{item?.cost_per_qty || "N/A"}</td>
                              <td>{item?.total_quantity || "N/A"}</td>
                              <td>{calculatedCoins || "N/A"}</td>
                            </tr>
                          );
                        })}
                        <tr>
                          <td colSpan="3" style={{ textAlign: "right" }}>
                            <strong>Total Amount:</strong>
                          </td>
                          <td>
                            <strong>
                              {billData?.reduce(
                                (acc, item) =>
                                  acc +
                                  (item?.cost_per_qty || 0) *
                                    (item?.total_quantity || 0),
                                0
                              )}
                            </strong>
                          </td>
                        </tr>
                      </tbody>
                    </table>
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

export default ProjectSpends;
