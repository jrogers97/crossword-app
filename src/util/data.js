import axios from 'axios';

export const fetchRandomData = (ignoredDays) => {
	const ignoredDaysNumbers = ignoredDays.map(day => {
		switch (day) {
			case "sunday": 
				return 0;
			case "monday": 
				return 1;
			case "tuesday": 
				return 2;
			case "wednesday": 
				return 3;
			case "thursday": 
				return 4;
			case "friday": 
				return 5;
			case "saturday": 
				return 6;
			default:
				return 0;
		}
	});

	let [year, month, day] = makeRandomDate(ignoredDaysNumbers);

	return axios.get(`https://raw.githubusercontent.com/doshea/nyt_crosswords/master/${year}/${month}/${day}.json`);
}

export const makeRandomDate = (ignoreDays) => {
	const [minYear, maxYear] = [1979, 2015];
	const daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];

	const year = Math.floor(Math.random() * (maxYear - minYear)) + minYear;
	const month = Math.floor(Math.random() * 12) + 1;

	let day;
	let validDay = false;
	while (!validDay) {
		day = Math.floor(Math.random() * daysInMonth[month - 1]) + 1;
		let dayOfWeek = (new Date(year, month - 1, day)).getDay();
		validDay = ignoreDays.indexOf(dayOfWeek) === -1;
	}

	// api requires "03" and not "3"
	const [monthStr, dayStr] = [month, day].map(num => num.toString().length !== 2 ? "0" + num : num.toString());

	return [year.toString(), monthStr, dayStr];
}

export const makeFinishedGrid = (grid) => {
	return grid.map(char => char === "." ? false : char.toUpperCase());
}

export const makeClues = (clues, gridNums) => {
	let cluesMap = {};
	["across", "down"].forEach(dir => {
		clues[dir].forEach(clue => {
			const [clueNum, clueText] = splitKeepRemainder(clue, ". ", 1);
			const fullClueNum = clueNum + (dir === "across" ? "A" : "D");

			const startCell = gridNums.indexOf(parseInt(clueNum.replace(/\D+/g, '')));

			cluesMap[fullClueNum] = {
				"startCell": startCell,
				"clue": clueText.replace("&amp;", "&").replace("&reg;", "®")
			};
		});
	});

	return cluesMap;
}

export const splitKeepRemainder = (str, separator, limit) => {
	str = str.split(separator);
	if (str.length > limit) {
		var ret = str.splice(0, limit);
		ret.push(str.join(separator));

		return ret;
	}

	return str;
}

// export const finishedGrid = [
// 	["p","a","t",false,false,"a","s","k",false,false,false,"a","m","e","n"], 
// 	["a","l","e","c",false,"s","p","y",false,"i","t","s","a","n","o"], 
// 	["c","l","a","r","e","s","a","d",false,"n","u","g","g","e","t"], 
// 	["t","a","r","o","t",false,false,false,"f","d","r",false,"i","r","i"], 
// 	[false,false,false,false,"c","a","m","e","r","o","n","s","c","o","t"], 
// 	["s","s","r","i",false,"c","a","b","o","o","s","e",false,false,false], 
// 	["s","t","u","d","i","e","d","a","b","r","o","a","d",false,false], 
// 	["b","e","e","t","s",false,false,false,false,false,"f","l","u","i","d"], 
// 	[false,"g","r","a","c","e","s","t","a","n","f","i","e","l","d"], 
// 	[false,false,false,"g","r","e","i","n","k","e",false,"n","t","o","s"], 
// 	["b","e","n","s","a","l","l","d","i","c","k",false,false,false,false], 
// 	["o","x","o",false,"n","i","l",false,false,false,"o","r","a","n","g"], 
// 	["u","p","t","a","k","e",false,"w","e","s","l","e","y","a","n"], 
// 	["m","a","r","t","y","r",false,"t","s","p",false,"b","e","t","a"], 
// 	["s","t","y","e",false,false,false,"d","u","i",false,false,"s","o","w"]
// ];

// export const loadingGrid = [
// 	[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null], 
// 	[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null], 
// 	[null,false,null,false,null,false,false,false,null,false,null,null,false,false,null], 
// 	[null,false,false,false,null,false,null,false,null,false,null,null,false,null,false], 
// 	[null,false,null,false,null,false,null,false,null,false,null,null,false,null,false], 
// 	[null,false,null,false,null,false,false,false,null,false,false,null,false,false,null], 
// 	[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null], 
// 	[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null], 
// 	[null,false,false,false,null,false,null,null,false,null,null,null,null,null,null], 
// 	[null,false,null,false,null,false,false,null,false,null,null,null,null,null,null], 
// 	[null,false,null,false,null,false,null,false,false,null,null,null,null,null,null], 
// 	[null,false,false,false,null,false,null,null,false,null,false,null,false,null,false], 
// 	[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null], 
// 	[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null], 
// 	[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]
// ];

