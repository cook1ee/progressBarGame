var FPS = 50;
const BUTTON_WHITE = "#eeeeee";

var eventSystem = new EventSystem();

function draw_icon(s){
	if(s == "upg_point"){
		return '<img src="assets/img/upgrade_point.png" style="width:24px;height:24px;"></img>';
	}
	if(s == "pr_point"){
		return '<img src="assets/img/prestige_point.png" style="width:24px;height:24px;"></img>';
	}
}

var savegame = {};

var normal_upgrades =
{
	power: 			new NormalUpgrade("Increase your Progress Power by 25%.", new Decimal(10), 1.4),
  upgpoints: 	new NormalUpgrade("Increase your Upgrade Points by 10%.", new Decimal(50), 1.7),
  click:      new NormalUpgrade("Make Clicking stronger by 2% linearily.", new Decimal(100), 1.8),
  neededpr:   new NormalUpgrade("Level up 10% faster.", new Decimal(10000), 2.6),
  powerboost: new NormalUpgrade("Increase your Progress Power by a huge amount.", new Decimal("100e+276"), new Decimal("1e+72")),
  pointboost: new NormalUpgrade("Increase your  Upgrade Points by a huge amount.", new Decimal("100e+375"), new Decimal("74e+174"))
};

var UnlockType =
{
  BASICSTATS: 0,
  BASICBUTTONS: 1,
  NORMAL_UPGRADES: 2,
  PERMANENT_UPGRADES: 3,
  PRESTIGE: 4
};

var unlocks =
{
  basicstats: false,
  basicbuttons: false,
  normal_upgrades: false,
  permanent_upgrades: false,
  prestige: false
};

//get names
var normal_upgrade_names = Object.getOwnPropertyNames(normal_upgrades);
var unlock_names = Object.getOwnPropertyNames(unlocks);


var permupgrades = [
new NormalPermanentUpgrade(new Decimal(100),new Decimal(2),new Decimal(1),"permupg1"),
new NormalPermanentUpgrade(new Decimal(5e+3),new Decimal(1.5),new Decimal(1.5),"permupg2"),
new NormalPermanentUpgrade(new Decimal(100e+3),new Decimal(3),new Decimal(1),"permupg3"),
new NormalPermanentUpgrade(new Decimal(10e+6),new Decimal(1),new Decimal(2.5),"permupg4"),
new NormalPermanentUpgrade(new Decimal(800e+6),new Decimal(2),new Decimal(2),"permupg5"),
new NormalPermanentUpgrade(new Decimal(245e+15),new Decimal(7.7),new Decimal(5.5),"permupg6"),
new NormalPermanentUpgrade(new Decimal(2e+24),new Decimal(10.1),new Decimal(7.07),"permupg7"),
new NormalPermanentUpgrade(new Decimal(555e+30),new Decimal(11.1),new Decimal(11.1),"permupg8"),
new NormalPermanentUpgrade(new Decimal(400e+42),new Decimal(22.2),new Decimal(22.2),"permupg9"),
new NormalPermanentUpgrade(new Decimal(30e+57),new Decimal(44.4),new Decimal(44.4),"permupg10"),
new NormalPermanentUpgrade(new Decimal(2e+72),new Decimal(88.8),new Decimal(88.8),"permupg11"),
new NormalPermanentUpgrade(new Decimal(111.11e+93),new Decimal(999.9),new Decimal(999.9),"permupg12"),
new NormalPermanentUpgrade(new Decimal(712e+111),new Decimal(19.9),new Decimal(29.9),"permupg13"),
new NormalPermanentUpgrade(new Decimal(42e+132),new Decimal(44),new Decimal(33),"permupg14"),
new NormalPermanentUpgrade(new Decimal(987e+162),new Decimal(1470),new Decimal(1),"permupg15"),
new NormalPermanentUpgrade(new Decimal(12e+222),new Decimal(1),new Decimal(37),"permupg16"),
new NormalPermanentUpgrade(new Decimal(205e+240),new Decimal(100),new Decimal(100),"permupg17"),
new NormalPermanentUpgrade(new Decimal("753e+378"),new Decimal(9999),new Decimal(999),"permupg18"),
new NormalPermanentUpgrade(new Decimal("612e+684"),new Decimal(999e+3),new Decimal(999e+3),"permupg19"),
new NormalPermanentUpgrade(new Decimal("9e+1236"),new Decimal(999e+6),new Decimal(999e+6),"permupg20"),
new NormalPermanentUpgrade(new Decimal("100e+3123"),new Decimal(999e+12),new Decimal(999e+12),"permupg21")
];

