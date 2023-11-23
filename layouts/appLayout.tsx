import React from "react";
import Head from "next/head";
import { useLogin } from "@/hooks/useLogin";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/sidebar";
import { Inter } from "next/font/google";
import { Image } from "@nextui-org/react";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
});

function AppLayout({ children }: any) {
    useLogin();

    return (
        <div>
            <Head>
                <title>Rhyme</title>
            </Head>

            <div className={`bg-[#121212] ${inter.className}`}>
                <div className="flex flex-row h-screen w-screen max-w-full">
                    <Image
                        src="/bg-gradient.png"
                        className="fixed dark:opacity-70 -top-[40%] -right-[30%] mobile:-right-[10%] mobile:-top-0 tablet:-right-[10%] tablet:-top-0 z-0 rotate-12"
                    />

                    <Sidebar />
                    <div className="h-screen scroll overflow-y-scroll">
                        <Navbar />
                        <div
                            className="relative w-[calc(100vw_-_14rem)] 
                    mini-laptop:w-[calc(100vw_-_55px)] tablet:w-screen mobile:w-screen"
                        >
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AppLayout;
