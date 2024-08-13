import { Box } from "@mui/material";
import React from "react";

interface TrackRequestProps {
  darkMode: boolean;
}

const TrackRequest: React.FC<TrackRequestProps> = ({ darkMode }) => {
  return (
    <Box>
      <div className="m-4">
        <h2>Coming Soon...</h2>
      </div>
    </Box>
  );
};

export default TrackRequest;
