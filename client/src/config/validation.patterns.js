const pattern = {
  passwordLowerAndUpper: /^(?=.*[a-z])(?=.*[A-Z]).{8,50}$/,
  name: /^[A-Za-zА-Яа-я-\s]+$/,
  // secure: /^[A-Za-zА-Яа-я0-9-_\s]+$/,
  // secureContent: /^[A-Za-zА-Яа-я0-9-_/\\(),.\s]+$/,
  // secureAddress: /^[A-Za-zА-Яа-я0-9-_/\\(),.\s]+$/,
  // // secureAddress: /^[A-Za-zА-Яа-я0-9-,.\s]+$/,
  // onlyNumbers: /^[0-9]+$/,
  // onlyLetters: /^[A-Za-zА-Яа-я-\s]+$/,
  phone: /^\+?[\d()\s-]+$/,
  email:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  //   telegram: /^[A-Za-z\d_]{5,32}$/,
  // // positiveIntegerPattern: /^(?:[1-9]|[1-9][0-9]|[1][0-7][0-9]|180)$/,
  // smsCode: /^\d{5}/,
};

export { pattern };
