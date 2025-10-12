import React from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from './Routes/NavBar';
import HeroSection from "./main_files/herosection";
import FeaturedArticles from "./main_files/featuredarticles";
import Tutorials from "./main_files/tutorial";
import Subscribe from "./main_files/subscribe";
import Footer from "./main_files/footer";
import Login from './Routes/Login';
import SignUp from './Routes/Sign-up';
import Plan from './Routes/Plan';
import Payment from './Routes/Payment';
import PostEditorRoute from './Routes/PostEditor';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={
          <>
            <NavBar />
            <HeroSection />
            <FeaturedArticles />
            <Tutorials />
            <Subscribe />
            <Footer />
          </>
        } />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
  <Route path="/pricing" element={<Plan />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/editor" element={<PostEditorRoute />} />
      </Routes>
    </div>
  );
}

export default App;
