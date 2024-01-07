document.addEventListener('DOMContentLoaded', function() {
  const chatBox = document.querySelector(".chat-box");
  const messageInput = document.querySelector("#message-input");
  const sendBtn = document.querySelector("#send-btn");

  function styleCodeBlock(code, language) {
    // Function to apply styling to code blocks
    return `<pre><div class="bg-black rounded-md"><div class="flex items-center relative text-gray-200 bg-gray-800 dark:bg-token-surface-primary px-4 py-2 text-xs font-sans justify-between rounded-t-md"><span>${language}</span><button class="flex gap-1 items-center">Copy code</button></div><div class="p-4 overflow-y-auto"><code class="!whitespace-pre hljs language-${language}">${code}</code></div></div></pre>`;
  }

  function addMessage(message, isUser) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", isUser ? "user-message" : "bot-message");

    // Check for code block syntax (```)
    const codeBlockRegex = /```([a-z]+)\n([\s\S]*?)```/gm;
    let match;
    let lastIndex = 0;
    let formattedMessage = '';

    while ((match = codeBlockRegex.exec(message)) !== null) {
      // Before code block
      formattedMessage += message.substring(lastIndex, match.index);
      // Code block
      const language = match[1];
      const code = match[2].trim();
      formattedMessage += styleCodeBlock(code, language);
      // Update lastIndex to search for the next code block
      lastIndex = match.index + match[0].length;
    }
    // After last code block
    formattedMessage += message.substring(lastIndex);

    msgDiv.innerHTML = isUser ? `<p>${formattedMessage}</p>` : formattedMessage;

    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
  }

  sendBtn.addEventListener("click", function() {
    const message = messageInput.value.trim();
    if (message) {
      addMessage(message, true); // Kullanıcı mesajını ekle
      fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message }),
      })
      .then(response => response.json())
      .then(data => {
        addMessage(data.answer, false); // Bot yanıtını ekle
      })
      .catch((error) => {
        console.error('Error:', error);
      });
      messageInput.value = ""; // Girdiyi temizle
      messageInput.style.height = '24px'; // Giriş yüksekliğini varsayılana geri döndür
      currentRow = 1; // Şu anki satırı sıfırla
    }
  });

  messageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      sendBtn.click();
      e.preventDefault();
    }
  });

  // Yeni eklenen kısım:
  messageInput.addEventListener('input', function() {
    if (!this.value) {
      this.style.height = '24px'; // İçerik silindiğinde varsayılan yükseklik
    } else {
      const rowCount = (this.value.match(/\n/g) || []).length + 1; // Satır sayısını hesapla
      const newHeight = 24 + (rowCount - 1) * 24; // Yeni yüksekliği hesapla (her satır için 24px artış)
      this.style.height = newHeight + 'px'; // İçerik varsa genişlet
      currentRow = rowCount; // Şu anki satır sayısını güncelle
    }
  });
});
