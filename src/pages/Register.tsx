import { FormEvent, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithPopup } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, googleProvider } from "../firebase/config";
import InputField from "../components/form/InputField";
import { Mail, UsersRound, Lock} from "lucide-react";
import IconGoogle from "../icons/google.svg";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Spinner from "../components/common/Spinner";

import toast from "react-hot-toast";



const Register = () => {
    const [user, loading] = useAuthState(auth);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState(""); 
    const navigate = useNavigate();

    useEffect(() => {
        if (user ) {
            navigate("/login");
        }
    }, [user, navigate]);

    const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                name,
                email
            });

            if (user) {
                await sendEmailVerification(user);
                showVerificationToast();
                //toast.success("Te hemos enviado un correo de verificación. Revisa tu bandeja de entrada o Spam.");
                //alert("Te hemos enviado un correo de verificación. Por favor revisa tu bandeja de entrada.");
            }
            await auth.signOut();

            navigate("/login");
        } catch (error: any) {
            console.error("Error registering:", error);
            if (error.code === "auth/email-already-in-use") {
                setError("El email ya está registrado. Por favor, intenta con otro.");
            } else {
                setError("Hubo un error al registrar la cuenta. Inténtalo de nuevo.");
            }
        }
    };

    const handleGoogleRegister = async () => {
        try {
            const userCredential = await signInWithPopup(auth, googleProvider);
            const user = userCredential.user;

            const userRef = collection(db, "users");
            const q = query(userRef, where("uid", "==", user.uid));
            const existingUser = await getDocs(q);
            if (existingUser.empty) {
                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    name: user.displayName,
                    email: user.email,
                });
            }
            else {
                console.log("El usuario ya existe");
            }
            navigate("/recursos");
        } catch (error) {
            console.error("Error with Google register:", error);
        }
    };


    if (loading) return <Spinner />;

    const showVerificationToast = () => {
        toast(
            <div className="flex flex-col justify-center">
                <span>Te hemos enviado un correo de verificación. Revisa tu bandeja de entrada o Spam.</span>
                <button
                    onClick={() => toast.dismiss()}
                    className="block mt-3 bg-indigo-600 text-white py-2 rounded"
                >
                    OK
                </button>
            </div>,
            {
                duration: 10000,
            }
        );
    };

    
    return (
        <section className="w-full flex flex-col items-center justify-center p-4">

            <div className="w-full lg:w-1/2 text-gray-800 space-y-8 bg-white px-10 py-8 rounded-lg shadow md:mt-6">
                <div className="text-center">
                    <div className="mt-5 space-y-2">
                        <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">Crear una cuenta</h3>
                        <p>¿Ya tienes una cuenta?
                            <Link to={"/login"} className="font-medium text-indigo-600 hover:text-indigo-500 ps-1">Iniciar sesion</Link>
                        </p>
                    </div>
                </div>
                <form onSubmit={handleRegister}>
                    {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                     <InputField
                        type="text"
                        placeholder="Escribe tu nombre completo..."
                        Icon={UsersRound}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <InputField
                        type="email"
                        placeholder="Escribe tu email..."
                        Icon={Mail}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <InputField
                        type="password"
                        placeholder="Escribe tu password..."
                        Icon={Lock}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                        
                    <button className="w-full mt-4 px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150">
                        Registrarse
                    </button>
                </form>
                <div className="relative">
                    <span className="block w-full h-px bg-gray-300"></span>
                    <p className="inline-block w-fit text-sm bg-white px-2 absolute -top-2 inset-x-0 mx-auto">Or continue with</p>
                </div>
                <div className="space-y-4 text-sm font-medium">
                    <button onClick={handleGoogleRegister} className="w-full flex items-center justify-center gap-x-3 py-2.5 border rounded-lg  shadow-lg">
                        <img src={IconGoogle} className="w-5 h-5" alt="icono de google" />
                        Continue with Google
                    </button>
                </div>
            </div>
            
        </section>
    );
};

export default Register;
