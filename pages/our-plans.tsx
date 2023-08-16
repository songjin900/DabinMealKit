// this is the landing page 

import type { NextPage } from "next";
import Link from "next/link";
import Layout from "@components/layout";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState, useRef } from "react";
import ContentCard from "@components/contentCard";
import PictureSlide from "@components/pictureSlide";
import { colors } from "@components/palette"
import PreferenceButton from "@components/preferernceButton";
import ChoiceButton from "@components/choiceButton";
import TitleFormat from "@components/titleFormat";
import client from "@libs/server/client";
import { Cuisine, Goal } from "@prisma/client";


const OurPlan: NextPage<{ cuisine: Cuisine[], goal: Goal[] }> = ({ cuisine, goal }) => {
    const router = useRouter()

    const [submitType, setSubmitType] = useState("update");
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [planStep, setPlanStep] = useState(1);
    const [selectedCuisineIndex, setSelectedCuisineIndex] = useState(Array(8).fill(''));
    const [selectedReasonIndex, setSelectedReasonIndex] = useState(Array(4).fill(''));
    const [selectedOrder, setSelectedOrder] = useState([4, 4])

    const [selectedCuisine, setSelectedCuisine] = useState<number[]>([]);
    const [selectedGoal, setSelectedGoal] = useState<number[]>([]);
    const peopleNum = [2, 4];
    const [selectedPeopleNum, setSelectedPeopleNum] = useState<number>();


    {/* **********************************************************************************************************************************************************
**********************************************************************************************************************************************************
                                    functions passed down to child components for data extraction
**********************************************************************************************************************************************************
********************************************************************************************************************************************************** */}
    const cuisineClicked = (id: number) => {
        if (!selectedCuisine.includes(id)) {
            setSelectedCuisine(prev => [...prev, id]);
        }
        else {
            setSelectedCuisine(prev => prev.filter(number => number !== id));
        }
    }

    const goalClicked = (id: number) => {
        if (!selectedGoal.includes(id)) {
            setSelectedGoal(prev => [...prev, id]);
        }
        else {
            setSelectedGoal(prev => prev.filter(number => number !== id));
        }
    }

    const peopleClicked = (num: number) => {
        if (num) {
            setSelectedPeopleNum(num);
        }
    }

    const handlePeopleClicked = (choice) => {
        const updatedSelectedOrder = [...selectedOrder]
        updatedSelectedOrder[0] = choice
        setSelectedOrder(updatedSelectedOrder)
    }
    const handleFoodButtonlicked = (choice) => {
        const updatedSelectedOrder = [...selectedOrder]
        updatedSelectedOrder[1] = choice
        setSelectedOrder(updatedSelectedOrder)
    }
   
  
    {/* **********************************************************************************************************************************************************
**********************************************************************************************************************************************************
                                                                        Routing
**********************************************************************************************************************************************************
********************************************************************************************************************************************************** */}

    const onViewplanClicked = () => {
        setSubmitType("viewplan");
    }

    useEffect(() => {
        if (submitType === "viewplan") {
            router.push(`/our-plans`);
        }
    }, [router, submitType])

    const onPlanStepClicked = () => {
        if (planStep === 4) {
            setPlanStep(planStep);
        } else {
            setPlanStep(prev => prev + 1);
        }
    }

    const onSelectPlanClicked = () => {
        setSubmitType("selectplan");
    }

    useEffect(() => {
        if (submitType === "selectplan") {
            router.push(`/register`);
        }
    }, [router, submitType])

    return (
        <Layout hasTabBar title="Purchase">
            {/* mobile & tablet view */}
            <div className={`bg-gray-100 w-full min-h-[40.625rem] items-center justify-center web:hidden`}>
                <div className={`flex flex-col max-w-3xl items-center justify-center mx-auto bg-white mt-20 ${planStep === 1 ? "" : "hidden"}`}>
                    <TitleFormat
                        title="What kind of cuisine do you like?"
                        subtitle="Tell us your preference below so we can better cater to your wants. You can always change them later"
                    />
                    <div className={`grid grid-cols-2 w-full mobile:px-2 tablet:px-3 web:px-4 text-lg gap-3 justify-center items-center`}>
                        {
                            cuisine
                                .slice(0)
                                .sort((a: any, b: any) => (a.index ?? 0) > (b.index ?? 0) ? 1 : -1)
                                .map((c: any) => <button className={`bg-white border-2 h-[4rem] rounded-sm text-[#3A4884] 
                            ${selectedCuisine.includes(c.id) ? "font-bold border-2 border-[#3A4884]" : ""}`}
                                    key={c.id} onClick={() => cuisineClicked(c.id)}>{c.displayName}</button>)
                        }
                    </div>
                    <div className="grid grid-cols-1 items-start px-4 tablet:grid-cols-2 web:grid-cols-4">
                        <div className="tablet:col-span-2 tablet:px-[130px] web:col-span-4 mt-8 web:mt-10 mb-2 web:px-[225px]">
                            <Link legacyBehavior href={`/our-plans`}>
                                <div className="flex h-full space-x-3 items-center">
                                    <button onClick={onPlanStepClicked} disabled={buttonDisabled} className={`w-full bg-[${colors.primary}]  hover:bg-[${colors.primaryHover}]  text-white px-4 border border-transparent rounded-sm shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-[${colors.primary}]  focus:outline-none py-2 text-sm ${buttonDisabled ? `bg-gray-300 hover:bg-gray-300` : `bg-[${colors.primary}]`}`}>Continue</button>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="mb-10 flex flex-row items-center justify-center">
                        <p> you can <span className="font-bold"> skip a week or cancel</span> any time </p>
                    </div>
                </div>
                <div className={`flex flex-col max-w-3xl items-center justify-center mx-auto bg-white mt-20 ${planStep === 2 ? "" : "hidden"}`}>
                    <TitleFormat
                        title="What are your goals with Slice Asia?"
                        subtitle="Tell us your preference below so we can better cater to your wants. You can always change them later."
                    />
                    <div className={`flex flex-col w-full mobile:px-2 tablet:px-3 web:px-4 text-lg gap-3 justify-center items-center`}>
                        {
                            goal
                                .slice(0)
                                .sort((a: any, b: any) => (a.index ?? 0) > (b.index ?? 0) ? 1 : -1)
                                .map((c: any) => <button className={`bg-white border-2 h-[4rem] rounded-sm text-[#3A4884] w-full
                            ${selectedGoal.includes(c.id) ? "font-bold border-2 border-[#3A4884]" : ""}`}
                                    key={c.id} onClick={() => goalClicked(c.id)}>{c.displayName}</button>)
                        }
                    </div>
                    <div className="grid grid-cols-1 items-start px-4 tablet:grid-cols-2 web:grid-cols-4">
                        <div className="tablet:col-span-2 tablet:px-[130px] web:col-span-4 mt-8 web:mt-10 mb-2 web:px-[225px]">
                            <div className="flex h-full space-x-3 items-center">
                                <button onClick={onPlanStepClicked} disabled={buttonDisabled} className={`w-full bg-[${colors.primary}]  hover:bg-[${colors.primaryHover}]  text-white px-4 border border-transparent rounded-sm shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-[${colors.primary}]  focus:outline-none py-2 text-sm ${buttonDisabled ? `bg-gray-300 hover:bg-gray-300` : `bg-[${colors.primary}]`}`}>Continue</button>
                            </div>
                        </div>
                    </div>
                    <div className="mb-10 flex flex-row items-center justify-center">
                        <p> you can <span className="font-bold"> skip a week or cancel</span> any time </p>
                    </div>
                </div>
                <div className={`flex flex-col max-w-3xl items-center justify-center mx-auto bg-white mt-20 ${planStep === 3 ? "" : "hidden"}`}>
                    <TitleFormat
                        title="How people will be eating Slice Asia?"
                        subtitle=""
                    />
                    <div className={`flex flex-col w-full text-lg justify-center items-center px-2`}>

                        {
                            peopleNum
                            .map((p) => <button className={`bg-white border-2 h-[4rem] w-64 rounded-sm text-[#3A4884] 
                            ${selectedPeopleNum === p ? "font-bold border-2 border-[#3A4884]" : ""}`}
                                key={p} onClick={() => peopleClicked(p)}>{p}</button>)                            
                        }
                        {
                            selectedPeopleNum && selectedPeopleNum === 2 ? <div>This is great for an individual or a pair preparing their meals.</div> : selectedPeopleNum && selectedPeopleNum === 4 ? <div>This is great to for families or friends!</div> : null
                        }

                    </div>
                    <div className="grid grid-cols-1 items-start px-4 tablet:grid-cols-2 web:grid-cols-4">
                        <div className="tablet:col-span-2 tablet:px-[130px] web:col-span-4 mt-8 web:mt-10 mb-2 web:px-[225px]">
                            <div className="flex h-full space-x-3 items-center">
                                <button onClick={onPlanStepClicked} disabled={buttonDisabled} className={`w-full bg-[${colors.primary}]  hover:bg-[${colors.primaryHover}]  text-white px-4 border border-transparent rounded-sm shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-[${colors.primary}]  focus:outline-none py-2 text-sm ${buttonDisabled ? `bg-gray-300 hover:bg-gray-300` : `bg-[${colors.primary}]`}`}>Continue</button>
                            </div>
                        </div>
                    </div>


                    <div className="mb-10 flex flex-row items-center justify-center">
                        <p> you can <span className="font-bold"> skip a week or cancel</span> any time </p>
                    </div>
                </div>
                <div className={`flex flex-col max-w-3xl items-center justify-center mx-auto bg-white mt-20 ${planStep === 4 ? "" : "hidden"}`}>
                    <TitleFormat
                        title="How many cuisines do you want a week?"
                        subtitle=""
                    />
                    <div className={`flex flex-row w-full text-lg gap-3 justify-center items-center px-2`}>
                        <ChoiceButton onClick={handleFoodButtonlicked} choices={["3", "4", "5"]} choiceTexts={["Our most popular plan", "Ready for next week plan", "A new dinner every night plan"]} />
                    </div>
                    <div className="grid grid-cols-1 items-start px-4 tablet:grid-cols-2 web:grid-cols-4">
                        <div className="tablet:col-span-2 tablet:px-[130px] web:col-span-4 mt-8 web:mt-10 mb-2 web:px-[225px]">
                            <div className="flex h-full space-x-3 items-center">
                                <button onClick={onSelectPlanClicked} disabled={buttonDisabled} className={`w-full bg-[${colors.primary}]  hover:bg-[${colors.primaryHover}]  text-white px-4 border border-transparent rounded-sm shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-[${colors.primary}]  focus:outline-none py-2 text-sm ${buttonDisabled ? `bg-gray-300 hover:bg-gray-300` : `bg-[${colors.primary}]`}`}>Continue</button>
                            </div>
                        </div>
                    </div>
                    <div className="mb-10 flex flex-row items-center justify-center">
                        <p> you can <span className="font-bold"> skip a week or cancel</span> any time </p>
                    </div>
                </div>
            </div>


            {/* web view  */}
            <div className={`bg-gray-100 w-full items-center justify-center invisible web:visible `}>
                <div className={`flex flex-row w-4/6 mx-auto bg-white drop-shadow-md mt-20 overflow-hidden overflow-clip pb-10`}>
                    <div className={`div for some picture later w-1/6`}></div>
                    <div className={`flex flex-col w-4/6 items-center justify-center mx-auto bg-white mx-[168px]`}>
                        <div className="w-full items-center justify-center">
                            <TitleFormat
                                title="Choose your plan size"
                                subtitle="We will set it to your default, but you can always change them later"
                            />
                            <div className={`flex flex-col w-full items-center justify-center `}>
                                <div className={`flex flex-row gap-10 items-center justify-center`}>
                                    <span className={`text-sm`}>Number of people</span>
                                    <div>
                                        <ChoiceButton onClick={handlePeopleClicked} choices={["2", "4"]} choiceTexts={["", ""]} height={"9"} />
                                    </div>
                                </div>
                                <div className={`flex flex-row gap-10 items-center justify-center mt-5`}>
                                    <span className={`text-sm`}>Recipes per week</span>
                                    <div>
                                        <ChoiceButton onClick={handleFoodButtonlicked} choices={["3", "4", "5"]} choiceTexts={["", "", ""]} height={"9"} />
                                    </div>
                                </div>

                                <div className={`border-2 flex flex-col w-[99%] gap-5 mt-5 p-3`}>
                                    <div className={`flex flex-col  text-sm`}>
                                        <span className={`font-bold`}>Price Summary</span>
                                        <span>{selectedOrder[1]} meals for {selectedOrder[0]} people per week</span>
                                        <span>{selectedOrder[0] * selectedOrder[1]} total servings</span>
                                    </div>
                                    <div className={`flex flex-col text-sm`}>
                                        <div className={`flex flex-row w-full place-content-between`}>
                                            <span>Box price</span>
                                            <span>$185.00</span>
                                        </div>
                                        <div className={`flex flex-row w-full place-content-between`}>
                                            <span>Price per serving</span>
                                            <span>$5.09</span>
                                        </div>
                                        <div className={`flex flex-row place-content-between`}>
                                            <span>Shipping</span>
                                            <span>Free</span>
                                        </div>
                                    </div>
                                    <div className={`flex flex-col text-sm`}>
                                        <div className={`flex flex-row place-content-between`}>
                                            <span>First box total</span>
                                            <span>$101.75</span>
                                        </div>
                                    </div>

                                </div>

                                <div className={`mt-10 w-[99%]`}>
                                    <Link legacyBehavior href={`/register`}>
                                        <div className="flex h-full w-full items-center">
                                            <button onClick={onSelectPlanClicked} disabled={buttonDisabled} className={`w-full bg-[${colors.primary}]  hover:bg-[${colors.primaryHover}]  text-white px-4 border border-transparent rounded-sm shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-3A4884  focus:outline-none py-2 text-sm ${buttonDisabled ? `bg-gray-300 hover:bg-gray-300` : `bg-[${colors.primary}]`}`}>Select this plan</button>
                                        </div>
                                    </Link>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className={`div for some picture later w-1/6`}></div>
                </div>
                <div className={`flex flex-col w-4/6 mx-auto mt-5`}>
                    <TitleFormat
                        title="What kind of cuisine do you like?"
                        subtitle="Tell us your preference below so we can better cater to your wants. You can always change them later"
                        titleSize="text-xl"
                    />
                    <div className={`grid grid-cols-4 gap-4 rounded-sm`}>
                        {
                            cuisine
                                .slice(0)
                                .sort((a: any, b: any) => (a.index ?? 0) > (b.index ?? 0) ? 1 : -1)
                                .map((c: any) => <button className={`bg-white border-2 h-[4rem] rounded-sm text-[#3A4884] 
                            ${selectedCuisine.includes(c.id) ? "font-bold border-2 border-[#3A4884]" : ""}`}
                                    key={c.id} onClick={() => cuisineClicked(c.id)}>{c.displayName}</button>)
                        }
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export const getServerSideProps = async () => {
    const cuisine = await client.cuisine.findMany({
        where: {
            visibility: true
        }
    })

    const goal = await client.goal.findMany({
        where: {
            visibility: true
        }
    })

    return {
        props: {
            cuisine: JSON.parse(JSON.stringify(cuisine)),
            goal: JSON.parse(JSON.stringify(goal)),
        }
    }
}


export default OurPlan;