///prestige upgrades
var permupgrades_prestige=[
new PrestigePermanentUpgrade(new Decimal(1),new Decimal(5),new Decimal(1),new Decimal(1),"prestigeupg1"),
new PrestigePermanentUpgrade(new Decimal(3),new Decimal(1),new Decimal(5),new Decimal(1),"prestigeupg2"),
new PrestigePermanentUpgrade(new Decimal(2),new Decimal(1),new Decimal(1),new Decimal(5),"prestigeupg3"),
new PrestigePermanentUpgrade(new Decimal(5),new Decimal(10),new Decimal(1),new Decimal(1),"prestigeupg4"),
new PrestigePermanentUpgrade(new Decimal(7),new Decimal(1),new Decimal(10),new Decimal(1),"prestigeupg5"),
new PrestigePermanentUpgrade(new Decimal(5),new Decimal(1),new Decimal(1),new Decimal(10),"prestigeupg6"),
new PrestigePermanentUpgrade(new Decimal(14),new Decimal(10),new Decimal(10),new Decimal(10),"prestigeupg7"),
new PrestigePermanentUpgrade(new Decimal(27),new Decimal(6),new Decimal(2),new Decimal(1.1),"prestigeupg8"),
new PrestigePermanentUpgrade(new Decimal(35),new Decimal(2),new Decimal(6),new Decimal(1.1),"prestigeupg9"),
new PrestigePermanentUpgrade(new Decimal(31),new Decimal(1.75),new Decimal(1.75),new Decimal(9),"prestigeupg10"),
new PrestigePermanentUpgrade(new Decimal(243),new Decimal(5),new Decimal(1),new Decimal(1),"prestigeupg11"),
new PrestigePermanentUpgrade(new Decimal(243),new Decimal(1),new Decimal(5),new Decimal(1),"prestigeupg12"),
new PrestigePermanentUpgrade(new Decimal(243),new Decimal(1),new Decimal(1),new Decimal(5),"prestigeupg13"),
new PrestigePermanentUpgrade(new Decimal(512),new Decimal(4),new Decimal(1),new Decimal(4),"prestigeupg14"),
new PrestigePermanentUpgrade(new Decimal(762),new Decimal(1),new Decimal(8),new Decimal(1),"prestigeupg15"),
new PrestigePermanentUpgrade(new Decimal(451),new Decimal(4),new Decimal(1),new Decimal(4),"prestigeupg16"),
new PrestigePermanentUpgrade(new Decimal(1251),new Decimal(7),new Decimal(8),new Decimal(9),"prestigeupg17"),
new PrestigePermanentUpgrade(new Decimal(2187),new Decimal(6),new Decimal(2),new Decimal(1.1),"prestigeupg18"),
new PrestigePermanentUpgrade(new Decimal(1489),new Decimal(2),new Decimal(6),new Decimal(1.1),"prestigeupg19"),
new PrestigePermanentUpgrade(new Decimal(2222),new Decimal(1.75),new Decimal(1.75),new Decimal(9),"prestigeupg20"),
new PrestigePermanentUpgrade(new Decimal(10203),new Decimal(99),new Decimal(99),new Decimal(99),"prestigeupg21")
];



////BUTTON EVENT LISTENERS////
nodes.button.speed_up.addEventListener("click",function(){
  active_click_multi += 0.05 + 0.001 * normal_upgrades.click.level;
});

