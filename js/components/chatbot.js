/**
 * chatbot.js
 * Renders a floating "Ask about Micah" chat widget in the bottom-
 * right corner. Talks to the /.netlify/functions/chat serverless
 * function (only works once deployed on Netlify — not when opening
 * index.html directly from disk).
 *
 * Visual styling intentionally uses the same coral / sand / cream
 * tokens defined in css/style.css (`.btn-primary`, `--color-accent`,
 * `--color-sand`) so the chat blends into Micah's existing palette.
 */

const CHAT_ENDPOINT = "/.netlify/functions/chat";
let chatHistory = []; // [{ role: 'user' | 'assistant', content: string }]
let chatOpen = false;
let chatLoading = false;

function renderChatbot() {
  const root = document.getElementById("chatbot-root");
  if (!root) return;

  root.innerHTML = `
    <div class="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      <div
        id="chat-panel"
        class="hidden mb-3 w-[92vw] max-w-sm h-[70vh] max-h-[520px] rounded-2xl border border-sand bg-white shadow-card flex flex-col overflow-hidden"
      >
        <div class="px-4 py-3 border-b border-sand flex items-center justify-between bg-accent">
          <div>
            <p class="font-display font-bold text-sm text-white">Ask about Micah</p>
            <p class="text-xs text-white/85">AI assistant · trained on Micah's resume</p>
          </div>
          <button id="chat-close" aria-label="Close chat" class="text-white/90 hover:text-white text-lg leading-none px-2">✕</button>
        </div>

        <div id="chat-messages" class="flex-1 overflow-y-auto px-4 py-4 space-y-3 text-sm"></div>

        <form id="chat-form" class="border-t border-sand p-3 flex gap-2">
          <input
            id="chat-input"
            type="text"
            placeholder="Ask a question about Micah..."
            autocomplete="off"
            class="flex-1 rounded-full border border-sand px-4 py-2 text-sm focus:outline-none focus:border-accent"
          />
          <button type="submit" class="btn-primary rounded-full px-4 py-2 text-xs" aria-label="Send">
            Send
          </button>
        </form>
      </div>

      <button
        id="chat-toggle"
        class="btn-primary w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-xl"
        aria-label="Open chat about Micah"
      >
        💬
      </button>
    </div>
  `;

  const panel = document.getElementById("chat-panel");
  const toggleBtn = document.getElementById("chat-toggle");
  const closeBtn = document.getElementById("chat-close");
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");
  const messagesEl = document.getElementById("chat-messages");

  function addMessage(role, text) {
    const bubble = document.createElement("div");
    const isUser = role === "user";
    bubble.className = isUser
      ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm px-3.5 py-2 bg-accent text-white"
      : "mr-auto max-w-[85%] rounded-2xl rounded-bl-sm px-3.5 py-2 bg-sand text-primary";
    bubble.textContent = text;
    messagesEl.appendChild(bubble);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return bubble;
  }

  // Greet on first open
  function ensureGreeting() {
    if (messagesEl.children.length === 0) {
      addMessage(
        "assistant",
        "Hi! I'm an AI assistant trained on Micah's resume and background. Ask me about her experience, skills, services, or projects."
      );
    }
  }

  toggleBtn.addEventListener("click", () => {
    chatOpen = !chatOpen;
    panel.classList.toggle("hidden", !chatOpen);
    if (chatOpen) {
      ensureGreeting();
      input.focus();
    }
  });

  closeBtn.addEventListener("click", () => {
    chatOpen = false;
    panel.classList.add("hidden");
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text || chatLoading) return;

    addMessage("user", text);
    chatHistory.push({ role: "user", content: text });
    input.value = "";
    chatLoading = true;

    const loadingBubble = addMessage("assistant", "Thinking…");

    try {
      const res = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: chatHistory.slice(0, -1),
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.error) {
        loadingBubble.textContent =
          data.error ||
          data.errorMessage ||
          `Sorry, something went wrong reaching the assistant (status ${res.status}). Please try again, or reach Micah directly via the contact section.`;
      } else {
        loadingBubble.textContent = data.reply;
        chatHistory.push({ role: "assistant", content: data.reply });
      }
    } catch (err) {
      loadingBubble.textContent =
        "This chat only works once the site is deployed with its serverless function (e.g. on Netlify) — it won't respond when opening the file directly.";
    } finally {
      chatLoading = false;
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
  });
}