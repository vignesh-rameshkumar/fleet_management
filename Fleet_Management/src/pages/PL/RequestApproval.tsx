import { Box } from "@mui/material";
import React from "react";

interface RequestApprovalProps {
  darkMode: boolean;
}

const RequestApproval: React.FC<RequestApprovalProps> = ({ darkMode }) => {
  return (
    <>
      <div
        style={{
          backgroundColor: darkMode ? "#222222" : "#fff",
          color: darkMode ? "#d1d1d1" : "#5b5b5b",
          padding: "15px",
        }}
      >
        <h2>Request Approval Coming Soon...</h2>
      </div>
    </>
  );
};

export default RequestApproval;
