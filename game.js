var FPS = 50;
const BUTTON_WHITE = "#eeeeee";

var savegame = {};

var PREFIXES_LETTERS = [""];
for(i=97;i<97+26;i++){ //create letter array
  PREFIXES_LETTERS.push(String.fromCharCode(i));
}

var PREFIXES_STANDARD = ["","K","M","B","T","q","Q","s","S","O","N","D","UD","DD","TD","qD","QD","sD","SD","OD","ND","V","UV","DV","TV","qV","QV","sV","SV","OV","NV","T"];
for(let i=0;i<85;i++){
  PREFIXES_STANDARD.push(PREFIXES_STANDARD[i]+"*");
}

class permupgrade //NORMAL UPGRADE
{
  constructor(price,effect_progress,effect_upgpoints,button_id)
  {
    this.price = price;
  	this.bought = false;

  	this.button = nodes.container.permanent_upgrades.appendChild(document.createElement("button"));
    this.button.id = button_id;
    this.button.className = "upgradebtn";

  	this.effect_pr = effect_progress;
  	this.effect_upgp = effect_upgpoints;

    this.button.addEventListener("click",this.buy.bind(this));
  	this.button.innerHTML = this.tostring();
  }

	buy()
  {
		if(upgrade_points.gte(this.price) && !this.bought)
    {
  		upgrade_points = upgrade_points.sub(this.price);
  		this.bought = true;
  		this.button.classList.add("bought");
  		normal_multi.progress = normal_multi.progress.mul(this.effect_pr);
  		normal_multi.upg_points = normal_multi.upg_points.mul(this.effect_upgp);
		}
	}

	tostring()
  {
		return "Get " + (this.effect_pr > 1 ? format_number(this.effect_pr) + "x Progress Power<br/>" : "") + (this.effect_upgp > 1 ? "Get " + format_number(this.effect_upgp) + "x Upgrade Points <br/>" : "") + "<br/>"+format_number(this.price)+draw_icon("upg_point");
	}


}

class permupgrade_prestige //PRESTIGE UPGRADE
{
  constructor(price, effect_progress, effect_upgpoints, effect_progressneeded, button_id)
  {
    this.price = price;
    this.bought = false;

    this.button = nodes.container.prestige.appendChild(document.createElement("button"));
    this.button.id = button_id;
    this.button.className = "pupgradebtn";

    this.effect_pr = effect_progress;
    this.effect_upgp = effect_upgpoints;
    this.effect_prneeded = effect_progressneeded;

    this.button.addEventListener("click",this.buy.bind(this));
  	this.button.innerHTML = this.tostring();
  }



	buy()
  {
		if(Decimal.max(prestige_points,this.price).equals(prestige_points) && !this.bought)
    {
  		prestige_points = prestige_points.sub(this.price);
  		this.bought = true;
  		document.getElementById(this.button).style.backgroundColor = BUTTON_WHITE;
  		prestige_multi.progress = prestige_multi.progress.mul(this.effect_pr);
  		prestige_multi.upg_points = prestige_multi.upg_points.mul(this.effect_upgp);
  		prestige_multi.prneeded = prestige_multi.prneeded.mul(this.effect_prneeded);
		}
	}

	tostring()
  {
		return format_number(this.effect_pr) + "x Progress Power<br/>"+format_number(this.effect_upgp) + "x Upgrade Points <br/>"+format_number(this.effect_prneeded) + "x less Progress needed <br/> "+format_number(this.price)+draw_icon("pr_point");
	}
}

function draw_icon(s){
	if(s == "upg_point"){
		return '<img src="../img/upgrade_point.png" style="width:24px;height:24px;"></img>';
	}
	if(s == "pr_point"){
		return '<img src="../img/prestige_point.png" style="width:24px;height:24px;"></img>';
	}
}

//ELEMENTS/NODES

