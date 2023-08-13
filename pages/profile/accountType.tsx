import { NextPage } from "next";
import Layout from "@components/layout";
import useMutation from "@libs/client/useMutation";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { useForm } from "react-hook-form";
import Input from "@components/input";
import Button from "@components/button";




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

interface GuestForm {
    email: string;
}


const AccountType: NextPage = () => {
    const [addGuest, { loading, data }] = useMutation(`/api/users/guestEnter`);
    const [confirmToken, { loading: tokenLoading, data: tokenData }] = useMutation<MutationResult>("/api/users/confirm");
    const [email, setEmail] = useState("");
    const router = useRouter()
    const { register, handleSubmit, setValue, setError, formState: { errors } } = useForm<UserDetailForm>();

    const onLoginClicked = () => {
        router.push(`/enter`);
    }
    //Create a guest account here.
    // const onGuestClicked = () => {
    //     if (email === "") {
    //         return;
    //     }

    //     addGuest({email});
    //     router.back();
    // }

    const onValid = ({ email }: GuestForm) => {
        if (loading)
            return;

        if (email === ''){
            return setError("formError", {message: "Email is required"});
        }
        addGuest({email});
        router.back();
    }


    return (
        <Layout title="Payment" hasTabBar>
            <div className="px-4 md:px-20 py-4 bg-gray-100">
                <div className="flex flex-col justify-center items-center gap-y-4">
                    <div className="flex flex-col items-center justify-center gap-y-4 py-4 border-b-2 border-orange-500 pb-8" >
                        <span className="text-2xl font-medium">Account Checkout</span>
                        <span>Please login with your account so that you can view or track your order.</span>
                        <button onClick={() => onLoginClicked()} className="w-full rounded-3xl bg-orange-500 hover:bg-orange-600 text-white  px-4 border border-transparent shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:outline-none py-3 text-base">Login or Register</button>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-y-4 mt-6" >
                        <span className="text-2xl">Guest Checkout</span>
                        <div className="flex items-center space-x-4">
                            {/* <label>*Email: </label>
                            <input required={true} value={email} type="text" className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"></input>
                            <button onClick={() => onGuestClicked()} className="w-full rounded-3xl bg-orange-500 hover:bg-orange-600 text-white border border-transparent shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:outline-none py-3 text-base">Checkout as Guest</button> */}
                            <form className="p-4 space-y-4 w-full max-w-[30rem] bg-gray-100" onSubmit={handleSubmit(onValid)}>
                                <div className="flex items-center space-x-4">
                                    <label className="pt-2">*Email: </label>
                                    <Input register={register("email", { required: true })} required label="" name="email" type="text" />
                                </div>
                                <Button text={loading ? "loading..." : "Edit Profile"} />
                            </form>

                        </div>
                    </div>
                </div>
            </div >
        </Layout>
    )
}

export default AccountType;