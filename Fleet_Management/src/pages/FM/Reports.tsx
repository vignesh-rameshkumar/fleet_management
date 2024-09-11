import React, { useState, useEffect } from "react";
import { CSmartTable } from "@coreui/react-pro";
import {
  Box,
  Drawer,
  Button,
  Typography,
  Grid,
  IconButton,
  CircularProgress,
  FormControl,
  InputAdornment,
  MenuItem,
  TextField,
  FormControlLabel,
  Select,
  Radio,
  RadioGroup,
  CardContent,
} from "@mui/material";

import { MdOutlineVisibility, MdDeleteForever } from "react-icons/md";
import {
  useFrappeGetDocList,
  useFrappeUpdateDoc,
  useFrappeGetDoc,
} from "frappe-react-sdk";
import Autocomplete from "@mui/material/Autocomplete";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { ThemeProvider, createTheme } from "@mui/material";
import { HiPlusSm, HiMinusSm } from "react-icons/hi";
import { red } from "@mui/material/colors";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
interface ReportsProps {
  darkMode: boolean;
  onCloseDrawer: () => void;
  userEmailId: string;
  employeeID: string;
  userName: string;
}

const Reports: React.FC<ReportsProps> = ({
  darkMode,
  onCloseDrawer,
  userEmailId,
  employeeID,
  userName,
}) => {
  const ThemeColor = createTheme({
    palette: {
      primary: {
        main: darkMode ? "#d1d1d1" : "#2D5831",
      },
    },
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            "& fieldset": {
              borderColor: darkMode ? "#d1d1d1" : "",
              color: darkMode ? "#d1d1d1" : "#000",
            },
            "&:hover fieldset": {
              borderColor: darkMode ? "#d1d1d1" : "#3f9747",
            },
            "&.Mui-focused fieldset": {
              borderColor: darkMode ? "#d1d1d1" : "#3f9747",
            },
            "& input::placeholder": {
              color: darkMode ? "#d1d1d1" : "#000",
            },
            "& input": {
              color: darkMode ? "#d1d1d1" : "#5b5b5b",
            },
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            backgroundColor: "#EFFFEF !important",
            color: darkMode ? "#5b5b5b" : "#5b5b5b",
            "&:hover": {
              backgroundColor: "#4D8C52 !important",
              color: "#fff !important",
            },
          },
        },
      },

      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: darkMode ? "#d1d1d1" : "#5b5b5b",
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          input: {
            "&::placeholder": {
              color: darkMode ? "#d1d1d1" : "#000",
            },
            color: darkMode ? "#d1d1d1" : "#5b5b5b",
          },
        },
      },

      MuiSvgIcon: {
        styleOverrides: {
          root: {
            color: darkMode ? "#d1d1d1" : "#5b5b5b",
          },
        },
      },
      MuiRadio: {
        styleOverrides: {
          root: {
            "&$checked": {
              color: "#d1d1d1",
            },
          },
        },
      },
    },
  });
  const theme = createTheme({
    components: {
      MuiRadio: {
        styleOverrides: {
          root: {
            color: "#A5D0A9", // Light green color for unchecked state
            "&.Mui-checked": {
              color: "#4D8C52", // Darker green for checked state
            },
          },
        },
      },
    },
  });
  // State
  const [table, setTable] = useState(true);
  const [subHeadingLog, setSubHeadingLog] = useState(true);
  const [subRadioReports, setSubRadioReports] = useState(true);
  const [activeLog, setActiveLog] = useState("travelroute");
  const [tableData, setTableData] = useState<any[]>([]);
  const [card, setCard] = useState(true);
  const [approvedRequests, setApprovedRequests] = useState(0);
  const [rejectedRequests, setRejectedRequests] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [allRequests, setAllRequests] = useState(0);
  const [radioOptions, setRadioOptions] = useState([
    { value: "all", label: "All" },
    { value: "thaiyur_to_research_park", label: "Thaiyur to Research Park" },
    { value: "research_park_to_thaiyur", label: "Research Park to Thaiyur" },
    { value: "ambattur_to_thaiyur", label: "Ambattur to Thaiyur" },
  ]);
  const [selectedRadio, setSelectedRadio] = useState("all");
  const cardData = [
    {
      title: "All Requests",
      count: allRequests,
      color: "#6D57FA",
      icon: (
        <DescriptionOutlinedIcon sx={{ color: "#6D57FA", fontSize: "30px" }} />
      ),
    },
    {
      title: "Approved Request",
      count: approvedRequests,
      color: "#5C8A58",
      icon: (
        <CheckCircleOutlineIcon sx={{ color: "#5C8A58", fontSize: "30px" }} />
      ),
    },
    {
      title: "Rejected Request",
      count: rejectedRequests,
      color: "#BA3B34",
      icon: <CancelOutlinedIcon sx={{ color: "#BA3B34", fontSize: "30px" }} />,
    },
    {
      title: "Pending Request",
      count: pendingRequests,
      color: "#FFCC00",
      icon: (
        <HourglassEmptyOutlinedIcon
          sx={{ color: "#FFCC00", fontSize: "30px" }}
        />
      ),
    },
  ];
  const travelRouteColumns = [
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
      key: "employee_name",
      label: "Employee Name",
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
      key: "pickup_point",
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
      key: "drop_point",
      label: "Employee Name",
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
      key: "same_route",
      label: "Return via Same Route",
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
  const passengerRouteColumns = [
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
      key: "request_date_time",
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
      key: "employee_name",
      label: "Employee Name",
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
      key: "from_location",
      label: "From Location",
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
      key: "to_location",
      label: "To Location",
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
      key: "ride_start_time",
      label: "Ride Status",
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
  const goodsRouteColumns = [
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
      key: "request_date_time",
      label: "Request Date",
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
      key: "employee_name",
      label: "Employee Name",
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
      key: "from_location",
      label: "From Location",
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
      key: "to_location",
      label: "To Location",
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
      key: "ride_start_time",
      label: "status",
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
  const equipmentRouteColumns = [
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
      key: "request_date_time",
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
      key: "employee_name",
      label: "Employee Name",
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
      key: "employee_name",
      label: "Employee Name",
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
      key: "driver_name_no",
      label: "Asgn Driver Name",
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
      key: "ride_start_time",
      label: "Status",
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

  const [doctypeName, setDoctypeName] = useState("FM_Travel_Route_Request");
  const [columns, setColumns] = useState(travelRouteColumns);
  //handle change
  const handleRadioChange = (event) => {
    setSelectedRadio(event.target.value);
    // Add your logic here to filter the table data based on the selected radio option
  };
  const handleLogClick = (logType) => {
    setActiveLog(logType);
    if (logType === "travelroute") {
      setDoctypeName("FM_Travel_Route_Request");
      setColumns(travelRouteColumns);
      setSelectedRadio("all");
      setRadioOptions([
        { value: "all", label: "All" },
        {
          value: "thaiyur_to_research_park",
          label: "Thaiyur to Research Park",
        },
        {
          value: "research_park_to_thaiyur",
          label: "Research Park to Thaiyur",
        },
        { value: "ambattur_to_thaiyur", label: "Ambattur to Thaiyur" },
      ]);
    } else if (logType === "passenger") {
      setDoctypeName("FM_Passenger_Vehicle_Request");
      setColumns(passengerRouteColumns);
      setSelectedRadio("all");
      setRadioOptions([
        { value: "all", label: "All" },
        { value: "Travel within Office", label: "Travel within Office" },
        { value: "Vendor Site Visit", label: "Vendor Site Visit" },
        { value: "For Advisors", label: "Advisor" },
        { value: "Health Emergency", label: "Health Emergency" },
        { value: "Others", label: "Others" },
      ]);
    } else if (logType === "goods") {
      setDoctypeName("FM_Goods_Vehicle_Request");
      setSelectedRadio("all");
      setColumns(goodsRouteColumns);
      setRadioOptions([
        { value: "all", label: "All" },
        { value: "Pickup", label: "Pick Up" },
        { value: "Drop", label: "Drop" },
      ]);
    } else if (logType === "equipment") {
      setDoctypeName("FM_Equipment_Vehicle_Request");
      setColumns(equipmentRouteColumns);
      setSelectedRadio("all");
      setRadioOptions([
        { value: "all", label: "All" },
        { value: "Crane", label: "Crane" },
      ]);
    }
  };
  //api and useEffect
  const { data: ReportsData, isLoading: reportsDataLoading } =
    useFrappeGetDocList(doctypeName, {
      fields: ["*"],
      orderBy: {
        field: "modified",
        order: "desc",
      },
      limit: 9000000,
    });

  // Set table data when the fetched data changes
  useEffect(() => {
    if (ReportsData) {
      // Calculate counts based on status
      const approvedCount = ReportsData.filter(
        (item) => item.status === "Approved"
      ).length;
      const rejectedCount = ReportsData.filter(
        (item) => item.status === "Rejected"
      ).length;
      const pendingCount = ReportsData.filter(
        (item) => item.status === "Pending"
      ).length;
      const totalRequests = ReportsData.length;

      // Set counts
      setApprovedRequests(approvedCount);
      setRejectedRequests(rejectedCount);
      setPendingRequests(pendingCount);
      setAllRequests(totalRequests);
      let filteredData = ReportsData;

      // Apply filter based on selectedRadio
      if (selectedRadio !== "all") {
        filteredData = ReportsData.filter(
          (item) =>
            item.category === selectedRadio ||
            item.type === selectedRadio ||
            item.equipment_type === selectedRadio
        );
      }

      setTableData(filteredData);
    }
  }, [ReportsData, selectedRadio, doctypeName]);
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
        Report Details
      </Box>
      <div style={{ backgroundColor: "#fff", padding: "10px" }}>
        {subHeadingLog && (
          <>
            <div>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: "5px",
                  margin: "10px",
                  justifyContent: "space-evenly",
                  overflowX: "auto",
                }}
              >
                {["travelroute", "passenger", "goods", "equipment"].map(
                  (logType) => (
                    <Typography
                      key={logType}
                      onClick={() => handleLogClick(logType)}
                      sx={{
                        backgroundColor:
                          activeLog === logType ? "#E5F3E6" : "#f5f5f5",
                        cursor: "pointer",
                        padding: { xs: "8px", sm: "10px" },
                        borderRadius: "4px 4px 0 0",
                        width: { xs: "100%", sm: "20vw" },
                        display: "flex",
                        justifyContent: "center",
                        fontSize: { xs: "14px", sm: "16px" },
                        fontWeight: 600,
                        color: activeLog === logType ? "#375d33" : "#A1A1A1",
                        borderBottom:
                          activeLog === logType
                            ? "3px solid #487644"
                            : "3px solid transparent",
                      }}
                    >
                      {logType.charAt(0).toUpperCase() + logType.slice(1)}
                    </Typography>
                  )
                )}
              </Box>
            </div>
          </>
        )}

        {subRadioReports && (
          <>
            <ThemeProvider theme={theme}>
              <Box sx={{ margin: "20px" }}>
                <RadioGroup
                  row
                  value={selectedRadio}
                  onChange={handleRadioChange}
                >
                  {radioOptions.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio />}
                      label={option.label}
                    />
                  ))}
                </RadioGroup>
              </Box>
            </ThemeProvider>
          </>
        )}

        {cardData && (
          <Grid container spacing={2} sx={{ borderRadius: "10px" }}>
            {cardData.map((data, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box
                  sx={{
                    borderRadius: "10px",
                    borderLeft: `4px solid ${data.color}`,
                    backgroundColor: "#f9f9f9",
                    p: 0,
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <CardContent>
                    <div
                      style={{
                        color: "#5B5B5B",
                        fontWeight: "500",
                      }}
                    >
                      {data.title}
                    </div>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "18px",
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
        )}
        <br />

        {table && (
          <>
            <div
              style={{
                backgroundColor: darkMode ? "#222222" : "#fff",
                padding: "10px",
              }}
            >
              {/* {JSON.stringify(tableData)} */}
              <CSmartTable
                // cleaner
                clickableRows
                columns={columns}
                columnFilter
                columnSorter
                items={tableData}
                itemsPerPageSelect
                itemsPerPage={10}
                pagination
                // tableFilter
                tableProps={{
                  className: "add-this-class red-border",
                  responsive: true,
                  striped: true,
                  hover: true,
                }}
                // onRowClick={(item) => handleRowClick(item)}
                tableBodyProps={{
                  className: "align-middle tableData",
                }}
                scopedColumns={{
                  S_no: (_item, index) => <td>{index + 1}</td>,
                  incident_date: (item: any) => {
                    const date = new Date(item.creation);
                    const formattedDate = `${date
                      .getDate()
                      .toString()
                      .padStart(2, "0")}-${(date.getMonth() + 1)
                      .toString()
                      .padStart(2, "0")}-${date.getFullYear()}`;
                    return <td>{formattedDate}</td>;
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
                  request_date_time: (item: any) => {
                    const date = new Date(item.creation);
                    const formattedDate = `${date
                      .getDate()
                      .toString()
                      .padStart(2, "0")}-${(date.getMonth() + 1)
                      .toString()
                      .padStart(2, "0")}-${date.getFullYear()}`;
                    return <td>{formattedDate}</td>;
                  },
                  ride_start_time: (item: any) => {
                    let status;
                    if (item.ride_start_time && item.ride_end_time) {
                      status = "Completed";
                    } else if (item.ride_start_time) {
                      status = "Ongoing";
                    } else {
                      status = "Not Started";
                    }
                    return <td style={{ textAlign: "center" }}>{status}</td>;
                  },
                  same_route: (item: any) => {
                    return <td>{item.same_route === "1" ? "Yes" : "No"}</td>;
                  },
                  // accident_date: (item: any) => {
                  //   const date = new Date(item.creation);
                  //   const formattedDate = `${date
                  //     .getDate()
                  //     .toString()
                  //     .padStart(2, "0")}-${(date.getMonth() + 1)
                  //     .toString()
                  //     .padStart(2, "0")}-${date.getFullYear()}`;
                  //   return <td>{formattedDate}</td>;
                  // },

                  // action: (item) => (
                  //   <td className="ActionData">
                  //     <div className="viewicon">
                  //       <MdOutlineVisibility
                  //         size={20}
                  //         onClick={() => {
                  //           toggleDrawer(true);
                  //           setView(true);
                  //           setDrawerDetails(item);
                  //         }}
                  //       />
                  //     </div>
                  //   </td>
                  // ),
                }}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Reports;
