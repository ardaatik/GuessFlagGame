import React from "react";

interface NameForm {
  handleStart: (e: React.FormEvent<EventTarget>) => void;
  setName: React.Dispatch<React.SetStateAction<string>>;
}

const NameForm = ({ handleStart, setName }: NameForm) => {
  return (
    <div className="game">
      <form className="game__submit-form" onSubmit={handleStart}>
        <input
          className="game__submit-input"
          type="text"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <button className="game__button" type="submit">
          Enter Your Name
        </button>
      </form>
    </div>
  );
};

export default NameForm;
