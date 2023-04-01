import { useContext } from "react";
import EnterGame from "../component/EnterGame";
import { GlobalContext } from "../context/GlobalProvider";

const Start = () => {
  const { setName, setRoom, socket, name, setOpenInput, openInput } =
    useContext(GlobalContext);

  const handleStart = (e: React.FormEvent<EventTarget>) => {
    e.preventDefault();
    setOpenInput(true);
  };
  return (
    <EnterGame
      openInput={openInput}
      setName={setName}
      handleStart={handleStart}
      socket={socket}
      setRoom={setRoom}
      name={name}
    />
  );
};

export default Start;
