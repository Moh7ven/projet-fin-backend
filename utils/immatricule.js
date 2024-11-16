const verifImmatricule = (immatriculation) => {
  const regex = /[A-Za-z]+[0-9]+[A-Za-z]+/i;
  return regex.test(immatriculation);
};

export default verifImmatricule;