var nodes =
{
  progress_bar: document.getElementById("pbar"),
  progress_info: document.getElementById("pbarinfo"),
  checkbox_buymax: document.getElementById("checkbox_buymax"),
  text:
  {
    level: document.getElementById("textlevel"),
    upg_points: document.getElementById("textupgpoints"),
    upg_points_get: document.getElementById("textupgpointsget"),
    prestige_points: document.getElementById("textprestigeamount"),
    infobox: document.getElementById("infobox"),
    active_click_power_boost: document.getElementById("activeclickpowerboost")
  },
  button:
  {
    speed_up: document.getElementById("speedupbtn"),
    level_1: document.getElementById("level0btn"),
    get_prestige: document.getElementById("btngetprestige"),
    upgrades:
    {
      power: document.getElementById("upgpowerbtn"),
      upgpoints: document.getElementById("upgupgpointsbtn"),
      click: document.getElementById("upgclickbtn"),
      neededpr: document.getElementById("upgneededprbtn"),
      powerboost: document.getElementById("upgpower2btn"),
      pointboost: document.getElementById("upgupgpoints2btn")
    }
  },
  container:
  {
    basicstats: document.getElementById("container_basicstats"),
    basicbuttons: document.getElementById("container_basicbuttons"),
    normal_upgrades: document.getElementById("container_upgrades"),
    permanent_upgrades: document.getElementById("container_permupgrades"),
    prestige: document.getElementById("container_prestige")
  },
  upgrades:
  {
    power:
    {
      price: document.getElementById("upgpowerbtn_price"), level: document.getElementById("upgpowerbtn_level")
    },
    upgpoints:
    {
      price: document.getElementById("upgupgpointsbtn_price"), level: document.getElementById("upgupgpointsbtn_level")
    },
    click:
    {
      price: document.getElementById("upgclickbtn_price"), level: document.getElementById("upgclickbtn_level")
    },
    neededpr:
    {
      price: document.getElementById("upgneededprbtn_price"), level: document.getElementById("upgneededprbtn_level")
    },
    powerboost:
    {
      price: document.getElementById("upgpower2btn_price"), level: document.getElementById("upgpower2btn_level")
    },
    pointboost:
    {
      price: document.getElementById("upgupgpoints2btn_price"), level: document.getElementById("upgupgpoints2btn_level")
    }
  }
}

//UPGRADES
var normal_upgrades =
{
  power:
  {
    base_price: new Decimal(10), price: new Decimal(10), level: 0, price_increase: 1.4
  },
  upgpoints:
  {
  	base_price: new Decimal(50), price: new Decimal(50), level: 0, price_increase: 1.7
  },
  click:
  {
  	base_price: new Decimal(100), price: new Decimal(100), level: 0, price_increase: 1.8
  },
  neededpr:
  {
  	base_price: new Decimal(10e+3), price: new Decimal(10e+3), level: 0, price_increase: 2.6
  },
  powerboost:
  {
  	base_price: new Decimal("100e+276"), price: new Decimal("100e+276"), level: 0, price_increase: new Decimal("1e+72")
  },
  pointboost:
  {
  	base_price: new Decimal("100e+375"), price: new Decimal("100e+375"), level: 0, price_increase: new Decimal("74e+174")
  }
}

var unlocks =
{
  basicstats: false,
  basicbuttons: false,
  normal_upgrades: false,
  permanent_upgrades: false,
  prestige: false
}

var UnlockType =
{
  BASICSTATS: 0,
  BASICBUTTONS: 1,
  NORMAL_UPGRADES: 2,
  PERMANENT_UPGRADES: 3,
  PRESTIGE: 4
}

var normal_upgrade_names = Object.getOwnPropertyNames(normal_upgrades);
var unlock_names = Object.getOwnPropertyNames(unlocks);

//GENERAL
var progress_current = new Decimal(0);
var progress_needed = new Decimal(0);
var progress_level = 0;
var progress_power = new Decimal(100);
var upgrade_points = new Decimal(0);
var upgrade_points_get = new Decimal(0);

