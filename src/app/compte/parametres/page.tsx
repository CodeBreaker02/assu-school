import type { Metadata } from "next";
import { Settings } from "@/components/account/settings";

export const metadata: Metadata = { title: "Paramètres — Assu School" };

export default function ParametresPage() {
  return <Settings />;
}
