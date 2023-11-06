import React from "react";

interface NamePageProps {
  handleStart: (e: React.FormEvent<EventTarget>) => void;
  setName: React.Dispatch<React.SetStateAction<string>>;
  name: string;
}

const NameInputScreen = ({ handleStart, setName, name }: NamePageProps) => {
  return (
    <div className="home">
      <form className="game__submit-form" onSubmit={handleStart}>
        <input
          className="game__submit-input"
          type="text"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <button
          className="game__button"
          type="submit"
          disabled={name === "" ? true : false}
        >
          Enter Your Name
        </button>
      </form>
    </div>
  );
};

export default NameInputScreen;
