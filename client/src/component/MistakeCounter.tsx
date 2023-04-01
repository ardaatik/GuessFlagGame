import svgIcons from "../style/assets/cross_sprite.svg";

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
              ? "score__board__mistakes-red"
              : "score__board__mistakes-white"
          }
        >
          <use xlinkHref={svgIcons + "#icon-cross1"} />
        </svg>
      ))}
    </>
  );
};

export default MistakeCounter;
