"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function GenerateQuizForm() {
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(1);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // แสดง SweetAlert ขณะที่กำลังประมวลผล
    Swal.fire({
      title: 'Generating...',
      text: 'กรุณารอสักครู่ ขณะนี้กำลังสร้างแบบทดสอบ...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const response = await fetch("http://localhost:3001/generate-quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic,
        numQuestions,
        userId: "admin",
        type: "quiz",
        coverPage: {
          quizTitle: `Untitled Quiz`,
          description: ``,
          buttonText: "Start",
        },
        sectionId: "section 1", // Example static sectionId for now
        sectionTitle: "",
        sectionDescription: "",
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // เมื่อประมวลผลสำเร็จ ให้ปิด SweetAlert และนำทางไปหน้าแบบทดสอบที่สร้างแล้ว
      Swal.close();
      router.push(`/quiz/${data.quizId}`);
    } else {
      // กรณีมีข้อผิดพลาดแสดงข้อความแจ้ง
      Swal.fire({
        icon: 'error',
        title: 'Failed to generate quiz',
        text: data.message,
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-[#F9F8F6] p-8">
      <h1 className="text-2xl font-bold mb-4 self-start">
        สร้างแบบทดสอบด้วย AI
      </h1>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-lg font-semibold mb-6 text-center">
          สร้างแบบทดสอบอัตโนมัติ
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="topic" className="block text-gray-700 mb-2">
              ใส่เนื้อหาหรือหัวข้อของแบบทดสอบที่คุณต้องการสร้าง
            </label>
            <textarea
              id="topic"
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows="10"
              placeholder="เช่น แมวในประเทศไทย..."
              required
            />
          </div>

          <div>
            <label htmlFor="numQuestions" className="block text-gray-700 mb-2">
              ใส่จำนวนข้อที่ต้องการให้สร้าง
            </label>
            <input
              id="numQuestions"
              type="number"
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={numQuestions}
              onChange={(e) => setNumQuestions(e.target.value)}
              min="1"
              max="10"
              placeholder="ใส่จำนวนข้อที่ต้องการให้สร้าง"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-[#03A9F4] text-white p-3 rounded-full hover:bg-[#039BE5] transition-colors shadow-md mx-auto block"
          >
            สร้างแบบทดสอบ
          </button>
        </form>
      </div>
    </div>
  );
}
