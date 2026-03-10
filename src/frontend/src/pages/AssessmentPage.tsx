import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { AssessmentResult } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSaveAssessmentResult } from "../hooks/useQueries";

type Question = {
  id: string;
  category: string;
  question: string;
  options: {
    value: string;
    label: string;
    score: { [career: string]: number };
  }[];
};

const questions: Question[] = [
  {
    id: "1",
    category: "Interests",
    question: "Which activity sounds most appealing to you?",
    options: [
      {
        value: "a",
        label: "Designing and creating things",
        score: { "Graphic Designer": 3, Architect: 2, "Software Engineer": 1 },
      },
      {
        value: "b",
        label: "Analyzing data and solving problems",
        score: {
          "Data Scientist": 3,
          "Financial Analyst": 2,
          "Software Engineer": 2,
        },
      },
      {
        value: "c",
        label: "Helping and supporting others",
        score: { Nurse: 3, Teacher: 3, "Social Worker": 2 },
      },
      {
        value: "d",
        label: "Leading teams and projects",
        score: {
          "Project Manager": 3,
          "Business Analyst": 2,
          "Marketing Manager": 2,
        },
      },
    ],
  },
  {
    id: "2",
    category: "Skills",
    question: "What skill do you excel at the most?",
    options: [
      {
        value: "a",
        label: "Creative thinking and innovation",
        score: { "Graphic Designer": 3, "Marketing Manager": 2, Architect: 2 },
      },
      {
        value: "b",
        label: "Logical reasoning and analysis",
        score: {
          "Data Scientist": 3,
          "Software Engineer": 3,
          "Financial Analyst": 2,
        },
      },
      {
        value: "c",
        label: "Communication and empathy",
        score: { Teacher: 3, Nurse: 2, "Social Worker": 3 },
      },
      {
        value: "d",
        label: "Organization and planning",
        score: {
          "Project Manager": 3,
          "Business Analyst": 2,
          "Financial Analyst": 1,
        },
      },
    ],
  },
  {
    id: "3",
    category: "Work Environment",
    question: "What work environment suits you best?",
    options: [
      {
        value: "a",
        label: "Creative studio or design space",
        score: { "Graphic Designer": 3, Architect: 2, "Marketing Manager": 1 },
      },
      {
        value: "b",
        label: "Office with technology and tools",
        score: {
          "Software Engineer": 3,
          "Data Scientist": 3,
          "Business Analyst": 2,
        },
      },
      {
        value: "c",
        label: "Healthcare or community setting",
        score: { Nurse: 3, "Social Worker": 3, Teacher: 2 },
      },
      {
        value: "d",
        label: "Corporate or business environment",
        score: {
          "Project Manager": 3,
          "Financial Analyst": 3,
          "Business Analyst": 2,
        },
      },
    ],
  },
  {
    id: "4",
    category: "Values",
    question: "What matters most to you in a career?",
    options: [
      {
        value: "a",
        label: "Self-expression and creativity",
        score: { "Graphic Designer": 3, Architect: 2, "Marketing Manager": 2 },
      },
      {
        value: "b",
        label: "Problem-solving and innovation",
        score: { "Software Engineer": 3, "Data Scientist": 3, Architect: 1 },
      },
      {
        value: "c",
        label: "Making a difference in lives",
        score: { Nurse: 3, Teacher: 3, "Social Worker": 3 },
      },
      {
        value: "d",
        label: "Financial stability and growth",
        score: {
          "Financial Analyst": 3,
          "Project Manager": 2,
          "Business Analyst": 2,
        },
      },
    ],
  },
  {
    id: "5",
    category: "Personality",
    question: "How do you prefer to work?",
    options: [
      {
        value: "a",
        label: "Independently with creative freedom",
        score: { "Graphic Designer": 3, "Software Engineer": 2, Architect: 2 },
      },
      {
        value: "b",
        label: "In teams with collaboration",
        score: { "Project Manager": 3, "Business Analyst": 2, Teacher: 2 },
      },
      {
        value: "c",
        label: "Directly with people one-on-one",
        score: { Nurse: 3, "Social Worker": 3, Teacher: 2 },
      },
      {
        value: "d",
        label: "With data and systems",
        score: {
          "Data Scientist": 3,
          "Software Engineer": 2,
          "Financial Analyst": 3,
        },
      },
    ],
  },
];

export default function AssessmentPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const saveAssessment = useSaveAssessmentResult();

  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({ ...prev, [questions[currentStep].id]: value }));
  };

  const handleNext = () => {
    if (!answers[questions[currentStep].id]) {
      toast.error("Please select an answer before continuing");
      return;
    }
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!identity) return;

    // Calculate scores
    const careerScores: { [career: string]: number } = {};

    for (const [questionId, answerValue] of Object.entries(answers)) {
      const question = questions.find((q) => q.id === questionId);
      if (question) {
        const option = question.options.find((o) => o.value === answerValue);
        if (option) {
          for (const [career, score] of Object.entries(option.score)) {
            careerScores[career] = (careerScores[career] || 0) + score;
          }
        }
      }
    }

    // Find top career
    const topCareer = Object.entries(careerScores).sort(
      (a, b) => b[1] - a[1],
    )[0];
    const maxScore = questions.length * 3; // Maximum possible score
    const matchScore = Math.round((topCareer[1] / maxScore) * 100);

    const result: AssessmentResult = {
      user: identity.getPrincipal(),
      recommendedCareer: topCareer[0],
      matchScore: BigInt(matchScore),
      timestamp: BigInt(Date.now() * 1000000), // Convert to nanoseconds
    };

    try {
      await saveAssessment.mutateAsync(result);
      toast.success("Assessment completed!");
      navigate({ to: "/results" });
    } catch (error) {
      console.error("Failed to save assessment:", error);
      toast.error("Failed to save assessment. Please try again.");
    }
  };

  const currentQuestion = questions[currentStep];
  const currentAnswer = answers[currentQuestion.id];

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold mb-2">
          Career Assessment
        </h1>
        <p className="text-muted-foreground">
          Answer honestly to get the most accurate recommendations
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            Question {currentStep + 1} of {questions.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {currentQuestion.category}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="shadow-soft mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-serif">
            {currentQuestion.question}
          </CardTitle>
          <CardDescription>
            Select the option that best describes you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={currentAnswer}
            onValueChange={handleAnswer}
            className="space-y-3"
          >
            {currentQuestion.options.map((option) => (
              <button
                type="button"
                key={option.value}
                className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                  currentAnswer === option.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
                onClick={() => handleAnswer(option.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleAnswer(option.value)
                }
              >
                <RadioGroupItem
                  value={option.value}
                  id={option.value}
                  className="mt-1"
                />
                <Label
                  htmlFor={option.value}
                  className="cursor-pointer flex-1 font-normal"
                >
                  {option.label}
                </Label>
              </button>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleNext} disabled={saveAssessment.isPending}>
          {saveAssessment.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : currentStep === questions.length - 1 ? (
            "Submit"
          ) : (
            <>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