// export const clues = {
// 	"1A": {
// 		"startCell": [0,0],
// 		"clue": "Bit of butter"
// 	},
// 	"4A": {
// 		"startCell": [0,5],
// 		"clue": "Question"
// 	},
// 	"7A": {
// 		"startCell": [0,11],
// 		"clue": "\"I hear ya\""
// 	},
// 	"11A": {
// 		"startCell": [1,0],
// 		"clue": "Actor Baldwin"
// 	},
// 	"13A": {
// 		"startCell": [1,5],
// 		"clue": "2015 Melissa McCarthy movie"
// 	},
// 	"14A": {
// 		"startCell": [1,9],
// 		"clue": "\"____ from me, dog\""
// 	},
// 	"16A": {
// 		"startCell": [2,0],
// 		"clue": "Fountain resident's Craigslist posting*"
// 	},
// 	"18A": {
// 		"startCell": [2,9],
// 		"clue": "Bit of gold"
// 	},
// 	"19A": {
// 		"startCell": [3,0],
// 		"clue": "Fortuneteller's card"
// 	},
// 	"20A": {
// 		"startCell": [3,8],
// 		"clue": "New Deal inits."
// 	},
// 	"21A": {
// 		"startCell": [3,12],
// 		"clue": "South Korean city"
// 	},
// 	"22A": {
// 		"startCell": [4,4],
// 		"clue": "Guest bed in a Cross house*"
// 	},
// 	"27A": {
// 		"startCell": [5,0],
// 		"clue": "Zoloft or Lexapro inits."
// 	},
// 	"31A": {
// 		"startCell": [5,5],
// 		"clue": "End of the train"
// 	},
// 	"32A": {
// 		"startCell": [6,0],
// 		"clue": "Discovered the true meaning of life in Europe, maybe"
// 	},
// 	"35A": {
// 		"startCell": [7,0],
// 		"clue": "Schrute Farms harvest items"
// 	},
// 	"36A": {
// 		"startCell": [7,10],
// 		"clue": "Liquid"
// 	},
// 	"39A": {
// 		"startCell": [8,1],
// 		"clue": "Rising senior's bronze meadow*"
// 	},
// 	"45A": {
// 		"startCell": [9,3],
// 		"clue": "Astros pitcher Zack"
// 	},
// 	"46A": {
// 		"startCell": [9,11],
// 		"clue": "Six letter alphabetic span"
// 	},
// 	"47A": {
// 		"startCell": [10,0],
// 		"clue": "Compliment about a Fountain resident's manhood*"
// 	},
// 	"51A": {
// 		"startCell": [11,0],
// 		"clue": "Palindromic kitchenware brand"
// 	},
// 	"52A": {
// 		"startCell": [11,4],
// 		"clue": "Zilch"
// 	},
// 	"53A": {
// 		"startCell": [11,10],
// 		"clue": "Chimp's cousin"
// 	},
// 	"58A": {
// 		"startCell": [12,0],
// 		"clue": "\"Slow on the ____\""
// 	},
// 	"60A": {
// 		"startCell": [12,7],
// 		"clue": "Where you might have found the answers to the themed questions"
// 	},
// 	"63A": {
// 		"startCell": [13,0],
// 		"clue": "Victim for a cause"
// 	},
// 	"64A": {
// 		"startCell": [13,7],
// 		"clue": "Recipe spec."
// 	},
// 	"65A": {
// 		"startCell": [13,11],
// 		"clue": "____ Theta Pi"
// 	},
// 	"66A": {
// 		"startCell": [14,0],
// 		"clue": "Eye woe"
// 	},
// 	"67A": {
// 		"startCell": [14,7],
// 		"clue": "Result of a high BAC: Abbr."
// 	},
// 	"68A": {
// 		"startCell": [14,12],
// 		"clue": "Scatter, as seeds"
// 	},

