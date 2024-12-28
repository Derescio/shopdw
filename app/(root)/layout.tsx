import type { Metadata } from "next";
import '@/assets/styles/globals.css';
import { APP_NAME, APP_DESCRIPTION, SERVER_URL } from "@/lib/constatnts";
import Header from "@/components/shared/header";
import Footer from "@/components/footer";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <div className="flex h-screen flex-col">
                <Header />
                <main className="flex-1 wrapper">
                    {children}
                </main>
                <Footer />
            </div>

        </>
    );
}
