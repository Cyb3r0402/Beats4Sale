import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BeatsSection from './components/BeatsSection';
import Licensing from './components/Licensing';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';

export default function Home() {
  return (
    <>
      <Navbar />
      <CartSidebar />
      <main>
        <Hero />
        <div className="section-divider" />
        <BeatsSection />
        <div className="section-divider" />
        <Licensing />
        <div className="section-divider" />
        <About />
        <div className="section-divider" />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
