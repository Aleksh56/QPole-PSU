import Hero from '@/components/04_Widgets/common/Hero';
import ServicesSection from '@widgets/ServicesSection';
import Footer from '@/components/04_Widgets/common/Footer';
import usePageTitle from '@/hooks/usePageTitle';

const HomePage = () => {
  usePageTitle('home');
  return (
    <>
      <Hero />
      <ServicesSection />
      <Footer />
    </>
  );
};

export default HomePage;
