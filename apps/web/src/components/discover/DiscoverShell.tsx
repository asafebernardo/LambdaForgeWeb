import type { ReactNode } from "react";

interface DiscoverShellProps {
  children: ReactNode;
}

export function DiscoverShell({ children }: DiscoverShellProps) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col overflow-hidden bg-bg">
      {children}
    </div>
  );
}
