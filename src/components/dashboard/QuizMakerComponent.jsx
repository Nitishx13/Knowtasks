import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Loader2, Plus, Trash2 } from 'lucide-react';

export default function QuizMakerComponent() {
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [subject, setSubject] = useState('General');
  const [manualQuestions, setManualQuestions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const addManualQuestion = () => {
    setManualQuestions([
      ...manualQuestions,
      {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: ''
      }
    ]);
  };

  const updateManualQuestion = (index, field, value) => {
    const updatedQuestions = [...manualQuestions];
    updatedQuestions[index][field] = value;
    setManualQuestions(updatedQuestions);
  };

  const updateQuestionOption = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...manualQuestions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setManualQuestions(updatedQuestions);
  };

  const removeManualQuestion = (index) => {
    const updatedQuestions = [...manualQuestions];
    updatedQuestions.splice(index, 1);
    setManualQuestions(updatedQuestions);
  };

  const handleCreateQuiz = async () => {
    // Validate inputs
    if (!quizTitle.trim()) {
      setError('Quiz title is required');
      return;
    }

    if (manualQuestions.length === 0) {
      setError('At least one question is required');
      return;
    }

    // Validate each question
    for (let i = 0; i < manualQuestions.length; i++) {
      const q = manualQuestions[i];
      if (!q.question.trim()) {
        setError(`Question ${i + 1} text is required`);
        return;
      }
      
      // Check if all options have content
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].trim()) {
          setError(`Option ${j + 1} for Question ${i + 1} is required`);
          return;
        }
      }
    }

    setError('');
    setIsSaving(true);

    try {
      // Create quiz object
      const quiz = {
        title: quizTitle,
        description: quizDescription,
        questions: manualQuestions,
      };

      // Save quiz to database
      const response = await fetch('/api/qz-folder/save-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: quizTitle,
          description: quizDescription,
          subject: subject,
          quizData: quiz
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Quiz created successfully!');
        // Reset form
        setQuizTitle('');
        setQuizDescription('');
        setManualQuestions([]);
        // Redirect to qz-folder page after 2 seconds
        setTimeout(() => {
          window.location.href = '/dashboard/qz-folder';
        }, 2000);
      } else {
        throw new Error(data.error || 'Failed to create quiz');
      }
    } catch (err) {
      console.error('Create quiz error:', err);
      setError(err.message || 'Failed to create quiz');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Quiz</CardTitle>
        <CardDescription>Build a custom quiz by adding questions manually</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Quiz Title</label>
            <Input
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              placeholder="Enter quiz title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              value={quizDescription}
              onChange={(e) => setQuizDescription(e.target.value)}
              placeholder="Enter quiz description"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="General">General</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Science">Science</SelectItem>
                <SelectItem value="History">History</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Questions</h3>
            <Button onClick={addManualQuestion} size="sm">
              <Plus size={16} className="mr-1" /> Add Question
            </Button>
          </div>
          
          {manualQuestions.length === 0 ? (
            <div className="text-center py-8 border border-dashed rounded-md">
              <p className="text-gray-500">No questions added yet. Click "Add Question" to start.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {manualQuestions.map((question, qIndex) => (
                <div key={qIndex} className="p-4 border rounded-md bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium">Question {qIndex + 1}</h4>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeManualQuestion(qIndex)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Question Text</label>
                      <Textarea
                        value={question.question}
                        onChange={(e) => updateManualQuestion(qIndex, 'question', e.target.value)}
                        placeholder="Enter question text"
                        rows={2}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Options</label>
                      <div className="space-y-2">
                        {question.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct-${qIndex}`}
                              checked={question.correctAnswer === oIndex}
                              onChange={() => updateManualQuestion(qIndex, 'correctAnswer', oIndex)}
                              className="h-4 w-4 text-blue-600"
                            />
                            <Input
                              value={option}
                              onChange={(e) => updateQuestionOption(qIndex, oIndex, e.target.value)}
                              placeholder={`Option ${oIndex + 1}`}
                              className="flex-1"
                            />
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Select the radio button for the correct answer</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Explanation (Optional)</label>
                      <Textarea
                        value={question.explanation}
                        onChange={(e) => updateManualQuestion(qIndex, 'explanation', e.target.value)}
                        placeholder="Explain why the correct answer is right"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button 
          onClick={handleCreateQuiz} 
          disabled={isSaving || manualQuestions.length === 0}
          className="w-full"
        >
          {isSaving ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Saving Quiz...
            </>
          ) : 'Create Quiz'}
        </Button>
      </CardContent>
    </Card>
  );
}