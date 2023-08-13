import { cls } from "../libs/client/utils";
import {colors} from "@components/palette";


interface ButtonProps {
  large?: boolean;
  text: string;
  [key: string]: any;
}

export default function Button({
  large = false,
  onClick,
  text,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={cls(
        `w-full bg-[${colors.primary}] hover:bg-[${colors.primaryHover}] text-white px-4 border border-transparent rounded-sm shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:outline-none`,
        large ? "py-3 text-base" : "py-2 text-sm "
      )}
    >
      {text}
    </button>
  );
}