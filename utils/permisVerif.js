const permisVerif = (permis) => {
  const regex = /[A-Za-z]+\d\d-[0-9]+-[0-9]+[A-Za-z]+/i;
  return regex.test(permis);
};

export default permisVerif;
