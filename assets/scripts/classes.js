class EventSystem
{
  constructor()
  {
    this.Events =
    {
      UPGRADE_POINTS_CHANGED: "upgradepointschanged",
      PRESTIGE_POINTS_CHANGED: "prestigepointschanged"
    };

    this.events = {};
  }

  emit(event, payload)
  {
    for(let id in this.events[event])
    {
      this.events[event][id](payload);
    }
  }

  subscribe(event, id, callback)
  {
    if(this.events[event] === undefined)
    {
      this.events[event] = {};
    }


    this.events[event][id] = callback;
  }

  unsubscribe(event, id)
  {
    delete this.events[event][id];
  }
}


class NormalUpgrade
{
  constructor(desc, base_price, price_increase)
  {
    this.button = nodes.container.normal_upgrades.appendChild(document.createElement("button"));
    this.button.className = "upgrade-button normal";
    this.description = desc;
    this.level = 0;
    this.base_price = base_price; this.price = this.base_price;
    this.price_increase = price_increase;

    this.id = generateUUID();
  }

  init()
  {
    this.button.addEventListener("click", this.click_buy_callback.bind(this));

    this.update_display();

    eventSystem.subscribe(eventSystem.Events.UPGRADE_POINTS_CHANGED, this.id, this.update_display.bind(this));
  }

  click_buy_callback() //click function
  {
    if(!nodes.checkbox_buymax.checked)
    {

      this.buy();
    }
    else
    {
      this.buy_max();
    }

    this.update_display();
  }

  buy()
  {
    if(upgrade_points.gte(this.price)) //upgrade_points >= upgrade_power.price
    {
      upgrade_points = upgrade_points.sub(this.price);
      this.level++;
      this.price = Decimal.floor(Decimal.mul(this.base_price, Decimal.pow(this.price_increase, this.level)));

      eventSystem.emit(eventSystem.Events.UPGRADE_POINTS_CHANGED, upgrade_points);
    }
  }

  buy_max()
  {
    let target_level = this.level, total_cost = new Decimal(0);

    //level up
    while((total_cost.add(this.price)).lte(upgrade_points)) //upgrade_points >= upgrade_power.price
    {
      total_cost = total_cost.add(this.price);
      target_level++;
      this.price = Decimal.floor(Decimal.mul(this.base_price, Decimal.pow(this.price_increase, target_level)));
    }

    upgrade_points = upgrade_points.sub(total_cost);
    this.level = target_level;
    this.price = Decimal.floor(Decimal.mul(this.base_price, Decimal.pow(this.price_increase, this.level)));

    eventSystem.emit(eventSystem.Events.UPGRADE_POINTS_CHANGED, upgrade_points);
  }

  update_display()
  {
    this.button.innerHTML = this.description + "<br/>" +
      "Price: " + format_number(this.price) + draw_icon("upg_point") + "<br/>" +
      "Level: " + this.level;

    this.button.disabled = this.price.gte(upgrade_points);
    this.button.style.visibility = (this.price.div(1e+9)).gte(upgrade_points) ? "hidden" : "visible";
  }
}

class NormalPermanentUpgrade //NORMAL UPGRADE
{
  constructor(price,effect_progress,effect_upgpoints,button_id)
  {
    this.price = price;
  	this.bought = false;

  	this.button = nodes.container.permanent_upgrades.appendChild(document.createElement("button"));
    this.button.id = button_id;
    this.button.className = "upgrade-button normal";

  	this.effect_pr = effect_progress;
  	this.effect_upgp = effect_upgpoints;

    this.id = generateUUID();
  }

  init()
  {
    this.button.addEventListener("click",this.buy.bind(this));
    this.update_display(upgrade_points);

    if(this.bought)
    {
      this.button.classList.add("bought");
    }

    eventSystem.subscribe(eventSystem.Events.UPGRADE_POINTS_CHANGED, this.id, this.update_display.bind(this));
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

  update_display(points)
  {
    this.button.innerHTML = (this.effect_pr > 1 ? "Get " + format_number(this.effect_pr) + "x Progress Power<br/>" : "") +
                            (this.effect_upgp > 1 ? "Get " + format_number(this.effect_upgp) + "x Upgrade Points <br/>" : "") +
                            "<br/>"+format_number(this.price)+draw_icon("upg_point");



    this.button.disabled = this.price.gte(upgrade_points) && !this.bought;
    this.button.style.visibility = (this.price.div(1e+9)).gte(upgrade_points) ? "hidden" : "visible";
  }

}

class PrestigePermanentUpgrade //PRESTIGE UPGRADE
{
  constructor(price, effect_progress, effect_upgpoints, effect_progressneeded, button_id)
  {
    this.price = price;
    this.bought = false;

    this.button = nodes.container.prestige.appendChild(document.createElement("button"));
    this.button.id = button_id;
    this.button.className = "upgrade-button prestige";

    this.effect_pr = effect_progress;
    this.effect_upgp = effect_upgpoints;
    this.effect_prneeded = effect_progressneeded;

    this.id = generateUUID();
  }

  init()
  {
    this.button.addEventListener("click",this.buy.bind(this));

    this.update_display();

    eventSystem.subscribe(eventSystem.Events.PRESTIGE_POINTS_CHANGED, this.id, this.update_display.bind(this));
  }

	buy()
  {
		if(prestige_points.gte(this.price) && !this.bought)
    {
  		prestige_points = prestige_points.sub(this.price);
  		this.bought = true;
  		this.button.classList.add("bought");
  		prestige_multi.progress = prestige_multi.progress.mul(this.effect_pr);
  		prestige_multi.upg_points = prestige_multi.upg_points.mul(this.effect_upgp);
  		prestige_multi.prneeded = prestige_multi.prneeded.mul(this.effect_prneeded);
		}
	}

	update_display()
  {
    this.button.innerHTML = (this.effect_pr > 1 ? "Get " + format_number(this.effect_pr) + "x Progress Power <br/>" : "") +
                            (this.effect_upgp > 1 ? "Get " + format_number(this.effect_upgp) + "x Upgrade Points <br/>" : "") +
                            (this.effect_prneeded > 1 ? "Need " + format_number(this.effect_prneeded) + "x less Progress <br/>" : "") +
                            "Price: " + format_number(this.price) + draw_icon("pr_point");


    this.button.disabled = this.price.gte(prestige_points);
	}
}
