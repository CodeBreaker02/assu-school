import type { Metadata } from "next";
import { Progression } from "@/components/account/progression";

export const metadata: Metadata = {
  title: "Ma progression — Assu School",
  description: "Votre progression, vos badges et votre activité dans l'école de l'argent.",
};

export default function ComptePage() {
  return <Progression />;
}
