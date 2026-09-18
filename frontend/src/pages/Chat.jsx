import React from "react";
import { useEffect, useRef, useState } from "react";
import {
  Link,
  useParams,
} from "react-router-dom";
import api from "../api";
import "./Chat.css";

export default function Chat() {

  const { matchId } = useParams();

  const [messages, setMessages] =
    useState([]);

  const [text, setText] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [sending, setSending] =
    useState(false);

  const bottomRef = useRef(null);

  const loadMessages = async () => {

    try {

      const response = await api.get(
        `/matches/${matchId}/messages`
      );

      setMessages(
        response.data.messages || []
      );

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    loadMessages();

    const interval =
      setInterval(loadMessages, 5000);

    return () =>
      clearInterval(interval);

  }, [matchId]);

  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);

  const sendMessage = async (e) => {

    e.preventDefault();

    if (!text.trim() || sending)
      return;

    try {

      setSending(true);

      await api.post(
        `/matches/${matchId}/messages`,
        {
          text: text.trim(),
        }
      );

      setText("");

      await loadMessages();

    } catch (err) {

      console.error(err);

    } finally {
      setSending(false);
    }
  };

  return (
    <main className="chat-page">

      <div className="chat-header">

        <Link
          to="/matches"
          className="back-link"
        >
          ←
        </Link>

        <div>
          <p className="eyebrow">
            CONNECTION
          </p>

          <h1>
            Chat
          </h1>
        </div>

      </div>

      <div className="messages">

        {loading ? (

          <div className="chat-loading">
            Loading conversation...
          </div>

        ) : messages.length === 0 ? (

          <div className="chat-empty">

            <div>♥</div>

            <h3>
              Start the conversation.
            </h3>

            <p>
              Say hello and see where
              the conversation goes.
            </p>

          </div>

        ) : (

          messages.map((message) => {

            const currentUser =
              JSON.parse(
                localStorage.getItem(
                  "wild_user"
                ) || "null"
              );

            const mine =
              String(message.sender?._id) ===
              String(
                currentUser?._id ||
                currentUser?.id
              );

            return (
              <div
                key={message._id}
                className={
                  mine
                    ? "message mine"
                    : "message"
                }
              >
                <div className="message-bubble">
                  {message.text}
                </div>
              </div>
            );
          })

        )}

        <div ref={bottomRef}></div>

      </div>

      <form
        className="chat-input"
        onSubmit={sendMessage}
      >

        <input
          value={text}
          onChange={(e) =>
            setText(e.target.value)
          }
          placeholder="Write a message..."
          maxLength="2000"
        />

        <button
          className="send-btn"
          disabled={sending}
        >
          {sending ? "..." : "→"}
        </button>

      </form>

    </main>
  );
}