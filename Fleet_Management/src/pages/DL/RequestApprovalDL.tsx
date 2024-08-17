import { Box } from "@mui/material";
import React from "react";

interface RequestApprovalDLProps {
  darkMode: boolean;
}

const RequestApprovalDL: React.FC<RequestApprovalDLProps> = ({ darkMode }) => {
  return (
    <>
      <div
        style={{
          backgroundColor: darkMode ? "#222222" : "#fff",
          color: darkMode ? "#d1d1d1" : "#5b5b5b",
          padding: "15px",
        }}
      >
        <h2>DL Request Approval Coming Soon...</h2>
      </div>
    </>
  );
};

export default RequestApprovalDL;
