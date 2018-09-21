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

  let normalupg = tryToLoad(savegame, "normalUpgrades", {});
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
  };

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
  let code = prompt("Input your code:", "<encoded string>");

  try
  {
    localStorage.setItem("savegame",atob(code));
  }
  catch (e)
  {
    alert("Invalid import String!");
  }


  load_game();

  eventSystem.emit(eventSystem.Events.UPGRADE_POINTS_CHANGED, prestige_points);
  eventSystem.emit(eventSystem.Events.PRESTIGE_POINTS_CHANGED, prestige_points);
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
