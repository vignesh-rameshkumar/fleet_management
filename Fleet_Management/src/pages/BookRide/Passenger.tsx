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
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { toast } from "react-toastify";
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
  const [rideType, SetRideType] = useState("");
  const [fromLocation, SetFromLocation] = useState("");
  const [toLocation, SetToLocation] = useState("");
  const [rideDate, SetRideDate] = useState(null);
  const [travelMore, SetTravelMore] = useState(false);
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

  const handleCancel = () => {
    onCloseDrawer();
    SetRideType("");
    SetFromLocation("");
    SetToLocation("");
    SetRideDate(null);
    SetTravelMore(false);
  };
  const Changeride = (event) => {
    SetRideType(event.target.value);
  };
  const HandleFromLocation = (event) => {
    const newFromLocation = event.target.value;
    SetFromLocation(newFromLocation);
    if (newFromLocation === toLocation) {
      SetToLocation("");
    }
  };

  const HandleToLocation = (event) => {
    const newToLocation = event.target.value;
    if (newToLocation === fromLocation) {
      toast.warning("The From and To locations cannot be the same.");
      SetToLocation("");
    } else {
      SetToLocation(newToLocation);
    }
  };
  const today = dayjs();
  const handleFromDateChange = (date) => {
    SetRideDate(date);
  };

  const handleCheckboxChange = () => {
    SetTravelMore((prevState) => !prevState);
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
            <Box display="flex" flexDirection="column" alignItems="center">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <ThemeProvider theme={ThemeColor}>
                  <Box
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
                        <MenuItem value="Travel Within Offices">
                          Travel Within Offices
                        </MenuItem>
                        <MenuItem value="Visit to Vendor Site">
                          Visit to Vendor Site
                        </MenuItem>
                        <MenuItem value="For Advisors">For Advisors</MenuItem>
                        <MenuItem value="Health Emergency">
                          Health Emergency
                        </MenuItem>
                        <MenuItem value="Group Ride">Group Ride</MenuItem>
                        <MenuItem value="Others">Others</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box
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
                    width={{ xs: "100%", sm: "100%", md: "90%" }}
                    marginBottom="16px"
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <FormControl
                      variant="outlined"
                      sx={{ width: { xs: "100%", sm: "100%", md: "90%" } }}
                    >
                      <InputLabel>
                        Select From Location {""}
                        <Typography className="CodeStar" variant="Code">
                          *
                        </Typography>
                      </InputLabel>
                      <Select
                        value={fromLocation}
                        onChange={HandleFromLocation}
                        label={<> Select From Location {""}</>}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              textAlign: "left",
                            },
                          },
                        }}
                      >
                        <MenuItem value="Research Park">Research Park</MenuItem>
                        <MenuItem value="Thaiyur">Thaiyur</MenuItem>
                        <MenuItem value="Shar">Shar</MenuItem>
                        <MenuItem value="Others">Others</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box
                    width={{ xs: "100%", sm: "100%", md: "90%" }}
                    marginBottom="16px"
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <FormControl
                      variant="outlined"
                      sx={{ width: { xs: "100%", sm: "100%", md: "90%" } }}
                    >
                      <InputLabel>
                        Select To Location {""}
                        <Typography className="CodeStar" variant="Code">
                          *
                        </Typography>
                      </InputLabel>
                      <Select
                        value={toLocation}
                        onChange={HandleToLocation}
                        label={<> Select From Location {""}</>}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              textAlign: "left",
                            },
                          },
                        }}
                      >
                        <MenuItem value="Research Park">Research Park</MenuItem>
                        <MenuItem value="Thaiyur">Thaiyur</MenuItem>
                        <MenuItem value="Shar">Shar</MenuItem>
                        <MenuItem value="Others">Others</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  <Box
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
                      value={rideDate}
                      sx={{
                        width: {
                          xs: "100%",
                          sm: "100%",
                          md: "90%",
                        },
                      }}
                      format="DD-MM-YYYY"
                      // disableFuture
                      minDate={today}
                      // maxDate={maxDate}
                      onChange={handleFromDateChange}
                      renderInput={(params) => (
                        <TextField {...params} variant="outlined" />
                      )}
                    />
                  </Box>

                  <Box
                    sx={{
                      width: {
                        xs: "90%",
                        sm: "90%",
                        md: "90%",
                      },
                    }}
                  >
                    <FormGroup
                      row
                      sx={{ display: "flex", justifyContent: "left" }}
                    >
                      <FormControlLabel
                        sx={{ marginLeft: { sm: "25px" } }}
                        control={
                          <Checkbox
                            checked={travelMore}
                            onChange={handleCheckboxChange}
                          />
                        }
                        label="Travel more than one day"
                      />
                    </FormGroup>
                  </Box>
                </ThemeProvider>
              </LocalizationProvider>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Box sx={{ display: "flex" }}>
                  <Button className="cancelBtn" onClick={handleCancel}>
                    Cancel
                  </Button>

                  <Button
                    className="saveBtn"
                    // onClick={handleCreateRaiseRequest}
                  >
                    Submit
                  </Button>
                </Box>
              </Box>
            </Box>
          </div>
        </Box>
      </LocalizationProvider>
    </>
  );
};

export default Passenger;
