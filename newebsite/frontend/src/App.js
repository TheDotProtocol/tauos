import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { WhyTauCore } from "./components/WhyTauCore";
import { DeveloperCTA } from "./components/DeveloperCTA";
import { Footer } from "./components/Footer";

// Pages
import { Apps } from "./pages/Apps";
import { Download } from "./pages/Download";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Community } from "./pages/Community";
import { Support } from "./pages/Support";
import { Developers } from "./pages/Developers";
import { Docs } from "./pages/Docs";
import { DocViewer } from "./pages/DocViewer";
import { TauScript } from "./pages/TauScript";
import { TauBrowser } from "./pages/TauBrowser";
import { Privacy } from "./pages/Privacy";
import { Terms } from "./pages/Terms";
import { Security } from "./pages/Security";

const Home = () => {
  return (
    <div className="App">
      <Header />
      <main>
        <Hero />
        <Features />
        <WhyTauCore />
        <DeveloperCTA />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apps" element={<Apps />} />
        <Route path="/download" element={<Download />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/community" element={<Community />} />
        <Route path="/support" element={<Support />} />
        <Route path="/developers" element={<Developers />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/docs/:docName" element={<DocViewer />} />
        <Route path="/tauscript" element={<TauScript />} />
        <Route path="/taubrowser" element={<TauBrowser />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/security" element={<Security />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;