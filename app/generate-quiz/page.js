'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GenerateQuizForm() {
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(1);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const response = await fetch('http://localhost:3001/generate-quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic,
        numQuestions,
        userId: 'admin',
        type: 'quiz',
        coverPage: {
          quizTitle: `Quiz on ${topic}`,
          description: `A quiz generated on the topic of ${topic}`,
          buttonText: 'Start',
        },
        sectionId: 'section-auto', // Example static sectionId for now
        sectionTitle: 'Generated Section',
        sectionDescription: 'Auto-generated questions section',
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Navigate to the quiz page to view the generated questions
      router.push(`/quiz/${data.quizId}`);
    } else {
      console.error('Failed to generate quiz:', data.message);
    }
  };

  return (
    <div>
      <h1>Generate Quiz</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Topic:</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Number of Questions:</label>
          <input
            type="number"
            value={numQuestions}
            onChange={(e) => setNumQuestions(e.target.value)}
            min="1"
            max="10"
            required
          />
        </div>
        <button type="submit">Generate Quiz</button>
      </form>
    </div>
  );
}
