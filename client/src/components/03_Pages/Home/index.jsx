import Hero from '@/components/04_Widgets/common/Hero';
import ServicesSection from '@widgets/ServicesSection';
import Footer from '@/components/04_Widgets/common/Footer';
import usePageTitle from '@/hooks/usePageTitle';
import { useEffect, useState } from 'react';
import { getProvider } from '@/services/ethereum';

const HomePage = () => {
  usePageTitle('home');
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    async function loadProvider() {
      const loadedProvider = await getProvider();
      setProvider(loadedProvider);
    }
    loadProvider();
  }, []);

  return (
    <>
      <Hero />
      <ServicesSection />
      <Footer />
    </>
  );
};

export default HomePage;
