interface MistakeCounterInterface {
  mistakes: boolean[];
}

const MistakeCounter = ({ mistakes }: MistakeCounterInterface) => {
  return (
    <>
      {mistakes.map((item, index) => (
        <svg
          key={index}
          className={
            !item
              ? "game__info__mistake-counter-red"
              : "game__info__mistake-counter-white"
          }
        >
          <use xlinkHref="./src/style/assets/cross-sprite.svg#icon-cross" />
        </svg>
      ))}
    </>
  );
};

export default MistakeCounter;
