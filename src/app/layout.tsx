import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GTAIM — AI-powered GTM, right on target",
  description:
    "Generate a complete Go-To-Market Playbook from a product URL — powered by Claude AI.",
  icons: {
    icon: "/gtaim-favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
