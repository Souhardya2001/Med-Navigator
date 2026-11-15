import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
export default function MessageList({ messages, thinking, error }) {
  const endRef = useRef(null);
  useEffect(() => {
    const element = endRef.current;

    if (!element) return;

    requestAnimationFrame(() => {
      element.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    });
  }, [messages, thinking]);
  return (
    <div className="space-y-5 px-4 py-6 sm:px-8">
      {messages.map((message, index) => (
        <MessageBubble key={message.id || index} message={message} />
      ))}
      {thinking && (
        <div className="flex items-center gap-3">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-aqua text-xs text-white">
            ✦
          </span>
          <div className="rounded-2xl rounded-tl-md border border-slate-100 bg-white px-4 py-3 text-sm text-slate-500 shadow-card">
            <span className="inline-flex gap-1">
              <i className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-aqua" />
              <i className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-aqua [animation-delay:200ms]" />
              <i className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-aqua [animation-delay:400ms]" />
            </span>
            <span className="ml-2">MedNavigator is thinking…</span>
          </div>
        </div>
      )}
      {error && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      <div ref={endRef} />
    </div>
  );
}
