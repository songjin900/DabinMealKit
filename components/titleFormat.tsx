import { useRef, useState } from "react";
import { colors } from "@components/palette";

interface TitleFormatProps {
  title: string;
  subtitle: string;
  titleFont?: string;
  subtitleFont?: string;
  titleSize?: string;
  subtitleSize?: string;
}

export default function TitleFormat({
  title,
  subtitle,
  titleFont=`font-semibold`,
  subtitleFont=``,
  titleSize=`text-2xl`,
  subtitleSize=`text-sm`
}: TitleFormatProps) {

  return (
    <div className={`flex flex-col items-center justify-center mt-5 mobile:px-2 tablet:px-3 web:px-4`}>
        <h3 className={`${titleFont} ${titleSize} mb-3 text-center`}>
            {title}
        </h3>
        <p className={`${subtitleFont} ${subtitleSize} mb-9 text-center`}>
            <span>
                {subtitle}
            </span>
        </p>
</div>
  );
}
