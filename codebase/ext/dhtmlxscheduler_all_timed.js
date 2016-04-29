/*
@license
dhtmlxScheduler v.4.3.25 Professional

This software is covered by DHTMLX Enterprise License. Usage without proper license is prohibited.

(c) Dinamenta, UAB.
*/
Scheduler.plugin(function(e){!function(){e.config.all_timed="short";var t=function(e){return!((e.end_date-e.start_date)/36e5>=24)};e._safe_copy=function(t){var a=null,i=null;return t.event_pid&&(a=e.getEvent(t.event_pid)),a&&a.isPrototypeOf(t)?(i=e._copy_event(t),delete i.event_length,delete i.event_pid,delete i.rec_pattern,delete i.rec_type):i=e._lame_clone(t),i};var a=e._pre_render_events_line;e._pre_render_events_line=function(i,n){function r(e){var t=s(e.start_date);return+e.end_date>+t}function s(t){
var a=e.date.add(t,1,"day");return a=e.date.date_part(a)}function d(t,a){var i=e.date.date_part(new Date(t));return i.setHours(a),i}if(!this.config.all_timed)return a.call(this,i,n);for(var o=0;o<i.length;o++){var _=i[o];if(!_._timed)if("short"!=this.config.all_timed||t(_)){var l=this._safe_copy(_);l.start_date=new Date(l.start_date),r(_)?(l.end_date=s(l.start_date),24!=this.config.last_hour&&(l.end_date=d(l.start_date,this.config.last_hour))):l.end_date=new Date(_.end_date);var c=!1;l.start_date<this._max_date&&l.end_date>this._min_date&&l.start_date<l.end_date&&(i[o]=l,
c=!0);var h=this._safe_copy(_);if(h.end_date=new Date(h.end_date),h.start_date<this._min_date?h.start_date=d(this._min_date,this.config.first_hour):h.start_date=d(s(_.start_date),this.config.first_hour),h.start_date<this._max_date&&h.start_date<h.end_date){if(!c){i[o--]=h;continue}i.splice(o+1,0,h)}}else i.splice(o--,1)}var u="move"==this._drag_mode?!1:n;return a.call(this,i,u)};var i=e.get_visible_events;e.get_visible_events=function(e){return this.config.all_timed&&this.config.multi_day?i.call(this,!1):i.call(this,e);
},e.attachEvent("onBeforeViewChange",function(t,a,i,n){return e._allow_dnd="day"==i||"week"==i,!0}),e._is_main_area_event=function(e){return!!(e._timed||this.config.all_timed===!0||"short"==this.config.all_timed&&t(e))};var n=e.updateEvent;e.updateEvent=function(t){var a,i=e.config.all_timed&&!(e.isOneDayEvent(e._events[t])||e.getState().drag_id);i&&(a=e.config.update_render,e.config.update_render=!0),n.apply(e,arguments),i&&(e.config.update_render=a)}}()});
//# sourceMappingURL=../sources/ext/dhtmlxscheduler_all_timed.js.map