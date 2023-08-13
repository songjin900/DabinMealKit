import type { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect, useState } from "react";
import { Product } from "@prisma/client";
import { useRouter } from "next/router";
import Image from "next/image";

interface UploadProductForm {
  name: string;
  price: number;
  description: string;
  category: string[];
  preStockQuantity: number;
  photo: FileList;
  photoTwo: FileList;
  photoThree: FileList;
}

interface UploadProductMutation {
  ok: boolean;
  product: Product;
}



const Upload: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit, watch } = useForm<UploadProductForm>();
  const [uploadProduct, { loading, data }] = useMutation<UploadProductMutation>("/api/products")

  const uploadFile = async (file: FileList, name: string) => {
    const { uploadURL } = await (await fetch('/api/files')).json();
    const form = new FormData();
    form.append('file', file[0], name);
    const { result: { id } } = await (await fetch(uploadURL, { method: 'POST', body: form })).json();
    return id;
  };

  const onValid = async ({ name, price, description, preStockQuantity }: UploadProductForm) => {
    if (loading)
      return;

    let imageArray = [];
    let photoId = null;

    if (photo && photo.length > 0) {
      photoId = await uploadFile(photo, name);
      imageArray.push({photoId: photoId , orderIndex: 1});
    }

    if (photoTwo && photoTwo.length > 0) {
      const id = await uploadFile(photoTwo, name);
      imageArray.push({photoId:id, orderIndex: 2});
    }

    if (photoThree && photoThree.length > 0) {
      const id = await uploadFile(photoThree, name);
      imageArray.push({photoId:id, orderIndex:3});
    }

    uploadProduct({
      name,
      price,
      description,
      preStockQuantity,
      photoId,
      photos: imageArray
    });
  }
  useEffect(() => {
    if (data?.ok) {
      router.push(`/products/${data?.product.id}`);
    }
  }, [data, router]);

  const photo = watch("photo");
  const photoTwo = watch("photoTwo");
  const photoThree = watch("photoThree");
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoTwoPreview, setPhotoTwoPreview] = useState("");
  const [photoThreePreview, setPhotoThreePreview] = useState("");

  useEffect(() => {
    if (photo && photo.length > 0) {
      const file = photo[0];
      setPhotoPreview(URL.createObjectURL(file));
    }
  }, [photo]);

  useEffect(() => {
    if (photoTwo && photoTwo.length > 0) {
      const file = photoTwo[0];
      setPhotoTwoPreview(URL.createObjectURL(file));
    }
  }, [photoTwo]);

  useEffect(() => {
    if (photoThree && photoThree.length > 0) {
      const file = photoThree[0];
      setPhotoThreePreview(URL.createObjectURL(file));
    }
  }, [photoThree]);

  return (
    <Layout canGoBack title="Upload Product">
      <div className="flex justify-center">
        <form className="p-4 space-y-4 w-full max-w-[30rem] bg-gray-100" onSubmit={handleSubmit(onValid)}>
          <h1>Main Image</h1>
          <div>
            {
              photoPreview ? (<Image
                src={photoPreview}
                className="w-full text-gray-600 rounded-md"
                alt=""
                height={150}
                width={150}
              />) : (

                <label className="w-full cursor-pointer text-gray-600 hover:border-orange-500 hover:text-orange-500 flex items-center justify-center border-2 border-dashed border-gray-300 h-48 rounded-md">
                  <svg
                    className="h-12 w-12"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <input {...register("photo")} accept="image/*" className="hidden" type="file" />
                </label>
              )}
          </div>
          <div>
            {
              photoTwoPreview ? (<Image
                src={photoTwoPreview}
                className="w-full text-gray-600 rounded-md"
                alt=""
                height={150}
                width={150}
              />) : (

                <label className="w-full cursor-pointer text-gray-600 hover:border-orange-500 hover:text-orange-500 flex items-center justify-center border-2 border-dashed border-gray-300 h-48 rounded-md">
                  <svg
                    className="h-12 w-12"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <input {...register("photoTwo")} accept="image/*" className="hidden" type="file" />
                </label>
              )}
          </div>
          <div>
            {
              photoThreePreview ? (<Image
                src={photoThreePreview}
                className="w-full text-gray-600 rounded-md"
                alt=""
                height={150}
                width={150}
              />) : (

                <label className="w-full cursor-pointer text-gray-600 hover:border-orange-500 hover:text-orange-500 flex items-center justify-center border-2 border-dashed border-gray-300 h-48 rounded-md">
                  <svg
                    className="h-12 w-12"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <input {...register("photoThree")} accept="image/*" className="hidden" type="file" />
                </label>
              )}
          </div>
          <Input register={register("name", { required: true })} required label="Name" name="name" type="text" />
          <Input
            required
            register={register("price", { required: true })}
            label="Price"
            name="price"
            type="text"
            kind="price"
          />
          <Input register={register("category", { required: true })}
            label="Category"
            name="category"
            type="text"
            kind="category"
          />
          <Input register={register("preStockQuantity", { required: true })}
            label="Qty"
            name="preStockQuantity"
            type="number"
            kind="number"
          />

          <TextArea register={register("description", { required: true })} name="description" label="Description" />
          <Button text={loading ? "loading..." : "Upload Product"} />
          {/* <>
            <div className="flex items-center mb-4">
              <input type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              <label htmlFor="default-checkbox" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Default checkbox</label>
            </div>
            <div className="flex items-center">
              <input checked id="checked-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              <label htmlFor="checked-checkbox" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Checked state</label>
            </div>
          </> */}
        </form>
      </div>
    </Layout>
  );
};

export default Upload;