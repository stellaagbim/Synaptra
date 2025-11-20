import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";

export default function TaskHistory({ history }) {
  return (
    <Card
      sx={{
        mb: 4,
        background: "rgba(15, 23, 42, 0.6)",
        borderRadius: "20px",
        border: "1px solid rgba(148,163,184,0.15)",
        backdropFilter: "blur(14px)",
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          sx={{ mb: 2, color: "white", fontWeight: 600 }}
        >
          Recent Runs
        </Typography>

        {history.length === 0 && (
          <Typography sx={{ color: "rgba(148,163,184,0.6)", fontSize: "0.85rem" }}>
            No runs yet. Once you start using the agent, your recent tasks will
            appear here.
          </Typography>
        )}

        {history.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            style={{ marginBottom: "1rem" }}
          >
            <Box
              sx={{
                p: 2,
                borderRadius: "14px",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  color: "white",
                }}
              >
                {item.goal}
              </Typography>

              <Typography
                sx={{
                  fontSize: "0.75rem",
                  color: "rgba(148,163,184,0.6)",
                }}
              >
                {item.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </Box>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
