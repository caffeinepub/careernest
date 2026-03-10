import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  Check,
  Copy,
  Download,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  useDeleteStudyNotes,
  useGenerateStudyNotes,
  useGetAllStudyNotes,
} from "../hooks/useQueries";

export default function StudyNotesPage() {
  const { data: studyNotes, isLoading } = useGetAllStudyNotes();
  const generateMutation = useGenerateStudyNotes();
  const deleteMutation = useDeleteStudyNotes();

  const [formData, setFormData] = useState({
    educationLevel: "",
    board: "",
    className: "",
    subject: "",
    chapter: "",
    difficultyLevel: "",
    content: "",
  });

  const [copiedNoteId, setCopiedNoteId] = useState<bigint | null>(null);
  const _printRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateMaharashtraContent = (
    educationLevel: string,
    board: string,
    className: string,
    subject: string,
    chapter: string,
    difficultyLevel: string,
    additionalInstructions: string,
  ): string => {
    const difficultyText = difficultyLevel || "Medium";

    // Generate structured Maharashtra-specific content
    let content = "STUDY NOTES - MAHARASHTRA EDUCATION\n\n";
    content += `${board}\n`;
    content += `${educationLevel} - ${className}\n`;
    content += `Subject: ${subject}\n`;
    content += `Chapter: ${chapter}\n`;
    content += `Difficulty Level: ${difficultyText}\n\n`;
    content +=
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

    // Introduction
    content += "Introduction:\n\n";
    content += `This chapter on "${chapter}" is part of the ${board} curriculum for ${educationLevel}. `;
    content += `This topic is essential for understanding ${subject} concepts as per Maharashtra State syllabus. `;
    content +=
      "The following notes are structured to help students prepare for exams effectively.\n\n";

    // Key Concepts
    content += "Key Concepts:\n\n";
    content += `• Core Definition: ${chapter} encompasses fundamental principles relevant to ${subject}\n`;
    content += `• Maharashtra Syllabus Focus: This topic aligns with the learning outcomes specified by the ${board}\n`;
    content += `• Application: Understanding this concept helps in solving practical problems in ${subject}\n`;
    content +=
      "• Examination Importance: This is a frequently tested topic in board examinations\n\n";

    // Detailed Explanation
    content += "Detailed Explanation:\n\n";
    content += `According to the ${board} syllabus, ${chapter} in ${subject} covers several important aspects:\n\n`;
    content += "1. Foundation Concepts:\n";
    content += `   The basic principles of ${chapter} establish a framework for understanding more complex topics. `;
    content +=
      "Students should focus on building a strong conceptual foundation before attempting advanced problems.\n\n";

    content += "2. Maharashtra Context:\n";
    content += `   The ${board} emphasizes practical applications and real-world relevance. Examples from Maharashtra's `;
    content +=
      "educational, industrial, and cultural context help students connect theoretical knowledge with everyday life.\n\n";

    content += `3. Difficulty Level - ${difficultyText}:\n`;
    if (difficultyLevel === "Easy") {
      content +=
        "   At the Easy level, focus on understanding basic definitions, simple examples, and direct applications. ";
      content +=
        "Practice fundamental problems and ensure clarity of core concepts.\n\n";
    } else if (difficultyLevel === "Advanced") {
      content +=
        "   At the Advanced level, students should tackle complex problems, analyze multi-step solutions, and ";
      content +=
        "explore advanced applications. Critical thinking and problem-solving skills are essential.\n\n";
    } else {
      content +=
        "   At the Medium level, students should work on standard problems, understand typical exam questions, ";
      content += "and practice applying concepts in various scenarios.\n\n";
    }

    // Important Points/Formulas
    content += "Important Points / Formulas:\n\n";
    content += `📌 Key Point 1: Master the fundamental definition of ${chapter}\n`;
    content +=
      "📌 Key Point 2: Understand the relationship between different concepts within this topic\n";
    content +=
      "📌 Key Point 3: Practice problems of varying difficulty levels\n";
    content +=
      "📌 Key Point 4: Review previous board exam questions related to this chapter\n\n";

    if (
      subject.toLowerCase().includes("math") ||
      subject.toLowerCase().includes("physics") ||
      subject.toLowerCase().includes("chemistry") ||
      subject.toLowerCase().includes("science")
    ) {
      content += "Important Formulas:\n";
      content += `• Formula 1: [Fundamental equation for ${chapter}]\n`;
      content +=
        "• Formula 2: [Derived relationship applicable to this topic]\n";
      content +=
        "• Formula 3: [Common calculation method for problem-solving]\n\n";
      content +=
        "Note: Memorize formulas with their units and conditions of applicability.\n\n";
    }

    // Solved Examples
    content += "Solved Examples:\n\n";
    content += "Example 1: Basic Application\n";
    content += `Problem: Consider a typical scenario related to ${chapter} as commonly asked in ${board} examinations.\n`;
    content += "Solution:\n";
    content +=
      "Step 1: Identify the given information and what is being asked\n";
    content += "Step 2: Select the appropriate formula or method\n";
    content += "Step 3: Substitute values and calculate\n";
    content +=
      "Step 4: Verify the answer and write the final result with proper units\n";
    content += "Answer: [Sample result based on the problem setup]\n\n";

    content += "Example 2: Maharashtra Board Style Question\n";
    content += `Problem: A practical problem related to ${chapter} with real-world context.\n`;
    content += "Solution:\n";
    content += "• Analyze the problem statement carefully\n";
    content += "• Draw diagrams if applicable\n";
    content += `• Apply the relevant concept from ${chapter}\n`;
    content += "• Show all calculation steps clearly\n";
    content +=
      "Answer: [Detailed solution following board exam answer format]\n\n";

    // Summary
    content += "Summary:\n\n";
    content += `This chapter on "${chapter}" is a crucial component of ${subject} for ${educationLevel} students `;
    content += `under the ${board}. The key takeaways include:\n\n`;
    content += "✓ Understanding fundamental definitions and concepts\n";
    content += "✓ Applying formulas and methods correctly in problem-solving\n";
    content +=
      "✓ Relating theoretical knowledge to practical Maharashtra contexts\n";
    content +=
      "✓ Practicing a variety of problems at different difficulty levels\n";
    content +=
      "✓ Reviewing board exam patterns and frequently asked questions\n\n";
    content +=
      "Regular practice and conceptual clarity are essential for scoring well in board examinations.\n\n";

    // Practice Questions
    content += "Practice Questions:\n\n";
    content += `Question 1: Define ${chapter} and explain its significance in ${subject}. (2 marks)\n\n`;
    content += `Question 2: Solve a numerical problem applying the concepts of ${chapter}. Show all steps. (3 marks)\n\n`;
    content += `Question 3: Explain how ${chapter} is relevant in real-life situations specific to Maharashtra. (3 marks)\n\n`;
    content += `Question 4: Compare and contrast two aspects of ${chapter}. Provide examples. (4 marks)\n\n`;
    content += `Question 5: A long-answer question combining multiple concepts from ${chapter}. `;
    content += "Include diagrams and detailed explanations. (5 marks)\n\n";

    // Answers
    content += "Answers to Practice Questions:\n\n";
    content +=
      "Answer 1: [Brief definition with 2-3 key points explaining significance]\n\n";
    content +=
      "Answer 2: [Step-by-step numerical solution with formula application]\n\n";
    content +=
      "Answer 3: [Real-world application examples from Maharashtra context]\n\n";
    content += "Answer 4: [Comparative analysis with clear examples]\n\n";
    content +=
      "Answer 5: [Comprehensive answer with diagrams and detailed explanation]\n\n";

    // Additional instructions if provided
    if (additionalInstructions.trim()) {
      content += "Additional Notes:\n\n";
      content += `Based on your specific requirements: ${additionalInstructions}\n\n`;
    }

    content += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    content +=
      "Generated for Maharashtra Students | CareerNest Educational Platform";

    return content;
  };

  const handleGenerate = async () => {
    if (
      !formData.educationLevel ||
      !formData.board ||
      !formData.className ||
      !formData.subject ||
      !formData.chapter ||
      !formData.difficultyLevel
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const generatedContent = generateMaharashtraContent(
        formData.educationLevel,
        formData.board,
        formData.className,
        formData.subject,
        formData.chapter,
        formData.difficultyLevel,
        formData.content,
      );

      await generateMutation.mutateAsync({
        ...formData,
        content: generatedContent,
      });
      toast.success("Study notes generated successfully!");
      setFormData({
        educationLevel: "",
        board: "",
        className: "",
        subject: "",
        chapter: "",
        difficultyLevel: "",
        content: "",
      });
    } catch (_error) {
      toast.error("Failed to generate study notes. Please try again.");
    }
  };

  const handleDelete = async (timestamp: bigint) => {
    try {
      await deleteMutation.mutateAsync(timestamp);
      toast.success("Study notes deleted successfully");
    } catch (_error) {
      toast.error("Failed to delete study notes");
    }
  };

  const handleCopyContent = async (content: string, timestamp: bigint) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedNoteId(timestamp);
      toast.success("Notes copied to clipboard!");
      setTimeout(() => setCopiedNoteId(null), 2000);
    } catch (_error) {
      toast.error("Failed to copy notes");
    }
  };

  const handleDownloadPDF = (note: any) => {
    // Create a print window with the note content
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow pop-ups to download PDF");
      return;
    }

    const logoUrl =
      "/assets/uploads/file_00000000afac7208abab2d62179b0676-1-1-1.png";

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${note.subject} - ${note.chapter}</title>
          <style>
            @page {
              size: A4;
              margin: 20mm;
            }
            
            body {
              font-family: Georgia, serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
            }

            .cover-page {
              page-break-after: always;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              text-align: center;
            }

            .cover-page img {
              max-width: 300px;
              height: auto;
              margin-bottom: 20px;
            }

            .content-page {
              padding: 20px 0;
            }

            .content-page h1 {
              color: #1a1a1a;
              font-size: 24px;
              margin-bottom: 10px;
              border-bottom: 2px solid #333;
              padding-bottom: 10px;
            }

            .content-page h2 {
              color: #2c3e50;
              font-size: 18px;
              margin-top: 30px;
              margin-bottom: 15px;
            }

            .content-page p {
              margin: 10px 0;
              text-align: justify;
            }

            .content-page pre {
              white-space: pre-wrap;
              word-wrap: break-word;
              font-family: Georgia, serif;
              font-size: 14px;
              line-height: 1.8;
            }

            @media print {
              body {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
              }
              
              .cover-page {
                page-break-after: always;
              }

              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <!-- Cover Page (Page 1) - Logo Only -->
          <div class="cover-page">
            <img src="${logoUrl}" alt="CareerNest Logo" onerror="this.style.display='none'" />
          </div>

          <!-- Content Pages (Page 2 onwards) -->
          <div class="content-page">
            <pre>${note.content}</pre>
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            };

            window.onafterprint = function() {
              window.close();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const parseNoteSections = (content: string) => {
    const sections = [
      "Introduction",
      "Key Concepts",
      "Detailed Explanation",
      "Important Formulas/Points",
      "Examples",
      "Summary",
      "Practice Questions",
    ];

    const parsedSections: { title: string; content: string }[] = [];

    sections.forEach((section, index) => {
      const regex = new RegExp(
        `${section}\\s*:?\\s*([\\s\\S]*?)(?=${sections[index + 1]}\\s*:?|$)`,
        "i",
      );
      const match = content.match(regex);
      if (match?.[1]) {
        parsedSections.push({
          title: section,
          content: match[1].trim(),
        });
      }
    });

    // If no sections found, return content as single section
    if (parsedSections.length === 0) {
      parsedSections.push({
        title: "Content",
        content: content,
      });
    }

    return parsedSections;
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000); // Convert nanoseconds to milliseconds
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-5xl font-serif font-bold">
            Study Notes Generator
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Generate structured, exam-oriented study notes for Maharashtra
          students
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <Card className="shadow-soft border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Generate New Notes
            </CardTitle>
            <CardDescription>
              Fill in the details to create Maharashtra-focused study notes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Education Level */}
            <div className="space-y-2">
              <Label htmlFor="educationLevel">Education Level *</Label>
              <Select
                value={formData.educationLevel}
                onValueChange={(value) =>
                  handleInputChange("educationLevel", value)
                }
              >
                <SelectTrigger id="educationLevel">
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10th Standard (SSC / CBSE)">
                    10th Standard (SSC / CBSE)
                  </SelectItem>
                  <SelectItem value="11th &amp; 12th - Science">
                    11th &amp; 12th - Science
                  </SelectItem>
                  <SelectItem value="11th &amp; 12th - Commerce">
                    11th &amp; 12th - Commerce
                  </SelectItem>
                  <SelectItem value="11th &amp; 12th - Arts">
                    11th &amp; 12th - Arts
                  </SelectItem>
                  <SelectItem value="Diploma / Polytechnic">
                    Diploma / Polytechnic
                  </SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="BSc">BSc</SelectItem>
                  <SelectItem value="BCA">BCA</SelectItem>
                  <SelectItem value="Other Undergraduate">
                    Other Undergraduate
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Board/University */}
            <div className="space-y-2">
              <Label htmlFor="board">Board/University *</Label>
              <Select
                value={formData.board}
                onValueChange={(value) => handleInputChange("board", value)}
              >
                <SelectTrigger id="board">
                  <SelectValue placeholder="Select board or university" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Maharashtra State Board">
                    Maharashtra State Board
                  </SelectItem>
                  <SelectItem value="Savitribai Phule Pune University">
                    Savitribai Phule Pune University
                  </SelectItem>
                  <SelectItem value="University of Mumbai">
                    University of Mumbai
                  </SelectItem>
                  <SelectItem value="Rashtrasant Tukadoji Maharaj Nagpur University">
                    Rashtrasant Tukadoji Maharaj Nagpur University
                  </SelectItem>
                  <SelectItem value="Shivaji University Kolhapur">
                    Shivaji University Kolhapur
                  </SelectItem>
                  <SelectItem value="Dr. Babasaheb Ambedkar Marathwada University">
                    Dr. Babasaheb Ambedkar Marathwada University
                  </SelectItem>
                  <SelectItem value="Kavayitri Bahinabai Chaudhari North Maharashtra University">
                    Kavayitri Bahinabai Chaudhari North Maharashtra University
                  </SelectItem>
                  <SelectItem value="Punyashlok Ahilyadevi Holkar Solapur University">
                    Punyashlok Ahilyadevi Holkar Solapur University
                  </SelectItem>
                  <SelectItem value="Gondwana University">
                    Gondwana University
                  </SelectItem>
                  <SelectItem value="SNDT Women's University">
                    SNDT Women's University
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Class/Semester */}
            <div className="space-y-2">
              <Label htmlFor="className">Class/Semester *</Label>
              <Input
                id="className"
                placeholder="e.g., Class 10, Semester 3"
                value={formData.className}
                onChange={(e) => handleInputChange("className", e.target.value)}
              />
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                placeholder="e.g., Mathematics, Physics, History"
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
              />
            </div>

            {/* Chapter/Topic */}
            <div className="space-y-2">
              <Label htmlFor="chapter">Chapter/Topic *</Label>
              <Input
                id="chapter"
                placeholder="e.g., Quadratic Equations, Newton's Laws"
                value={formData.chapter}
                onChange={(e) => handleInputChange("chapter", e.target.value)}
              />
            </div>

            {/* Difficulty Level */}
            <div className="space-y-2">
              <Label htmlFor="difficultyLevel">Difficulty Level *</Label>
              <Select
                value={formData.difficultyLevel}
                onValueChange={(value) =>
                  handleInputChange("difficultyLevel", value)
                }
              >
                <SelectTrigger id="difficultyLevel">
                  <SelectValue placeholder="Select difficulty level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Content Instructions */}
            <div className="space-y-2">
              <Label htmlFor="content">
                Additional Instructions (Optional)
              </Label>
              <Textarea
                id="content"
                placeholder="Add any specific requirements or focus areas..."
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                rows={4}
              />
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={generateMutation.isPending}
              className="w-full"
            >
              {generateMutation.isPending ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Study Notes
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* History Section */}
        <div className="space-y-6">
          <Card className="shadow-soft border-primary/20">
            <CardHeader>
              <CardTitle>Your Study Notes</CardTitle>
              <CardDescription>Previously generated notes</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : studyNotes && studyNotes.length > 0 ? (
                <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                  {[...studyNotes]
                    .sort((a, b) => Number(b.timestamp - a.timestamp))
                    .map((note) => {
                      const sections = parseNoteSections(note.content);
                      return (
                        <Card
                          key={Number(note.timestamp)}
                          className="border-muted"
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <CardTitle className="text-lg mb-1">
                                  {note.subject}
                                </CardTitle>
                                <CardDescription className="text-sm">
                                  {note.chapter} • {note.educationLevel}
                                </CardDescription>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {formatTimestamp(note.timestamp)}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDownloadPDF(note)}
                                  title="Download as PDF"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleCopyContent(
                                      note.content,
                                      note.timestamp,
                                    )
                                  }
                                  title="Copy content"
                                >
                                  {copiedNoteId === note.timestamp ? (
                                    <Check className="h-4 w-4 text-success" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(note.timestamp)}
                                  disabled={deleteMutation.isPending}
                                  title="Delete note"
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {/* Logo Cover Page */}
                            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-8 flex items-center justify-center border-2 border-primary/20">
                              <div className="text-center">
                                <img
                                  src="/assets/uploads/file_00000000afac7208abab2d62179b0676-1-1-1.png"
                                  alt="CareerNest Logo"
                                  className="max-w-[200px] mx-auto mb-2"
                                  onError={(e) => {
                                    (
                                      e.target as HTMLImageElement
                                    ).style.display = "none";
                                  }}
                                />
                                <p className="text-xs text-muted-foreground mt-4">
                                  Maharashtra Education • {note.board}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {note.subject} - {note.chapter}
                                </p>
                              </div>
                            </div>

                            {/* Structured Content */}
                            <Accordion
                              type="single"
                              collapsible
                              className="w-full"
                            >
                              {sections.map((section) => (
                                <AccordionItem
                                  key={section.title}
                                  value={section.title}
                                >
                                  <AccordionTrigger className="text-sm font-medium">
                                    {section.title}
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                                      {section.content}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              ))}
                            </Accordion>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No study notes yet</p>
                  <p className="text-sm">
                    Generate your first set of notes to get started
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
