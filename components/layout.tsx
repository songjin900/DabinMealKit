import React, { useState, useEffect, useRef} from "react";
import Link from "next/link";
import { cls } from "@libs/client/utils";
import { useRouter } from "next/router";
import Head from "next/head";
import {colors} from "./palette";

interface LayoutProps {
  title?: string;
  canGoBack?: boolean;
  hasTabBar?: boolean;
  children: React.ReactNode;
  seoTitle?: string;
  brandLogo?: boolean;
  searchIcon?: boolean;
  shoppingCart?: boolean;
  hamburgerMenu?: boolean
}

export default function Layout({
  title,
  canGoBack,
  hasTabBar,
  children,
  seoTitle,
  brandLogo,
  searchIcon,
  shoppingCart,
  hamburgerMenu
}: LayoutProps) {
  const router = useRouter();
  const onClick = () => {
    router.back();
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [submitType, setSubmitType] = useState("update");
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [completedSteps, setCompletedSteps] = useState(1); 

  const onEnterClicked = () => {
      setSubmitType("enter");
  }

  useEffect(() => {
      if (submitType === "enter") {
          router.push(`/enter`);
      }
  }, [router, submitType])

  const onViewplanClicked = () => {
    setSubmitType("viewplan");
  }

  useEffect(() => {
      if (submitType === "viewplan") {
          router.push(`/our-plans`);
      }
  }, [router, submitType])

  const onMainClicked = () => {
    setSubmitType("main");
  }

  useEffect(() => {
      if (submitType === "main") {
          router.push(`/`);
      }
  }, [router, submitType])

  useEffect(() => {
    //shuts off the side menu bar when screen orientation changes
    //prolly won't work on safari
    const handleOrientationChange = () => {
      setIsOpen(false);
    };
    window.addEventListener('orientationchange', handleOrientationChange);
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);


  return (
    <div>
      <Head>
        <title>Slice Asia</title>
      </Head>


{/* **********************************************************************************************************************************************************
**********************************************************************************************************************************************************
                                                      <Layout title = "Profile"></Layout>
**********************************************************************************************************************************************************
********************************************************************************************************************************************************** */}
      {/* mobile navbar */}
      <div className= {`${title === "Profile" ? "" : "hidden"} visible tablet:hidden web:hidden fixed top-0 left-0 z-50 bg-white static w-full h-12 justify-between text-lg px-3 font-normal text-gray-800 top-0 flex items-center border-b-2 border-gray-200`}>
        <div className="grid grid-cols-3 h-full w-full">
          <div className="grid grid-cols-1 h-full items-center ">
            <button onClick={() => { setIsOpen(!isOpen) }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 cursor-pointer hover:bg-black hover:text-white hover:rounded-2xl hover:p-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
          <div className="items-center justify-items-center"> 
            <Link legacyBehavior href={`/`}>
              <div className="grid grid-cols-1 h-full space-x-3 items-center justify-items-center">
                <span onClick={onMainClicked} className="text-xl truncate font-bold cursor-pointer">Logo Here</span>
              </div>
            </Link>
          </div>
          <div className="grid grid-cols-1 h-full place-items-end">
            <div className="w-18 h-full pl-4 pr-4 x-0 cursor-pointer hover:bg-[#5246BA] hover:text-white "> 
              <Link legacyBehavior href={`/profile/cart`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-full">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* mobile sidebar menu open close */}
      <div className={`z-50 fixed top-0 left-0 bg-white w-[250px] h-full p-10 ${isOpen ? `-translate-x-0` : `-translate-x-full`} ease-in-out duration-300`}>
        <div className = "flex flex-col">
          <div className="flex flex-col w-full">
            <Link legacyBehavior href={`/enter`}>
                <div className="flex h-full space-x-3 items-center">
                  <button onClick={onEnterClicked} disabled={buttonDisabled} className={`${isLoggedIn? `invisible`:`visible`} w-full bg-[#FFFFFF] text-[#3A4884] font-bold underline underline-offset-1 px-4 border border-[#3A4884] rounded-sm shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-3A4884  focus:outline-none py-2 text-sm ${buttonDisabled ? `bg-gray-300 hover:bg-gray-300` : `bg-[#3A4884]`}`}>Log in</button>
                </div>
            </Link>

            <Link legacyBehavior href={`/our-plans`}>
              <div className="flex h-full space-x-3 items-center">
                <span onClick={onViewplanClicked} className="p-1 pt-3 justify-items-center h-full text-md lg:block hover:bg-[#5246BA] hover:text-white hover:p-1 hover:pt-3 hover:cursor-pointer">Our plans</span>
              </div>
            </Link>

            <Link legacyBehavior href={`/`}>
              <div className="flex h-full space-x-3 items-center">
                <span className="p-1 pt-3 h-full text-md lg:block hover:bg-[#5246BA] hover:text-white hover:p-1 hover:pt-3 hover:cursor-pointer">How it works</span>
              </div>
            </Link>

            <Link legacyBehavior href={`/`}>
              <div className="flex h-full space-x-3 items-center">
                <span className="p-1 pt-3 h-full text-md lg:block hover:bg-[#5246BA] hover:text-white hover:p-1 hover:pt-3 hover:cursor-pointer">Recipes</span>
              </div>
            </Link>

            <Link legacyBehavior href={`/profile`}>
              <span className={`${isLoggedIn? `flex`:`hidden`} p-1 pt-3 h-full text-md lg:block hover:bg-[#5246BA] hover:text-white hover:p-1 hover:pt-3 hover:cursor-pointer`}>My profile</span>
            </Link>
          </div>
          <div className={`${isOpen ? `fixed` : `hidden`} bg-gray-200 opacity-75 w-screen h-screen top-0 left-[250px]`} onClick={()=>setIsOpen(false)}>
          </div>
        </div> 
      </div>




      {/* web and tablet navbar */}
      <div className={`${title === "Profile" ? "": "hidden"} invisible tablet:visible web:visible fixed top-0 left-0 z-50 bg-white static w-full h-12 justify-between text-lg px-3 font-normal text-gray-800 top-0 flex items-center border-b-2 border-gray-200`}>
        <div className="flex h-full w-full space-x-3 items-center">
          <Link legacyBehavior href={`/`}>
            <div className="flex h-full items-center">
              <span onClick={onMainClicked} className="text-xl truncate font-bold cursor-pointer">Logo Here</span>
            </div>
          </Link>
          <Link legacyBehavior href={`/our-plans`}>
            <div className="flex h-full items-center">
              <span onClick={onViewplanClicked} className="p-1 pt-3 justify-items-center h-full text-sm truncate hover:bg-[#5246BA] hover:text-white hover:p-1 hover:pt-3 hover:cursor-pointer">Our plans</span>
            </div>
          </Link>
          <Link legacyBehavior href={`/`}>
            <div className="flex h-full items-center">
              <span className="p-1 pt-3 h-full text-sm truncate hover:bg-[#5246BA] hover:text-white hover:p-1 hover:pt-3 hover:cursor-pointer">How it works</span>
            </div>
          </Link>
          <Link legacyBehavior href={`/`}>
            <div className="flex h-full items-center">
              <span className="p-1 pt-3 h-full text-sm truncate hover:bg-[#5246BA] hover:text-white hover:p-1 hover:pt-3 hover:cursor-pointer">Recipes</span>
            </div>
          </Link>
        </div>
        <div className="flex h-full w-full space-x-3 items-center"></div>
        <div className="flex h-full w-full space-x-3 items-center justify-end mr-2">
          <div className="w-18 h-full px-4 cursor-pointer hover:bg-[#5246BA] hover:text-white">
            <Link legacyBehavior href={`/profile/cart`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-full mx-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
            </Link>
          </div>
          <div>
            <Link legacyBehavior href={`/profile`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${isLoggedIn? `flex`:`hidden`} w-7 h-7 cursor-pointer hover:text-white hover:bg-green-500 hover:rounded-2xl hover:p-1`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </Link>
            <Link legacyBehavior href={`/enter`}>
                  <div className="flex h-full space-x-3 items-center justify-center place-self-center">
                    <button onClick={onEnterClicked} disabled={buttonDisabled} 
                      className={`
                        ${isLoggedIn? `hidden`:`flex`} 
                        w-[120px] 
                        bg-[#FFFFFF] 
                        text-[#3A4884] 
                        hover:bg-[#5246BA] 
                        hover:text-[#FFFFFF] 
                        text-center 
                        font-bold 
                        underline 
                        underline-offset-1 
                        pl-[33px] 
                        border 
                        border-[#3A4884] 
                        rounded-sm 
                        shadow-sm  
                        py-1 
                        ${buttonDisabled ? `bg-gray-300 hover:bg-gray-300` : `bg-[#3A4884]`}`
                      }>Log in</button>
                  </div>
            </Link>
          </div>
        </div> 
      </div>


      {/* mobile navbar for progress navbar */}
      {/* web and tablet profess navbar */}


      {/* mobile footer */}
      {/* web and tablet footer */}
      <div className={cls("top-0 static pt-0 z-[-2]", hasTabBar ? "" : "" )}>{children}</div>

      
      <div className={`${title === "Profile" ? "visible" : "invisible"} grid grid-cols-1 border-t-2 h-screen max-h-72`}>
        <div className="border-r-2 pl-6 pt-2">
          <h2 className="mb-3 mt-2 text-sm font-semibold text-gray-900 uppercase">Shop</h2>
          <div className="flex flex-col my-1 gap-y-2 pl-1">
            <span className="hover:underline text-gray-600 text-sm cursor-pointer">All Categoasdfasdfries</span>
            <span className="hover:underline text-gray-600 text-sm cursor-pointer">Package</span>
          </div>
        </div>
        <div className="border-r-2 pl-6 pt-2">
          <h2 className="mb-3 mt-2 text-sm font-semibold text-gray-900 uppercase">Account</h2>
          <div className="flex flex-col my-1 gap-y-2 pl-1">
            <span className="hover:underline text-gray-600 text-sm cursor-pointer">My Account</span>
            <span className="hover:underline text-gray-600 text-sm cursor-pointer">Order History</span>
            <span className="hover:underline text-gray-600 text-sm cursor-pointer">Edit Profile</span>
          </div>
        </div>
        <div className="border-r-2 pl-6 pt-2">
          <h2 className="mb-3 mt-2 text-sm font-semibold text-gray-900 uppercase">About us</h2>
          <div className="flex flex-col my-1 gap-y-2 pl-1">
            <span className="hover:underline text-gray-600 text-sm cursor-pointer">Our Store</span>
            <span className="hover:underline text-gray-600 text-sm cursor-pointer">Location</span>
            <span className="hover:underline text-gray-600 text-sm cursor-pointer">Edit Profile</span>
          </div>
        </div>
      </div>


{/* **********************************************************************************************************************************************************
**********************************************************************************************************************************************************
                                                      <Layout title = "Purchase"></Layout>
**********************************************************************************************************************************************************
********************************************************************************************************************************************************** */}
      {/* mobile navbar */}
      <div className= {`${title === "Purchase" ? "" : "hidden"} visible tablet:invisible web:invisible fixed top-0 left-0 z-50 bg-white static w-full h-20 justify-center flex items-center border-b-2 border-gray-200`}>
        <div className="flex items-center justify-center min-w-[95%] overflow-auto whitespace-nowrap scroll-smooth scrollbar-hide pt-3">
            <div className="flex gap-x-2 h-full text-xs justify-left items-center overflow-auto whitespace-nowrap scroll-smooth scrollbar-hide">
              <div className="flex flex-col h-full items-center justify-center">
                <div className={`w-full h-2 bg-gray-300 rounded-lg transition-colors ${completedSteps > 0 ? `bg-[${colors.primary}]` : 'bg-gray-200'}`}
                ></div>
                <span className={`${completedSteps > 0 ? `text-[${colors.primary}] font-black`: `font-light text-gray-400`}`}>Select Plan</span>
              </div> 
              <div className="flex flex-col h-full items-center justify-center">
                <div className={`w-full h-2 bg-gray-300 rounded-lg transition-colors ${completedSteps > 1 ? `bg-[${colors.primary}]` : 'bg-gray-200'}`}
                ></div>
                <span  className={`${completedSteps > 1 ? `text-[${colors.primary}] font-black`: `font-light text-gray-300`}`}>Register</span>
              </div>
              <div className="flex flex-col h-full items-center justify-center">
                <div className={`w-full h-2 bg-gray-300 rounded-lg transition-colors ${completedSteps > 2 ? `bg-[${colors.primary}]` : 'bg-gray-200'}`}
                ></div>
                <span  className={`${completedSteps > 2 ? `text-[${colors.primary}] font-black`: `font-light text-gray-300`}`}>Address</span>
              </div>
              <div className="flex flex-col h-full items-center justify-center">
                <div className={`w-full h-2 bg-gray-300 rounded-lg transition-colors ${completedSteps > 3 ? `bg-[${colors.primary}]` : 'bg-gray-200'}`}
                ></div>
                <span  className={`${completedSteps > 3 ? `text-[${colors.primary}] font-black`: `font-light text-gray-300`}`}>Checkout</span>
              </div> 
              <div className="flex flex-col h-full items-center justify-center">
                <div className={`w-full h-2 bg-gray-300 rounded-lg transition-colors ${completedSteps > 4 ? `bg-[${colors.primary}]` : 'bg-gray-200'}`}
                ></div>
                <span  className={`${completedSteps > 4 ? `text-[${colors.primary}] font-black`: `font-light text-gray-300`}`}>Select Meals</span>
              </div> 
            </div> 
            <div className={`px-4`}>
              <Link legacyBehavior href={`/profile/cart`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-full">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
              </Link>
            </div>

        </div>
      </div>

      {/* web and tablet navbar */}
      <div className= {`${title === "Purchase" ? "" : "hidden"} invisible tablet:visible web:visible fixed top-0 left-0 z-50 bg-white static w-screen h-20 justify-center flex items-center border-b-2 border-gray-200`}>
        <div className="flex items-center justify-center overflow-auto whitespace-nowrap scroll-smooth scrollbar-hide pt-3">
            <div className="flex gap-x-10 h-full text-sm justify-left items-center overflow-auto whitespace-nowrap scroll-smooth scrollbar-hide">
              <div className="flex flex-col h-full w-[6rem] items-center justify-center">
                <div className={`w-full h-2 bg-gray-300 rounded-lg transition-colors ${completedSteps > 0 ? `bg-[${colors.primary}]` : 'bg-gray-200'}`}
                ></div>
                <span  className={`${completedSteps > 0 ? `text-[${colors.primary}] font-black`: `font-light text-gray-400`}`}>Select Plan</span>
              </div> 
              <div className="flex flex-col h-full w-[6rem] items-center justify-center">
                <div className={`w-full h-2 bg-gray-300 rounded-lg transition-colors ${completedSteps > 1 ? `bg-[${colors.primary}]` : 'bg-gray-200'}`}
                ></div>
                <span  className={`${completedSteps > 1 ? `text-[${colors.primary}] font-black`: `font-light text-gray-300`}`}>Register</span>
              </div>
              <div className="flex flex-col h-full w-[6rem] items-center justify-center">
                <div className={`w-full h-2 bg-gray-300 rounded-lg transition-colors ${completedSteps > 2 ? `bg-[${colors.primary}]` : 'bg-gray-200'}`}
                ></div>
                <span  className={`${completedSteps > 2 ? `text-[${colors.primary}] font-black`: `font-light text-gray-300`}`}>Address</span>
              </div>
              <div className="flex flex-col h-full w-[6rem] items-center justify-center">
                <div className={`w-full h-2 bg-gray-300 rounded-lg transition-colors ${completedSteps > 3 ? `bg-[${colors.primary}]` : 'bg-gray-200'}`}
                ></div>
                <span  className={`${completedSteps > 3 ? `text-[${colors.primary}] font-black`: `font-light text-gray-300`}`}>Checkout</span>
              </div> 
              <div className="flex flex-col h-full w-[6rem] items-center justify-center">
                <div className={`w-full h-2 bg-gray-300 rounded-lg transition-colors ${completedSteps > 4 ? `bg-[${colors.primary}]` : 'bg-gray-200'}`}
                ></div>
                <span  className={`${completedSteps > 4 ? `text-[${colors.primary}] font-black`: `font-light text-gray-300`}`}>Select Meals</span>
              </div> 
            </div> 

        </div>
        <div className={`absolute right-[70px]`}> 
          <Link legacyBehavior href={`/profile/cart`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-full">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          </Link>
        </div> 
      </div>
      
      {/* Footer */}
      <div className={`${title === "Purchase" ? "visible" : "invisible"} grid grid-cols-1 border-t-2 h-screen max-h-72`}>
        <div>Slice Asia</div>

      </div>


    </div>
  );
}