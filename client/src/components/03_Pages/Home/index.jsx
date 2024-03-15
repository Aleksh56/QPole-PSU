import Hero from '@/widgets/common/Hero';
import ServicesSection from '@widgets/ServicesSection';
import Footer from '@/widgets/common/Footer';
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
