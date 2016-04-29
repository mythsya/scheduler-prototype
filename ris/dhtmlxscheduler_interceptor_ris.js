Scheduler.plugin(function(scheduler){

scheduler.config.details_on_create=true;
scheduler.config.details_on_dblclick=true;
scheduler.config.xml_date="%Y-%m-%d %H:%i";
scheduler.config.api_date="%Y-%m-%d %H:%i";
scheduler.config.multi_day = true;
scheduler.config.check_limits = true;
scheduler.config.collision_limit = 1;
scheduler.config.drag_create = false;
scheduler.config.drag_move = false;
scheduler.config.drag_resize = false;
scheduler.config.limit_time_select = true;

//scheduler.config.enable_single_click = true;
scheduler.config.dblclick_create = true;
scheduler.config.edit_on_create = false;

var max_depth = 30;

//===============
//Customization
//===============

scheduler.attachEvent("onOptionsLoad", function(opts) {

	var mname = (opts && opts.name) || 'matrix';

	scheduler.templates[mname+"_scale_date"] = function(date) {
		var hour = (date||new Date()).getHours();
		if (hour < 8) {
			return "早";
		} else if (hour < 16) {
			return "中";
		} else {
			return "晚";
		}
		return "TEST";
	};

	scheduler.templates[mname+"_scalex_class"] = function(date){
		if (date.getDay()==0 || date.getDay()==6)  return "weekend_section";
		return "";
	};

	scheduler.templates[mname+"_second_scalex_class"] = function(date){
		if (date.getDay()==0 || date.getDay()==6)  return "weekend_section";
		return "";
	};	

	scheduler.templates.event_bar_date = function(start, end, evt) {
		return "";
	};

	scheduler.templates.event_bar_text = function(start, end, evt) {
		return "";
	};

	scheduler.templates.event_class = function(start, end, event){
		var original = scheduler.getEvent(event.id);

		return "multisection section_" + event.section_id;
	};
});


//===============
// Tooltip related code
//===============
scheduler.attachEvent("onMouseMove", function(id, e) {

	// while target has parent node and we haven't reached dhx_cal_data
	// we can keep checking if it is timeline section
	var isTooltipTarget = function(target) {
		var max_depth = 30, depth = 0;
		while (target.parentNode && depth <= max_depth) {
			var css = target.className.split(" ")[0];
			// if we are over matrix cell or tooltip itself
			if (css == "dhx_matrix_scell" || css == "dhtmlXTooltip" || css == "dhx_row_folder") {
				return { classname: css };
			}
			target = target.parentNode;
			depth ++;
		}
		return false;
	};	

	var timeline_view = scheduler.matrix[scheduler.getState().mode];

	// if we are over event then we can immediately return
	// or if we are not on timeline view
	if (id || !timeline_view) {
		return;
	}

	// native mouse event
	e = e||window.event;
	var target = e.target||e.srcElement;


	//make a copy of event, will be used in timed call, ie8 comp
	var ev = {
		'pageX':undefined,
		'pageY':undefined,
		'clientX':undefined,
		'clientY':undefined,
		'target':undefined,
		'srcElement':undefined
	};
	for(var i in ev){
		ev[i] = e[i];
	}

	var tooltip = scheduler.dhtmlXTooltip;
	var tooltipTarget = isTooltipTarget(target);
	if (tooltipTarget) {

		if (tooltipTarget.classname == "dhx_matrix_scell" || tooltipTarget.classname == "dhx_row_folder") {
			// we are over cell, need to get what cell it is and display tooltip
			var section_id = scheduler.getActionData(e).section;
			var section = timeline_view.y_unit[timeline_view.order[section_id]];

			// showing tooltip itself
			var text = "双击可以弹出设置窗口";
			tooltip.delay(tooltip.show, tooltip, [ev, text]);
		}
		if (tooltipTarget.classname == "dhtmlXTooltip") {


			dhtmlxTooltip.delay(tooltip.show, tooltip, [ev, tooltip.tooltip.innerHTML]);
		}
	}
});


//===============
//Event binding
//===============

scheduler.attachEvent("onYScaleDblClick", function(x, y, evt){
	console.info(arguments);
});

scheduler.attachEvent("onCellDblClick", function (x, y, a, b, e) {
	var src = e.target||e.srcElement;			
	if (scheduler.isFolderCell(src)) {
		console.info("onFolderCellDblClick");
	} 
});

scheduler._on_cell_click = 	function (e, src){			
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
			this.deleteEvent(id);					
			break;
		case "dhx_time_block":
		case "dhx_cal_container":
			break;
		case "dhx_matrix_cell":
		case "dhx_marked_timespan":
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
							this.deleteEvent(evs[i].id);									
						}
					}
				}
			}
			if (!eventExists) {
				this._on_dbl_click(e);
			}
			break;
		default:
			var t = this["click_"+name];
			if (t) {
				t.call(this,e);
			}
			else {
				if (src.parentNode && src != this)
					return scheduler._on_cell_click(e,src.parentNode);
			}
			break;
	}
};

scheduler.attachEvent("onCellClick", function (x, y, a, b, e) {			
	var src = e.target||e.srcElement;
	if (!scheduler.isFolderCell(src)) {				
		if (this.config.readonly) return;
		this._on_cell_click(e, src);
	}
});


});