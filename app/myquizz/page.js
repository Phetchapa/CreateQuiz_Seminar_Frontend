"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2"; // Import SweetAlert

export default function MyQuizzesPage() {
  const [quizzes, setQuizzes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch all quizzes
    async function fetchQuizzes() {
      const response = await fetch("http://localhost:3001/quiz");
      const data = await response.json();
      setQuizzes(data);
    }

    fetchQuizzes();
  }, []);

  const handleQuizClick = (quizId) => {
    router.push(`/quiz/${quizId}`);
  };

  const handleDeleteQuiz = async (quizId) => {
    // Confirm deletion with SweetAlert
    Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "การลบควิซนี้จะไม่สามารถกู้คืนได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ลบเลย!",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Call API to delete quiz
        const response = await fetch(`http://localhost:3001/quiz/${quizId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          Swal.fire("ลบสำเร็จ!", "ควิซถูกลบแล้ว", "success");
          // Remove the deleted quiz from the state
          setQuizzes(quizzes.filter((quiz) => quiz.quizId !== quizId));
        } else {
          Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถลบควิซได้", "error");
        }
      }
    });
  };

  if (quizzes.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">ควิซของฉัน</h1>
      <div className="space-y-6">
        {quizzes.map((quiz) => (
          <div
            key={quiz.quizId}
            className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between cursor-pointer hover:shadow-lg transition-shadow"
          >
            {/* Image Section */}
            <div className="flex items-center space-x-4" onClick={() => handleQuizClick(quiz.quizId)}>
              <img
                src={
                  quiz.coverPage.imagePath ||
                  "https://img.freepik.com/premium-photo/quiz-quizz-word-inscription-fun-game-with-questions_361816-1115.jpg"
                } // Use default image if imagePath is null
                alt={quiz.coverPage.quizTitle}
                className="w-16 h-16 object-cover rounded-lg"
              />
              {/* Quiz Title */}
              <h2 className="text-lg font-medium text-blue-500">
                {quiz.coverPage.quizTitle || "Untitled Quiz"}
              </h2>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-black">แก้ไข</button>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => handleDeleteQuiz(quiz.quizId)}
              >
                ลบ
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
