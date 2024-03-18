import packageJson from '../../package.json';

const config = {
  siteName: packageJson.name,
  imageApiUrl: import.meta.env.VITE_BASE_URL,
  serverUrl: {
    main: import.meta.env.VITE_BASE_URL,
  },
  //   serverImagesUrl: `${import.meta.env.VITE_SERVER_URL}/lk_api/files/logos/`,
  serverPlacementsUrl: `${import.meta.env.VITE_BASE_URL}/lk_api/files/placements/`,
};
export default config;
