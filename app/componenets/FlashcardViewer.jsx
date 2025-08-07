"use client";

import { useState } from "react";
import PropTypes from "prop-types";

export default function FlashcardViewer({ flashcards }) {
  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="bg-white p-5 rounded-xl shadow-sm border h-fit">
        <h2 className="text-md font-bold text-indigo-600 mb-4">📚 Interactive Flashcards</h2>
        <p className="text-sm text-gray-500">No flashcards found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border h-fit">
      <h2 className="text-md font-bold text-indigo-600 mb-4">📚 Interactive Flashcards</h2>

      <div className="flex flex-col items-center">
        {/* Flip Card */}
        <div className="w-64 h-40 perspective cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
          <div
            className={`relative w-full h-full transition-transform duration-700 ${
              isFlipped ? "transform rotate-y-180" : "transform"
            } transform-style-preserve-3d`}
          >
            {/* Front Side */}
            <div className="absolute w-full h-full backface-hidden bg-white border border-gray-300 rounded-xl shadow-md flex items-center justify-center p-4 text-center text-sm font-semibold text-gray-800">
              {flashcards[currentFlashcard].question}
            </div>

            {/* Back Side */}
            <div className="absolute w-full h-full backface-hidden bg-indigo-100 border border-gray-300 rounded-xl shadow-md transform rotate-y-180 flex items-center justify-center p-4 text-center text-sm text-gray-700">
              {flashcards[currentFlashcard].answer}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-4 text-sm w-full">
          <button
            disabled={currentFlashcard === 0}
            onClick={() => {
              setCurrentFlashcard((p) => p - 1);
              setIsFlipped(false);
            }}
            className="text-indigo-600 disabled:text-gray-400"
          >
            Previous
          </button>
          <span className="text-gray-500">
            {currentFlashcard + 1} of {flashcards.length}
          </span>
          <button
            disabled={currentFlashcard === flashcards.length - 1}
            onClick={() => {
              setCurrentFlashcard((p) => p + 1);
              setIsFlipped(false);
            }}
            className="text-indigo-600 disabled:text-gray-400"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

FlashcardViewer.propTypes = {
  flashcards: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string.isRequired,
      answer: PropTypes.string.isRequired,
    })
  ),
};
