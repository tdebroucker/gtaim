"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function PlaybookPage() {
  const router = useRouter();
  const [markdown, setMarkdown] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("gtaim_playbook");
    if (!stored) {
      router.push("/intake");
      return;
    }
    setMarkdown(stored);
  }, [router]);

  function handleCopy() {
    navigator.clipboard.writeText(markdown).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (!markdown) {
    return (
      <div style={styles.loadingWrap}>
        <p style={styles.loadingText}>Loading playbook…</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.headerInner}>
          <a href="/" style={styles.logo}>GTAIM</a>
          <div style={styles.headerActions}>
            <button onClick={handleCopy} style={styles.copyBtn}>
              {copied ? "✓ Copied" : "Copy Markdown"}
            </button>
            <a href="/intake" style={styles.newBtn}>
              New Playbook →
            </a>
          </div>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.markdownWrap}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => <h1 style={styles.h1}>{children}</h1>,
              h2: ({ children }) => <h2 style={styles.h2}>{children}</h2>,
              h3: ({ children }) => <h3 style={styles.h3}>{children}</h3>,
              p: ({ children }) => <p style={styles.p}>{children}</p>,
              ul: ({ children }) => <ul style={styles.ul}>{children}</ul>,
              li: ({ children }) => <li style={styles.li}>{children}</li>,
              strong: ({ children }) => <strong style={styles.strong}>{children}</strong>,
              em: ({ children }) => <em style={styles.em}>{children}</em>,
              hr: () => <hr style={styles.hr} />,
              table: ({ children }) => (
                <div style={styles.tableWrap}>
                  <table style={styles.table}>{children}</table>
                </div>
              ),
              thead: ({ children }) => <thead>{children}</thead>,
              tbody: ({ children }) => <tbody>{children}</tbody>,
              tr: ({ children }) => <tr style={styles.tr}>{children}</tr>,
              th: ({ children }) => <th style={styles.th}>{children}</th>,
              td: ({ children }) => <td style={styles.td}>{children}</td>,
              blockquote: ({ children }) => (
                <blockquote style={styles.blockquote}>{children}</blockquote>
              ),
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#0A0A0F",
    fontFamily: "Inter, sans-serif",
    color: "#F0F0F0",
  },
  loadingWrap: {
    minHeight: "100vh",
    backgroundColor: "#0A0A0F",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#8B8B9E",
    fontFamily: "Inter, sans-serif",
    fontSize: 16,
  },
  header: {
    position: "sticky" as const,
    top: 0,
    backgroundColor: "#0A0A0F",
    borderBottom: "1px solid #2A2A3A",
    zIndex: 100,
    padding: "0 24px",
  },
  headerInner: {
    maxWidth: 860,
    margin: "0 auto",
    height: 56,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    fontFamily: "Space Grotesk, sans-serif",
    fontWeight: 700,
    fontSize: 18,
    color: "#FF6B35",
    textDecoration: "none",
    letterSpacing: "0.04em",
  },
  headerActions: {
    display: "flex",
    gap: 12,
    alignItems: "center",
  },
  copyBtn: {
    background: "transparent",
    border: "1px solid #2A2A3A",
    color: "#8B8B9E",
    fontFamily: "Inter, sans-serif",
    fontSize: 13,
    fontWeight: 500,
    padding: "7px 14px",
    borderRadius: 4,
    cursor: "pointer",
  },
  newBtn: {
    background: "#FF6B35",
    border: "none",
    color: "#FFFFFF",
    fontFamily: "Inter, sans-serif",
    fontSize: 13,
    fontWeight: 600,
    padding: "7px 14px",
    borderRadius: 4,
    cursor: "pointer",
    textDecoration: "none",
  },
  content: {
    maxWidth: 860,
    margin: "0 auto",
    padding: "48px 24px 80px",
  },
  markdownWrap: {
    lineHeight: 1.7,
  },
  h1: {
    fontFamily: "Space Grotesk, sans-serif",
    fontSize: 32,
    fontWeight: 700,
    color: "#F0F0F0",
    marginTop: 0,
    marginBottom: 8,
    lineHeight: 1.2,
  },
  h2: {
    fontFamily: "Space Grotesk, sans-serif",
    fontSize: 22,
    fontWeight: 600,
    color: "#FF6B35",
    marginTop: 48,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottom: "1px solid #2A2A3A",
  },
  h3: {
    fontFamily: "Space Grotesk, sans-serif",
    fontSize: 17,
    fontWeight: 600,
    color: "#F0F0F0",
    marginTop: 32,
    marginBottom: 12,
  },
  p: {
    margin: "0 0 14px",
    color: "#D0D0D8",
    fontSize: 15,
  },
  ul: {
    margin: "0 0 14px",
    paddingLeft: 22,
  },
  li: {
    color: "#D0D0D8",
    fontSize: 15,
    marginBottom: 6,
  },
  strong: {
    color: "#F0F0F0",
    fontWeight: 600,
  },
  em: {
    color: "#8B8B9E",
    fontStyle: "italic",
  },
  hr: {
    border: "none",
    borderTop: "1px solid #2A2A3A",
    margin: "32px 0",
  },
  tableWrap: {
    overflowX: "auto" as const,
    margin: "16px 0 24px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    fontSize: 14,
  },
  tr: {
    borderBottom: "1px solid #2A2A3A",
  },
  th: {
    textAlign: "left" as const,
    padding: "10px 14px",
    backgroundColor: "#13131A",
    color: "#F0F0F0",
    fontWeight: 600,
    fontSize: 13,
    whiteSpace: "nowrap" as const,
  },
  td: {
    padding: "10px 14px",
    color: "#D0D0D8",
    verticalAlign: "top" as const,
    fontSize: 14,
  },
  blockquote: {
    borderLeft: "3px solid #FF6B35",
    margin: "16px 0",
    padding: "12px 16px",
    backgroundColor: "#13131A",
    borderRadius: "0 4px 4px 0",
    color: "#8B8B9E",
    fontSize: 14,
    fontStyle: "italic",
  },
};
