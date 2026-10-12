import { AccountShell } from "@/components/account/account-shell";

export default function CompteLayout({ children }: LayoutProps<"/compte">) {
  return <AccountShell>{children}</AccountShell>;
}
