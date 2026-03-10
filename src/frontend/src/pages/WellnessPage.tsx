import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, CheckCircle, Leaf } from "lucide-react";
import { useState } from "react";
import {
  useGetAllWellnessResources,
  useGetViewedResources,
  useSaveViewedResource,
} from "../hooks/useQueries";

export default function WellnessPage() {
  const { data: resources, isLoading } = useGetAllWellnessResources();
  const { data: viewedResources } = useGetViewedResources();
  const saveViewed = useSaveViewedResource();

  const [selectedResource, setSelectedResource] = useState<number | null>(null);

  const handleViewResource = async (index: number) => {
    setSelectedResource(index);
    try {
      await saveViewed.mutateAsync(BigInt(index));
    } catch (error) {
      console.error("Failed to save viewed resource:", error);
    }
  };

  const isViewed = (index: number) => {
    return viewedResources?.some((id) => Number(id) === index) || false;
  };

  const categorizeResources = () => {
    const categories: { [key: string]: typeof resources } = {};
    for (const resource of resources ?? []) {
      const type = resource.type || "General";
      if (!categories[type]) {
        categories[type] = [];
      }
      categories[type]!.push(resource);
    }
    return categories;
  };

  const categorized = categorizeResources();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold mb-2">
          Wellness Resources
        </h1>
        <p className="text-muted-foreground">
          Tips and strategies for managing stress and maintaining well-being
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-8">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((j) => (
                  <Card key={j}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-16 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : !resources || resources.length === 0 ? (
        <Card className="shadow-soft">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Leaf className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              No Resources Available
            </h2>
            <p className="text-muted-foreground text-center max-w-md">
              Wellness resources will appear here once they're added.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-12">
          {Object.entries(categorized).map(([category, categoryResources]) => (
            <div key={category}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Leaf className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-serif font-semibold">
                  {category}
                </h2>
                <Badge variant="secondary" className="ml-auto">
                  {categoryResources?.length}{" "}
                  {categoryResources?.length === 1 ? "resource" : "resources"}
                </Badge>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {categoryResources?.map((resource) => {
                  const globalIndex = resources.findIndex(
                    (r) =>
                      r.title === resource.title &&
                      r.content === resource.content,
                  );
                  const viewed = isViewed(globalIndex);

                  return (
                    <Card
                      key={resource.title}
                      className={`shadow-soft hover:shadow-glow transition-all cursor-pointer group ${
                        viewed ? "border-success/30" : ""
                      }`}
                      onClick={() => handleViewResource(globalIndex)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between gap-3">
                          <CardTitle className="text-lg font-serif flex-1 group-hover:text-primary transition-colors">
                            {resource.title}
                          </CardTitle>
                          {viewed && (
                            <CheckCircle className="h-5 w-5 text-success shrink-0" />
                          )}
                        </div>
                        <CardDescription className="line-clamp-3">
                          {resource.content}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline" size="sm" className="w-full">
                          <BookOpen className="mr-2 h-4 w-4" />
                          Read More
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resource Detail Dialog */}
      {selectedResource !== null &&
        resources &&
        resources[selectedResource] && (
          <Dialog
            open={selectedResource !== null}
            onOpenChange={() => setSelectedResource(null)}
          >
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-serif">
                  {resources[selectedResource].title}
                </DialogTitle>
                <DialogDescription>
                  <Badge variant="secondary" className="mt-2">
                    {resources[selectedResource].type}
                  </Badge>
                </DialogDescription>
              </DialogHeader>
              <div className="prose prose-sm max-w-none mt-4">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {resources[selectedResource].content}
                </p>
              </div>
              <div className="flex items-center gap-3 mt-6 pt-6 border-t">
                <CheckCircle className="h-5 w-5 text-success" />
                <span className="text-sm text-muted-foreground">
                  Marked as viewed
                </span>
              </div>
            </DialogContent>
          </Dialog>
        )}

      {/* Encouragement Card */}
      <Card className="bg-gradient-to-br from-secondary/10 to-accent/10 border-dashed mt-12">
        <CardContent className="flex flex-col items-center text-center p-8">
          <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mb-4">
            <Leaf className="h-8 w-8 text-secondary" />
          </div>
          <h3 className="text-xl font-serif font-semibold mb-2">
            Take Care of Yourself
          </h3>
          <p className="text-muted-foreground max-w-md">
            Remember to prioritize your mental well-being. Small steps every day
            can make a big difference. You're doing great! 💚
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
