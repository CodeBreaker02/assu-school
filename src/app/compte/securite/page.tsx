import type { Metadata } from "next";
import { Security } from "@/components/account/security";

export const metadata: Metadata = { title: "Sécurité — Assu School" };

export default function SecuritePage() {
  return <Security />;
}
