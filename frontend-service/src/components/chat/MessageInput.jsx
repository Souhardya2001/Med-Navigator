import { useEffect, useRef, useState } from "react";
export default function MessageInput({
  onSend,
  sending,
  onLocation,
  location,
}) {
  const [value, setValue] = useState("");
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = `${Math.min(ref.current.scrollHeight, 150)}px`;
    }
  }, [value]);
  const submit = () => {
    if (value.trim() && !sending) {
      onSend(value.trim());
      setValue("");
    }
  };
  return (
    <div className="border-t border-slate-200 bg-white p-3 sm:p-4">
      <div className="mx-auto flex max-w-4xl items-end gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus-within:border-aqua focus-within:ring-2 focus-within:ring-aqua/10">
        <textarea
          ref={ref}
          rows="1"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Ask MedNavigator..."
          aria-label="Message MedNavigator"
          disabled={sending}
          className="max-h-36 min-h-[28px] flex-1 resize-none bg-transparent py-1.5 text-sm leading-6 outline-none placeholder:text-slate-400"
        />
        <button
          type="button"
          title="Use my location"
          aria-label="Use my location to find nearby facilities"
          onClick={onLocation}
          className={`rounded-lg p-2 transition ${location ? "bg-teal-50 text-aqua" : "text-slate-400 hover:bg-mist hover:text-aqua"}`}
        >
          ⌖
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={!value.trim() || sending}
          aria-label="Send message"
          className="grid h-9 w-9 place-items-center rounded-xl bg-aqua text-white transition hover:bg-[#087f77] disabled:bg-slate-200"
        >
          ➤
        </button>
      </div>
      <p className="mx-auto mt-2 max-w-4xl px-1 text-xs text-slate-400">
        MedNavigator provides informational support, not medical advice.
      </p>
    </div>
  );
}
