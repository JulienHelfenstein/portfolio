import type { Metadata } from "next";

// Tier privé : jamais indexé. L'accès est contrôlé par src/proxy.ts.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PrivateLayout({ children }: LayoutProps<"/private">) {
  return children;
}
