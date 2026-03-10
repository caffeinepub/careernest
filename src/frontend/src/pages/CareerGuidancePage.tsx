import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronRight,
  Code2,
  GraduationCap,
  Heart,
  Shield,
  Wrench,
} from "lucide-react";

const careerPaths = [
  {
    id: "engineering",
    label: "Engineering",
    icon: Code2,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    description:
      "Pursue B.E. / B.Tech through JEE Main or MHT-CET. Maharashtra has some of India's best engineering institutions.",
    exams: ["MHT-CET", "JEE Main", "JEE Advanced", "NEET (for Bio-Tech)"],
    colleges: [
      "COEP Technological University, Pune",
      "VJTI Mumbai",
      "ICT Mumbai (formerly UDCT)",
      "VNIT Nagpur",
      "NIT Nagpur",
      "College of Engineering, Nashik",
      "SPPU affiliated colleges (PICT, SPIT, etc.)",
      "Symbiosis Institute of Technology, Pune",
    ],
    branches: [
      "Computer Science",
      "Mechanical",
      "Civil",
      "Electronics",
      "IT",
      "Chemical",
      "Electrical",
    ],
    salary: "₹3.5 – ₹20+ LPA (depending on branch & company)",
    steps: [
      "Clear 10th with good marks",
      "Choose Science (PCM) in 11th–12th",
      "Prepare for MHT-CET / JEE",
      "Apply via MHT-CET CAP Round",
      "Complete 4-year B.E./B.Tech",
      "Campus placements or higher studies (M.Tech / MBA)",
    ],
  },
  {
    id: "medical",
    label: "Medical",
    icon: Heart,
    color: "text-rose-600",
    bg: "bg-rose-50 dark:bg-rose-950/30",
    description:
      "Become a doctor (MBBS/BDS) or explore AYUSH courses. NEET is the single gateway for all medical admissions in India.",
    exams: ["NEET UG", "NEET PG (for post-graduation)"],
    colleges: [
      "Grant Medical College, Mumbai",
      "BJ Medical College, Pune",
      "Government Medical College, Nagpur",
      "Seth GS Medical College, Mumbai",
      "Govt. Medical College, Aurangabad",
      "Dr. Vasantrao Pawar Medical College, Nashik",
      "Armed Forces Medical College (AFMC), Pune",
    ],
    branches: [
      "MBBS",
      "BDS (Dentistry)",
      "BAMS (Ayurveda)",
      "BHMS (Homeopathy)",
      "BUMS (Unani)",
      "B.Pharm",
      "Nursing",
    ],
    salary: "₹5 – ₹30+ LPA (specialization increases earnings significantly)",
    steps: [
      "Choose Science (PCB) in 11th–12th",
      "Prepare rigorously for NEET",
      "Apply through NEET counselling (State / All-India quota)",
      "Complete 5.5-year MBBS including internship",
      "Register with Maharashtra Medical Council",
      "Pursue MD/MS for specialization",
    ],
  },
  {
    id: "government",
    label: "Government Jobs",
    icon: Shield,
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    description:
      "Maharashtra offers excellent government job opportunities through MPSC, UPSC, and central recruitment boards.",
    exams: [
      "MPSC Rajyaseva",
      "MPSC Combine",
      "UPSC CSE",
      "IBPS PO / Clerk",
      "RRB NTPC",
      "Maharashtra Police Bharti",
      "Army / Navy / Air Force",
    ],
    colleges: [
      "YCM Open University (study centers across MH)",
      "MPSC coaching centers in Pune, Nashik, Aurangabad",
      "Gondwana University (for Vidarbha region)",
    ],
    branches: [
      "Civil Services (IAS/IPS)",
      "Banking",
      "Railways",
      "Police",
      "Defence",
      "Teaching (TET/SET)",
      "Maharashtra PSC posts",
    ],
    salary: "₹2.5 – ₹15 LPA + perks, pension, job security",
    steps: [
      "Complete graduation (any stream)",
      "Identify target exam (MPSC / UPSC / Banking)",
      "Join a coaching class or self-study with MPSC notes",
      "Appear in Prelims → Mains → Interview",
      "Selected candidates go through training",
      "Posting across Maharashtra",
    ],
  },
  {
    id: "bsc-bca",
    label: "BSc / BCA",
    icon: BookOpen,
    color: "text-violet-600",
    bg: "bg-violet-50 dark:bg-violet-950/30",
    description:
      "3-year undergraduate programs offering strong foundations in science or computer applications, with many career avenues.",
    exams: [
      "Maharashtra CET (for some colleges)",
      "College-level admission",
      "JEE for IISc / IISERs",
    ],
    colleges: [
      "Ferguson College, Pune (SPPU)",
      "Elphinstone College, Mumbai",
      "Institute of Science, Mumbai",
      "Fergusson College of Science, Pune",
      "Symbiosis College of Arts & Commerce",
      "Savitribai Phule Pune University campus colleges",
      "Nanded, Solapur, Kolhapur government colleges",
    ],
    branches: [
      "BSc CS",
      "BSc IT",
      "BSc Physics",
      "BSc Chemistry",
      "BSc Math",
      "BCA (Computer Applications)",
      "BSc Data Science",
    ],
    salary: "₹2.5 – ₹10 LPA (higher with MSc/MCA/MBA)",
    steps: [
      "Clear 12th Science or Commerce",
      "Apply to desired college for BSc/BCA",
      "Complete 3-year program",
      "Pursue MSc, MCA, or MBA for advancement",
      "Certifications (AWS, Python, etc.) boost BSc CS/IT/BCA careers",
    ],
  },
  {
    id: "diploma",
    label: "Diploma / Polytechnic",
    icon: Wrench,
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    description:
      "3-year diploma programs after 10th standard through Maharashtra's polytechnic colleges. Direct entry to 2nd year of engineering (lateral entry).",
    exams: [
      "Maharashtra Polytechnic CET (after 10th)",
      "Lateral Entry to 2nd year Engineering",
    ],
    colleges: [
      "Government Polytechnic Mumbai",
      "Government Polytechnic Pune",
      "Government Polytechnic Nagpur",
      "K.K. Wagh Polytechnic, Nashik",
      "Annasaheb Dange College of Engineering & Tech (Diploma wing)",
      "Padmashri Dr. Vitthalrao Vikhe Patil Poly, Ahmednagar",
    ],
    branches: [
      "Mechanical",
      "Civil",
      "Electrical",
      "Electronics",
      "Computer Engineering",
      "Automobile",
      "Chemical",
    ],
    salary: "₹2 – ₹6 LPA (freshers); higher after experience or degree",
    steps: [
      "Complete 10th Standard (SSC)",
      "Apply via Maharashtra Polytechnic CET",
      "Choose branch and college via CAP round",
      "Complete 3-year Diploma program",
      "Join industry or lateral entry to 2nd year B.E.",
    ],
  },
  {
    id: "skill",
    label: "Skill-Based Careers",
    icon: Briefcase,
    color: "text-orange-600",
    bg: "bg-orange-50 dark:bg-orange-950/30",
    description:
      "Vocational and skill-based training through ITI, PMKVY, and private institutes. Great for students who want to enter the workforce quickly.",
    exams: [
      "ITI Admission (after 8th / 10th)",
      "PMKVY Enrollment",
      "Private certification exams",
    ],
    colleges: [
      "Government ITI colleges across Maharashtra",
      "MSBTE affiliated institutes",
      "Aptech / NIIT / Arena Animation",
      "Skill Development Centers (DGET)",
      "Maharashtra Skill Development Society (MSDS) centers",
    ],
    branches: [
      "ITI Trades (Fitter, Welder, Electrician)",
      "Digital Marketing",
      "Web Development",
      "Graphic Design",
      "Fashion Design",
      "Hospitality & Tourism",
      "Coding Bootcamps",
    ],
    salary: "₹1.8 – ₹8 LPA (freelance or employed; highly skill-dependent)",
    steps: [
      "Identify skill area of interest",
      "Enroll in ITI, PMKVY, or private institute",
      "Complete 6-month to 2-year program",
      "Get NCVT / SCVT certification",
      "Apply for apprenticeship or freelance work",
      "Keep upskilling with online platforms (Coursera, NPTEL)",
    ],
  },
];

