import { useRef, useState, useEffect} from "react";
import { colors } from "@components/palette";

interface ChoiceButtonProps {
  onClick: (selectedIndex: number) => void;
  choices: string[];
  choiceTexts: string[];
  height?: string;
  [key: string]: any;
}

export default function ChoiceButton({
  onClick,
  choices,
  choiceTexts,
  height="[4rem]",
  ...rest
}: ChoiceButtonProps) {
  const buttonRefs = useRef(Array(choices.length).fill(null));
  const [selectedIndex, setSelectedIndex] = useState<number | null>(1);

  const [dummyIndex, setDummyIndex] = useState(1); // it colour the default value initially


//   useEffect(() => {
//     console.log("component mounted")
//     setSelectedChoiceIndex(2)
// }, [])


  const handleChoiceButtonClicked = (selectedIndex: number) => {
    buttonRefs.current.forEach((buttonRef, index) => {
      if (selectedIndex === index) {
        buttonRef.className = `my-1 border-2 border-[${colors.primary}] bg-[${colors.accent}] font-bold h-${height} rounded-sm w-full`;
      } else {
        buttonRef.className = `my-1 border-2 h-${height} rounded-sm text-[${colors.primary}] w-full`;
      }
    });
    setSelectedIndex(selectedIndex);
    onClick(parseInt(choices[selectedIndex],10));
  };

  // Initialize the component with selectedChoiceIndex 1


  return (
    <div className="flex flex-col items-center justify-center w-64 tablet:w-64 web:w-64">
      <div className="flex mobile:flex-col tablet:flex-row web:flex-row w-full">
        {choices.map((choice, index) => (
          <button
            {...rest}
            key={choice}
            ref={(ref) => (buttonRefs.current[index] = ref)}
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleChoiceButtonClicked(index)}
            className={
              dummyIndex===index? `my-1 border-2 border-[${colors.primary}] bg-[${colors.accent}] font-bold h-${height} rounded-sm w-full`:`my-1 items-center  justify-center border-2 h-${height} rounded-sm text-[${colors.primary}] w-full`        
            } 
          >
            {choice}
          </button>
        ))}
      </div>
      {selectedIndex !== null && (
        <p className={
          choiceTexts[0] === "" || choiceTexts[0] === null ?
            "text-center" :
            "text-center mt-5"
        }>
          {choiceTexts[selectedIndex]}
        </p>
      )}
    </div>
  );
}
