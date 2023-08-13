import Image from "next/image";
import Link from "next/link";

interface PictureCardProps {
    text: string;
    subtext: string;
    image: string;
    width: number;
    height: number;
    align?: string;
    justify?: string;
    textalign?: string;
}

export default function PictureCard({
    text,
    subtext,
    image,
    width,
    height,
    align = "items-center",
    justify = "justify-center",
    textalign = "text-left"
}: PictureCardProps) {

    return (
        <div className="bg-white flex flex-col w-2xl h-2xl min-h-96 my-1 mx-1 px-1 relative">
            <div className="w-70 h-80 relative">
                <Image
                    src={`https://imagedelivery.net/F5uyA07goHgKR71hGfm2Tg/${image}/public`}
                    className="bg-black w-55 h-80 max-w-none max-h-none object-none"
                    width={width}
                    height={height}
                    alt={""}
                />
                <p className={`text-lg ${textalign} font-bold text-black line-clamp-3 w-full absolute bottom-7 left-0 px-4 bg-white bg-opacity-75 truncate` }>{text}</p>
                <p className={`text-sm ${textalign} text-black line-clamp-3 w-full absolute bottom-0 left-0 right-0 px-4 pb-2 bg-white bg-opacity-75 truncate`}>{subtext}</p>
            </div>
        </div>

    );
}






// ***** picture card with texts in the bottom. 


// <div className="bg-white flex flex-col w-360px h-2xl min-h-96 my-1 mx-1 px-4">
//         <div className="w-55 h-80">
//             <div className="h-full overflow-hidden">
//             <Image
//                 src={`${image}`}
//                 className="bg-black w-55 h-80 max-w-none max-h-none object-none"
//                 width={width}
//                 height={height}
//                 alt={""} />
//                                         <span className="text-md font-bold text-black pb-4">{text}</span>
//                 <span className={`text-sm ${textalign} text-black line-clamp-3`}>{subtext}</span>
//             </div>
//         </div>
//         <div className={`flex mt-2 ${align} ${justify}`}>
//             <div className={`flex flex-col w-10/12 ${align} ${justify}`}>

//             </div>
//         </div>
// </div>