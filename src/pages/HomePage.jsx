import ScrollSequence from "../components/sections/ScrollSequence.jsx";
import Home from "../components/sections/Home.jsx";
import About from "../components/sections/About.jsx";
import Products from "../components/sections/Products.jsx";
import CustomCakes from "../components/sections/CustomCakes.jsx";
import Outlets from "../components/sections/Outlets.jsx";
import Contact from "../components/sections/Contact.jsx";

/*=============== HOME PAGE ===============*/
const HomePage = ({ onQuickView }) => {
  return (
    <>
      <ScrollSequence />
      <Home />
      <About />
      <Products onQuickView={onQuickView} />
      <CustomCakes />
      <Outlets />
      <Contact />
    </>
  );
};

export default HomePage;
