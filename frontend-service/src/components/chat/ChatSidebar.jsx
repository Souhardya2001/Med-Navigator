import { Link } from "react-router-dom";
import Brand from "../Brand";
export default function ChatSidebar({
  chats,
  selectedId,
  loading,
  error,
  open,
  onClose,
  onNew,
  onDelete,
}) {
  return (
    <aside
      className={`${open ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-slate-200 bg-white p-4 transition-transform md:static md:translate-x-0`}
    >
      <div className="flex items-center justify-between">
        <Brand />
        <button
          onClick={onClose}
          className="p-2 text-slate-500 md:hidden"
          aria-label="Close conversations"
        >
          ×
        </button>
      </div>
      <button
        onClick={onNew}
        className="mt-7 rounded-xl border border-teal-100 bg-mist px-4 py-3 text-left text-sm font-semibold text-aqua hover:bg-teal-100"
      >
        ＋ New conversation
      </button>
      <p className="mt-7 px-2 text-xs font-bold uppercase tracking-[.13em] text-slate-400">
        Recent conversations
      </p>
      <div className="mt-3 flex-1 space-y-1 overflow-y-auto">
        {loading && (
          <div className="space-y-2 px-2 pt-2">
            <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
            <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
          </div>
        )}
        {error && (
          <p className="p-2 text-xs text-red-600">
            Couldn’t load conversations.
          </p>
        )}
        {!loading &&
          chats.map((chat) => (
            <div
              className={`group flex items-center rounded-xl ${String(chat.id || chat._id) === String(selectedId) ? "bg-mist text-aqua" : "hover:bg-slate-50"}`}
              key={chat.id || chat._id}
            >
              <Link
                onClick={onClose}
                to={`/chat?chatId=${chat.id || chat._id}`}
                className="min-w-0 flex-1 px-3 py-2.5 text-sm"
              >
                <p className="truncate font-medium">
                  {chat.title || "New conversation"}
                </p>
                {chat.updatedAt && (
                  <p className="mt-0.5 text-xs text-slate-400">
                    {new Date(chat.updatedAt).toLocaleDateString()}
                  </p>
                )}
              </Link>
              <button
                onClick={() => onDelete(chat)}
                className="mr-1 rounded p-1.5 text-slate-400 opacity-100 hover:bg-red-50 hover:text-red-600 md:opacity-0 md:group-hover:opacity-100"
                aria-label={`Delete ${chat.title || "conversation"}`}
              >
                ⌫
              </button>
            </div>
          ))}
      </div>
      <p className="border-t border-slate-100 pt-4 text-xs text-slate-400">
        Your healthcare navigation space
      </p>
    </aside>
  );
}
