// Class/stream/branch encoding utilities for CareerNest student profiles
// Data is stored in the interests array with special prefixes

export const CLASS_OPTIONS = [
  { value: "10th", label: "10th Standard (SSC/CBSE)" },
  { value: "11th", label: "11th Standard" },
  { value: "12th", label: "12th Standard" },
  { value: "Diploma", label: "Diploma / Polytechnic" },
  { value: "Engineering", label: "Engineering" },
  { value: "BSc", label: "BSc" },
  { value: "BCA", label: "BCA" },
  { value: "OtherUG", label: "Other Undergraduate Courses" },
];

export const STREAM_OPTIONS = [
  { value: "Science", label: "Science" },
  { value: "Commerce", label: "Commerce" },
  { value: "Arts", label: "Arts" },
];

export const BRANCH_OPTIONS = [
  { value: "Computer", label: "Computer Engineering" },
  { value: "Mechanical", label: "Mechanical Engineering" },
  { value: "Civil", label: "Civil Engineering" },
  { value: "Electrical", label: "Electrical Engineering" },
  { value: "Electronics", label: "Electronics Engineering" },
  { value: "OtherBranch", label: "Other Branch" },
];

export function requiresStream(classLevel: string): boolean {
  return classLevel === "11th" || classLevel === "12th";
}

export function requiresBranch(classLevel: string): boolean {
  return classLevel === "Engineering" || classLevel === "Diploma";
}

export function encodeClassProfile(
  classLevel: string,
  stream?: string,
  branch?: string,
): string[] {
  const entries: string[] = [];
  if (classLevel) entries.push(`__class:${classLevel}`);
  if (stream && requiresStream(classLevel)) entries.push(`__stream:${stream}`);
  if (branch && requiresBranch(classLevel)) entries.push(`__branch:${branch}`);
  return entries;
}

export function decodeClassProfile(interests: string[]): {
  classLevel: string;
  stream: string;
  branch: string;
} {
  let classLevel = "";
  let stream = "";
  let branch = "";

  for (const interest of interests) {
    if (interest.startsWith("__class:")) {
      classLevel = interest.slice("__class:".length);
    } else if (interest.startsWith("__stream:")) {
      stream = interest.slice("__stream:".length);
    } else if (interest.startsWith("__branch:")) {
      branch = interest.slice("__branch:".length);
    }
  }

  return { classLevel, stream, branch };
}

export function getDisplayInterests(interests: string[]): string[] {
  return interests.filter((i) => !i.startsWith("__"));
}

export function getClassLabel(classLevel: string): string {
  return CLASS_OPTIONS.find((c) => c.value === classLevel)?.label ?? classLevel;
}

export function getStreamLabel(stream: string): string {
  return STREAM_OPTIONS.find((s) => s.value === stream)?.label ?? stream;
}

export function getBranchLabel(branch: string): string {
  return BRANCH_OPTIONS.find((b) => b.value === branch)?.label ?? branch;
}
