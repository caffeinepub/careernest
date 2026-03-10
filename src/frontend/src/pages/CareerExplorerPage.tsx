import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Briefcase, GraduationCap, Search } from "lucide-react";
import { useState } from "react";
import { useGetAllCareerPaths } from "../hooks/useQueries";

export default function CareerExplorerPage() {
  const { data: careers, isLoading } = useGetAllCareerPaths();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCareers = careers
    ? careers.filter((career) => {
        const query = searchQuery.toLowerCase();
        return (
          career.title.toLowerCase().includes(query) ||
          career.description.toLowerCase().includes(query) ||
          career.industry.toLowerCase().includes(query) ||
          career.requiredSkills.some((skill) =>
            skill.toLowerCase().includes(query),
          )
        );
      })
    : [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold mb-2">Explore Careers</h1>
        <p className="text-muted-foreground">
          Browse and discover career paths that interest you
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by title, industry, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full mb-3" />
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredCareers.length === 0 ? (
        <Card className="shadow-soft">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Careers Found</h2>
            <p className="text-muted-foreground text-center max-w-md">
              {searchQuery
                ? "Try adjusting your search terms or browse all careers."
                : "No career paths are available yet."}
            </p>
            {searchQuery && (
              <Button
                variant="outline"
                onClick={() => setSearchQuery("")}
                className="mt-4"
              >
                Clear Search
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-6 text-sm text-muted-foreground">
            Showing {filteredCareers.length}{" "}
            {filteredCareers.length === 1 ? "career" : "careers"}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCareers.map((career) => (
              <Card
                key={career.title}
                className="shadow-soft hover:shadow-glow transition-all hover:scale-[1.02] group"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-serif line-clamp-1">
                    {career.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-1">
                    {career.industry}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {career.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <GraduationCap className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground line-clamp-1">
                        {career.educationRequirements}
                      </span>
                    </div>
                  </div>

                  {career.requiredSkills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {career.requiredSkills.slice(0, 3).map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {career.requiredSkills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{career.requiredSkills.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  <Link to="/career/$title" params={{ title: career.title }}>
                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
