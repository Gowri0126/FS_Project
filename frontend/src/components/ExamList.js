// src/components/ExamList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import ExamTake from "./ExamTake";

export default function ExamList({ token }) {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/exams", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setExams(res.data))
      .catch((err) => console.error(err));
  }, [token]);

  if (selectedExam) {
    return (
      <ExamTake
        token={token}
        examId={selectedExam}
        goBack={() => setSelectedExam(null)}
      />
    );
  }

  return (
    <div>
      <h2>Available Exams</h2>
      <ul>
        {exams.map((exam) => (
          <li key={exam._id}>
            {exam.title}{" "}
            <button onClick={() => setSelectedExam(exam._id)}>Take Exam</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
