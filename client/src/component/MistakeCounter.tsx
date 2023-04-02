import svgIcons from "../style/assets/cross_sprite.svg";
import CrossIcon from "./CrossIcon";
interface MistakeCounterInterface {
  mistakes: boolean[];
}

const MistakeCounter = ({ mistakes }: MistakeCounterInterface) => {
  return (
    <>
      {mistakes.map((item, index) => (
        <CrossIcon item={item} key={index} />
      ))}
    </>
  );
};

export default MistakeCounter;
