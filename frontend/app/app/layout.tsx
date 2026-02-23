import { PhoneShell } from "@/components/app/PhoneShell";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PhoneShell>{children}</PhoneShell>;
}
