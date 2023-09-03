import "./index.css";
import MessagesDisplay from "./components/MessagesDisplay";
import CodeDisplay from "./components/CodeDisplay";
import { useState } from "react";

interface ChatData {
  role: string,
  content: string,
}

function App() {
  // create your Hooks
  const [value, setValue] = useState<string>("");
  const [chat, setChat] = useState<ChatData[]>([]);

  // Function to get your Query
  const getQuery = async () => {
    try {
      const options: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: value,
        }),
      };
      const response = await fetch(
        "http://localhost:8000/completions",
        options
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data: ChatData = await response.json();
      console.log(data);
      const userMessage = {
        role: "user",
        content: value,
      };
      setChat((oldChat) => [...oldChat, data, userMessage]);
    } catch (error) {
      console.error(error);
    }
  };

  const clearChat = () => {
    setValue("")
    setChat([])
  }
  const filteredMessages = chat.filter(message => message.role === "user");
  const latestCode = chat.filter(message => message.role === "assistant").pop()

  return (
    <div className="app">
      <MessagesDisplay userMessages={filteredMessages} />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type="text"
        placeholder="Type here..."
      />
      <CodeDisplay text={latestCode?.content || ""} />
      <div className="button-container">
        <button id="get-query" onClick={getQuery}>
          Get Query
        </button>
        <button id="clear-chat" onClick={clearChat}>Clear Chat</button>
      </div>
    </div>
  );
}

export default App;
