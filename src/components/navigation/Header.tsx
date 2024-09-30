import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase/config";
import { Button } from 'keep-react';
import { SignIn } from 'phosphor-react';
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { AlignJustify, CircleUser } from "lucide-react";

import {
    Navbar,
    NavbarCollapse,
    NavbarCollapseBtn,
    NavbarContainer,
    NavbarItem,
    NavbarList,
} from 'keep-react'

interface HeaderProps {
    toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const navigate = useNavigate();
    const db = getFirestore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const userDoc = doc(db, "users", currentUser.uid);
                const docSnapshot = await getDoc(userDoc);
                setUserName(docSnapshot.exists() ? docSnapshot.data()?.name : null);
            } else {
                setUserName(null);
            }
        });
        return () => unsubscribe();
    }, [db]);

    const handleLogout = useCallback(async () => {
        await signOut(auth);
        navigate("/recursos");
    }, [navigate]);


    return (
        <header className="bg-white shadow-md p-2 flex justify-between items-center m-5 rounded-lg">
            <div className="flex items-center space-x-4">
                <button className="sm:hidden" onClick={toggleSidebar}>
                    <AlignJustify className="h-6 w-6 text-gray-800" />
                </button>
                <h1 className="text-xl font-black uppercase hidden xl:block">Bienvenido a WebTools</h1>
            </div>

           {/*  <nav className={`flex-1 pb-3 mt-8 md:block md:pb-0 md:mt-0 ${isMenuOpen ? 'block' : 'hidden'} sm:block`}>
                <ul className="justify-end items-center space-y-6 md:flex md:space-x-6 md:space-y-0">
                    {navigation.map((item, idx) => (
                        <li key={idx} className="text-gray-700 hover:text-indigo-600">
                            <Link to={item.path} className="block">{item.title}</Link>
                        </li>
                    ))}
                    <span className='hidden w-px h-6 bg-gray-300 md:block'></span>
                    <div className='space-y-3 items-center gap-x-6 md:flex md:space-y-0'>
                        {user && user.emailVerified ? (
                            <>
                                <p className="text-gray-700">
                                    <span className='text-gray-800 font-bold flex gap-1 items-center'>
                                        <CircleUser className="w-6 text-gray-900" />
                                        {user.displayName || userName}
                                    </span>
                                </p>
                                <Link to={"/mis-recursos"} className="block text-center text-gray-700 hover:text-indigo-600 border rounded-lg md:border-none">
                                    Mis recursos
                                </Link>
                                <Button onClick={handleLogout} className='text-gray-50 font-bold bg-red-600 hover:bg-red-800'>
                                    <SignIn size={20} className="mr-1.5" />
                                    Cerrar sesión
                                </Button>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link to={"/login"} className="block py-3 text-center text-gray-700 hover:text-indigo-700 border rounded-lg md:border-none">
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link to={"/register"} className="block py-3 px-4 font-medium text-center text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 active:shadow-none rounded-lg shadow md:inline">
                                        Registrate
                                    </Link>
                                </li>
                            </>
                        )}
                    </div>
                </ul>
            </nav> */}

            <Navbar className="py-0 border-0">
                <NavbarContainer className="w-full">
                    <NavbarList>
                        <NavbarItem className="py-2">
                            <Link to={"/acerca-de"} className="w-full py-3 text-center text-gray-700 hover:text-indigo-700 border rounded-lg md:border-none">
                                Acerca de
                            </Link>
                        </NavbarItem>
                        {user && user.emailVerified ? (
                            <>
                                <NavbarItem className="py-2">
                                    <span className='text-gray-800 font-bold flex gap-1 items-center'>
                                        <CircleUser className="w-6 text-gray-900" />
                                        {user.displayName || userName}
                                    </span>
                                </NavbarItem>
                                <NavbarItem className="py-2">
                                    <Link to={"/mis-recursos"} className="block text-center text-gray-700 hover:text-indigo-600 border rounded-lg md:border-none">
                                        Mis recursos
                                    </Link>
                                </NavbarItem>
                                <NavbarItem className="py-0 hover:bg-white">
                                    <Button onClick={handleLogout} className='text-gray-50 font-bold bg-red-600 hover:bg-red-800'>
                                        <SignIn size={20} className="mr-1.5" />
                                        Cerrar sesión
                                    </Button>
                                </NavbarItem>
                            </>
                        ) : (
                            <>
                                <NavbarItem className="py-0">
                                    <Link to={"/login"} className="block py-2 text-center text-gray-700 hover:text-indigo-700 border rounded-lg md:border-none">
                                        Login
                                    </Link>
                                </NavbarItem>
                                <NavbarItem className="py-2" active>
                                    <Link to={"/register"} className="w-full font-medium text-center text-white">
                                        Registrate
                                    </Link>
                                </NavbarItem>
                            </>
                        )}
                    </NavbarList>
                    <NavbarCollapseBtn className="bg-gray-900 rounded"/>
                    <NavbarCollapse className="w-auto p-3">
                        <NavbarItem>
                            <Link to={"/acerca-de"} className="w-full text-center text-gray-800 hover:text-indigo-700">
                                Acerca de
                            </Link>
                        </NavbarItem>
                        {user && user.emailVerified ? (
                            <>
                                <NavbarItem>
                                    <span className='text-gray-800 font-bold flex gap-1 items-center'>
                                        <CircleUser className="w-6 text-gray-800" />
                                        {user.displayName || userName}
                                    </span>
                                </NavbarItem>
                                <NavbarItem>
                                    <Link to={"/mis-recursos"} className="block text-center text-gray-800 hover:text-indigo-600">
                                        Mis recursos
                                    </Link>
                                </NavbarItem>
                                <NavbarItem>
                                    <Button onClick={handleLogout} className='text-gray-50 font-bold bg-red-600 hover:bg-red-800'>
                                        <SignIn size={20} className="mr-1.5" />
                                        Cerrar sesión
                                    </Button>
                                </NavbarItem>
                            </>
                        ) : (
                            <>
                                <NavbarItem>
                                    <Link to={"/login"} className="w-full text-center text-gray-700 hover:text-indigo-700">
                                        Login
                                    </Link>
                                </NavbarItem>
                                <NavbarItem active>
                                    <Link to={"/register"} className="w-full font-medium text-center text-white">
                                        Registrate
                                    </Link>
                                </NavbarItem>
                            </>
                        )}                   
                    </NavbarCollapse>
                </NavbarContainer>
            </Navbar>
        </header>
    );
};

export default Header;
