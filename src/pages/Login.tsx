import { FormEvent, useEffect, useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, googleProvider } from "../firebase/config";
import InputField from "../components/form/InputField";
import { Lock, Mail } from "lucide-react";
import IconGoogle from "../icons/google.svg";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Spinner from "../components/common/Spinner";

const Login = () => {

    const [user, loading] = useAuthState(auth);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState(""); 

    useEffect(() => {
        if (user && user.emailVerified) {
            navigate("/recursos");
        }
    }, [user, navigate]);

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        try {

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;


            if (user.emailVerified) {
                navigate("/recursos");
            } else {
                setError("Por favor verifica tu correo antes de iniciar sesión.");
                await signOut(auth);
            } 

        } catch (error) {
            console.error("Error logging in:", error);
            setError("Credenciales incorrectas. Por favor, intenta de nuevo.");
        }
    };


    const handleGoogleLogin = async () => {
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

            navigate("/recursos");
        } catch (error) {
            console.error("Error with Google register:", error);
            setError("Hubo un problema con el inicio de sesión de Google.");
        }
    };

    if (loading) return <Spinner />; 

    return (
        <section className="w-full flex flex-col items-center justify-center p-4">
            <div className="w-full md:w-1/3 text-gray-800 space-y-8 bg-white px-10 py-8 rounded-lg shadow md:mt-12">
                <div className="text-center">
                    <div className="mt-5 space-y-2">
                        <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">Acceda a su cuenta</h3>
                        <p>¿No tiene una cuenta?
                            <Link to={"/register"} className="font-medium text-indigo-600 hover:text-indigo-500 ps-1">Crear cuenta</Link>
                        </p>
                    </div>
                </div>
                <form onSubmit={handleLogin}>
                    {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
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
                        Iniciar sesion
                    </button>
                </form>
                <div className="relative">
                    <span className="block w-full h-px bg-gray-300"></span>
                    <p className="inline-block w-fit text-sm bg-white px-2 absolute -top-2 inset-x-0 mx-auto">Or continue with</p>
                </div>
                <div className="space-y-4 text-sm font-medium">
                    <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-x-3 py-2.5 border rounded-lg shadow-lg">
                        <img src={IconGoogle} className="w-5 h-5" alt="icono de google" />
                        Continue with Google
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Login;
