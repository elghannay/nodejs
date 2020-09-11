function addFirstToLast(str) {
  if (str.length > 0) {
    return str[0] + str[str.length - 1];
  } else return '';
}
console.log(addFirstToLast(['first', 'second', 'third']));
console.log(addFirstToLast(['golden', 'terrier']));
console.log(addFirstToLast(['cheerio']));
console.log(addFirstToLast([]));
