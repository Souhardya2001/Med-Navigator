export default function LocationPrompt({ status, onRequest, onDismiss }) {
  if (!status) return null;
  return (
    <div
      role="status"
      className={`mx-auto mb-3 flex max-w-4xl items-center gap-3 rounded-xl px-4 py-3 text-sm ${status === "denied" || status === "unavailable" ? "bg-amber-50 text-amber-800" : "bg-mist text-ink"}`}
    >
      <span className="text-aqua">⌖</span>
      <p className="flex-1">
        {status === "ready"
          ? "Your location is available for this conversation."
          : status === "request"
            ? "Your location is used only to find nearby healthcare facilities."
            : "Location access was not granted. You can continue chatting, or enable it when you want to find nearby facilities."}
      </p>
      {status === "request" && (
        <button className="btn-primary px-3 py-2 text-xs" onClick={onRequest}>
          Use my location
        </button>
      )}
      <button
        onClick={onDismiss}
        aria-label="Dismiss location message"
        className="text-slate-500"
      >
        ×
      </button>
    </div>
  );
}