// 	"1D": {
// 		"startCell": [0,0],
// 		"clue": "Treaty"
// 	},
// 	"2D": {
// 		"startCell": [0,1],
// 		"clue": "Penne ____ vodka"
// 	},
// 	"3D": {
// 		"startCell": [0,2],
// 		"clue": "Sad, salty drop"
// 	},
// 	"4D": {
// 		"startCell": [0,5],
// 		"clue": "Fool"
// 	},
// 	"5D": {
// 		"startCell": [0,6],
// 		"clue": "Where you might take a mud bath"
// 	},
// 	"6D": {
// 		"startCell": [0,7],
// 		"clue": "Syd Tha ____"
// 	},
// 	"7D": {
// 		"startCell": [0,11],
// 		"clue": "Acronym for the event where someone on the 8-Down can play with a 18-Across"
// 	},
// 	"8D": {
// 		"startCell": [0,12],
// 		"clue": "Sorcery"
// 	},
// 	"9D": {
// 		"startCell": [0,13],
// 		"clue": "El primer mes"
// 	},
// 	"10D": {
// 		"startCell": [0,14],
// 		"clue": "Cry heard on the playground"
// 	},
// 	"12D": {
// 		"startCell": [1,3],
// 		"clue": "____-Magnon"
// 	},
// 	"14D": {
// 		"startCell": [1,9],
// 		"clue": "Like some pools"
// 	},
// 	"15D": {
// 		"startCell": [1,10],
// 		"clue": "Powers down"
// 	},
// 	"17D": {
// 		"startCell": [2,4],
// 		"clue": "List ender"
// 	},
// 	"20D": {
// 		"startCell": [3,8],
// 		"clue": "Nickname for a legendary Reds outfielder, maybe"
// 	},
// 	"23D": {
// 		"startCell": [4,5],
// 		"clue": "It beats a king"
// 	},
// 	"24D": {
// 		"startCell": [4,6],
// 		"clue": "Peeved"
// 	},
// 	"25D": {
// 		"startCell": [4,7],
// 		"clue": "Major chords in a I-V-IV progression, maybe"
// 	},
// 	"26D": {
// 		"startCell": [4,11],
// 		"clue": "Keep from escaping"
// 	},
// 	"27D": {
// 		"startCell": [5,0],
// 		"clue": "Classic game featuring Kirby and Captain Falcon: Abbr."
// 	},
// 	"28D": {
// 		"startCell": [5,1],
// 		"clue": "Spiky-tailed dino"
// 	},
// 	"29D": {
// 		"startCell": [5,2],
// 		"clue": "One who regrets"
// 	},
// 	"30D": {
// 		"startCell": [5,3],
// 		"clue": "Luggage attachments"
// 	},
// 	"33D": {
// 		"startCell": [6,4],
// 		"clue": "Woke up on the wrong side of the bed, say"
// 	},
// 	"34D": {
// 		"startCell": [6,12],
// 		"clue": "Song with a high and low part, say"
// 	},
// 	"37D": {
// 		"startCell": [7,13],
// 		"clue": "U.N. agency"
// 	},
// 	"38D": {
// 		"startCell": [7,14],
// 		"clue": "Stays sober for the night, briefly"
// 	},
// 	"40D": {
// 		"startCell": [8,5],
// 		"clue": "More slippery"
// 	},
// 	"41D": {
// 		"startCell": [8,6],
// 		"clue": "Window feature"
// 	},
// 	"42D": {
// 		"startCell": [8,7],
// 		"clue": "Anthony Fantano YouTube channel inits."
// 	},
// 	"43D": {
// 		"startCell": [8,8],
// 		"clue": "Sudden renal damage inits."
// 	},
// 	"44D": {
// 		"startCell": [8,9],
// 		"clue": "Japanese electronics giant inits."
// 	},
// 	"47D": {
// 		"startCell": [10,0],
// 		"clue": "French parties, slangily"
// 	},
// 	"48D": {
// 		"startCell": [10,1],
// 		"clue": "One who runs away from home?"
// 	},
// 	"49D": {
// 		"startCell": [10,2],
// 		"clue": "\"Do or do not, there is ____\""
// 	},
// 	"50D": {
// 		"startCell": [10,10],
// 		"clue": "____ Nidre, Jewish atonement prayer"
// 	},
// 	"54D": {
// 		"startCell": [11,11],
// 		"clue": "Basketball stat."
// 	},
// 	"55D": {
// 		"startCell": [11,12],
// 		"clue": "Thumbs-up votes"
// 	},
// 	"56D": {
// 		"startCell": [11,13],
// 		"clue": "Western alliance"
// 	},
// 	"57D": {
// 		"startCell": [11,14],
// 		"clue": "Munch on"
// 	},
// 	"59D": {
// 		"startCell": [12,3],
// 		"clue": "Had"
// 	},
// 	"60D": {
// 		"startCell": [12,7],
// 		"clue": "Roll of dough"
// 	},
// 	"61D": {
// 		"startCell": [12,8],
// 		"clue": "Ostrich's cousin"
// 	},
// 	"62D": {
// 		"startCell": [12,9],
// 		"clue": "What protection prevents"
// 	}
// }