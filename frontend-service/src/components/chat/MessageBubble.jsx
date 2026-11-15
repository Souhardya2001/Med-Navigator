import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import HospitalCard from "./HospitalCard";

export default function MessageBubble({ message }) {
  const user = message.role === "user" || message.sender === "user";
  const content = message.content || message.text || "";
  const hospitals = message.hospitals || message.metadata?.hospitals || [];

  const formattedContent =
    typeof content === "string"
      ? content.replace(/<br\s*\/?>/gi, "\n")
      : String(content ?? "");

  return (
    <div
      className={`animate-fade-up flex gap-3 ${
        user ? "justify-end" : "justify-start"
      }`}
    >
      {!user && (
        <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-aqua text-xs text-white">
          ✦
        </span>
      )}

      <div
        className={`${
          user
            ? "max-w-[85%] rounded-2xl rounded-br-md bg-navy text-white sm:max-w-[72%]"
            : "w-full max-w-[95%] rounded-2xl rounded-tl-md border border-slate-100 bg-white text-ink shadow-card sm:max-w-[90%] lg:max-w-[85%]"
        } px-4 py-3 text-sm leading-6`}
      >
        {user ? (
          <span className="whitespace-pre-wrap">{formattedContent}</span>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="mb-3 mt-5 text-lg font-bold leading-7 text-navy first:mt-0">
                  {children}
                </h1>
              ),

              h2: ({ children }) => (
                <h2 className="mb-2 mt-5 text-base font-bold leading-6 text-navy first:mt-0">
                  {children}
                </h2>
              ),

              h3: ({ children }) => (
                <h3 className="mb-2 mt-4 text-sm font-bold leading-6 text-navy first:mt-0">
                  {children}
                </h3>
              ),

              p: ({ children }) => (
                <p className="mb-3 leading-7 last:mb-0">
                  {children}
                </p>
              ),

              ul: ({ children }) => (
                <ul className="mb-4 list-disc space-y-1.5 pl-5">
                  {children}
                </ul>
              ),

              ol: ({ children }) => (
                <ol className="mb-4 list-decimal space-y-1.5 pl-5">
                  {children}
                </ol>
              ),

              li: ({ children }) => (
                <li className="pl-1 leading-6">
                  {children}
                </li>
              ),

              strong: ({ children }) => (
                <strong className="font-semibold text-navy">
                  {children}
                </strong>
              ),

              em: ({ children }) => (
                <em className="italic">
                  {children}
                </em>
              ),

              blockquote: ({ children }) => (
                <blockquote className="my-4 border-l-4 border-aqua/40 pl-4 text-slate-600">
                  {children}
                </blockquote>
              ),

              code: ({ children, className }) => {
                const isBlock = className?.includes("language-");

                return isBlock ? (
                  <code
                    className={`${className} block overflow-x-auto rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-700`}
                  >
                    {children}
                  </code>
                ) : (
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[13px] text-navy">
                    {children}
                  </code>
                );
              },

              table: ({ children }) => (
                <div className="my-5 w-full overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full min-w-[650px] border-collapse text-sm">
                    {children}
                  </table>
                </div>
              ),

              thead: ({ children }) => (
                <thead className="bg-slate-50">
                  {children}
                </thead>
              ),

              tbody: ({ children }) => (
                <tbody className="divide-y divide-slate-100">
                  {children}
                </tbody>
              ),

              tr: ({ children }) => (
                <tr className="transition-colors hover:bg-slate-50/70">
                  {children}
                </tr>
              ),

              th: ({ children }) => (
                <th className="border-b border-slate-200 px-4 py-3 text-left font-semibold text-navy">
                  {children}
                </th>
              ),

              td: ({ children }) => (
                <td className="px-4 py-3 align-top leading-6 text-slate-600">
                  {children}
                </td>
              ),

              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-aqua underline underline-offset-2 transition hover:opacity-80"
                >
                  {children}
                </a>
              ),

              hr: () => (
                <hr className="my-5 border-slate-200" />
              ),
            }}
          >
            {formattedContent}
          </ReactMarkdown>
        )}

        {hospitals.length > 0 && (
          <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
            {hospitals.map((hospital) => (
              <HospitalCard
                key={hospital.id || hospital.name}
                hospital={hospital}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}