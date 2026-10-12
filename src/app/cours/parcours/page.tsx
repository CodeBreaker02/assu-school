import type { Metadata } from "next";
import { Dashboard } from "@/components/learn/dashboard";

export const metadata: Metadata = {
  title: "Mon parcours — Assu School",
  description: "Votre progression dans l'école de l'argent : chapitres, leçons et simulateurs.",
};

export default function ParcoursPage() {
  return <Dashboard />;
}
