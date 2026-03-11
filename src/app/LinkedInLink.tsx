"use client";

export default function LinkedInLink() {
  return (
    <a
      href="https://www.linkedin.com/in/tdebroucker/"
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: "#FF6B35", textDecoration: "none" }}
      onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
      onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
    >
      Tristan de Broucker
    </a>
  );
}
