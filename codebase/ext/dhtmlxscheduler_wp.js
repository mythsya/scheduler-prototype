/*
@license
dhtmlxScheduler v.4.3.25 Professional

This software is covered by DHTMLX Enterprise License. Usage without proper license is prohibited.

(c) Dinamenta, UAB.
*/
Scheduler.plugin(function(e){e.attachEvent("onLightBox",function(){if(this._cover)try{this._cover.style.height=this.expanded?"100%":(document.body.parentNode||document.body).scrollHeight+"px"}catch(e){}}),e.form_blocks.select.set_value=function(e,t,a){("undefined"==typeof t||""===t)&&(t=(e.firstChild.options[0]||{}).value),e.firstChild.value=t||""}});
//# sourceMappingURL=../sources/ext/dhtmlxscheduler_wp.js.map