var active_click_multi = 1;

var normal_multi = {
	progress: new Decimal(1),
	upg_points: new Decimal(1)
};


var prestige_points = new Decimal(0);
var prestige_points_get = new Decimal(0);
var prestige_multi = {
	progress:new Decimal(1),
	upg_points:new Decimal(1),
	prneeded:new Decimal(1)
};





////BUTTON EVENT LISTENERS////
nodes.button.speed_up.addEventListener("click",function(){
  active_click_multi += 0.05;
});

nodes.button.level_1.addEventListener("click",function(){
	progress_current = new Decimal(0);
	progress_level = 0;
  upgrade_points = upgrade_points.plus(upgrade_points_get);
  upgrade_points_get = new Decimal(0);
});



normal_upgrade_names.forEach(function(key)
{
  nodes.button.upgrades[key].addEventListener("click",function(){ //power upgrade
  	if(!nodes.checkbox_buymax.checked){
  	if(Decimal.max(upgrade_points, normal_upgrades[key].price).equals(upgrade_points)){ //upgrade_points >= upgrade_power.price
  		upgrade_points = upgrade_points.sub(normal_upgrades[key].price);
  		normal_upgrades[key].level++;
  		normal_upgrades[key].price = Decimal.floor(Decimal.mul(normal_upgrades[key].base_price, Decimal.pow(normal_upgrades[key].price_increase, normal_upgrades[key].level)));
  	}}
  	else{
  	while(Decimal.max(upgrade_points, normal_upgrades[key].price).equals(upgrade_points)){ //upgrade_points >= upgrade_power.price
  		upgrade_points = upgrade_points.sub(normal_upgrades[key].price);
  		normal_upgrades[key].level++;
  		normal_upgrades[key].price = Decimal.floor(Decimal.mul(normal_upgrades[key].base_price, Decimal.pow(normal_upgrades[key].price_increase, normal_upgrades[key].level)));
  	}
  	}
  });
});

//normal upgrades

permupgrades = [
new permupgrade(new Decimal(100),new Decimal(2),new Decimal(1),"permupg1"),
new permupgrade(new Decimal(5e+3),new Decimal(1.5),new Decimal(1.5),"permupg2"),
new permupgrade(new Decimal(205e+3),new Decimal(7),new Decimal(4),"permupg3"),
new permupgrade(new Decimal(132e+6),new Decimal(2.25),new Decimal(4.25),"permupg4"),
new permupgrade(new Decimal(7e+12),new Decimal(9.9),new Decimal(2),"permupg5"),
new permupgrade(new Decimal(245e+15),new Decimal(7.7),new Decimal(5.5),"permupg6"),
new permupgrade(new Decimal(2e+24),new Decimal(10.1),new Decimal(7.07),"permupg7"),
new permupgrade(new Decimal(555e+30),new Decimal(11.1),new Decimal(11.1),"permupg8"),
new permupgrade(new Decimal(400e+42),new Decimal(22.2),new Decimal(22.2),"permupg9"),
new permupgrade(new Decimal(30e+57),new Decimal(44.4),new Decimal(44.4),"permupg10"),
new permupgrade(new Decimal(2e+72),new Decimal(88.8),new Decimal(88.8),"permupg11"),
new permupgrade(new Decimal(111.11e+93),new Decimal(999.9),new Decimal(999.9),"permupg12"),
new permupgrade(new Decimal(712e+111),new Decimal(19.9),new Decimal(29.9),"permupg13"),
new permupgrade(new Decimal(42e+132),new Decimal(44),new Decimal(33),"permupg14"),
new permupgrade(new Decimal(987e+162),new Decimal(1470),new Decimal(1),"permupg15"),
new permupgrade(new Decimal(12e+222),new Decimal(1),new Decimal(37),"permupg16"),
new permupgrade(new Decimal(205e+240),new Decimal(100),new Decimal(100),"permupg17"),
new permupgrade(new Decimal("753e+378"),new Decimal(9999),new Decimal(999),"permupg18"),
new permupgrade(new Decimal("612e+684"),new Decimal(999e+3),new Decimal(999e+3),"permupg19"),
new permupgrade(new Decimal("9e+1236"),new Decimal(999e+6),new Decimal(999e+6),"permupg20"),
new permupgrade(new Decimal("100e+3123"),new Decimal(999e+12),new Decimal(999e+12),"permupg21")
];

