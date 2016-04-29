Scheduler.plugin(function(scheduler){

scheduler.unset_actions = function(){
	for (var a in this._els)
		if (this._click[a])
			for (var i=0; i < this._els[a].length; i++)
				this._els[a][i].onclick = null;
	this._obj.onselectstart = null;
	this._obj.onmousemove = null;
	this._obj.onmousedown = null;
	this._obj.onmouseup = null;
	this._obj.ondblclick = null;
	this._obj.onclick = null;
	this._obj.oncontextmenu = null;
};

scheduler.set_actions=function(){
	
	for (var a in this._els)
		if (this._click[a])
			for (var i=0; i < this._els[a].length; i++)
				this._els[a][i].onclick=scheduler._click[a];
	this._obj.onselectstart=function(e){ return false; };
	this._obj.onmousemove=function(e){
		if (!scheduler._temp_touch_block)
			scheduler._on_mouse_move(e||event);
	};
	this._obj.onmousedown=function(e){
		if (!scheduler._ignore_next_click)
			scheduler._on_mouse_down(e||event);
	};
	this._obj.onmouseup=function(e){
		if (!scheduler._ignore_next_click)
			scheduler._on_mouse_up(e||event);
	};
	this._obj.onclick=function(e){
		if (scheduler.config.enable_single_click) {
			scheduler._on_click(e||event);
		}
	};	
	this._obj.ondblclick=function(e){
		//if (!scheduler.config.enable_single_click) {
			scheduler._on_dbl_click(e||event);
		//}
	};
	this._obj.oncontextmenu = function(e) {
		var ev = e||event;
		var src = ev.target||ev.srcElement;
		var returnValue = scheduler.callEvent("onContextMenu", [scheduler._locate_event(src), ev]);
		return returnValue;
	};
};

scheduler._on_click=function(e,src){
	src = src||(e.target||e.srcElement);
	if (this.config.readonly) return;
	var name = (src.className||"").split(" ")[0];
	switch(name){
		case "dhx_scale_holder":
		case "dhx_scale_holder_now":
		case "dhx_month_body":
		case "dhx_wa_day_data":
			break;
		case "dhx_cal_event":
		case "dhx_wa_ev_body":
		case "dhx_agenda_line":
		case "dhx_grid_event":
		case "dhx_cal_event_line":
		case "dhx_cal_event_clear":
			var id = this._locate_event(src);
			//this.deleteEvent(id);
			this.callEvent("onEventClick",[id,e]);
			break;
		case "dhx_time_block":
		case "dhx_cal_container":
			break;
		case "dhx_matrix_cell":
			var dt = this.getActionData(e);
			var eventExists = false;
			if (dt) {
				var start = dt.date,
				    section_id = dt.section,
				    step = (this.config.event_duration||this.config.time_step)*60000,
				    end = new Date(start.valueOf()+step),
				    evs = this.getEvents(start, end);

				if (evs && evs.length > 0) {						
					for(var i=0; i<evs.length; i++) {
						if (section_id == evs[i].section_id) {
							eventExists = true;
							//this.deleteEvent(evs[i].id);
							this.callEvent("onEventClick",[evs[i].id,e]);
						}
					}
				}
			}
			if (!eventExists) {
				var t = this["click_"+name];
				if (t) {
					t.call(this,e);
				}
				else {
					if (src.parentNode && src != this)
						return scheduler._on_click(e,src.parentNode);
				}
			}
			break;
		default:
			var t = this["click_"+name];
			if (t) {
				t.call(this,e);
			}
			else {
				if (src.parentNode && src != this)
					return scheduler._on_click(e,src.parentNode);
			}
			break;
	}
};


});