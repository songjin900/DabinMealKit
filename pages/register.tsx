import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import Button from "@components/button";
import Link from "next/link";
import Input from "@components/input";
import ContentCard from "@components/contentCard";
import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";
import Layout from "@components/layout";
import useSWR from "swr"


interface EnterForm {
  email?: string;
  phone?: string
}

interface TokenForm {
  token: string;
}

interface MutationResult {
  ok: boolean;
}

const Enter: NextPage = () => {
  const router = useRouter();
  const passwordRef = useRef(null);
  const passwordLabelRef = useRef(null);
  const normalLogInRef = useRef(null); 
  const noPasswordLogInRef = useRef(null); 

  const [enter, { loading, data, error }] = useMutation<MutationResult>("/api/users/enter");
  const [confirmToken, { loading: tokenLoading, data: tokenData }] = useMutation<MutationResult>("/api/users/confirm");
  const { register, watch, reset, handleSubmit } = useForm<EnterForm>();
  const { register: tokenRegister, handleSubmit: tokenHandleSubmit } = useForm<TokenForm>()
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [submitType, setSubmitType] = useState("update");
  const [buttonDisabled, setButtonDisabled] = useState(false);


  const { data: userData, error: userError } = useSWR("/api/users/me");

  
  const handlePasswordVisibilityToggle = () => {
    const password = passwordRef.current;
    const passwordLabel = passwordLabelRef.current;

    //error note
    //error because passsword is potentially null. 
    //something to do with useRef i guess? 

    if (password.type === 'password') {
      password.type = 'text';
      passwordLabel.innerHTML = 'hide';
    } else {
      password.type = 'password';
      passwordLabel.innerHTML = 'show';
    }
    password.focus();
  };

  const handleLogInWithoutPasswordClicked = () => {
    const normalLogInForm = normalLogInRef.current;
    const noPasswordLogInForm = noPasswordLogInRef.current; 
    if(normalLogInForm.className === "hidden"){
      normalLogInForm.className='mt-5'; 
      noPasswordLogInForm.className='hidden'
    } else{
      normalLogInForm.className='hidden'; 
      noPasswordLogInForm.className='mt-5'
    }
  }


  
  

  const onLogInClicked = () => {
    setSubmitType("login");
  }

  useEffect(() => {
      if (submitType === "login") {
          router.push(`/`);
      }
  }, [router, submitType])

  const onEmailClick = () => {
    reset();
    setMethod("email")
  };
  const onPhoneClick = () => {
    reset();
    setMethod("phone")
  };

  const onValid = (validForm: EnterForm) => {
    if (loading) return;
    enter(validForm)
  }

  const onTokenValid = (validForm: TokenForm) => {
    if (tokenLoading) return;
    confirmToken(validForm)
  }

  useEffect(() => {
    if (tokenData?.ok) {
      router.push("/")
    }
  }, [tokenData, router])

  useEffect(() => {
    if (userData && userData.ok) {
      router.replace("/profile")
    }
  }, [userData, router])



  const onSignUpClicked = () => {
      setSubmitType("signup");
  }

  useEffect(() => {
      if (submitType === "signup") {
          router.push(`/`);
      }
  }, [router, submitType])


  return (
    <Layout hasTabBar title="Purchase">
      <div className="">
        <div className="flex flex-row pt-[100px] pb-10 bg-gray-100 justify-center lgweb:grid lgweb:grid-cols-2 lgweb:pl-[100px]">

          {/* left side - login form */}
          <div className="flex flex-col basis-[450px] max-w-[450px]  bg-white border-2 place-self-center lgweb:min-w-[450px]">
            <div className="mx-[1px] p-[24px]">
              <h3 className="text-3xl font text-center">Log in</h3>
              {/* normal password login form */}
              <div className={`mt-5`} ref={normalLogInRef}>
                <form className="bg-white pt-6 pb-8">
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                    <input className="appearance-none border-2 rounded-sm text-sm w-full py-3 px-3 leading-tight border-gray-300 bg-gray-100 focus:outline-none focus:border-indigo-700 focus:bg-white text-gray-700 pr-16" id="username" type="text" placeholder="Email" />
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 right-0 flex items-center px-2">
                        <input className="hidden js-password-toggle" id="toggle" type="checkbox" />
                        <label ref={passwordLabelRef} onClick={handlePasswordVisibilityToggle} className="bg-gray-300 hover:bg-gray-400 rounded px-2 py-1 text-sm text-gray-600 cursor-pointer" for="toggle" >show</label>
                      </div>
                      <input ref={passwordRef}  className="appearance-none border-2 text-sm rounded-sm w-full py-3 px-3 leading-tight border-gray-300 bg-gray-100 focus:outline-none focus:border-indigo-700 focus:bg-white text-gray-700 pr-16" id="password" type="password" autocomplete="on" placeholder="Password" />
                    </div>
                    {/* replace with <Link> later */}
                    <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">Forgot Password?</a> 

                  </div>
                  <div className="flex items-center justify-between">
                    <button onClick={onLogInClicked} disabled={buttonDisabled} className={`w-full bg-[#3A4884]  hover:bg-[#5246BA]  text-white px-4 border border-transparent rounded-sm text-base shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-3A4884  focus:outline-none py-2 text-sm ${buttonDisabled ? `bg-gray-300 hover:bg-gray-300` : `bg-[#3A4884]`}`}>Log in</button>

                  </div>
                </form>
                <div className="relative">
                    <div className="absolute w-full border-t border-gray-300" />
                    <div className="relative -top-3 text-center ">
                      <span className="bg-white px-2 text-sm text-gray-500">
                        or
                      </span>
                    </div>
                  </div>
                <button
                  onClick={handleLogInWithoutPasswordClicked}
                  disabled={buttonDisabled}
                  className={`w-full bg-[#FFFFFF]  hover:bg-[#5246BA] hover:text-[#FFFFFF] text-[#3A4884] px-4 border border-[#3A4884] rounded-sm shadow-sm text-base font-medium focus:ring-2 focus:ring-offset-2 focus:ring-3A4884  focus:outline-none py-2 text-sm ${
                    buttonDisabled ? `bg-gray-300 hover:bg-gray-300` : `bg-[#3A4884]`
                  }`}
                >Log in without password
                </button>

                <div className="mt-[100px]">
                  <div className="grid grid-rows-2 mt-2 gap-3">
                    <button className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-sm shadow-sm bg-white text-base font-medium text-gray-500 hover:bg-gray-50 gap-[50px]">
                      <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                      <span> Log in with Google </span>
                    </button> 
                    <button className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-sm shadow-sm bg-white text-base font-medium text-gray-500 hover:bg-gray-50 gap-[50px]">
                      <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span> Log in with Facebook </span>
                    </button>
                  </div>
                  <div className="flex flex-row w-full mt-10 justify-center px-1"> 
                      <p> Don't have an account? </p>
                      <Link legacyBehavior href={`/enter`}>
                          <div className="flex h-full items-center pl-5">
                              <span onClick={onSignUpClicked} className="underline underline-offset-1 text-[#3A4884]">Sign up</span>
                          </div>
                      </Link>
                    </div>
                </div>
              </div>

              {/* no password login form */}
              <div className={`hidden`} ref={noPasswordLogInRef}>
                {data?.ok ?
                  <form onSubmit={tokenHandleSubmit(onTokenValid)} className="flex flex-col mt-8 space-y-4">
                    <Input
                      register={tokenRegister("token"
                      )}
                      name="token"
                      label="Confirmation Token"
                      type="number"
                      required
                    />
                    <Button text={tokenLoading ? "Loading" : "Confirm Token"} />
                  </form> :
                  <>
                    <div className="flex flex-col items-center">
                      <h5 className="text-sm text-gray-500 font-medium">Enter using:</h5>
                      <div className="grid  border-b  w-full mt-8 grid-cols-2 ">
                        <button
                          className={cls(
                            "pb-4 font-medium text-sm border-b-2",
                            method === "email"
                              ? " border-orange-500 text-orange-400"
                              : "border-transparent hover:text-gray-400 text-gray-500"
                          )}
                          onClick={onEmailClick}
                        >
                          Email
                        </button>
                        <button
                          className={cls(
                            "pb-4 font-medium text-sm border-b-2",
                            method === "phone"
                              ? " border-orange-500 text-orange-400"
                              : "border-transparent hover:text-gray-400 text-gray-500"
                          )}
                          onClick={onPhoneClick}
                        >
                          Phone
                        </button>
                      </div>
                    </div>
                    <form onSubmit={handleSubmit(onValid)} className="flex flex-col mt-8 space-y-4">
                      {method === "email" ? (
                        <Input
                          register={register("email"
                          )}
                          name="email"
                          label="Email address"
                          type="email"
                          required
                        />
                      ) : null}
                      {method === "phone" ? (
                        <Input
                          register={register("phone")}
                          name="phone"
                          label="Phone number"
                          type="number"
                          kind="phone"
                          required
                        />
                      ) : null}
                      {method === "email" ? <Button text={"Get login link"} /> : null}
                      {method === "phone" ? (
                        <Button text={loading ? "Loading" : "Get one-time password"} />
                      ) : null}
                    </form>
                  </>}
                  <div className="mt-5"> 
                    <a onClick={handleLogInWithoutPasswordClicked} className="underline cursor-pointer">Go back</a>
                  </div> 


              </div>
            </div>
          </div>


          {/* right side - only viewed over 1200px screen */}
          <div className="hidden font-2xl text-black lgweb:block lgweb:place-self-center">
            <ContentCard 
              text="Original recipe"
              subtext = "Authentic taste of Asia and a variety of fusion recipes every week, all inspired in Asia"
              srcSet = "https://imagedelivery.net/3acOXCfy_eb2FQ3SxlSAMw/25eecf4c-6448-4f6c-d7bc-a80d0064d600/contentCardMobile 360w https://imagedelivery.net/3acOXCfy_eb2FQ3SxlSAMw/25eecf4c-6448-4f6c-d7bc-a80d0064d600/contentCardWeb 240w"
              src = "https://imagedelivery.net/3acOXCfy_eb2FQ3SxlSAMw/25eecf4c-6448-4f6c-d7bc-a80d0064d600/contentCardMobile"
            ></ContentCard>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default Enter;