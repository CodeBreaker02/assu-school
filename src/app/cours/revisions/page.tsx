import type { Metadata } from "next";
import { ReviewHub } from "@/components/learn/review-hub";

export const metadata: Metadata = {
  title: "Révisions — Assu School",
  description: "Répétition espacée : revoyez chaque notion juste avant de l'oublier.",
};

export default function RevisionsPage() {
  return <ReviewHub />;
}
