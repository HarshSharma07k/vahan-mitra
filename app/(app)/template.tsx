import { PageTransition } from "@/components/common/PageTransition";

// Next remounts template.tsx on every navigation within this segment, which
// is exactly the hook point needed for a per-route enter transition.
export default function AppTemplate({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
