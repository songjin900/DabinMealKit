import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

interface ContentCardProps {
    text: string;
    subtext: string;
    srcSet: string;
    src: string; 
    align?: string;
    justify?: string;
    textalign?: string;
}
export default function ContentCard({
    text,
    subtext,
    srcSet,
    src,
    align = "items-center",
    justify = "justify-items-center",
    textalign = "text-left"
}: ContentCardProps) {
    return (
        <div className="bg-white flex flex-col w-auto mt-1 mx-0 px-0 mobile:px-0 mobile:mx-0 tablet:mx-1 tablet:px-1 web:px-2 web:mx-2 web:w-60 items-center justify-items-center">
                <div className="w-auto web:w-60 items-center justify-center">
                    <div className="h-full w-auto justify-center items-center">
                        <picture>
                            <source 
                                srcSet={`${srcSet}`}
                                sizes="(max-width: 20 rem), (min-width: 15rem)"
                            />                        
                            <img src={`${src}`} alt="" />
                        </picture>
                    </div>
                </div>
                <div className={`flex flex-col my-4 ${align} ${justify}`}>
                    <div className={`flex flex-col w-11/12 top-0 ${align} ${justify}`}>
                        <span className="text-md font-bold text-black pb-4">{text}</span>
                        <span className={`text-sm ${textalign} text-black line-clamp-3`}>{subtext}</span>
                    </div>
                </div>
        </div>
    );
}



// import Image from "next/image";
// import Link from "next/link";
// import { useState, useEffect } from "react";

// interface ContentCardProps {
//     text: string;
//     subtext: string;
//     image: string;
//     width: number;
//     height: number;
//     align?: string;
//     justify?: string;
//     textalign?: string;
// }


// export default function ContentCard({
//     text,
//     subtext,
//     image,
//     width,
//     height,
//     align = "items-center",
//     justify = "justify-center",
//     textalign = "text-left"
// }: ContentCardProps) {

//     return (
//         <div className="bg-white flex flex-col w-360px h-2xl min-h-96 my-1 mx-1 px-4 md: items-center md: justify-center">
//                 <div className="w-55 h-52">
//                     <div className="h-full overflow-hidden">
//                     {/* <Image
//                         src={`${image}`}
//                         className="bg-black w-55 h-52 max-w-none max-h-none object-none"
//                         width={
//                             width
//                         }
//                         height={height}
//                         alt={""} /> */}
//                         <picture>
//                             <source srcSet={`${image}`}
//                                     media="(min-width: 500px)" />
//                             <img src={`${image}`} alt="" />
//                         </picture>
//                     </div>
//                 </div>
//                 <div className={`flex mt-2 ${align} ${justify} md: mb-10`}>
//                     <div className={`flex flex-col w-10/12 ${align} ${justify}`}>
//                         <span className="text-md font-bold text-black pb-4">{text}</span>
//                         <span className={`text-sm ${textalign} text-black line-clamp-3`}>{subtext}</span>
//                     </div>
//                 </div>
//         </div>
//     );
// }