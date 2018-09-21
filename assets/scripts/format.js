var PREFIXES_LETTERS = [""];
for(i=97;i<97+26;i++){ //create letter array
  PREFIXES_LETTERS.push(String.fromCharCode(i));
}

var PREFIXES_STANDARD = ["","K","M","B","T","q","Q","s","S","O","N","D",
                        "UD","DD","TD","qD","QD","sD","SD","OD","ND","V",
                        "UV","DV","TV","qV","QV","sV","SV","OV","NV","T"];
for(let i=0;i<85;i++){
  PREFIXES_STANDARD.push(PREFIXES_STANDARD[i]+"*");
}

var NumberFormatType =
{
  STANDARD: 0,
  LETTERS: 1
};

function format_number(d){ //short numbers

	let s = Number((Math.pow(10, d.e % 3) * Math.pow(10, d.log().toNumber() % 1)).toFixed(2));

	for(let i = 0; i < 10; i++){
		s += PREFIXES_LETTERS[Math.floor(d.e/3/Math.pow(PREFIXES_LETTERS.length,9-i))%PREFIXES_LETTERS.length];
	}

	if(Decimal.max(d,1).equals(d)){
	   return s;
	}
	else{
	return "0";
	}
}
