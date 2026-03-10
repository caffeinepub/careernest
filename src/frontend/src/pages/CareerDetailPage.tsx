import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Briefcase,
  Building,
  CheckCircle,
  GraduationCap,
  TrendingUp,
} from "lucide-react";
import {
  useGetAllCareerPaths,
  useGetCareerPathByTitle,
} from "../hooks/useQueries";

export default function CareerDetailPage() {
  const { title } = useParams({ from: "/career/$title" });
  const { data: career, isLoading } = useGetCareerPathByTitle(title);
  const { data: allCareers } = useGetAllCareerPaths();

  const relatedCareers = allCareers
    ? allCareers
        .filter((c) => c.title !== title && c.industry === career?.industry)
        .slice(0, 3)
    : [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Skeleton className="h-10 w-32 mb-8" />
        <Card>
          <CardHeader>
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Card className="shadow-soft">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Briefcase className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Career Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The career you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/explore">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Browse Careers
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Back Button */}
      <Link to="/explore">
        <Button variant="ghost" className="mb-6 -ml-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Careers
        </Button>
      </Link>

      {/* Main Content */}
      <Card className="shadow-glow mb-8">
        <CardHeader>
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
              <Briefcase className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-serif font-bold mb-2">
                {career.title}
              </h1>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-sm">
                  <Building className="h-3 w-3 mr-1" />
                  {career.industry}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Description */}
          <div>
            <h2 className="text-2xl font-serif font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Overview
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {career.description}
            </p>
          </div>

          <Separator />

          {/* Education Requirements */}
          <div>
            <h2 className="text-2xl font-serif font-semibold mb-3 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-secondary" />
              Education Requirements
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {career.educationRequirements}
            </p>
          </div>

          <Separator />

          {/* Required Skills */}
          <div>
            <h2 className="text-2xl font-serif font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-accent" />
              Required Skills
            </h2>
            {career.requiredSkills.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-3">
                {career.requiredSkills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                    <span className="text-sm">{skill}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No specific skills listed.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Related Careers */}
      {relatedCareers.length > 0 && (
        <div>
          <h2 className="text-2xl font-serif font-semibold mb-6">
            Related Careers in {career.industry}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedCareers.map((related) => (
              <Card
                key={related.title}
                className="shadow-soft hover:shadow-glow transition-shadow group"
              >
                <CardHeader>
                  <CardTitle className="text-lg font-serif line-clamp-2">
                    {related.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {related.description}
                  </p>
                  <Link to="/career/$title" params={{ title: related.title }}>
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-dashed mt-8">
        <CardContent className="flex items-center justify-between gap-4 p-6 flex-wrap">
          <div>
            <h3 className="font-semibold mb-1">Interested in this career?</h3>
            <p className="text-sm text-muted-foreground">
              Take an assessment to see how well it matches your profile
            </p>
          </div>
          <Link to="/assessment">
            <Button size="lg">Take Assessment</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
