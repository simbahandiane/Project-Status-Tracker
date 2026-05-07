import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";

export default function SkillsPage() {
  // Locate skills.md
  const filePath = path.join(process.cwd(), "skills.md");

  // Read file content
  const markdown = fs.readFileSync(filePath, "utf8");

  return (
    <main className="p-10">
      <article className="prose">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </article>
    </main>
  );
}