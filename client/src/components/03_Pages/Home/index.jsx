import Hero from '@/components/04_Widgets/Content/Display/hero';
import ServSection from '@/components/04_Widgets/Content/Display/servSection';
import Footer from '@/components/04_Widgets/Navigation/Menus/footer';
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
      <ServSection />
      <Footer />
    </>
  );
};

export default HomePage;
