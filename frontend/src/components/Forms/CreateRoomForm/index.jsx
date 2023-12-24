import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import { toast } from 'react-toastify';

const CreateRoomForm = ({ uuid, socket, setUser, setMyPeer }) => {
  const [roomId, setRoomId] = useState(uuid());
  const [name, setName] = useState("");

  const navigate = useNavigate();

  const generateRoomId = () => {
    const newRoomId = uuid();
    setRoomId(newRoomId);
    toast.success('New room code generated!');
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();

    // {name,roomId, userId, host, presenter}

    const myPeer = new Peer(undefined, {
      host: "/",
      port: 5001,
      path: "/",
      secure: false,
    });

    setMyPeer(myPeer);

    myPeer.on("open", (id) => {
      const roomData = {
        name,
        roomId,
        userId: id,
        host: true,
        presenter: true,
      };
      setUser(roomData);
      navigate(`/${roomId}`);
      console.log(roomData);
      socket.emit("userJoined", roomData);
    });
    myPeer.on("error", (err) => {
      console.log("peer connection error", err);
      myPeer.reconnect();
    });
  };

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(roomId)
        .then(() => {
          toast.success('Code copied to clipboard!');
        })
        .catch((err) => {
          console.error("Unable to copy number to clipboard:", err);
        });
    }
  };

  return (
    <form className="form col-md-12 mt-5">
      <div className="form-group">
        <input
          type="text"
          className="form-control my-2"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="form-group border">
        <div className="input-group d-flex align-items-center jusitfy-content-center">
          <input
            type="text"
            value={roomId}
            className="form-control my-2 border-0"
            disabled
            placeholder="Generate room code"
          />
          <div className="input-group-append">
            <button
              className="btn btn-primary btn-sm me-1"
              onClick={generateRoomId}
              type="button"
            >
              generate
            </button>
            <button
              className="btn btn-outline-danger btn-sm me-2"
              onClick={copyToClipboard}
              type="button"
            >
              copy
            </button>
          </div>
        </div>
      </div>
      <button
        type="submit"
        onClick={handleCreateRoom}
        className="mt-4 btn-primary btn-block form-control"
      >
        Generate Room
      </button>
    </form>
  );
};

export default CreateRoomForm;
