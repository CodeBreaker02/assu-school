import type { Metadata } from "next";
import { Subscription } from "@/components/account/subscription";

export const metadata: Metadata = { title: "Abonnement et factures — Assu School" };

export default function AbonnementPage() {
  return <Subscription />;
}
