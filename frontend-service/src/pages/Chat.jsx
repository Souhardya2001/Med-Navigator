import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ChatSidebar from "../components/chat/ChatSidebar";
import MessageList from "../components/chat/MessageList";
import MessageInput from "../components/chat/MessageInput";
import LocationPrompt from "../components/chat/LocationPrompt";
import * as chatApi from "../services/chatApi";
import { useAuth } from "../context/AuthContext";

function EmptyState({ onExample }) {
  const prompts = [
    "How can I manage knee pain?",
    "What should I know about hypertension?",
    "Find a cardiology hospital near me",
  ];
  return (
    <div className="m-auto max-w-xl px-5 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-mist text-2xl text-aqua">
        ✦
      </span>
      <h1 className="mt-5 text-3xl font-bold tracking-tight text-navy">
        How can I help you today?
      </h1>
      <p className="mt-3 leading-7 text-slate-600">
        Ask about a health concern, medical information, or finding a healthcare
        facility.
      </p>
      <div className="mt-8 grid gap-2 text-left sm:grid-cols-3">
        {prompts.map((prompt) => (
          <button
            onClick={() => onExample(prompt)}
            key={prompt}
            className="rounded-xl border border-slate-200 bg-white p-3 text-sm leading-5 text-slate-600 shadow-sm transition hover:border-aqua hover:bg-mist"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
export default function Chat() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const chatId = params.get("chatId");
  const [chats, setChats] = useState([]),
    [messages, setMessages] = useState([]),
    [listLoading, setListLoading] = useState(true),
    [historyLoading, setHistoryLoading] = useState(false),
    [sidebarOpen, setSidebarOpen] = useState(false),
    [sending, setSending] = useState(false),
    [error, setError] = useState(""),
    [listError, setListError] = useState(""),
    [location, setLocation] = useState(null),
    [locationStatus, setLocationStatus] = useState("");
  const sendingRef = useRef(false);
  const loadChats = useCallback(async () => {
    setListLoading(true);
    setListError("");
    try {
      const data = await chatApi.getChats();
      setChats(data.chats || data.items || data || []);
    } catch (err) {
      if (err.status === 401) logout();
      else setListError(err.message);
    } finally {
      setListLoading(false);
    }
  }, [logout]);
  useEffect(() => {
    loadChats();
  }, [loadChats]);
  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      return;
    }
    let active = true;
    setHistoryLoading(true);
    setError("");
    chatApi
      .getMessages(chatId)
      .then((data) => {
        if (active && !sendingRef.current) {
          setMessages(data.messages || data.items || data || []);
        }
      })
      .catch((err) => {
        if (active)
          setError(
            err.status === 404
              ? "This conversation could not be found."
              : "We couldn’t load this conversation. Please try again.",
          );
      })
      .finally(() => active && setHistoryLoading(false));
    return () => {
      active = false;
    };
  }, [chatId]);
  async function newChat() {
    setError("");
    try {
      const data = await chatApi.createChat();
      const id = data.id || data._id || data.chat?.id || data.chat?._id;
      if (!id) throw new Error("The server did not return a conversation ID.");
      await loadChats();
      navigate(`/chat?chatId=${id}`);
      setSidebarOpen(false);
    } catch (err) {
      setError("We couldn’t create a new conversation. Please try again.");
    }
  }
  async function removeChat(chat) {
    if (
      !window.confirm(
        `Delete “${chat.title || "this conversation"}”? This can’t be undone.`,
      )
    )
      return;
    const id = chat.id || chat._id;
    try {
      await chatApi.deleteChat(id);
      setChats((items) =>
        items.filter((item) => String(item.id || item._id) !== String(id)),
      );
      if (String(id) === String(chatId)) navigate("/chat");
    } catch {
      setError("We couldn’t delete this conversation. Please try again.");
    }
  }
  async function send(content) {
    sendingRef.current = true;

    let activeId = chatId;
    if (!activeId) {
      try {
        const data = await chatApi.createChat();
        activeId = data.id || data._id || data.chat?.id || data.chat?._id;
        if (!activeId) throw new Error();
        await loadChats();
        navigate(`/chat?chatId=${activeId}`);
      } catch {
        setError("We couldn’t start a conversation. Please try again.");
        return;
      }
    }
    const optimistic = { id: `pending-${Date.now()}`, role: "user", content };
    setMessages((items) => [...items, optimistic]);
    setSending(true);
    setError("");
    try {
      const data = await chatApi.sendMessage(
        activeId,
        content,
        location ? { location } : null,
      );
      const assistant =
        data.assistantMessage || data.message || data.response || data;
      setMessages((items) => [
        ...items,
        {
          ...assistant,
          id: assistant.id || `assistant-${Date.now()}`,
          role: assistant.role || "assistant",
          content:
            assistant.content ||
            assistant.text ||
            (typeof assistant === "string"
              ? assistant
              : "I’m sorry, I couldn’t prepare a response."),
        },
      ]);
      await loadChats();
    } catch (err) {
      setMessages((items) =>
        items.filter((message) => message.id !== optimistic.id),
      );
      setError(
        err.status === 401
          ? "Your session has expired. Please log in again."
          : "Something went wrong while sending your message. Please try again.",
      );
      if (err.status === 401) logout();
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  }
  function askForLocation() {
    if (!navigator.geolocation) {
      setLocationStatus("unavailable");
      return;
    }
    setLocationStatus("request");
  }
  function requestLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationStatus("ready");
      },
      (error) =>
        setLocationStatus(
          error.code === error.PERMISSION_DENIED ? "denied" : "unavailable",
        ),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }
  return (
    <div className="flex h-[100dvh] overflow-hidden bg-[#fbfdfd]">
      <ChatSidebar
        chats={chats}
        selectedId={chatId}
        loading={listLoading}
        error={listError}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNew={newChat}
        onDelete={removeChat}
      />
      {sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation overlay"
          className="fixed inset-0 z-20 bg-navy/25 md:hidden"
        />
      )}
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[65px] shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
          <button
            className="rounded-lg p-2 text-aqua hover:bg-mist md:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open conversations"
          >
            ☰
          </button>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-navy">
              {chats.find(
                (item) => String(item.id || item._id) === String(chatId),
              )?.title || (chatId ? "Conversation" : "MedNavigator")}
            </p>
            <p className="text-xs text-slate-400">
              Healthcare navigation assistant
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-600 sm:block">
              {user?.name || user?.email || "Your account"}
            </span>
            <button
              onClick={logout}
              className="text-sm font-semibold text-aqua hover:underline"
            >
              Log out
            </button>
          </div>
        </header>
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {historyLoading ? (
            <div className="space-y-4 p-8">
              <div className="h-16 w-2/3 animate-pulse rounded-2xl bg-slate-100" />
              <div className="ml-auto h-12 w-1/2 animate-pulse rounded-2xl bg-slate-100" />
            </div>
          ) : messages.length ? (
            <MessageList messages={messages} thinking={sending} error={error} />
          ) : (
            <EmptyState onExample={send} />
          )}
        </div>
        <LocationPrompt
          status={locationStatus}
          onRequest={requestLocation}
          onDismiss={() => setLocationStatus("")}
        />
        <MessageInput
          onSend={send}
          sending={sending}
          onLocation={askForLocation}
          location={location}
        />
      </main>
    </div>
  );
}
