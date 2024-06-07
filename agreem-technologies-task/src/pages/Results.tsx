import React from "react";
import { useLocation } from "react-router-dom";
import { Typography } from "@mui/material";

interface LocationState {
  totalCorrect: number;
  totalIncorrect: number;
}

function Results() {
  const location = useLocation();
  const { totalCorrect, totalIncorrect } = location.state as LocationState;

  const totalQuestionsServed = totalCorrect + totalIncorrect;

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h5">Results</Typography>
      <Typography variant="body1">
        Total Questions Served: {totalQuestionsServed}
      </Typography>
      <Typography variant="body1">
        Total Correct Questions: {totalCorrect}
      </Typography>
      <Typography variant="body1">
        Total Incorrect Questions: {totalIncorrect}
      </Typography>
    </div>
  );
}

export default Results;
