// src/components/FileUpload.jsx
import React from "react";
import { Button } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";

export default function FileUpload() {
  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        variant="outlined"
        startIcon={<UploadIcon />}
        sx={{
          borderColor: "white",
          color: "white",
          "&:hover": {
            borderColor: "#00E5FF",
            background: "rgba(0,229,255,0.08)",
          },
        }}
      >
        Upload Image / Audio
      </Button>
    </div>
  );
}
