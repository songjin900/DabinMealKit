import Image from "next/image";
import { useState } from "react";

export default function ImageSlides() {
    const slides = [
        {
            url: `https://imagedelivery.net/F5uyA07goHgKR71hGfm2Tg/63114483-efa1-4714-c65e-64688b717400/public`
        },
        {
            url: `https://imagedelivery.net/F5uyA07goHgKR71hGfm2Tg/d1b994cc-e03b-442a-7e24-ae70a55ea400/public`
        },
        {
            url: `https://imagedelivery.net/F5uyA07goHgKR71hGfm2Tg/9d994287-7706-4b85-f5d0-e57e95ab5100/public`
        },
    ]

    const [selectedImage, setSelectedImage] = useState(slides[0].url);

    const onRightArrowClicked = () => {
        const index = slides?.findIndex(item => item.url === selectedImage);
        if (index === -1)
            return;

        if (index + 1 === slides.length)
            setSelectedImage(slides[0].url)
        else
            setSelectedImage(slides[index + 1].url)

    }
    const onLeftArrowClicked = () => {
        const index = slides?.findIndex(item => item.url === selectedImage);
        if (index === -1)
            return;

        if (index === 0)
            setSelectedImage(slides[slides.length - 1].url)
        else
            setSelectedImage(slides[index + -1].url)
    }
    return (
        <div className="flex flex-col items-center bg-white">
            <div className="flex">
                <Image
                    src={selectedImage}
                    width={400}
                    height={400}
                    alt=""
                    // className="object-contain"
                    className="bg-white max-h-[30rem] min-h-[24rem]"
                    layout="responsive"

                />
            </div>
            <div className="flex flex-row items-center">
                <div className=" text-black cursor-pointer" onClick={() => onLeftArrowClicked()}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </div>
                {
                    slides?.map((img) => (
                        <div key={img.url} onClick={() => setSelectedImage(img.url)}>
                            <Image
                                src={img.url + ""}
                                width={75}
                                height={75}
                                alt=""
                                className={`${selectedImage === img.url ? 'border-gray-500' : 'border-gray-300'} m-2  border-2 rounded-xl`}
                            />
                        </div>
                    ))
                }
                <div className=" text-black cursor-pointer" onClick={() => onRightArrowClicked()}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </div>
            </div>
        </div>
    );
}