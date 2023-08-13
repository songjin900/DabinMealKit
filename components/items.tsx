import Image from "next/image";
import Link from "next/link";

interface ItemProps {
    title: string;
    id: number;
    price: number;
    comments: number;
    hearts: number;
    image: string;
}

export default function Item({
    title,
    price,
    comments,
    hearts,
    id,
    image
}: ItemProps) {
    return (
        <Link legacyBehavior href={`/products/${id}`}>
            <a className="bg-white p-2 rounded-2xl shadow-md shadow-gray-400 cursor-pointer">
                <div className="flex items-center justify-center">
                    <Image
                        src={`https://imagedelivery.net/F5uyA07goHgKR71hGfm2Tg/${image}/public`}
                        className="bg-white"
                        width={300}
                        height={150} 
                        alt={""} />
                </div>
                <div className="flex flex-col pl-2 mt-2">
                    <span className="text-lg font-md text-gray-800">{title}</span>
                    <span className="text-sm text-gray-500">${price}</span>
                </div>
            </a>
        </Link>
    );
}