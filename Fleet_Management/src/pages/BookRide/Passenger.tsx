import React, { useEffect, useState, createContext } from "react";

import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormGroup,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  Modal,
  Chip,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { createTheme } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { toast } from "react-toastify";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import { useFrappeCreateDoc, useFrappeGetDocList } from "frappe-react-sdk";
import { ThemeProvider } from "@mui/material";

import dayjs from "dayjs";
interface PassengerProps {
  darkMode: boolean;
  onCloseDrawer: () => void;
  userEmailId: string;
  employeeID: string;
  userName: string;
}

const Passenger: React.FC<PassengerProps> = ({
  darkMode,
  onCloseDrawer,
  userEmailId,
  employeeID,
  userName,
}) => {
  const [rideType, setRideType] = useState("");
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [purpose, setPurpose] = useState("");
  const [rideDate, setRideDate] = useState(null);
  const [rideMoreDates, setRideMoreDates] = useState([]);
  const [currentdate, setCurrentDate] = useState(null);

  const [rideTime, setRideTime] = useState(null);
  const [travelMore, setTravelMore] = useState(false);
  const [terms, setTerms] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  // const [travelMore, SetTravelMore] = useState(false);

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

  useEffect(() => {
    const today = dayjs().format("DD-MM-YYYY");
    setCurrentDate(today);
  }, []);

  const handleCancel = () => {
    onCloseDrawer();
    setRideType("");
    setFromLocation("");
    setToLocation("");
    setRideDate(null);
    setTravelMore(false);
    setTerms(false);
    setOpenModal(false);
    setRideTime(null);
  };

  const Changeride = (event) => {
    setRideType(event.target.value);
  };

  const handleToLocationChange = (event, newValue) => {
    if (newValue === fromLocation) {
      toast.warning("The From and To locations cannot be the same.");
      setToLocation("");
    } else {
      setToLocation(newValue);
    }
  };

  const today = dayjs();

  const handleFromDateChange = (date) => {
    if (dayjs(date).isValid()) {
      const formattedDate = dayjs(date).format("DD-MM-YYYY");
      setRideDate(formattedDate);
    } else {
      toast.error("Invalid date selected");
      setRideDate(null);
    }
  };

  const date_time = `${rideDate} ${rideTime}`;

  const handleFromTimeChange = (time) => {
    if (dayjs(time).isValid()) {
      const formattedTime = dayjs(time).format("HH:mm:ss");
      setRideTime(formattedTime);
    } else {
      toast.error("Invalid time selected");
      setRideTime(null);
    }
  };

  // Start Multi dates
  const handleMoreDateChange = (date) => {
    if (dayjs(date).isValid()) {
      const formattedDate = dayjs(date).format("DD-MM-YYYY");
      if (!rideMoreDates.includes(formattedDate)) {
        setRideMoreDates([...rideMoreDates, formattedDate]);
      } else {
        toast.warning("Date already selected");
      }
    } else {
      toast.warning("Invalid date selected");
    }
  };

  const moreDates = rideMoreDates.join(",");

  const handleRemoveDate = (dateToRemove) => {
    setRideMoreDates(rideMoreDates.filter((date) => date !== dateToRemove));
  };

  // END

  const handleTravelMoreChange = () => {
    setTravelMore((prevState) => !prevState);
    setRideMoreDates([]);
  };

  const handleTermsChange = () => {
    setOpenModal(true);
  };

  const handleAgree = () => {
    setTerms(true);
    setOpenModal(false);
  };
  const handleCancelAggr = () => {
    setTerms(false);
    setOpenModal(false);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  // ............ API Function ............

  const { data: RM_Project_Lead }: any = useFrappeGetDocList(
    "RM_Project_Lead",
    {
      fields: ["*"],
      filters: [["project_status", "=", "Active"]],
      limit: 100000,
      orderBy: {
        field: "modified",
        order: "desc",
      },
    }
  );

  const [projectName, setProjectName] = useState(RM_Project_Lead);

  useEffect(() => {
    setProjectName(RM_Project_Lead);
  }, [RM_Project_Lead]);

  const [selectedProject, setSelectedProject] = useState();

  const handleChange = (event) => {
    setSelectedProject(event.target.value);
  };

  // Save API
  const { createDoc } = useFrappeCreateDoc();

  const CreateBookRequest = async () => {
    try {
      const body = {
        type: rideType,
        project_name: selectedProject,
        from_location: fromLocation,
        to_location: toLocation,
        terms: terms,
        doctypename: "FM_Passenger_Vehicle_Request",
        employee_email: userEmailId,
        employee_name: userName,
        request_date_time: date_time,
        mod: travelMore,
        mod_dates: moreDates,
        purpose: purpose,
      };
      await createDoc("FM_Passenger_Vehicle_Request", body);
      toast.success("Request Created Successfully ");
      onCloseDrawer();
    } catch (error) {
      if (error.response) {
        const statusCode = error.response.status;
        const serverMessage = error.response.data?._server_messages;

        if (statusCode === 400) {
          toast.error("Bad request. Please check your input.");
        } else if (statusCode === 401) {
          toast.error("Unauthorized. Please log in.");
        } else if (statusCode === 404) {
          toast.error("Resource not found.");
        } else if (statusCode === 500) {
          toast.error("Internal server error. Please try again later.");
        } else if (serverMessage) {
          const parsedMessages = JSON.parse(serverMessage);
          const errorMessage = parsedMessages
            .map((msg) => JSON.parse(msg).message)
            .join(", ");
          toast.error(errorMessage);
        } else {
          toast.error(`Error: ${statusCode}`);
        }
      } else if (error.request) {
        toast.error(
          "No response received from server. Please try again later."
        );
      } else {
        toast.error(`${error.exception}`);
      }
    }
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box>
          <div className="m-4">
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                flexGrow={1}
                className="drawerTitle"
                sx={{ color: darkMode ? "#fff" : "#5b5b5b" }}
              >
                {rideType === "" ? "Book Ride" : rideType}
              </Box>
              <Button
                className="closeX"
                sx={{ color: darkMode ? "#fff" : "#5b5b5b" }}
                onClick={onCloseDrawer}
              >
                X
              </Button>
            </Box>
            <br />
            <br />
            <Box
              className="slideFromRight"
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <ThemeProvider theme={ThemeColor}>
                  <Box
                    className="slideFromRight"
                    width={{ xs: "100%", sm: "100%", md: "90%" }}
                    marginBottom="16px"
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <FormControl
                      variant="outlined"
                      sx={{ width: { xs: "100%", sm: "100%", md: "90%" } }}
                    >
                      <InputLabel>
                        Select Project Name {""}
                        <Typography className="CodeStar" variant="Code">
                          *
                        </Typography>
                      </InputLabel>
                      <Select
                        value={selectedProject}
                        onChange={handleChange}
                        label={
                          <>
                            Select Project Name{""}
                            <Typography className="CodeStar" variant="Code">
                              *
                            </Typography>
                          </>
                        }
                      >
                        <MenuItem value="General">General</MenuItem>
                        {projectName?.map((project) => (
                          <MenuItem
                            key={project?.name}
                            value={project.project_name}
                          >
                            {project.project_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box
                    className="slideFromRight delay-1"
                    width={{ xs: "100%", sm: "100%", md: "90%" }}
                    marginBottom="16px"
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <FormControl
                      variant="outlined"
                      sx={{ width: { xs: "100%", sm: "100%", md: "90%" } }}
                    >
                      <InputLabel>
                        Select Ride Type {""}
                        <Typography className="CodeStar" variant="Code">
                          *
                        </Typography>
                      </InputLabel>
                      <Select
                        value={rideType}
                        disabled={!selectedProject}
                        onChange={Changeride}
                        label={<> Select Ride Type {""}</>}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              textAlign: "left",
                            },
                          },
                        }}
                      >
                        <MenuItem value="Travel within Office">
                          Travel within Office
                        </MenuItem>
                        <MenuItem value="Vendor Site Visit">
                          Vendor Site Visit
                        </MenuItem>
                        <MenuItem value="For Advisors">For Advisors</MenuItem>
                        <MenuItem value="Health Emergency">
                          Health Emergency
                        </MenuItem>
                        <MenuItem value="Others">Others</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box
                    className="slideFromRight delay-2"
                    width={{ xs: "100%", sm: "100%", md: "90%" }}
                    textAlign={"center"}
                    marginBottom="16px"
                  >
                    <Autocomplete
                      freeSolo
                      disableClearable
                      value={fromLocation}
                      onChange={(event, newValue) => {
                        setFromLocation(newValue);
                        setToLocation("");
                      }}
                      inputValue={fromLocation}
                      onInputChange={(event, newInputValue) => {
                        setFromLocation(newInputValue);
                        setToLocation("");
                      }}
                      disabled={!selectedProject || !rideType}
                      options={["Research Park", "Thaiyur", "Shar"]}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={
                            <>
                              Select From Location {""}
                              <Typography variant="code" className="CodeStar">
                                *
                              </Typography>
                            </>
                          }
                          variant="outlined"
                          sx={{
                            width: { xs: "100%", sm: "100%", md: "90%" },
                            textAlign: "left",
                          }}
                        />
                      )}
                    />
                  </Box>

                  <Box
                    className="slideFromRight delay-2"
                    width={{ xs: "100%", sm: "100%", md: "90%" }}
                    textAlign={"center"}
                    marginBottom="16px"
                  >
                    <Autocomplete
                      freeSolo
                      disableClearable
                      value={toLocation}
                      onChange={(event, newValue) =>
                        handleToLocationChange(event, newValue)
                      }
                      inputValue={toLocation}
                      onInputChange={(event, newInputValue) =>
                        handleToLocationChange(event, newInputValue)
                      }
                      disabled={!rideType || !selectedProject || !fromLocation}
                      options={["Research Park", "Thaiyur", "Shar"]}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={
                            <>
                              Select To Location {""}
                              <Typography variant="code" className="CodeStar">
                                *
                              </Typography>
                            </>
                          }
                          variant="outlined"
                          sx={{
                            width: { xs: "100%", sm: "100%", md: "90%" },
                            textAlign: "left",
                          }}
                        />
                      )}
                    />
                  </Box>

                  <Box
                    className="slideFromRight delay-3"
                    width={{ xs: "100%", sm: "100%", md: "90%" }}
                    marginBottom="16px"
                    textAlign={"center"}
                  >
                    <DatePicker
                      label={
                        <Typography>
                          From <code className="CodeStar">*</code>
                        </Typography>
                      }
                      value={dayjs(rideDate, "DD-MM-YYYY")}
                      minDate={today}
                      disabled={
                        !rideType ||
                        !selectedProject ||
                        !fromLocation ||
                        !toLocation
                      }
                      sx={{
                        width: {
                          xs: "100%",
                          sm: "100%",
                          md: "90%",
                        },
                      }}
                      format="DD-MM-YYYY"
                      onChange={handleFromDateChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Select Date"
                        />
                      )}
                    />
                  </Box>

                  <Box
                    className="slideFromRight delay-3"
                    sx={{
                      width: {
                        xs: "90%",
                        sm: "90%",
                        md: "90%",
                      },
                    }}
                    marginBottom="16px"
                  >
                    <FormGroup
                      row
                      sx={{ display: "flex", justifyContent: "left" }}
                    >
                      <FormControlLabel
                        sx={{ marginLeft: { sm: "25px" } }}
                        disabled={!rideType || !selectedProject || !rideDate}
                        control={
                          <Checkbox
                            checked={travelMore}
                            onChange={handleTravelMoreChange}
                          />
                        }
                        label="Travel more than one day"
                      />
                    </FormGroup>
                  </Box>

                  {travelMore === true && (
                    <>
                      <Box
                        width={{ xs: "100%", sm: "100%", md: "90%" }}
                        marginBottom="16px"
                        textAlign={"center"}
                      >
                        <DatePicker
                          label={
                            <Typography>
                              Select Date <code className="CodeStar">*</code>
                            </Typography>
                          }
                          value={null}
                          minDate={dayjs(rideDate, "DD-MM-YYYY")}
                          sx={{
                            width: {
                              xs: "100%",
                              sm: "100%",
                              md: "90%",
                            },
                          }}
                          format="DD-MM-YYYY"
                          onChange={handleMoreDateChange}
                          renderInput={(params) => (
                            <TextField {...params} variant="outlined" />
                          )}
                        />

                        <Box mt={2} className="slideFromRight">
                          {rideMoreDates?.map((date, index) => (
                            <Chip
                              key={index}
                              label={date}
                              onDelete={() => handleRemoveDate(date)}
                              sx={{
                                margin: "2px",
                                padding: "5px",
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    </>
                  )}

                  <Box
                    className="slideFromRight delay-4"
                    width={{ xs: "100%", sm: "100%", md: "90%" }}
                    marginBottom="16px"
                    textAlign={"center"}
                  >
                    <TimePicker
                      label={
                        <>
                          Time{" "}
                          <Typography variant="code" className="CodeStar">
                            *
                          </Typography>
                        </>
                      }
                      sx={{
                        width: {
                          xs: "100%",
                          sm: "100%",
                          md: "90%",
                        },
                      }}
                      value={dayjs(rideTime, "HH:mm:ss")}
                      ampm={false}
                      disabled={
                        !rideType ||
                        !selectedProject ||
                        !fromLocation ||
                        !toLocation ||
                        !rideDate ||
                        (travelMore && rideMoreDates.length === 0)
                      }
                      onChange={handleFromTimeChange}
                      renderInput={(params) => <TextField {...params} />}
                      adapter={AdapterDayjs}
                    />
                  </Box>
                  <Box
                    className="slideFromRight delay-5"
                    width={{ xs: "100%", sm: "100%", md: "90%" }}
                    marginBottom="16px"
                    textAlign={"center"}
                  >
                    <TextField
                      label={
                        <Typography>
                          Purpose <code className="CodeStar"> *</code>
                        </Typography>
                      }
                      multiline
                      rows={2}
                      variant="outlined"
                      value={purpose}
                      disabled={
                        !rideType ||
                        !selectedProject ||
                        !fromLocation ||
                        !toLocation ||
                        !rideDate ||
                        !rideTime
                      }
                      sx={{
                        width: {
                          xs: "100%",
                          sm: "100%",
                          md: "90%",
                        },
                      }}
                      onChange={(e) => {
                        setPurpose(e.target.value);
                      }}
                    />
                  </Box>
                  <br />

                  <Box
                    className="slideFromRight delay-5"
                    sx={{
                      width: {
                        xs: "90%",
                        sm: "90%",
                        md: "90%",
                      },
                    }}
                    marginBottom="16px"
                  >
                    <FormGroup
                      row
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <FormControlLabel
                        sx={{ color: "#4D8C52" }}
                        control={
                          <Checkbox
                            checked={terms}
                            onChange={handleTermsChange}
                            disabled={
                              !rideType ||
                              !selectedProject ||
                              !fromLocation ||
                              !toLocation ||
                              !rideDate ||
                              !rideTime ||
                              !purpose ||
                              (travelMore && rideMoreDates.length === 0)
                            }
                          />
                        }
                        label="Terms & Conditions"
                      />
                    </FormGroup>
                  </Box>
                </ThemeProvider>
              </LocalizationProvider>

              {terms === true && (
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Box sx={{ display: "flex" }}>
                    <Button className="cancelBtn" onClick={handleCancel}>
                      Cancel
                    </Button>

                    <Button className="saveBtn" onClick={CreateBookRequest}>
                      Submit
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          </div>
        </Box>
        {/* Model */}
        <Modal
          open={openModal}
          onClose={handleClose}
          aria-labelledby="terms-modal-title"
          aria-describedby="terms-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 800,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 2,
              borderRadius: 1,
              maxHeight: "90vh",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h2
              id="modal-title"
              style={{
                background: "#5C8A58",
                color: "#fff",
                fontSize: "24px",
                fontWeight: 600,
                padding: "10px",
                textAlign: "center",
              }}
            >
              Terms & Conditions
            </h2>

            <div
              id="modal-description"
              className="description"
              style={{
                flexGrow: 1,
                overflowY: "auto",
                padding: "16px",
                marginBottom: "16px",
              }}
            >
              <p className="TermSubtitle">
                **Transportation Liability Exemption Waiver**
              </p>
              <ul>
                <li>
                  This Transportation Liability Exemption Waiver ("Waiver") is
                  entered into by and between Agnikul Cosmos Private Limited, a
                  company incorporated in India, having its registered office at
                  [Company Address] (hereinafter referred to as the "Company")
                  and the employees or passengers availing transportation
                  services provided by the Company (hereinafter referred to as
                  the "Passenger").
                </li>
                <br />
                <li>
                  **WHEREAS**, the Passenger voluntarily chooses to avail
                  themselves of Agnikul Cosmos Private Limited's transportation
                  services.
                </li>
                <br />
                <li>
                  **NOW, THEREFORE**, in consideration of the benefits of the
                  transportation services provided by Agnikul Cosmos Private
                  Limited, the Passenger hereby acknowledges and agrees to the
                  following terms and conditions:
                </li>
                <br />
                <li>
                  **Assumption of Risk**: The Passenger acknowledges that
                  transportation involves inherent risks, and by choosing to use
                  Agnikul Cosmos Private Limited's transportation services, they
                  voluntarily assume all such risks. The Passenger agrees that
                  Agnikul Cosmos Private Limited shall not be liable for any
                  injuries, damages, losses, or other liabilities arising out of
                  or in connection with the use of transportation services.
                </li>
                <br />
                <li>
                  **Release of Liability**: The Passenger, on behalf of
                  themselves and their heirs, assigns, and legal
                  representatives, releases and discharges Agnikul Cosmos
                  Private Limited, its officers, employees, agents, and
                  contractors from any and all liability for any claims,
                  demands, actions, or causes of action arising out of or
                  related to the use of transportation services.
                </li>
                <br />
                <li>
                  **Indemnification**: The Passenger agrees to indemnify and
                  hold Agnikul Cosmos Private Limited harmless from any claims,
                  demands, or actions brought by third parties arising out of or
                  in connection with the Passenger's use of the transportation
                  services.
                </li>
                <br />
                <li>
                  **Compliance with Rules and Regulations**: The Passenger
                  agrees to comply with all applicable laws, rules, and
                  regulations while using Agnikul Cosmos Private Limited's
                  transportation services. Failure to comply may result in the
                  termination of transportation services.
                </li>
                <br />
                <li>
                  **No Warranty**: Agnikul Cosmos Private Limited makes no
                  warranties, express or implied, regarding the transportation
                  services, including but not limited to the safety, timeliness,
                  or suitability of the services for any particular purpose.
                </li>
                <br />
                <li>
                  **Changes to Terms and Conditions**: Agnikul Cosmos Private
                  Limited reserves the right to change or update the terms and
                  conditions of this Waiver at any time. The Passenger will be
                  notified of any such changes.
                </li>
                <br />
                <li>
                  **Governing Law**: This Waiver shall be governed by and
                  construed in accordance with the laws of India, and any
                  disputes arising under or in connection with this Waiver shall
                  be subject to the exclusive jurisdiction of the courts in
                  [Jurisdiction].
                </li>
              </ul>

              <p>
                By availing Agnikul Cosmos Private Limited's transportation
                services, the Passenger acknowledges that they have read and
                understood this Waiver and voluntarily agree to its terms and
                conditions.
              </p>
            </div>
            <Box
              sx={{
                fontSize: "16px",
                color: "#000",
                padding: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <p>Name : {userName} </p>
                <p>Date : {currentdate} </p>
              </Box>
              <Box>
                <Button
                  className="cancelBtn"
                  onClick={handleCancelAggr}
                  sx={{ alignSelf: "center" }}
                >
                  Cancel
                </Button>
                <Button
                  className="saveBtn"
                  onClick={handleAgree}
                  sx={{ alignSelf: "center" }}
                >
                  Agree
                </Button>
              </Box>
            </Box>
          </Box>
        </Modal>
      </LocalizationProvider>
    </>
  );
};

export default Passenger;
