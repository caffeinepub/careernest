import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "../hooks/useQueries";
import { addSharedNote } from "../utils/localStorage";

interface SharedNoteUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function SharedNoteUploadModal({
  open,
  onOpenChange,
  onSuccess,
}: SharedNoteUploadModalProps) {
  const { identity } = useInternetIdentity();
  const { data: profile } = useGetCallerUserProfile();

  const [formData, setFormData] = useState({
    topic: "",
    educationLevel: "",
    board: "",
    className: "",
    subject: "",
    content: "",
  });
  const [imageData, setImageData] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string>("");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImageData(reader.result as string);
        setImageFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageData(null);
    setImageFileName("");
  };

  const handleSubmit = () => {
    if (
      !formData.topic ||
      !formData.educationLevel ||
      !formData.board ||
      !formData.className ||
      !formData.subject ||
      !formData.content
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!identity || !profile) {
      toast.error("You must be logged in to upload notes");
      return;
    }

    try {
      addSharedNote({
        uploaderId: identity.getPrincipal().toString(),
        uploaderName: profile.name,
        educationLevel: formData.educationLevel,
        board: formData.board,
        className: formData.className,
        subject: formData.subject,
        topic: formData.topic,
        content: formData.content,
        imageData: imageData || undefined,
      });

      toast.success("Notes uploaded successfully!");

      // Reset form
      setFormData({
        topic: "",
        educationLevel: "",
        board: "",
        className: "",
        subject: "",
        content: "",
      });
      setImageData(null);
      setImageFileName("");

      onSuccess();
      onOpenChange(false);
    } catch (_error) {
      toast.error("Failed to upload notes. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Upload Study Notes
          </DialogTitle>
          <DialogDescription>
            Share your notes with other students studying the same curriculum
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Topic/Title */}
          <div className="space-y-2">
            <Label htmlFor="topic">
              Topic/Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="topic"
              placeholder="e.g., Photosynthesis, Quadratic Equations"
              value={formData.topic}
              onChange={(e) => handleInputChange("topic", e.target.value)}
            />
          </div>

          {/* Education Level */}
          <div className="space-y-2">
            <Label htmlFor="educationLevel">
              Education Level <span className="text-destructive">*</span>
            </Label>
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
                <SelectItem value="Class 1-5">Class 1-5</SelectItem>
                <SelectItem value="Class 6-8">Class 6-8</SelectItem>
                <SelectItem value="Class 9-10">Class 9-10</SelectItem>
                <SelectItem value="Class 11-12">Class 11-12</SelectItem>
                <SelectItem value="Diploma">Diploma</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="BSc">BSc</SelectItem>
                <SelectItem value="BCA">BCA</SelectItem>
                <SelectItem value="BA">BA</SelectItem>
                <SelectItem value="BCom">BCom</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Board/University */}
          <div className="space-y-2">
            <Label htmlFor="board">
              Board/University <span className="text-destructive">*</span>
            </Label>
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

          {/* Class/Year/Semester */}
          <div className="space-y-2">
            <Label htmlFor="className">
              Class/Year/Semester <span className="text-destructive">*</span>
            </Label>
            <Input
              id="className"
              placeholder="e.g., Class 10, Year 2, Semester 3"
              value={formData.className}
              onChange={(e) => handleInputChange("className", e.target.value)}
            />
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">
              Subject <span className="text-destructive">*</span>
            </Label>
            <Input
              id="subject"
              placeholder="e.g., Biology, Mathematics, History"
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">
              Notes Content <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="content"
              placeholder="Enter your study notes here..."
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
          </div>

          {/* Image Upload (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="image">Image (Optional)</Label>
            {imageData ? (
              <div className="relative">
                <img
                  src={imageData}
                  alt="Upload preview"
                  className="w-full max-h-48 object-contain rounded-lg border border-border"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4" />
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  {imageFileName}
                </p>
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <label htmlFor="image" className="cursor-pointer">
                  <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-1">
                    Click to upload handwritten notes
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG up to 5MB
                  </p>
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Notes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
