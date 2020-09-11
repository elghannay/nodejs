const input = process.argv[2];
if (input % 15 == 0) {
  console.log('JavaScript');
} else if (input % 3 == 0) console.log('Java');
else if (input % 5 == 0) console.log('Script');
else console.log(input);
