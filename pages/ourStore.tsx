import type { NextPage } from "next";
import Layout from "@components/layout";

const OurStore: NextPage = () => {
  return (
    <Layout hasTabBar title="Profile">
      <div className="bg-gray-100 w-full p-2 md:min-h-[38rem]">
        <div className="max-w-3xl mx-auto py-8 px-4 md:px-8">
          <h1 className="text-3xl font-bold text-center mb-6">
            Welcome to Sunny&apos;s Express
          </h1>
          <p className="text-lg text-center mb-8">
            Location: 885 Hamilton Road, London, Ontario
          </p>
          <p className="text-center mb-8">
            At Sunny&apos;s Express, we specialize in customized flower arrangements and reliable delivery services. With a genuine passion for flowers, our talented team is dedicated to bringing your floral visions to life and creating memorable moments. Whether you&apos;re celebrating a joyous occasion, expressing your deepest emotions, or simply looking to brighten someone&apos;s day, Sunny&apos;s Express is here to make it special. Visit us today and experience the beauty of personalized floral creations that are crafted with care and delivered with love.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default OurStore;
