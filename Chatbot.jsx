import { useState } from 'react';

const suggestedQuestions = [
  'What do my symptoms mean?',
  'How can I improve my sleep?',
  'What should I track in my health logs?',
  'Can you explain my health assessment?',
];

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "Hi! I'm FemoraAI 💗",
    },
    {
      id: 2,
      type: 'bot',
      text: "I'm your personal health assistant. You can ask me questions about your symptoms, lifestyle, menstrual health, or your FemoraAI assessment.",
    },
  ]);

  const [input, setInput] = useState('');

  const sendMessage = (messageText = input) => {
    const text = messageText.trim();

    if (!text) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text,
    };

    setMessages((previous) => [...previous, userMessage]);
    setInput('');

    // Temporary frontend-only response
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: "I'm currently running in demo mode. Once the AI backend is connected, I'll be able to provide personalised responses based on your health profile and assessment.",
      };

      setMessages((previous) => [...previous, botMessage]);
    }, 600);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  return (
    <div className="chatbot-page">

      {/* HEADER */}
      <header className="chatbot-header">
        <div className="chatbot-header__content">

          <div className="chatbot-avatar chatbot-avatar--large">
            ✦
          </div>

          <div>
            <span className="chatbot-eyebrow">
              FEMORAAI ASSISTANT
            </span>

            <h1>Health Assistant</h1>

            <div className="chatbot-status">
              <span className="chatbot-status__dot" />
              <span>Ready to help</span>
            </div>
          </div>

        </div>
      </header>


      {/* CHAT AREA */}
      <main className="chatbot-main">

        <section className="chatbot-card">

          {/* CHAT MESSAGES */}
          <div className="chatbot-messages">

            <div className="chatbot-welcome">

              <div className="chatbot-avatar">
                ✦
              </div>

              <div>
                <strong>FemoraAI</strong>
                <span>Your health companion</span>
              </div>

            </div>


            {messages.map((message) => (

              <div
                key={message.id}
                className={`chat-message ${
                  message.type === 'user'
                    ? 'chat-message--user'
                    : 'chat-message--bot'
                }`}
              >

                {message.type === 'bot' && (
                  <div className="chat-message__avatar">
                    ✦
                  </div>
                )}

                <div className="chat-message__bubble">
                  {message.text}
                </div>

              </div>

            ))}

          </div>


          {/* SUGGESTIONS */}
          <div className="chatbot-suggestions">

            <span>Try asking</span>

            <div className="chatbot-suggestion-list">

              {suggestedQuestions.map((question) => (

                <button
                  type="button"
                  key={question}
                  onClick={() => sendMessage(question)}
                >
                  {question}
                </button>

              ))}

            </div>

          </div>


          {/* INPUT */}
          <form
            className="chatbot-input-area"
            onSubmit={handleSubmit}
          >

            <div className="chatbot-input-wrapper">

              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask FemoraAI anything about your health..."
                aria-label="Message FemoraAI"
              />

              <button
                type="submit"
                className="chatbot-send-button"
                disabled={!input.trim()}
                aria-label="Send message"
              >
                →
              </button>

            </div>

            <p className="chatbot-disclaimer">
              FemoraAI provides informational guidance and does not
              replace professional medical advice.
            </p>

          </form>

        </section>


        {/* SIDE INFORMATION */}
        <aside className="chatbot-sidebar">

          <div className="chatbot-info-card chatbot-info-card--primary">

            <div className="chatbot-info-icon">
              ♡
            </div>

            <h2>Your health, understood.</h2>

            <p>
              FemoraAI is designed to make your health information
              easier to understand and track.
            </p>

          </div>


          <div className="chatbot-info-card">

            <span className="chatbot-card-eyebrow">
              I CAN HELP WITH
            </span>

            <div className="chatbot-help-list">

              <div>
                <span>♡</span>
                Symptoms
              </div>

              <div>
                <span>◌</span>
                Menstrual health
              </div>

              <div>
                <span>⌁</span>
                Lifestyle
              </div>

              <div>
                <span>✦</span>
                Health assessment
              </div>

            </div>

          </div>

        </aside>

      </main>

    </div>
  );
}

export default Chatbot;