(function () {
  // Crear el botón flotante ("burbuja")
  const bubbleButton = document.createElement("button");
  bubbleButton.textContent = "Hablar con Agustina";
  Object.assign(bubbleButton.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    padding: "10px 16px",
    borderRadius: "999px",
    border: "none",
    cursor: "pointer",
    background: "#4A6CF7",
    color: "white",
    fontWeight: "600",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    fontSize: "14px",
    zIndex: "9999"
  });

  // Contenedor del chat
  const chatContainer = document.createElement("div");
  Object.assign(chatContainer.style, {
    position: "fixed",
    bottom: "80px",
    right: "20px",
    width: "320px",
    height: "420px",
    background: "white",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    display: "none",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: "9998",
    border: "1px solid #eee"
  });

  // Header
  const header = document.createElement("div");
  header.textContent = "Agustina – Asistente IA";
  Object.assign(header.style, {
    padding: "10px 14px",
    fontWeight: "600",
    fontSize: "14px",
    background: "#f4f4f4",
    borderBottom: "1px solid #ddd"
  });

  // Área de mensajes
  const messages = document.createElement("div");
  Object.assign(messages.style, {
    flex: "1",
    padding: "10px",
    overflowY: "auto",
    fontSize: "13px"
  });

  // Input + botón enviar
  const inputRow = document.createElement("div");
  Object.assign(inputRow.style, {
    display: "flex",
    borderTop: "1px solid #eee",
    padding: "6px"
  });

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Escribí tu consulta...";
  Object.assign(input.style, {
    flex: "1",
    fontSize: "13px",
    padding: "6px 8px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    outline: "none"
  });

  const sendButton = document.createElement("button");
  sendButton.textContent = "▶";
  Object.assign(sendButton.style, {
    marginLeft: "6px",
    padding: "0 10px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    background: "#4A6CF7",
    color: "white",
    fontSize: "13px"
  });

  inputRow.appendChild(input);
  inputRow.appendChild(sendButton);

  chatContainer.appendChild(header);
  chatContainer.appendChild(messages);
  chatContainer.appendChild(inputRow);

  document.body.appendChild(bubbleButton);
  document.body.appendChild(chatContainer);

  bubbleButton.addEventListener("click", () => {
    chatContainer.style.display =
      chatContainer.style.display === "none" ? "flex" : "none";
  });

  function addMessage(text, from) {
    const msg = document.createElement("div");
    msg.textContent = text;
    msg.style.margin = "6px 0";
    msg.style.whiteSpace = "pre-wrap";
    msg.style.textAlign = from === "user" ? "right" : "left";
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, "user");
    input.value = "";

    addMessage("Agustina está pensando…", "assistant");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });

      const all = messages.querySelectorAll("div");
      const last = all[all.length - 1];
      if (last && last.textContent.includes("pensando")) {
        messages.removeChild(last);
      }

      if (!res.ok) {
        addMessage("Hubo un error al contactar a Agustina.", "assistant");
        return;
      }

      const data = await res.json();
      addMessage(data.reply || "(Respuesta vacía)", "assistant");
    } catch (e) {
      addMessage("Error de conexión.", "assistant");
    }
  }

  sendButton.addEventListener("click", sendMessage);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  // Mensaje inicial
  addMessage("Hola, soy Agustina. ¿En qué puedo ayudarte hoy?", "assistant");
})();
