import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { useState } from 'react';

const SurveyQuestions = ({ questions, setQuestions, type }) => {
  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].text = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    const newQuestion = {
      text: '',
      ...(type === 'MCQ' ? { options: [''] } : {}),
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push('');
    setQuestions(updated);
  };

  const removeOption = (qIndex, oIndex) => {
    const updated = [...questions];
    updated[qIndex].options.splice(oIndex, 1);
    setQuestions(updated);
  };

  const renderPreview = (question) => {
    if (type === 'MCQ') {
      return (
        <div className="space-y-2 mt-3">
          {question.options.map((opt, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input type="radio" disabled />
              <span className="text-gray-600">{opt}</span>
            </div>
          ))}
        </div>
      );
    }

    if (type === 'Text') {
      return (
        <textarea
          className="w-full mt-3 p-2 border border-gray-300 rounded-md bg-gray-50"
          placeholder="Answer goes here..."
          disabled
        />
      );
    }

    if (type === 'Rating') {
      return (
        <div className="flex mt-3 gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="text-gray-400 text-xl">&#9734;</span>  // ☆ empty star
          ))}

        </div>
      );
    }

    return null;
  };

  return (
    <div>
      <label className="block font-semibold text-purple-800 mb-3">Questions</label>
      <div className="space-y-6">
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="bg-purple-50 p-4 rounded-xl border border-purple-200 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-purple-700">Question {qIndex + 1}</span>
              <button
                type="button"
                onClick={() => removeQuestion(qIndex)}
                className="text-red-600 hover:text-red-800"
                title="Remove Question"
              >
                <FiTrash2 />
              </button>
            </div>

            <input
              type="text"
              value={q.text}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              placeholder="Enter your question"
              required
              className="w-full px-4 py-2 rounded-md border border-purple-300 mb-4"
            />

            {type === 'MCQ' && (
              <div className="space-y-2">
                {q.options.map((opt, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                      placeholder={`Option ${oIndex + 1}`}
                      required
                      className="flex-1 px-3 py-2 border border-purple-300 rounded"
                    />
                    {q.options.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeOption(qIndex, oIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addOption(qIndex)}
                  className="text-sm text-purple-600 mt-2 flex items-center gap-1"
                >
                  <FiPlus /> Add Option
                </button>
              </div>
            )}

            {/* Show Preview for Text or Rating */}
            {(type === 'Text' || type === 'Rating') && renderPreview(q)}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={addQuestion}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FiPlus /> Add Question
        </button>
      </div>
    </div>
  );
};

export default SurveyQuestions;
