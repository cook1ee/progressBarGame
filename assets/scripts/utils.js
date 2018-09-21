function generateUUID()
{
  let numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"]; //all hexadecimal symbols
  let result = "";

  for(let i = 1; i <= 32; i++)
  {
    result += numbers[Math.floor(Math.random() * numbers.length)] + ((i == 8 || i == 12 || i == 16 || i == 20) ? "-" : "");
  }

  return result;
}
