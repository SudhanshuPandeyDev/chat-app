import React, { useEffect, useState } from "react";
import io from "socket.io-client";

// installs the client-side version of Socket.IO. You’ll use this in your front-end code to connect to the server and communicate in real time.
const socket = io("http://localhost:5000");

const App = () => {
  const [userName, setUserName] = useState("");
  const [chatActive, setChatActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    socket.on("received-message", (message) => {
      setMessages([...messages, message]);
    });
    console.log(messages);
  }, [messages, socket]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const messageData = {
      message: newMessage,
      user: userName,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    };

    !newMessage == ""
      ? socket.emit("send-message", messageData)
      : alert("Message cannot be empty");

    setNewMessage("");
  };

  return (
    <>
      <div className="w-screen h-screen bg-gray-300 flex justify-center items-center p-2">
        {chatActive ? (
          <div className="rounded-md w-full md:w-[80vw] lg:w-[40vw]">
            <h1 className="text-center font-bold text-xl my-2 uppercase">
              Squad Chat
            </h1>
            <div>
              <div className="overflow-scroll h-[80vh] lg:h-[60vh]">
                {messages.map((message, index) => {
                  return (
                    <div
                      key={index}
                      className={`flex rounded-md shadow-md w-fit my-5 ${
                        userName === message.user && "ml-auto"
                      }`}
                    >
                      <div className="bg-green-400 flex justify-center items-center rounded-l-md">
                        <h3 className="font-bold text-lg px-2">
                          {message.user.charAt(0).toUpperCase()}
                        </h3>
                      </div>
                      <div className="px-2 bg-white rounded-r-md">
                        <span className="text-sm">{message.user}</span>
                        <h3 className="font-bold">{message.message}</h3>
                        <h3 className="text-xs text-right">{message.time}</h3>
                      </div>
                    </div>
                  );
                })}
              </div>
              <form
                className="flex gap-2 md:gap-3 justify-between"
                onSubmit={handleSubmit}
              >
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="rounded-md border-1 border-gray-500 outline-none px-3 py-2 w-full"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-green-500 rounded-md font-bold text-white"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="w-screen h-screen flex justify-center items-center gap-2">
            <input
              type="text"
              name=""
              id=""
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
              }}
              className="text-center px-3 py-2 outline-none border-1 border-gray-700 rounded-md"
            />
            <button
              type="submit"
              className="bg-green-500 text-white px-3 py-2 rounded-md font-bold"
              onClick={() => {
                if (userName) {
                  setChatActive(true);
                }
              }}
            >
              Start Chat
            </button>
          </div>
        )}
      </div>
    </>
  );
};
export default App;
