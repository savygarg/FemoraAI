import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { assistantApi } from '../services/api';

const suggestedQuestions = [
  'What do my symptoms mean?',
  'How can I improve my sleep?',
  'What should I track in my health logs?',
  'Can you explain my health assessment?',
];

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const sendMessage = async (messageText = input) => {
    const text = messageText.trim();

    if (isLoading) return;

    if (!text) {
      setError('Please enter a question before sending.');
      return;
    }

    const userMessage = {
      id: `${messages.length + 1}-user`,
      type: 'user',
      text,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setError('');
    setIsLoading(true);

    try {
      const { data } = await assistantApi.sendMessage({
        message: text,
      });

      if (!data?.success || !data.reply) {
        throw new Error(data?.message || 'The assistant could not respond right now.');
      }

      setMessages((previous) => [
        ...previous,
        {
          id: `${previous.length + 1}-assistant`,
          type: 'bot',
          text: data.reply,
        },
      ]);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          'Unable to reach the assistant right now. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  const handleInputKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chatbot-page">
      <header className="chatbot-header">
        <div className="chatbot-header__content">
          <div className="chatbot-avatar chatbot-avatar--large" aria-hidden="true">
            ✦
          </div>
          <div>
            <span className="chatbot-eyebrow">FEMORAAI ASSISTANT</span>
            <h1>FemoraAI Assistant</h1>
            <p className="chatbot-subtitle">Your personal health information companion</p>
            <div className="chatbot-status">
              <span className="chatbot-status__dot" />
              <span>Online and ready</span>
            </div>
          </div>
        </div>
      </header>

      <main className="chatbot-main">
        <section className="chatbot-card">
          <div className="chatbot-messages">
            <div className="chatbot-welcome">
              <div className="chatbot-avatar">
                ✦
              </div>
              <div className="chatbot-welcome-copy">
                <strong>FemoraAI</strong>
                <span>Here to make health information easier to understand</span>
              </div>
            </div>

            {messages.length === 0 && (
              <div className="chatbot-empty-state">
                <span className="chatbot-empty-state__mark">✦</span>
                <strong>What would you like to understand?</strong>
                <span>Ask about symptoms, lifestyle, or women&apos;s health.</span>
              </div>
            )}

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
                  {message.type === 'bot' ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.text}
                    </ReactMarkdown>
                  ) : (
                    message.text
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="chat-message chat-message--bot" aria-live="polite">
                <div className="chat-message__avatar">✦</div>
                <div className="chat-message__bubble chatbot-thinking">
                  <span>FemoraAI is thinking</span>
                  <span className="chatbot-thinking__dots" aria-hidden="true">•••</span>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="chatbot-system-message" role="alert">
              <span aria-hidden="true">!</span>
              {error}
            </div>
          )}

          <form className="chatbot-input-area" onSubmit={handleSubmit}>
            <div className="chatbot-input-wrapper">
              <textarea
                rows="1"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Ask FemoraAI anything..."
                aria-label="Message FemoraAI"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="chatbot-send-button"
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
              >
                <span aria-hidden="true">↑</span>
              </button>
            </div>
            <p className="chatbot-input-hint">Press Enter to send · Shift + Enter for a new line</p>
            <p className="chatbot-disclaimer">
              FemoraAI provides informational guidance and does not replace professional medical advice.
            </p>
          </form>
        </section>

        <aside className="chatbot-sidebar">
          <div className="chatbot-info-card chatbot-info-card--primary">
            <div className="chatbot-info-icon" aria-hidden="true">♡</div>
            <span className="chatbot-card-eyebrow">ABOUT YOUR ASSISTANT</span>
            <h2>Your health, understood.</h2>
            <p>Get clear, practical health information in a calm, conversational space.</p>
          </div>

          <div className="chatbot-info-card">
            <span className="chatbot-card-eyebrow">QUICK TOPICS</span>
            <div className="chatbot-help-list">
              {suggestedQuestions.map((question, index) => (
                <button
                  type="button"
                  key={question}
                  onClick={() => sendMessage(question)}
                  disabled={isLoading}
                >
                  <span aria-hidden="true">{['♡', '◌', '⌁', '✦'][index]}</span>
                  {question}
                </button>
              ))}
            </div>
          </div>
          <div className="chatbot-notice">
            <span aria-hidden="true">i</span>
            <p>For information only. A healthcare professional can provide advice for your situation.</p>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default Chatbot;