///prestige upgrades

permupgrades_prestige=[
new permupgrade_prestige(new Decimal(1),new Decimal(5),new Decimal(1),new Decimal(1),"prestigeupg1"),
new permupgrade_prestige(new Decimal(3),new Decimal(1),new Decimal(5),new Decimal(1),"prestigeupg2"),
new permupgrade_prestige(new Decimal(2),new Decimal(1),new Decimal(1),new Decimal(5),"prestigeupg3"),
new permupgrade_prestige(new Decimal(5),new Decimal(10),new Decimal(1),new Decimal(1),"prestigeupg4"),
new permupgrade_prestige(new Decimal(7),new Decimal(1),new Decimal(10),new Decimal(1),"prestigeupg5"),
new permupgrade_prestige(new Decimal(5),new Decimal(1),new Decimal(1),new Decimal(10),"prestigeupg6"),
new permupgrade_prestige(new Decimal(14),new Decimal(10),new Decimal(10),new Decimal(10),"prestigeupg7"),
new permupgrade_prestige(new Decimal(27),new Decimal(6),new Decimal(2),new Decimal(1.1),"prestigeupg8"),
new permupgrade_prestige(new Decimal(35),new Decimal(2),new Decimal(6),new Decimal(1.1),"prestigeupg9"),
new permupgrade_prestige(new Decimal(31),new Decimal(1.75),new Decimal(1.75),new Decimal(9),"prestigeupg10"),
new permupgrade_prestige(new Decimal(243),new Decimal(5),new Decimal(1),new Decimal(1),"prestigeupg11"),
new permupgrade_prestige(new Decimal(243),new Decimal(1),new Decimal(5),new Decimal(1),"prestigeupg12"),
new permupgrade_prestige(new Decimal(243),new Decimal(1),new Decimal(1),new Decimal(5),"prestigeupg13"),
new permupgrade_prestige(new Decimal(512),new Decimal(4),new Decimal(1),new Decimal(4),"prestigeupg14"),
new permupgrade_prestige(new Decimal(762),new Decimal(1),new Decimal(8),new Decimal(1),"prestigeupg15"),
new permupgrade_prestige(new Decimal(451),new Decimal(4),new Decimal(1),new Decimal(4),"prestigeupg16"),
new permupgrade_prestige(new Decimal(1251),new Decimal(7),new Decimal(8),new Decimal(9),"prestigeupg17"),
new permupgrade_prestige(new Decimal(2187),new Decimal(6),new Decimal(2),new Decimal(1.1),"prestigeupg18"),
new permupgrade_prestige(new Decimal(1489),new Decimal(2),new Decimal(6),new Decimal(1.1),"prestigeupg19"),
new permupgrade_prestige(new Decimal(2222),new Decimal(1.75),new Decimal(1.75),new Decimal(9),"prestigeupg20"),
new permupgrade_prestige(new Decimal(10203),new Decimal(99),new Decimal(99),new Decimal(99),"prestigeupg21")
];

///PRESTIGE

