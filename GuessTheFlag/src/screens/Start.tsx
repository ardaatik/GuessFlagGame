import { useState, useContext } from "react";
import EnterGame from "../component/EnterGame";
import { GlobalContext } from "../context/GlobalProvider";
import { useNavigate } from "react-router-dom";

const Start = () => {
  const { setName, room, setRoom, socket } = useContext(GlobalContext);

  const [openInput, setOpenInput] = useState(false);
  const navigate = useNavigate();

  const handleStart = (e: React.FormEvent<EventTarget>) => {
    e.preventDefault();
    console.log("sending name ");
    navigate("/start");
  };
  return (
    <EnterGame
      openInput={openInput}
      setName={setName}
      handleStart={handleStart}
      socket={socket}
      room={room}
      setOpenInput={setOpenInput}
      setRoom={setRoom}
    />
  );
};

export default Start;
