import CryptoJS from 'crypto-js';

export const encryptItem = (key,name) => {
  let SessionName = null;
  const encryptionKey = process.env.REACT_APP_SECRET_KEY;

  const encrypted = CryptoJS.AES.encrypt(key, encryptionKey).toString();


  SessionName = 'encrypted' + capitalizeFirstLetter(name);

  sessionStorage.setItem(SessionName, encrypted);
};


const capitalizeFirstLetter = (str) => {
  if (!str) return ""; // Handle empty or null strings
  return str.charAt(0).toUpperCase() + str.slice(1);
};