nodes.button.get_prestige.addEventListener("click",function(){
	if(Decimal.max(prestige_points_get,new Decimal(1)).equals(prestige_points_get)){

		prestige_points = prestige_points.plus(prestige_points_get);

		normal_upgrades.power.price = normal_upgrades.power.base_price;
		normal_upgrades.power.level = 0;

		normal_upgrades.upgpoints.price = normal_upgrades.upgpoints.base_price;
		normal_upgrades.upgpoints.level = 0;

		normal_upgrades.click.price = normal_upgrades.click.base_price;
		normal_upgrades.click.level = 0;

		normal_upgrades.neededpr.price = normal_upgrades.neededpr.base_price;
		normal_upgrades.neededpr.level = 0;

		normal_upgrades.powerboost.price = normal_upgrades.powerboost.base_price;
		normal_upgrades.powerboost.level = 0;

		normal_upgrades.pointboost.price = normal_upgrades.pointboost.base_price;
		normal_upgrades.pointboost.level = 0;

		//reset one time upgrades (color)

		for(let i = 0;i < permupgrades.length;i++){
			permupgrades[i].bought = false
			document.getElementById(permupgrades[i].button).classList.remove("bought") = "#eeeeee";
		}

		normal_multi.progress = new Decimal(1);
		normal_multi.upg_points = new Decimal(1);

		upgrade_points = new Decimal(0);
		progress_current = new Decimal(0);
		progress_level = 0;

	}
});

function stringToBoolean(s)
{
  return s == "true";
}

function format_number(d){ //short numbers

	let s = Number((Math.pow(10, d.e % 3) * Math.pow(10, d.log().toNumber() % 1)).toFixed(2));

	for(let i = 0;i<10;i++){
		s += PREFIXES_LETTERS[Math.floor(d.e/3/Math.pow(PREFIXES_LETTERS.length,9-i))%PREFIXES_LETTERS.length];
	}

	if(Decimal.max(d,1).equals(d)){
	return s;
	}
	else{
	return "0";
	}
}

function UnlockFeature(unlocktype)
{
  unlock_names.forEach(function(key)
  {
    if(unlocktype == UnlockType[key.toUpperCase()] && !unlocks[key])
    {
      unlocks[key] = true;
      nodes.container[key].style.display = "block";
    }
  });
}


//PRELOAD
load_game();

unlock_names.forEach(function(key) //apply saved unlocks
{
  if(unlocks[key]) nodes.container[key].style.display = "block";
});

permupgrades.forEach(function(p){ //apply green color to bought upgrades
  if(p.bought)
  {
    p.button.classList.add("bought");
  }
});

