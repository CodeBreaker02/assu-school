import type { Metadata } from "next";
import { Certificates } from "@/components/account/certificates";

export const metadata: Metadata = { title: "Mes certificats — Assu School" };

export default function CertificatsPage() {
  return <Certificates />;
}
