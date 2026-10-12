import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { demoInvoices, findInvoice } from "@/components/account/data";
import { InvoiceView } from "@/components/account/documents";

export function generateStaticParams() {
  return demoInvoices.map((i) => ({ id: i.id }));
}

export async function generateMetadata({ params }: PageProps<"/compte/factures/[id]">): Promise<Metadata> {
  const { id } = await params;
  return { title: `Facture ${id} — Assu School` };
}

export default function InvoicePage({ params }: PageProps<"/compte/factures/[id]">) {
  return (
    <Suspense>
      <Invoice params={params} />
    </Suspense>
  );
}

async function Invoice({ params }: Pick<PageProps<"/compte/factures/[id]">, "params">) {
  const { id } = await params;
  const invoice = findInvoice(id);
  if (!invoice) notFound();
  return <InvoiceView invoice={invoice} />;
}
