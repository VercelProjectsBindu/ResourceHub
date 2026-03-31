import React from 'react';
import Header from '../components/header/Header';
import Hero from '../components/hero/Hero';
import Capabilities from '../components/capabilities/Capabilities';
import Projects from '../components/projects/Projects';
import Contact from '../components/contact/Contact';
import Footer from '../components/footer/Footer';
import BackToTop from '../components/ui/BackToTop';

const LandingPage = () => (
  <div className="min-h-screen selection:bg-primary/30">
    <Header />
    <Hero />
    <Capabilities />
    <Projects />
    <Contact />
    <Footer />
    <BackToTop />
  </div>
);

export default LandingPage;
