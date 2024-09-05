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
  MenuItem,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
} from "@mui/material";
import { MdOutlineVisibility, MdDeleteForever } from "react-icons/md";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import {
  useFrappeGetDocList,
  useFrappeUpdateDoc,
  useFrappeCreateDoc,
  useFrappeFileUpload,
} from "frappe-react-sdk";
interface CreateCoinsProps {
  darkMode: boolean;
  onCloseDrawer: () => void;
  userEmailId: string;
  employeeID: string;
  userName: string;
}

const CreateCoins: React.FC<CreateCoinsProps> = ({
  darkMode,
  onCloseDrawer,
  userEmailId,
}) => {
  // State
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [tableData, setTableData] = useState<any[]>([]);
  const [view, setView] = useState<boolean>(false);
  // State for Coins and Reason
  const [coins, setCoins] = useState("");
  const [coinsError, setCoinsError] = useState("");
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState("");
  // States for pagination
  const [currentPage, setCurrentPage] = useState(1); // Start from the first page
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page
  //calendar
  const [calendarView, setCalendarView] = useState<"month" | "year">("month");
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("MMMM"));
  const [selectedYear, setSelectedYear] = useState(dayjs().year()); // Current year
  useEffect(() => {
    const filterInput = document.querySelector(".form-control");
    if (filterInput) {
      filterInput.placeholder = "Request Type";
    }
  }, []);

  // Handle drawer toggle
  const toggleDrawer = (open: boolean) => {
    setIsOpen(open);
  };

  const handleCloseDrawer = () => {
    toggleDrawer(false);
  };
  // handle change

  // validation  // Handler for validating and setting Coins input
  const handleCoinsChange = (value) => {
    if (/^\d*$/.test(value)) {
      setCoins(value);
      setCoinsError(value ? "" : "Coins is required");
    } else {
      setCoinsError("Only numbers are allowed");
    }
  };
  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  // Handler for validating and setting Reason input
  const handleReasonChange = (value) => {
    setReason(value);

    if (value.length < 15) {
      setReasonError("Reason must be at least 15 characters long.");
    } else {
      setReasonError("");
    }
  };
  const handleCancel = () => {
    setReason("");
    setCoins("");
  };
  // calendar handle change
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
  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: "month" | "year"
  ) => {
    if (newView !== null) {
      setCalendarView(newView);
    }
  };

  const handleMonthChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedMonth(event.target.value as string);
  };

  const handleYearChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedYear(event.target.value as number);
  };

  const renderMonths = () => {
    return months.map((month) => (
      <MenuItem key={month} value={month}>
        {month}
      </MenuItem>
    ));
  };
  // Function to generate years (example: from 2000 to the current year)
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
  //api
  const {
    createDoc,
    loading: coinsLoading,
    isCompleted,
    error,
    reset,
  } = useFrappeCreateDoc();
  const CreateCoinsDetails = async () => {
    try {
      // Base request body
      const requestBody = {
        reason: reason,
        coins: coins,
      };

      // Create the document
      await createDoc("FM_Manager_Coins", requestBody);
      handleCancel();
      toggleDrawer(false);

      reset;
      // Reset form if contractor process is completed

      toast.success("Coins Created Successfully");
    } catch (error) {
      handleRequestError(error);
      console.log("error", error);
    }
  };
  // Helper function to handle errors
  const handleRequestError = (error) => {
    if (error.response) {
      const statusCode = error.response.status;
      const serverMessage = error.response.data?._server_messages;

      switch (statusCode) {
        case 400:
          toast.error("Bad request. Please check your input.");
          break;
        case 401:
          toast.error("Unauthorized. Please log in.");
          break;
        case 404:
          toast.error("Resource not found.");
          break;
        case 500:
          toast.error("Internal server error. Please try again later.");
          break;
        default:
          if (serverMessage) {
            const parsedMessages = JSON.parse(serverMessage);
            const errorMessage = parsedMessages
              .map((msg) => JSON.parse(msg).message)
              .join(", ");
            toast.error(errorMessage);
          } else {
            toast.error(`Error: ${statusCode}`);
          }
      }
    } else if (error.request) {
      toast.error("No response received from server. Please try again later.");
    } else {
      toast.error(`${error.exception}`);
    }
  };
  const getFilter = () => {
    if (calendarView === "month") {
      const startOfMonth = dayjs()
        .month(months.indexOf(selectedMonth))
        .startOf("month")
        .format("YYYY-MM-DD");
      const endOfMonth = dayjs()
        .month(months.indexOf(selectedMonth))
        .endOf("month")
        .format("YYYY-MM-DD");
      return [
        ["modified", ">=", `${startOfMonth} 00:00:00`],
        ["modified", "<=", `${endOfMonth} 23:59:59`],
      ];
    } else {
      const startOfYear = `${selectedYear}-01-01 00:00:00`;
      const endOfYear = `${selectedYear}-12-31 23:59:59`;
      return [
        ["modified", ">=", startOfYear],
        ["modified", "<=", endOfYear],
      ];
    }
  };
  const { data: FM_Manager_Coins, isLoading: coinLoading } =
    useFrappeGetDocList("FM_Manager_Coins", {
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
    if (FM_Manager_Coins) {
      setTableData(FM_Manager_Coins);
    }
  }, [FM_Manager_Coins, currentPage, itemsPerPage]);

  // console.log("year and month:", selectedMonth, selectedYear);
  // Columns definition for the table
  const columns = [
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
      key: "coins",
      label: "Created coins",
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
      key: "reason",
      label: "Reason",
      _style: {
        width: "15%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
      },
    },
  ];

  const handleRowClick = (item: any) => {
    //setSelectedRowItem(item);
    toggleDrawer(true);
    setView(true);
  };

  const totalCoinAmount = tableData.reduce(
    (acc, item) => acc + parseFloat(item.coins || 0), // Summing up the 'coins' field
    0
  );
  // console.log("tableData", tableData);
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
        Create Coins
      </Box>

      <div
        style={{
          backgroundColor: darkMode ? "#222222" : "#fff",
          padding: "15px",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-around" }}>
          {" "}
          <Box sx={{ display: "flex", justifyContent: "start" }}>
            <Box
              sx={{
                color: "#FFFFFF",
                backgroundColor: "#487644",
                padding: "10px 20px",
                borderRadius: "8px",
                float: "left",
                marginBottom: "5px",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
              }}
              onClick={() => {
                toggleDrawer(true);
                setView(true);
              }}
            >
              <AddIcon sx={{ marginRight: "8px" }} />
              Create Coins
            </Box>
            <Typography
              sx={{
                color: "#625770",
                backgroundColor: "#F4EBFF",
                padding: "10px 20px",
                borderRadius: "8px",
                float: "left",
                marginBottom: "5px",
                marginLeft: "10px",
                fontSize: "15px",
                fontWeight: 600,
                width: "12vw",
                borderLeft: "4px solid #BA87FC",
              }}
            >
              Coins {totalCoinAmount}
            </Typography>
          </Box>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <ToggleButtonGroup
              value={calendarView}
              exclusive
              onChange={handleViewChange}
              aria-label="Month Year Selector"
              sx={{ marginRight: "20px" }}
            >
              <ToggleButton
                value="month"
                aria-label="Month"
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#5C8A58", // Active background color
                    color: "white", // Active text color
                    "&:hover": {
                      backgroundColor: "#4e724a", // Slightly darker hover color
                    },
                  },
                }}
              >
                Month
              </ToggleButton>
              <ToggleButton
                value="year"
                aria-label="Year"
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#5C8A58", // Active background color
                    color: "white", // Active text color
                    "&:hover": {
                      backgroundColor: "#4e724a", // Slightly darker hover color
                    },
                  },
                }}
              >
                Year
              </ToggleButton>
            </ToggleButtonGroup>

            {calendarView === "month" ? (
              <FormControl variant="outlined">
                <Select value={selectedMonth} onChange={handleMonthChange}>
                  {renderMonths()}
                </Select>
              </FormControl>
            ) : (
              <FormControl variant="outlined">
                <Select value={selectedYear} onChange={handleYearChange}>
                  {renderYears()}
                </Select>
              </FormControl>
            )}
          </div>
        </Box>

        <br />
        <br />
        <br />
        <CSmartTable
          cleaner
          clickableRows
          columns={columns}
          columnFilter
          columnSorter
          items={tableData}
          itemsPerPageSelect={{
            label: "Items helo per page",
            values: [10, 20, 30, 50, 100], // Options for items per page
            onItemsPerPageChange: handleItemsPerPageChange, // Function to handle change
          }}
          itemsPerPage={itemsPerPage} // Number of items per page
          activePage={currentPage} // Current page number
          onActivePageChange={handlePageChange} // Function
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
                      Create Coins
                    </Box>
                    <Button
                      className="closeX"
                      sx={{ color: darkMode ? "#d1d1d1" : "#5b5b5b" }}
                      onClick={handleCloseDrawer}
                    >
                      X
                    </Button>
                  </Box>
                  <br />
                  <br />
                  {/* Coins Input Field */}
                  <TextField
                    sx={{ width: "100%", marginBottom: 2 }}
                    label={
                      <span>
                        Coins <span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    value={coins}
                    onChange={(e) => handleCoinsChange(e.target.value)}
                    error={!!coinsError}
                    helperText={coinsError}
                    inputProps={{
                      maxLength: 15,
                    }}
                  />

                  {/* Reason Input Field */}
                  <TextField
                    sx={{ width: "100%", marginBottom: 2 }}
                    label={
                      <span>
                        Reason <span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    value={reason}
                    onChange={(e) => handleReasonChange(e.target.value)}
                    error={!!reasonError}
                    helperText={reasonError}
                    inputProps={{
                      maxLength: 500, // Assuming a reasonable max length for reason
                    }}
                    multiline
                    rows={4}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      padding: "20px",
                    }}
                  >
                    <Button
                      className="saveBtn"
                      disabled={!reason || !coins || coinsError || reasonError}
                      onClick={CreateCoinsDetails}
                    >
                      {coinsLoading ? "Submitting..." : "Submit"}
                    </Button>
                  </Box>
                </div>
              </Box>
            </Box>
          </>
        )}
      </Drawer>
    </>
  );
};

export default CreateCoins;
