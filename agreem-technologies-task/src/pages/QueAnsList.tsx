import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Paper,
} from "@mui/material";

interface Question {
  type: string;
  difficulty: string;
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

const TOTAL_QUESTIONS = 10;

function QueAnsList() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [result, setResult] = useState<string | null>(null);
  const [totalCorrect, setTotalCorrect] = useState<number>(0);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const fetchQuestions = useCallback(async () => {
    try {
      const response = await axios.get<{ results: Question[] }>(
        "https://opentdb.com/api.php?amount=10"
      );
      setQuestions(response.data.results);
    } catch (error: any) {
      console.error("Error fetching questions:", error);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const currentQuestion = useMemo(
    () => questions[currentQuestionIndex],
    [currentQuestionIndex, questions]
  );

  const handleAnswerSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!submitted) {
        setSelectedAnswer(event.target.value);
      }
    },
    [submitted]
  );

  const handleSubmit = useCallback(() => {
    const correctAnswer = currentQuestion.correct_answer;
    const isCorrect = selectedAnswer === correctAnswer;

    setResult(
      isCorrect ? "Correct!" : `Incorrect! Correct answer: ${correctAnswer}`
    );
    setSubmitted(true);

    if (isCorrect) {
      setTotalCorrect((prev) => prev + 1);
    }
  }, [currentQuestion, selectedAnswer]);

  const handleNextQuestion = useCallback(() => {
    setSelectedAnswer("");
    setResult(null);
    setSubmitted(false);
    if (currentQuestionIndex + 1 < TOTAL_QUESTIONS) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      navigate("/results", {
        state: {
          totalCorrect,
          totalIncorrect: TOTAL_QUESTIONS - totalCorrect,
        },
      });
    }
  }, [currentQuestionIndex, navigate, totalCorrect]);

  if (!questions.length) {
    return (
      <div style={{ padding: 20 }}>
        <Typography variant="h5">Loading...</Typography>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <Paper elevation={3} style={{ padding: 20 }}>
        <Typography variant="h5">
          Question {currentQuestionIndex + 1} of {TOTAL_QUESTIONS}:
          {currentQuestion.question}
        </Typography>
        <FormControl component="fieldset" style={{ marginTop: 20 }}>
          <FormLabel component="legend">Choose an answer:</FormLabel>
          <RadioGroup value={selectedAnswer} onChange={handleAnswerSelect}>
            {currentQuestion.incorrect_answers.map((answer, index) => (
              <FormControlLabel
                key={index}
                value={answer}
                control={<Radio />}
                label={answer}
                disabled={submitted}
              />
            ))}
            <FormControlLabel
              value={currentQuestion.correct_answer}
              control={<Radio />}
              label={currentQuestion.correct_answer}
              disabled={submitted}
            />
          </RadioGroup>
        </FormControl>
        {result && (
          <div style={{ marginTop: 20 }}>
            <Typography variant="h6">{result}</Typography>
          </div>
        )}
        <div style={{ marginTop: 20 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!selectedAnswer || submitted}
            style={{ marginRight: 10 }}
          >
            Submit
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNextQuestion}
            disabled={!result}
          >
            Next
          </Button>
        </div>
      </Paper>
    </div>
  );
}

export default QueAnsList;
