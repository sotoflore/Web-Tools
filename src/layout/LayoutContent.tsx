import { useState } from "react";
import { Outlet, useSearchParams } from "react-router-dom";
import Sidebar from "../components/navigation/Sidebar";
import Header from "../components/navigation/Header";


const LayoutContent = () => {
    const [searchParams] = useSearchParams();
    const category = searchParams.get("category") || "";

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };


    return (
        <main className="flex h-screen bg-gray-950">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} currentCategory={category} />
            <section className="flex flex-col flex-grow bg-gray-200 md:rounded-[11px] md:my-3 md:me-3 overflow-y-auto">
                <Header toggleSidebar={toggleSidebar} />
                <div className="">
                    <Outlet /> 
                </div>
            </section>
        </main>
    );
};

export default LayoutContent;
