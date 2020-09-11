function scan(str) {
  let count = 0;
  str.forEach((element) => {
    if (element === 'contraband') count++;
  });
  return count;
}
