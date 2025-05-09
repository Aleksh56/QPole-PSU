const pattern = {
  passwordLowerAndUpper: /^(?=.*[a-z])(?=.*[A-Z]).{8,50}$/,
  name: /^[A-Za-zА-Яа-я-\s]+$/,
  phone: /^\+?[\d()\s-]+$/,
  email:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
};

export { pattern };