export default function CareerGuidancePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-serif font-bold">Career Guidance</h1>
        </div>
        <p className="text-muted-foreground ml-13">
          Explore career paths for Maharashtra students — from Standard 10
          onwards.
        </p>
        <Badge variant="outline" className="mt-2 ml-1">
          <Building2 className="h-3 w-3 mr-1" /> Maharashtra Focus
        </Badge>
      </div>

      <Tabs defaultValue="engineering" data-ocid="career.tab">
        <TabsList className="flex flex-wrap gap-1 h-auto mb-6 bg-muted p-1 rounded-xl">
          {careerPaths.map((path) => (
            <TabsTrigger
              key={path.id}
              value={path.id}
              className="rounded-lg text-xs sm:text-sm"
              data-ocid={`career.${path.id}.tab`}
            >
              <path.icon className="h-3.5 w-3.5 mr-1.5" />
              {path.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {careerPaths.map((path) => (
          <TabsContent key={path.id} value={path.id}>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Overview */}
              <Card className={`border-0 ${path.bg} shadow-soft`}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/60 dark:bg-black/20 rounded-xl flex items-center justify-center">
                      <path.icon className={`h-6 w-6 ${path.color}`} />
                    </div>
                    <div>
                      <CardTitle className="font-serif text-xl">
                        {path.label}
                      </CardTitle>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {path.salary}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80 mb-4">
                    {path.description}
                  </p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Key Exams / Entry Points
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {path.exams.map((exam) => (
                          <Badge
                            key={exam}
                            variant="outline"
                            className="text-xs"
                          >
                            {exam}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Branches / Courses
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {path.branches.map((branch) => (
                          <Badge
                            key={branch}
                            className="text-xs bg-white/70 dark:bg-black/20 text-foreground border"
                          >
                            {branch}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                {/* Top Colleges */}
                <Card className="shadow-soft">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-serif flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-primary" />
                      Top Maharashtra Colleges
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Government & reputed institutes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {path.colleges.map((college) => (
                        <li
                          key={college}
                          className="flex items-start gap-2 text-sm"
                        >
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          {college}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Next Steps */}
                <Card className="shadow-soft">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-serif flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-primary" />
                      Your Roadmap
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Step-by-step path forward
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-2">
                      {path.steps.map((step, i) => (
                        <li
                          key={step}
                          className="flex items-start gap-3 text-sm"
                        >
                          <span className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
