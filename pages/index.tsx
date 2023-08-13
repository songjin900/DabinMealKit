// this is the landing page 
import type { NextPage } from "next";
import Link from "next/link";
import Layout from "@components/layout";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import ContentCard from "@components/contentCard";
import PictureSlide from "@components/pictureSlide";
import {colors} from "@components/palette";

const OurStore: NextPage = () => {
    const router = useRouter()
    const [submitType, setSubmitType] = useState("update");
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const onViewplanClicked = () => {
        setSubmitType("viewplan");
    }

    useEffect(() => {
        if (submitType === "viewplan") {
            router.push(`/our-plans`);
        }
    }, [router, submitType])

    return (
        <Layout hasTabBar title="Profile">
            <div className="bg-white w-full min-h-[40.625rem]">
                <div className="flex-col">
                    {/* start of hero section */}  
                    <div className="flex "> 
                        <div className="bg-[#6CA2E8] w-full sm:w-full min-h-[40.625rem] flex flex-col items-center justify-center px-225 ">
                            <div className="flex flex-col items-center justify-center"> 
                                <h3 className="text-4xl text-center">The first Canadian meal kit that</h3>
                                <h3 className="text-4xl pb-5 text-center">specializes in Asian cuisine</h3>
                                <p>We bring flavour of Asia from just</p>
                                <p className="pb-5">$9.25/pp.</p>
                                <div>
                                    <Link legacyBehavior href={`/our-plans`}>
                                        <div className="flex h-full space-x-3 items-center">
                                            <button onClick={onViewplanClicked} disabled={buttonDisabled} className={`w-full bg-[${colors.primary}]  hover:bg-[${colors.primaryHover}]  text-white px-4 border border-transparent rounded-sm shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-3A4884  focus:outline-none py-2 text-sm ${buttonDisabled ? `bg-gray-300 hover:bg-gray-300` : `bg-[${colors.primary}]`}`}>View our plans</button>
                                        </div>
                                    </Link>
                                </div>

                            </div>

                        </div>
                    </div> 
                    {/* end of hero section */}  
                    {/* start of how it works section */}  
                    <div className="flex flex-col max-w-5xl items-center justify-center mx-auto bg-white"> 
                        <div className="flex flex-col items-center justify-center mt-5 mobile:px-2 tablet:px-3 web:px-4">
                            <h3 className="text-2xl font-bold mb-3">
                                How it works
                            </h3>
                            <p className="text-sm mb-9 text-center">
                                <span>Choose your recipes • Pre-measured ingredients for less waste • Receive chopped ingredients</span>
                            </p>
                        </div>
                        <div>
                        <div className="grid grid-cols-1 items-start px-4 tablet:grid-cols-2 web:grid-cols-4">
                            <ContentCard 
                                text="Original recipe"
                                subtext = "Authentic taste of Asia and a variety of fusion recipes every week, all inspired in Asia"
                                srcSet = "https://imagedelivery.net/3acOXCfy_eb2FQ3SxlSAMw/25eecf4c-6448-4f6c-d7bc-a80d0064d600/contentCardMobile 360w https://imagedelivery.net/3acOXCfy_eb2FQ3SxlSAMw/25eecf4c-6448-4f6c-d7bc-a80d0064d600/contentCardWeb 240w"
                                src = "https://imagedelivery.net/3acOXCfy_eb2FQ3SxlSAMw/25eecf4c-6448-4f6c-d7bc-a80d0064d600/contentCardMobile"
                            ></ContentCard>
                            <ContentCard 
                                text="Conveniently chopped"
                                subtext = "You are busy and we get that. We do the chopping so the cooking time matches what it says on the recipe card."
                                srcSet = "https://imagedelivery.net/3acOXCfy_eb2FQ3SxlSAMw/6f0fda92-f0a4-4f8b-cb07-e887d199a400/contentCardMobile 360w https://imagedelivery.net/3acOXCfy_eb2FQ3SxlSAMw/6f0fda92-f0a4-4f8b-cb07-e887d199a400/contentCardWeb 240w"
                                src = "https://imagedelivery.net/3acOXCfy_eb2FQ3SxlSAMw/6f0fda92-f0a4-4f8b-cb07-e887d199a400/contentCardMobile"
                            ></ContentCard>
                            <ContentCard 
                                text="Delivered to your door"
                                subtext = "Fresh ingredients requir to cook your recipe are delivered to your home weekly in our cooler box"
                                srcSet = "https://imagedelivery.net/3acOXCfy_eb2FQ3SxlSAMw/2434ca60-6af2-4746-c0ae-bbf3985d4f00/contentCardMobile 360w https://imagedelivery.net/3acOXCfy_eb2FQ3SxlSAMw/2434ca60-6af2-4746-c0ae-bbf3985d4f00/contentCardWeb 240w"
                                src = "https://imagedelivery.net/3acOXCfy_eb2FQ3SxlSAMw/2434ca60-6af2-4746-c0ae-bbf3985d4f00/contentCardMobile"
                            ></ContentCard>
                            <ContentCard 
                                text="Recipe from home"
                                subtext = "Chef Kim, our executive chef, creates new recipes, with the flavour passed down from his grandmother."
                                srcSet = "https://imagedelivery.net/3acOXCfy_eb2FQ3SxlSAMw/25eecf4c-6448-4f6c-d7bc-a80d0064d600/contentCardMobile 360w https://imagedelivery.net/3acOXCfy_eb2FQ3SxlSAMw/25eecf4c-6448-4f6c-d7bc-a80d0064d600/contentCardWeb 240w"
                                src = "https://imagedelivery.net/3acOXCfy_eb2FQ3SxlSAMw/25eecf4c-6448-4f6c-d7bc-a80d0064d600/contentCardMobile"
                            ></ContentCard>

                            <div className="tablet:col-span-2 tablet:px-[130px] web:col-span-4 mt-8 web:mt-10 mb-2 web:px-[225px]">
                                <Link legacyBehavior href={`/our-plans`}>
                                    <div className="flex h-full space-x-3 items-center">
                                        <button onClick={onViewplanClicked} disabled={buttonDisabled} className={`w-full bg-[${colors.primary}]  hover:bg-[${colors.primaryHover}]  text-white px-4 border border-transparent rounded-sm shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-[${colors.primary}]  focus:outline-none py-2 text-sm ${buttonDisabled ? `bg-gray-300 hover:bg-gray-300` : `bg-[${colors.primary}]`}`}>Learn more</button>
                                    </div>
                                </Link>
                            </div>
                            </div>
                        </div>

                        <div className="mb-10 flex flex-row items-center justify-center">
                            <p> you can <span className="font-bold"> skip a week or cancel</span> any time </p>
                        </div>
                    </div>
                    {/* end of how it works section */}  
                    <div className="w-full border border-gray-50"></div>
                    {/* start of what's on the menu section */}
                    <div className="bg-white mb-12"> 
                        <div className="flex flex-col max-w-5xl items-center justify-center mx-auto"> 
                            <div className="flex flex-col items-center justify-center mt-5 ">
                                <h3 className="text-2xl font-bold mb-3 ">
                                    What's on the menu?
                                </h3>
                                <p className="text-sm mb-9">
                                    <span>Flexible and delicious! You can customize your weekly box now!</span>
                                </p>
                            </div>
                            <div className="bg-white w-full">
                                <PictureSlide width={280} height={400}/>
                            </div>
                        </div>
                    </div> 
                    {/* end of what's on the menu section*/}
                    {/* start of get started section */}  
                    <div className="flex border-b-2 border-gray-200 h-2xl"> 
                        <div className="bg-[#6CA2E8] w-full h-full flex flex-col items-center justify-center px-225px py-20">
                            <div className="flex flex-col items-center justify-center"> 
                                <h3 className="text-4xl pb-5">Get started</h3>
                                <p>We bring flavour of Asia from just</p>
                                <p className="pb-5">$9.25/pp.</p>
                                <div>
                                    <Link legacyBehavior href={`/our-plans`}>
                                        <div className="flex h-full space-x-3 items-center">
                                            <button onClick={onViewplanClicked} disabled={buttonDisabled} className={`w-full bg-[${colors.primary}]  hover:bg-[${colors.primaryHover}]  text-white px-4 border border-transparent rounded-sm shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-3A4884  focus:outline-none py-2 text-sm ${buttonDisabled ? `bg-gray-300 hover:bg-gray-300` : `bg-[${colors.primary}]`}`}>View our plans</button>
                                        </div>
                                    </Link>
                                </div>

                            </div>
                        </div>
                    </div> 
                    {/* end of get started section */}  

                </div>
            </div>
        </Layout>
    );
};

export default OurStore;