nodes.button.level_1.addEventListener("click",function(){
	progress_current = new Decimal(0);
	progress_level = 0;
  upgrade_points = upgrade_points.plus(upgrade_points_get);
  upgrade_points_get = new Decimal(0);

	eventSystem.emit(eventSystem.Events.UPGRADE_POINTS_CHANGED, upgrade_points);
});



///PRESTIGE

nodes.button.get_prestige.addEventListener("click",function(){
	if(Decimal.max(prestige_points_get,new Decimal(1)).equals(prestige_points_get)){

		prestige_points = prestige_points.plus(prestige_points_get);

		//reset normal upgrades
		Object.getOwnPropertyNames(normal_upgrades).forEach(function(upg_name)
		{
			normal_upgrades[upg_name].price = normal_upgrades[upg_name].base_price;
			normal_upgrades[upg_name].level = 0;
		});

		//reset one time upgrades

		for(let i = 0; i < permupgrades.length; i++){
			if(permupgrades[i].bought)
			{
				permupgrades[i].bought = false;
				permupgrades[i].button.classList.remove("bought");
			}
		}

		normal_multi.progress = new Decimal(1);
		normal_multi.upg_points = new Decimal(1);

		upgrade_points = new Decimal(0);
		upgrade_points_get = new Decimal(0);
		progress_current = new Decimal(0);
		progress_level = 0;

		eventSystem.emit(eventSystem.Events.UPGRADE_POINTS_CHANGED, prestige_points);
		eventSystem.emit(eventSystem.Events.PRESTIGE_POINTS_CHANGED, prestige_points);

	}
});

function stringToBoolean(s)
{
  return s == "true";
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

Object.getOwnPropertyNames(normal_upgrades).forEach(function(normal_upgrade)
{
	normal_upgrades[normal_upgrade].init();
});

permupgrades.forEach(function(upg)
{
	upg.init();
});

permupgrades_prestige.forEach(function(upg)
{
	upg.init();
});

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

  active_click_multi = Math.max(1, active_click_multi / Math.pow(1.2, (1 / FPS)));

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

	prestige_points_get = progress_level >= 50 ? new Decimal(Math.floor(progress_level*progress_level/1000)).mul(Decimal.max(1,Decimal.pow(1.005,progress_level-500))) : new Decimal(0); //calc prestige points get

	progress_current = progress_current.plus(progress_power.div(FPS));

	////update texts////
	document.title = "Progress Bar | Level "+progress_level;

	if(progress_current.div(progress_needed).toNumber() != Infinity && progress_current.div(progress_needed).toNumber() != NaN){
		nodes.progress_bar.value = progress_current.div(progress_needed).toNumber();
	}
	else{
		nodes.progress_bar.value = 1;
	}

	nodes.progress_info.innerHTML = format_number(progress_current);
	nodes.text.level.innerHTML = progress_level;
	nodes.text.upg_points.innerHTML = format_number(upgrade_points);
  nodes.text.upg_points_get.innerHTML = format_number(upgrade_points_get);
  nodes.text.active_click_power_boost.innerHTML = active_click_multi.toFixed(2);
	nodes.text.prestige_points_get.innerHTML = format_number(prestige_points_get);
	//nodes.text.infobox.innerHTML = "You have <b>"+format_number(upgrade_points)+"</b> Upgrade Points<br/>You have <b>"+format_number(prestige_points)+"</b> Prestige Points";

  if(progress_level >= 1) UnlockFeature(UnlockType.BASICSTATS);
  if(progress_level >= 2) UnlockFeature(UnlockType.BASICBUTTONS);
  if(progress_level >= 3) UnlockFeature(UnlockType.NORMAL_UPGRADES);
  if(progress_level >= 10) UnlockFeature(UnlockType.PERMANENT_UPGRADES);
  if(progress_level >= 50) UnlockFeature(UnlockType.PRESTIGE);
}

setInterval(update, 1000/FPS);
setInterval(save_game, 10000);
