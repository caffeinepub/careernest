import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Award, Calendar, TrendingUp } from "lucide-react";
import { useGetUserAssessments } from "../hooks/useQueries";

export default function CareerResultsPage() {
  const { data: assessments, isLoading } = useGetUserAssessments();

  const sortedAssessments = assessments
    ? [...assessments].sort((a, b) => Number(b.timestamp - a.timestamp))
    : [];

  const getMatchColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-primary";
    if (score >= 40) return "text-accent";
    return "text-muted-foreground";
  };

  const getMatchBadgeVariant = (
    score: number,
  ): "default" | "secondary" | "destructive" | "outline" => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "outline";
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold mb-2">
          Your Career Results
        </h1>
        <p className="text-muted-foreground">
          Recommended career paths based on your assessments
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : sortedAssessments.length === 0 ? (
        <Card className="shadow-soft">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Assessments Yet</h2>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Take your first career assessment to discover paths that match
              your interests and skills.
            </p>
            <Link to="/assessment">
              <Button size="lg">
                Take Assessment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Top Result */}
          {sortedAssessments[0] && (
            <Card className="shadow-glow border-primary/30 bg-gradient-to-br from-card to-primary/5">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-5 w-5 text-accent" />
                      <Badge
                        variant="default"
                        className="bg-accent text-accent-foreground"
                      >
                        Top Match
                      </Badge>
                    </div>
                    <CardTitle className="text-3xl font-serif mb-2">
                      {sortedAssessments[0].recommendedCareer}
                    </CardTitle>
                    <CardDescription className="text-base">
                      Latest assessment result
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-4xl font-bold ${getMatchColor(Number(sortedAssessments[0].matchScore))}`}
                    >
                      {Number(sortedAssessments[0].matchScore)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Match</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(
                      Number(sortedAssessments[0].timestamp) / 1000000,
                    ).toLocaleDateString()}
                  </span>
                </div>
                <Link
                  to="/career/$title"
                  params={{ title: sortedAssessments[0].recommendedCareer }}
                >
                  <Button size="lg" className="w-full sm:w-auto">
                    View Career Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Assessment History */}
          {sortedAssessments.length > 1 && (
            <>
              <div className="mt-12">
                <h2 className="text-2xl font-serif font-semibold mb-4">
                  Assessment History
                </h2>
              </div>
              <div className="space-y-4">
                {sortedAssessments.slice(1).map((assessment) => (
                  <Card
                    key={assessment.timestamp.toString()}
                    className="shadow-soft hover:shadow-glow transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-serif font-semibold truncate">
                              {assessment.recommendedCareer}
                            </h3>
                            <Badge
                              variant={getMatchBadgeVariant(
                                Number(assessment.matchScore),
                              )}
                            >
                              {Number(assessment.matchScore)}% Match
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(
                                Number(assessment.timestamp) / 1000000,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Link
                          to="/career/$title"
                          params={{ title: assessment.recommendedCareer }}
                        >
                          <Button variant="outline">
                            View Details
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* CTA */}
          <Card className="bg-muted/50 border-dashed">
            <CardContent className="flex items-center justify-between gap-4 p-6 flex-wrap">
              <div>
                <h3 className="font-semibold mb-1">
                  Want to explore more careers?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Take another assessment or browse our career database
                </p>
              </div>
              <div className="flex gap-3">
                <Link to="/assessment">
                  <Button variant="outline">Retake Assessment</Button>
                </Link>
                <Link to="/explore">
                  <Button>Browse Careers</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
