import { NextPage } from "next";
import Layout from "@components/layout";
import { Cart, Product, User } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { cls } from "@libs/client/utils";
import useSWR, { useSWRConfig } from "swr";
import useMutation from "@libs/client/useMutation";
import { useEffect, useState,useRef } from "react";
import ImageSlides from "@components/imageSlider";


interface ProductWithUser extends Product {
    user: User;
}

interface ItemDetailResponse {
    ok: boolean,
    product: ProductWithUser;
    relatedProducts: Product[];
    isLiked: boolean;
}

interface WriteForm {
    question: string;
}

interface ItemInCartResponse {
    ok: boolean,
    cart: Cart,
    message: string
}

const ItemDetail: NextPage = () => {
    const router = useRouter()
    const { data, mutate: boundMutate } = useSWR<ItemDetailResponse>(router.query.id ? `/api/products/${router.query.id}` : null)
    const [buttonDisabled, setButtonDisabled] = useState(false);

    useEffect(() => {
        setButtonDisabled(data?.product?.preStockQuantity === 0 || data?.product?.actualStockQuantity === 0 ? true : false)
    }, [data?.product?.preStockQuantity])

    const [toggleFav] = useMutation(`/api/products/${router.query.id}/fav`);
    const onFavClick = () => {
        toggleFav({})
        if (!data)
            return;

        boundMutate((prev: any) => prev && { ...prev, isLiked: !prev.isLiked }, false);
    }

    const [addToCart, { loading: cartLoading, data: cart }] = useMutation<ItemInCartResponse>(`/api/products/${router.query.id}/cart`);

    const [cartQuantity, setCartQuantity] = useState(1);

    const onQtyDecreaseClicked = () => {
        if (data?.product?.preStockQuantity && cartQuantity - 1 > 0) {
            setCartQuantity(cartQuantity - 1);
        }
    }

    const onQtyIncreaseClicked = () => {
        if (data?.product?.preStockQuantity && cartQuantity + 1 <= data?.product?.preStockQuantity)
            setCartQuantity(cartQuantity + 1);
    }

    const onAddToCartClick = () => {
        if (cartLoading)
            return;
        addToCart({ cartQuantity, id: router.query.id });
    }

    //postData
    useEffect(() => {
        if (cartLoading)
            return;

        if (cart?.ok) {
            router.push(`/profile/cart`);
        }
        else if (cart?.message === "redirect") {
            router.push(`/profile/accountType`);
        }
    }, [cart, cartLoading, router])

    const div1Ref = useRef(null);
    const div2Ref = useRef(null);

    useEffect(() => {
        const div1Width = div1Ref.current.offsetWidth;
        div2Ref.current.style.width = `${div1Width}px`;
      }, []);
    
    return (
        <Layout title="Selected Flower" hasTabBar >
            <div className="flex flex-col items-center">
                <div className="px-4 py-4 w-full bg-gray-100">
                    <div className="flex flex-col items-center lg:items-start lg:flex-row lg:justify-center lg:space-x-5">


                        {/* <div className="bg-gray-600 md:bg-red-300 w-full h-[30rem] max-w-[30rem] m-1" /> */}

                        {/* <Image
                            src={`https://imagedelivery.net/F5uyA07goHgKR71hGfm2Tg/${data?.product.image}/public`}
                            className="bg-white mb-3"
                            height={400}
                            width={400}
                            alt={""} /> */}

                        <div ref={div2Ref} className="w-full sm:w-1/2">
                            <ImageSlides></ImageSlides>
                        </div>
                        <div ref={div1Ref} className="flex flex-col w-full lg:w-full max-w-[30rem] lg:h-[30rem] lg:justify-between">
                            <div className="flex flex-col pl-3 space-y-2 lg:w-full lg:p-1">
                                <span className="font-bold text-3xl">{data?.product?.name}</span>
                                <span className="text-lg">Model: sunflower-2-1</span>
                                <span className="text-2xl">${data?.product?.price}</span>
                                <span className={`text-lg ${data && data?.product?.preStockQuantity > 10 ? `hidden` : `block`}`}>Availability: {data?.product?.preStockQuantity}</span>

                                <p>{data?.product?.description}</p>
                            </div>
                            <div className="mt-3 p-1 border-t-2 border-gray-300">
                                <div className="flex items-center gap-x-2 m-3">
                                    <span className="text-lg">Qty: </span>
                                    <button onClick={onQtyDecreaseClicked}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </button>
                                    <span className="text-lg">{cartQuantity}</span>
                                    <button onClick={onQtyIncreaseClicked}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex items-center justify-between space-x-2">
                                    <button
                                        onClick={onAddToCartClick}
                                        disabled={buttonDisabled}
                                        className={`w-full ${buttonDisabled ? `bg-gray-500` : `bg-orange-500 hover:bg-orange-600`}  text-white  px-4 border border-transparent 
                                        rounded-md shadow-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 
                                        focus:outline-none py-2 text-sm `}>Add To Cart</button>
                                    <button
                                        onClick={onFavClick}
                                        className={cls(
                                            "p-3 rounded-md flex items-center hover:bg-gray-100 justify-center ",
                                            data?.isLiked
                                                ? "text-red-500  hover:text-red-600"
                                                : "text-gray-400  hover:text-gray-500"
                                        )}
                                    >
                                        {data?.isLiked ? (
                                            <svg
                                                className="w-6 h-6"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                        ) : (
                                            <svg
                                                className="h-6 w-6 "
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="w-full flex flex-col items-center">
                    <h2 className={cls("text-2xl font-bold my-4 text-gray-900", data?.relatedProducts.length === 0 ? "hidden" : "block")}>Similar items</h2>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                        {data?.relatedProducts.map((product) => (
                            <Link key={product.id} href={`/products/${product.id}`}>
                                <div key={product.id} className="bg-red-300 p-2 rounded-xl flex flex-col items-center">
                                    <div className="h-56 w-52 mb-4 bg-slate-700" />
                                    <h3 className="text-gray-700 -mb-1">{product.name}</h3>
                                    <span className="text-sm font-medium text-gray-900">${product.price}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div> */}
            </div>
        </Layout>
    )
}

export default ItemDetail;