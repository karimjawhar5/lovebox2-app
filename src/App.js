import React, { useState, useEffect } from "react";
import MessageForm from "./components/MessageForm";
import PendingMessageRead from "./components/PendingMessageRead";

function App() {
  const [messageReadStatus, setMessageReadStatus] = useState(true);

  useEffect(() => {
    // Function to fetch message read status from the server
    const fetchMessageReadStatus = async () => {
      try {
        const response = await fetch("http://192.168.2.54:8080/get_message_read_status");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMessageReadStatus(data.status);
      } catch (error) {
        console.error("Failed to fetch message read status:", error);
        // Optionally, handle errors or set a default state here
      }
    };

    // Call the function
    fetchMessageReadStatus();
  }, []); // The empty array [] means this effect runs once after the initial render

  return (
    <div className="App">
      {messageReadStatus ? <MessageForm setMessageReadStatus={setMessageReadStatus}/> : <PendingMessageRead />}
    </div>
  );
}

export default App;

