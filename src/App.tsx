import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
//import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddResource from "./pages/resources/AddResource";
import EditResource from "./pages/resources/EditResources";
import About from "./pages/About";
import MyResources from "./pages/resources/MyResources";
import PrivateRoute from "./hooks/useProtectedRoute";
import LayoutContent from "./layout/LayoutContent";
import ListResource from "./pages/resources/ListResource";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";

/* function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/recursos" element={<LayoutContent/>} />
                <Route path="/acerca-de" element={<About />} />
                <Route path="/mis-recursos" element={<PrivateRoute><MyResources /></PrivateRoute>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/register" element={<Register />} />
                <Route path="/agregar-recurso" element={<PrivateRoute><AddResource /></PrivateRoute>} />
                <Route path="/editar-recurso/:id" element={<PrivateRoute><EditResource /></PrivateRoute>} />
            </Routes>
        </Router>
    );
}

export default App; */


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LayoutContent />}>
                    <Route index element={<Home />} />
                    <Route path="recursos" element={<ListResource />} />
                    <Route path="acerca-de" element={<About />} /> 
                    <Route path="login" element={<Login />} /> 
                    <Route path="register" element={<Register />} /> 
                    <Route path="mis-recursos" element={<PrivateRoute><MyResources /></PrivateRoute>} />
                    <Route path="agregar-recurso" element={<PrivateRoute><AddResource /></PrivateRoute>} />
                    <Route path="editar-recurso/:id" element={<PrivateRoute><EditResource /></PrivateRoute>} />
                </Route>
            </Routes>
            <Toaster position="top-center" reverseOrder={false} />
        </Router>
    );
}

export default App; 