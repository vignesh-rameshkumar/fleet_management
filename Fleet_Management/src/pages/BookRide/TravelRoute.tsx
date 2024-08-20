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
import QRCode from "qrcode";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { MdOutlineDownloadForOffline } from "react-icons/md";
import { HiOutlineCloudDownload } from "react-icons/hi";
import { FiMapPin } from "react-icons/fi";
import { LiaExchangeAltSolid } from "react-icons/lia";

import Autocomplete from "@mui/material/Autocomplete";
import { createTheme } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { toast } from "react-toastify";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { MdDeleteOutline } from "react-icons/md";

import {
  useFrappeCreateDoc,
  useFrappeGetDocList,
  useFrappeGetDoc,
  useFrappeDeleteDoc,
} from "frappe-react-sdk";

import { ThemeProvider } from "@mui/material";

import dayjs from "dayjs";
interface TravelRouteProps {
  darkMode: boolean;
  onCloseDrawer: () => void;
  userEmailId: string;
  employeeID: string;
  userName: string;
}

const TravelRoute: React.FC<TravelRouteProps> = ({
  darkMode,
  onCloseDrawer,
  userEmailId,
  employeeID,
  userName,
}) => {
  const [updateView, setUpdateView] = useState(false);
  const [sameRoute, setSameRoute] = useState(false);
  const [terms, setTerms] = useState(false);
  const [currentdate, setCurrentDate] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState(null);

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

  // END

  const handleTravelMoreChange = () => {
    setSameRoute((prevState) => !prevState);
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

  const { data: FM_Route_ID }: any = useFrappeGetDocList("FM_Route_ID", {
    fields: ["*"],
    filters: [["enabled", "=", true]],
    limit: 100000,
    orderBy: {
      field: "modified",
      order: "desc",
    },
  });

  const [routeId, setRouteId] = useState(FM_Route_ID);

  useEffect(() => {
    setRouteId(FM_Route_ID);
  }, [FM_Route_ID]);

  const [selectedRouteId, setSelectedRouteId] = useState();

  const handleRouteId = (event) => {
    setSelectedRouteId(event.target.value);
    setPickup([]);
    setDropPoint([]);
    setSelectedDropPoint(null);
    setSelectedPickUp(null);
  };

  // Start - Pickup

  // Fetching Pickup Locations
  const { data: pickup } = useFrappeGetDoc("FM_Route_ID", selectedRouteId);
  const [pickUp, setPickup] = useState([]);

  useEffect(() => {
    if (pickup && pickup?.route) {
      const routeList = pickup?.route?.map((x) => x.location_name);
      setPickup(routeList);
    }
  }, [pickup]);

  const [selectedPickup, setSelectedPickUp] = useState();

  const handlePickId = (event) => {
    setSelectedPickUp(event.target.value);
  };

  // Fetching Drop Locations
  const { data: drop } = useFrappeGetDoc("FM_Route_ID", selectedRouteId);
  const [dropPoint, setDropPoint] = useState([]);

  useEffect(() => {
    if (drop && drop?.route) {
      const routeList = drop?.route
        ?.map((x) => x.location_name)
        .filter((location) => location !== selectedPickup); // Filter out the selected pickup location
      setDropPoint(routeList);
    }
  }, [drop, selectedPickup]);
  // State for Selected Drop Location
  const [selectedDropPoint, setSelectedDropPoint] = useState("");

  const handleDropId = (event) => {
    const dropPoint = event.target.value;

    if (dropPoint === selectedPickup) {
      toast.warning("The Pickup and Drop locations cannot be the same.");
      setSelectedDropPoint("");
    } else {
      setSelectedDropPoint(dropPoint);
    }
  };

  // END

  // ............ API Function ............
  const handleCancel = () => {
    onCloseDrawer();
    setPickup([]);
    setDropPoint([]);
    setSameRoute(false);
    setTerms(false);
    setOpenModal(false);
    setOpen(false);
    setTravelData("");
  };

  // Save API
  const { createDoc } = useFrappeCreateDoc();

  const CreateBookRequest = async () => {
    try {
      const body = {
        doctypename: "FM_Travel_Route_Request",
        employee_email: userEmailId,
        employee_name: userName,
        route_id: selectedRouteId,
        pickup_point: selectedPickup,
        drop_point: selectedDropPoint,
        same_route: sameRoute,
        terms: terms,
      };
      await createDoc("FM_Travel_Route_Request", body);
      toast.success("Request Created Successfully ");
      handleCancel();
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
        toast.error(`Error: ${error.exception}`);
      }
    }
  };

  const { data: FM_Travel_Route_Request }: any = useFrappeGetDocList(
    "FM_Travel_Route_Request",
    {
      fields: ["*"],
      filters: [["name", "=", userEmailId]],
      limit: 100000,
      orderBy: {
        field: "modified",
        order: "desc",
      },
    }
  );

  const [travelData, setTravelData] = useState(FM_Travel_Route_Request);

  useEffect(() => {
    setTravelData(FM_Travel_Route_Request);
  }, [FM_Travel_Route_Request]);

  // Ensure travelData is defined and is an array
  const Pickup = travelData?.map((x) => x.pickup_point || "") || [];
  const Drop = travelData?.map((x) => x.drop_point || "") || [];

  // QR Code
  useEffect(() => {
    const generateQR = async () => {
      if (travelData.length > 0 && travelData[0]?.name === userEmailId) {
        try {
          const qrUrl = travelData[0].name;
          // Generate QR code data URL
          const qrCodeDataUrl = await QRCode.toDataURL(qrUrl);
          setQrCodeDataUrl(qrCodeDataUrl);
        } catch (error) {
          toast.error("Error generating QR code");
        }
      } else {
        setQrCodeDataUrl(null); // Ensure QR code is cleared if conditions are not met
      }
    };

    generateQR();
  }, [travelData, userEmailId]);

  const [open, setOpen] = React.useState(false);
  const handleCloseDelete = () => {
    setOpen(false);
  };
  // Delete
  const { deleteDoc } = useFrappeDeleteDoc();

  const handleDeleteDoc = async () => {
    const doctypename = "FM_Travel_Route_Request";
    const id = travelData?.map((x) => x.name || "") || [];

    try {
      await deleteDoc(doctypename, id);
      toast.success("Deleted Successfully");
      setQrCodeDataUrl(null);
      setTravelData([]);
      handleCancel();
    } catch (error) {
      toast.error(`Error deleting doc: ${error.message}`);
    }
  };

  const handleCome = () => {
    toast.warning("Coming Soon...");
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
                Travel Route
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

            {/* {qrCodeDataUrl !== null ? ( */}
            {qrCodeDataUrl !== null && !updateView ? (
              <>
                <Box>
                  {qrCodeDataUrl && (
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                    >
                      <Box
                        sx={{
                          display: "flex",
                          gap: "150px",
                        }}
                      >
                        {" "}
                        <p>
                          Pick up : {""}
                          {Pickup}
                        </p>
                        <p>
                          Drop :{""} {Drop}
                        </p>
                      </Box>
                      <img src={qrCodeDataUrl} alt="QR Code" width={280} />
                      <br />

                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                      >
                        <Box sx={{ display: "flex" }}>
                          <Button
                            className="saveBtn"
                            component="a"
                            href={qrCodeDataUrl}
                            download="qrcode.png"
                          >
                            Download {""}
                            <HiOutlineCloudDownload
                              size={25}
                              style={{ marginLeft: "10px" }}
                            />
                          </Button>
                          <Button
                            className="deleteBtn"
                            onClick={() => {
                              setOpen(true);
                            }}
                          >
                            Delete {""}
                            <MdDeleteOutline
                              size={25}
                              style={{ marginLeft: "10px" }}
                            />
                          </Button>
                        </Box>
                      </Box>
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                      >
                        <Box sx={{ display: "flex" }}>
                          <Button
                            className="saveBtn"
                            onClick={() => {
                              // setUpdateView(true);
                              handleCome();
                            }}
                          >
                            Update
                            <LiaExchangeAltSolid
                              size={25}
                              style={{ marginLeft: "10px" }}
                            />
                          </Button>
                          <Button className="saveBtn" onClick={handleCome}>
                            View Map {""}
                            <FiMapPin
                              size={25}
                              style={{ marginLeft: "10px" }}
                            />
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Box>
              </>
            ) : (
              <>
                <>
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
                            sx={{
                              width: { xs: "100%", sm: "100%", md: "90%" },
                            }}
                          >
                            <InputLabel>
                              Select Route ID {""}
                              <Typography className="CodeStar" variant="Code">
                                *
                              </Typography>
                            </InputLabel>
                            <Select
                              value={selectedRouteId}
                              onChange={handleRouteId}
                              label={
                                <>
                                  Select Route ID {""}
                                  <Typography
                                    className="CodeStar"
                                    variant="Code"
                                  >
                                    *
                                  </Typography>
                                </>
                              }
                            >
                              {routeId?.map((x) => (
                                <MenuItem key={x?.name} value={x.name}>
                                  {x.start_point} - {x.end_point}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>

                        <Box
                          className="slideFromRight"
                          width={{ xs: "100%", sm: "100%", md: "90%" }}
                          marginBottom="16px"
                          sx={{ display: "flex", justifyContent: "center" }}
                        >
                          <FormControl
                            variant="outlined"
                            sx={{
                              width: { xs: "100%", sm: "100%", md: "90%" },
                            }}
                          >
                            <InputLabel>
                              Select Pick Up Point {""}
                              <Typography className="CodeStar" variant="Code">
                                *
                              </Typography>
                            </InputLabel>
                            <Select
                              value={selectedPickup}
                              disabled={!selectedRouteId}
                              onChange={handlePickId}
                              label={
                                <>
                                  Select Pick Up Point {""}
                                  <Typography
                                    className="CodeStar"
                                    variant="Code"
                                  >
                                    *
                                  </Typography>
                                </>
                              }
                            >
                              {pickUp?.map((x) => (
                                <MenuItem key={x?.name} value={x}>
                                  {x}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>

                        <Box
                          className="slideFromRight"
                          width={{ xs: "100%", sm: "100%", md: "90%" }}
                          marginBottom="16px"
                          sx={{ display: "flex", justifyContent: "center" }}
                        >
                          <FormControl
                            variant="outlined"
                            sx={{
                              width: { xs: "100%", sm: "100%", md: "90%" },
                            }}
                          >
                            <InputLabel>
                              Select Drop Point{" "}
                              <Typography className="CodeStar" variant="Code">
                                *
                              </Typography>
                            </InputLabel>
                            <Select
                              value={selectedDropPoint}
                              disabled={!selectedRouteId || !selectedPickup}
                              onChange={handleDropId}
                              label={
                                <>
                                  Select Drop Point{" "}
                                  <Typography
                                    className="CodeStar"
                                    variant="Code"
                                  >
                                    *
                                  </Typography>
                                </>
                              }
                            >
                              {dropPoint?.map((x) => (
                                <MenuItem key={x?.name} value={x}>
                                  {x}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
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
                              control={
                                <Checkbox
                                  disabled={
                                    !selectedPickup ||
                                    !selectedRouteId ||
                                    !selectedDropPoint
                                  }
                                  checked={sameRoute}
                                  onChange={handleTravelMoreChange}
                                />
                              }
                              label="Return Via Same Route"
                            />
                          </FormGroup>
                        </Box>

                        <Box
                          className="slideFromRight delay-4"
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
                                    !selectedPickup ||
                                    !selectedRouteId ||
                                    !selectedDropPoint
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
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                      >
                        <Box sx={{ display: "flex" }}>
                          <Button className="cancelBtn" onClick={handleCancel}>
                            Cancel
                          </Button>

                          <Button
                            className="saveBtn"
                            onClick={CreateBookRequest}
                          >
                            Submit
                          </Button>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </>
              </>
            )}
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

        {/* Delete */}
        <Dialog
          open={open}
          keepMounted
          onClose={handleCloseDelete}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Are you sure want to delete ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button className="cancelBtn" onClick={handleCloseDelete}>
              No
            </Button>
            <Button
              className="saveBtn"
              onClick={() => handleDeleteDoc()}
              autoFocus
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </LocalizationProvider>
    </>
  );
};

export default TravelRoute;
