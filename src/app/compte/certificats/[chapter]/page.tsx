import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { certificateIds, findCertificateMeta } from "@/components/account/data";
import { CertificateView } from "@/components/account/documents";

export function generateStaticParams() {
  return certificateIds.map((chapter) => ({ chapter }));
}

export async function generateMetadata({ params }: PageProps<"/compte/certificats/[chapter]">): Promise<Metadata> {
  const { chapter } = await params;
  const meta = findCertificateMeta(chapter);
  return meta ? { title: `Certificat · ${meta.title} — Assu School` } : {};
}

export default function CertificatePage({ params }: PageProps<"/compte/certificats/[chapter]">) {
  return (
    <Suspense>
      <Certificate params={params} />
    </Suspense>
  );
}

async function Certificate({ params }: Pick<PageProps<"/compte/certificats/[chapter]">, "params">) {
  const { chapter } = await params;
  if (!findCertificateMeta(chapter)) notFound();
  return <CertificateView id={chapter} />;
}