function update(){

  active_click_multi = Math.max(1, active_click_multi / 1.2 ** (1 / FPS));

	//calculate progress bar values
	//progress_needed = 100 * Math.pow(1.6,progress_level) * Math.pow(1-0.1,upgrade_neededpr.level * Math.pow(2,Math.floor(progress_level / 10)) * Math.pow(25,Math.floor(progress_level / 100))) / prestige_multi.prneeded; //needed progress
	progress_needed = new Decimal(10).mul(Decimal.pow(1.5, progress_level))
                                    .mul(Decimal.pow(1 - 0.1, normal_upgrades.neededpr.level))
                                    .div(prestige_multi.prneeded);

	if(Decimal.max(progress_current,progress_needed).equals(progress_current)){ //level up
		let point_multi = 1;
		if(progress_level % 5==0 && progress_level >= 10) point_multi *= 1.5;
		if(progress_level % 10==0 && progress_level >= 10) point_multi *= 1.5;
		if(progress_level % 50==0 && progress_level >= 10) point_multi *= 1.5; //special rewards at certain levels

		progress_level++;
		progress_current = new Decimal(0);

		//upgrade_points+=Math.floor(Math.random() * 0.75 * Math.pow(1.4,progress_level) * Math.pow(1.07,upgrade_upgpoints.level) * upgrade_points_multi * prestige_multi.upg_points * point_multi); //get upg points
		upgrade_points_get = upgrade_points_get.plus(Decimal.floor(new Decimal(5)
                                    .mul(Decimal.pow(1.4, progress_level))
                                    .mul(Decimal.pow(1.07, normal_upgrades.upgpoints.level))
                                    .mul(normal_multi.upg_points).mul(prestige_multi.upg_points)
                                    .mul(point_multi))
                                    .mul(Decimal.pow(1000, normal_upgrades.pointboost.level)));

		if(Decimal.max(progress_power,progress_needed.mul(new Decimal("1e+30"))).equals(progress_power)){
			progress_level+=10;
			progress_current = new Decimal(0);
		}
		if(Decimal.max(progress_power,progress_needed.mul(new Decimal("1e+300"))).equals(progress_power)){
			progress_level+=100;
			progress_current = new Decimal(0);
		}
	}

	//more calculation
	//progress_power = 100 * Math.pow(1.25,upgrade_power.level) * progress_power_multi * prestige_multi.progress;
	progress_power = new Decimal(1).mul(Decimal.pow(1.25, normal_upgrades.power.level))
                                    .mul(normal_multi.progress)
                                    .mul(prestige_multi.progress)
                                    .mul(Decimal.pow(1000, normal_upgrades.powerboost.level))
                                    .mul(active_click_multi);

	prestige_points_get = new Decimal(Math.floor(progress_level*progress_level/5000)).mul(Decimal.max(1,Decimal.pow(1.005,progress_level-500))); //calc prestige points get

	progress_current = progress_current.plus(progress_power.div(FPS));

	////update texts////
	document.title = "Progress Bar | Level "+progress_level;

	if(progress_current.div(progress_needed).toNumber() != Infinity && progress_current.div(progress_needed).toNumber() != NaN){
		nodes.progress_bar.value = progress_current.div(progress_needed).toNumber();
	}
	else{
		nodes.progress_bar.value = 1;
	}

	if(Decimal.max(normal_upgrades.pointboost.price.div(1e+100),upgrade_points).equals(upgrade_points)){ //disable upgrades if out of reach
		nodes.button.upgrades.pointboost.style.visibility = "visible";
	}
	else{
		nodes.button.upgrades.pointboost.style.visibility = "hidden";
	}

	if(Decimal.max(normal_upgrades.powerboost.price.div(1e+100),upgrade_points).equals(upgrade_points)){ //disable upgrades if out of reach
		nodes.button.upgrades.powerboost.style.visibility = "visible";
	}
	else{
		nodes.button.upgrades.powerboost.style.visibility = "hidden";
	}

	nodes.progress_info.innerHTML = format_number(progress_current);
	nodes.text.level.innerHTML = progress_level;
	nodes.text.upg_points.innerHTML = format_number(upgrade_points);
  nodes.text.upg_points_get.innerHTML = format_number(upgrade_points_get);
  nodes.text.active_click_power_boost.innerHTML = active_click_multi.toFixed(2);
	//nodes.text.infobox.innerHTML = "You have <b>"+format_number(upgrade_points)+"</b> Upgrade Points<br/>You have <b>"+format_number(prestige_points)+"</b> Prestige Points";

  normal_upgrade_names.forEach(function(key) //normal upgrade texts and status
  {
    nodes.upgrades[key].price.innerHTML = format_number(normal_upgrades[key].price);
    nodes.upgrades[key].level.innerHTML = normal_upgrades[key].level;

    nodes.button.upgrades[key].disabled = normal_upgrades[key].price.gte(upgrade_points); //disable button if price higher
    nodes.button.upgrades[key].style.opacity = (normal_upgrades[key].price.gte(upgrade_points_get) && normal_upgrades[key].price.gte(upgrade_points) && normal_upgrades[key].level == 0) ? 0 : 1; //hide upgrades that are too expensive
  });

  if(progress_level >= 1) UnlockFeature(UnlockType.BASICSTATS);
  if(progress_level >= 2) UnlockFeature(UnlockType.BASICBUTTONS);
  if(progress_level >= 3) UnlockFeature(UnlockType.NORMAL_UPGRADES);
  if(progress_level >= 10) UnlockFeature(UnlockType.PERMANENT_UPGRADES);
  if(progress_level >= 50) UnlockFeature(UnlockType.PRESTIGE);
}

