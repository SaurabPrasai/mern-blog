import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Header from "./components/Header";
import FooterComponent from "./components/Footer";
import { useSelector } from "react-redux";

export default function App() {
  const {currentUser}=useSelector(state=>state.user)
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<About/>}/>
        <Route path="/signin" element={<Signin/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/dashboard" element={currentUser?<Dashboard/>:<Navigate to={'/signin'}/>}/>
        <Route path="/projects" element={<Projects/>}/>
      </Routes>
     <FooterComponent/>
    </BrowserRouter>
  );
}
