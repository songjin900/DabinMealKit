import { useRef} from "react";
import {colors} from "@components/palette";


interface ButtonProps {
  text: string;
  index: string;
  width?: string;
  bg?: string;
  [key: string]: any;
}

export default function PreferenceButton({
  onClick,
  text,
  index,
  bg=``,
  width=`[150px]`,
  ...rest
}: ButtonProps) {
    const buttonRef = useRef(null);
    const handlePreferenceButtonClicked = () => {
        onClick(index)
        const selectedButton = buttonRef.current
        if (selectedButton.className === `${bg} border-2 w-${width} h-[4rem] rounded-sm text-[${colors.primary}]`) {
            selectedButton.className = `${bg} border-2 border-[${colors.primary}] bg-[${colors.accent}] font-bold w-${width} h-[4rem] rounded-sm`
        } else {
            selectedButton.className = `${bg} border-2 w-${width} h-[4rem] rounded-sm text-[${colors.primary}]`
        }
    }

  return (
    <button
      {...rest}
      ref={buttonRef}
      onClick={handlePreferenceButtonClicked}
      className={`${bg} border-2 w-${width} h-[4rem] rounded-sm text-[${colors.primary}]`}
    >
      {text}
    </button>
  );
}