setInterval(update, 1000/FPS);
setInterval(save_game, 5000);

function save_game()
{
  let savegame = {};
  savegame.progressCurrent = progress_current;
  savegame.progressNeeded = progress_needed;
  savegame.progressLevel = progress_level;

  savegame.upgradePoints = upgrade_points;
  savegame.upgradePointsGet = upgrade_points_get;

  savegame.normalUpgrades = {};
  normal_upgrade_names.forEach(function(key)
  {
    savegame.normalUpgrades[key] = {};
    savegame.normalUpgrades[key].price = normal_upgrades[key].price;
    savegame.normalUpgrades[key].level = normal_upgrades[key].level;
  });

  savegame.normalMulti =
  {
    progress: normal_multi.progress,
    upg_points: normal_multi.upg_points
  };

  savegame.permUpgradesBought = {};
  for (var i = 0; i < permupgrades.length; i++)
  {
    savegame.permUpgradesBought[i] = permupgrades[i].bought;
  }

  savegame.unlocks = unlocks;

  localStorage.setItem("savegame", JSON.stringify(savegame));
}

function tryToLoad(savegame, property, altvalue)
{
  if(savegame !== null && savegame.hasOwnProperty(property))
  {
    return savegame[property];
  }
  if(altvalue === undefined)
  {
    altvalue = 0;
  }
  return altvalue;
}

function load_game()
{
  let savegame = {};

  //try to load from storage
  try
  {
    savegame = JSON.parse(localStorage.getItem("savegame"));
  }
  catch (e)
  {

  }

  progress_current = new Decimal(tryToLoad(savegame, "progressCurrent"));
  progress_needed = new Decimal(tryToLoad(savegame, "progressNeeded"));
  progress_level = new Decimal(tryToLoad(savegame, "progressLevel"));

  upgrade_points = new Decimal(tryToLoad(savegame, "upgradePoints"));
  upgrade_points_get = new Decimal(tryToLoad(savegame, "upgradePointsGet"));

  let normalupg = tryToLoad(savegame, "normalUpgrades", {})
  normal_upgrade_names.forEach(function(key)
  {
    let upg = tryToLoad(normalupg, key, {});
    normal_upgrades[key].price = new Decimal(tryToLoad(upg, "price", normal_upgrades[key].base_price));
    normal_upgrades[key].level = tryToLoad(upg, "level");
  });

  let normalmulti = tryToLoad(savegame, "normalMulti", {});

  normal_multi =
  {
    progress: new Decimal(tryToLoad(normalmulti, "progress", 1)),
    upg_points: new Decimal(tryToLoad(normalmulti, "upg_points", 1)),
  }

  let permupg = tryToLoad(savegame, "permUpgradesBought");
  for(let i = 0; i < permupgrades.length; i++)
  {
    permupgrades[i].bought = tryToLoad(permupg, i, false);
  }

  unlocks = tryToLoad(savegame, unlocks, unlocks /*dont change*/);

}

function export_game()
{
  prompt("Keep this in a safe place!!!\n\n", btoa(localStorage.getItem("savegame")));
}

function import_game()
{
  let code = prompt("Input your code:", "<encoded string>")

  try
  {
    localStorage.setItem("savegame",atob(code));
  }
  catch (e)
  {
    alert("Invalid import String!")
  }


  load_game();
}

function hard_reset_game()
{
  let reset = true;

  for (var i = 0; i < 5; i++)
  {
    if(!confirm("YOU SURE" + "?".repeat(i + 1)))
    {
      reset = false;
      break;
    }
  }

  if(reset)
  {
    localStorage.clear();
    load_game();
    location.reload();
  }
}
