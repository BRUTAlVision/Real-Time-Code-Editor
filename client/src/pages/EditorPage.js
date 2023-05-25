import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import ACTIONS from "../Actions";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";

import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";

export const Context = React.createContext();
const EditorPage = () => {
  const [count, setcount] = useState(0);
    
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const reactNavigator = useNavigate();
  const [clients, setClients] = useState([]);

  console.log(count);
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed, try again later.");
        reactNavigator("/");
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      // Listening for joined event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room.`);
            console.log(`${username} joined`);
          }
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );

      // Listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room.`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, [count]);

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied to your clipboard");
    } catch (err) {
      toast.error("Could not copy the Room ID");
      console.error(err);
    }
  }

  function leaveRoom() {
    reactNavigator("/");
  }

  function counter() {
    setcount(count + 1);
    reactNavigator("/dash");
  }

  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <Context.Provider value={[count, setcount]}>
      <div className="mainWrap">
        <div className="aside">
          <div className="asideInner">
            <div className="logo">
              <img className="logoImage" src="/code-sync.png" alt="logo" />
            </div>
            <h3>Connected</h3>
            <div className="clientsList">
              {clients.map((client) => (
                <Client key={client.socketId} username={client.username} />
              ))}
            </div>
          </div>
          <button className="btn copyBtn" onClick={copyRoomId}>
            Copy ROOM ID
          </button>
          {/* For DashBoard */}
          <button className="correct" onClick={counter}>
            Correct
          </button>
          <button className="btn leaveBtn" onClick={leaveRoom}>
            Leave
          </button>
        </div>
        <div className="editorWrap">
          <Editor
            socketRef={socketRef}
            roomId={roomId}
            onCodeChange={(code) => {
              codeRef.current = code;
            }}
          />
        </div>
      </div>
    </Context.Provider>
  );
};

export default EditorPage;
