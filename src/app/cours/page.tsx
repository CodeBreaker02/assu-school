import { redirect } from "next/navigation";
import { firstLesson } from "@/lib/content";

// Opening the e-learning space drops you straight into chapter 01, lesson 01.
export default function CoursPage() {
  redirect(`/cours/${firstLesson.slug}`);
}
