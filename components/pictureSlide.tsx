import { useState, useRef } from "react";
import PictureCard from "./pictureCard";
import { Recipe } from "@prisma/client";


interface PictureSlideProps {
  recipes: Recipe[];
  width: number;
  height: number;
  align?: string;
  justify?: string;
  textalign?: string;
}


export default function PictureSlide({ recipes,
  width,
  height,
  align = "items-center",
  justify = "justify-center",
  textalign = "text-left"
}: PictureSlideProps) {
  // const slides = [
  //   {
  //     url: `https://imagedelivery.net/F5uyA07goHgKR71hGfm2Tg/63114483-efa1-4714-c65e-64688b717400/public`,
  //     text: "text 1ddddddddddddddddddddccccccccccccccccccc",
  //     subtext: "subtext 1dddddddddddddddddddddddddddddddddddddddddddddddddd",
  //   },
  //   {
  //     url: `https://imagedelivery.net/F5uyA07goHgKR71hGfm2Tg/d1b994cc-e03b-442a-7e24-ae70a55ea400/public`,
  //     text: "text 2",
  //     subtext: "subtext 2",
  //   },
  //   {
  //     url: `https://imagedelivery.net/F5uyA07goHgKR71hGfm2Tg/9d994287-7706-4b85-f5d0-e57e95ab5100/public`,
  //     text: "text 3",
  //     subtext: "subtext 3",
  //   },
  //   {
  //     url: `https://imagedelivery.net/F5uyA07goHgKR71hGfm2Tg/9d994287-7706-4b85-f5d0-e57e95ab5100/public`,
  //     text: "text 4",
  //     subtext: "subtext 4",
  //   },
  //   {
  //     url: `https://imagedelivery.net/F5uyA07goHgKR71hGfm2Tg/63114483-efa1-4714-c65e-64688b717400/public`,
  //     text: "text 5ddddddddddddddddddddccccccccccccccccccc",
  //     subtext: "subtext 5dddddddddddddddddddddddddddddddddddddddddddddddddd",
  //   },
  //   {
  //     url: `https://imagedelivery.net/F5uyA07goHgKR71hGfm2Tg/d1b994cc-e03b-442a-7e24-ae70a55ea400/public`,
  //     text: "text 6",
  //     subtext: "subtext 6",
  //   },
  //   {
  //     url: `https://imagedelivery.net/F5uyA07goHgKR71hGfm2Tg/9d994287-7706-4b85-f5d0-e57e95ab5100/public`,
  //     text: "text 7",
  //     subtext: "subtext 7",
  //   }
  // ];

  // const [selectedImage, setSelectedImage] = useState(slides[0].url);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [submitType, setSubmitType] = useState("update");
  const sliderRef = useRef<HTMLDivElement>();

    const onViewplanClicked = () => {
        setSubmitType("viewplan")
    }

    const slideLeft = () => {
      const slider = sliderRef.current;
      if (slider) {
        slider.scrollLeft = slider.scrollLeft - 700;
      }
    };
    
    const slideRight = () => {
      const slider = sliderRef.current;
      if (slider) {
        slider.scrollLeft = slider.scrollLeft + 700;
      }
    };
    
  return (
    <div className="flex flex-col items-center bg-white">
      <div className="flex flex-row items-center w-full">
        <div
          className="invisible web:visible text-black cursor-pointer opacity-50 hover:opacity-100"
          onClick={slideLeft}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </div>
        <div id="slider" ref={sliderRef} className="flex flex-row overflow-x-scroll scroll whitespace-nowrap scroll-smooth scrollbar-hide max-w-5xl w-5xl ">
          {recipes?.map((r) => (
            <div
              key={r.id}
              // onClick={() => setSelectedImage(img.url)}
            >
              <PictureCard
                text={r.title}
                subtext={r.subTitle ?? ""}
                image={r.image + ""}
                width={width}
                height={height}
                align="items-start"
                justify="justify-start"
              ></PictureCard>

              <div className="mx-2 mt-0 mb-3">
                <button
                  onClick={onViewplanClicked}
                  disabled={buttonDisabled}
                  className={`w-full bg-[#FFFFFF]  hover:bg-[#5246BA] hover:text-[#FFFFFF] text-[#3A4884] px-4 border border-[#3A4884] rounded-sm shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-3A4884  focus:outline-none py-2 text-sm ${
                    buttonDisabled ? `bg-gray-300 hover:bg-gray-300` : `bg-[#3A4884]`
                  }`}
                >
                  Order this recipe
                </button>
              </div>
            </div>
          ))}
        </div>
        <div
          className="invisible web:visible text-black cursor-pointer opacity-50 hover:opacity-100"
          onClick={slideRight}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}





// note 
// I used "tailwind-scrollbar-hide" package to remove the scrollbar
// it was added via tailwind.config.js in plugins