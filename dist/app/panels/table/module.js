/*! banana-fusion - v1.6.9 - 2016-05-27
 * https://github.com/LucidWorks/banana/wiki
 * Copyright (c) 2016 Andrew Thanalertvisuti; Licensed Apache License */

define("panels/table/module",["angular","app","underscore","kbn","moment"],function(a,b,c,d,e){"use strict";var f=a.module("kibana.panels.table",[]);b.useModule(f),f.controller("table",["$rootScope","$scope","$timeout","timer","fields","querySrv","dashboard","filterSrv",function(b,e,f,g,h,i,j,k){e.panelMeta={modals:[{description:"Inspect",icon:"icon-info-sign",partial:"app/partials/inspector.html",show:e.panel.spyable}],editorTabs:[{title:"Fields",src:"app/panels/table/fields.html"},{title:"Paging",src:"app/panels/table/pagination.html"},{title:"Queries",src:"app/partials/querySelect.html"}],exportfile:!0,status:"Stable",description:"A paginated table of records matching your query (including any filters that may have been applied). Click on a row to expand it and review all of the fields associated with that document. Provides the capability to export your result set to CSV, XML or JSON for further processing using other systems."};var l={status:"Stable",queries:{mode:"all",ids:[],query:"*:*",basic_query:"",custom:""},size:100,pages:5,offset:0,sort:[],sortable:!1,group:"default",style:{"font-size":"9pt"},overflow:"min-height",fields:[],important_fields:[],highlight:[],header:!0,paging:!0,field_list:!0,trimFactor:300,normTimes:!0,spyable:!0,saveOption:"json",exportSize:100,exportAll:!0,displayLinkIcon:!0,imageFields:[],imgFieldWidth:"auto",imgFieldHeight:"85px",show_queries:!0,maxNumCalcTopFields:20,calcTopFieldValuesFromAllData:!1,refresh:{enable:!1,interval:2}};c.defaults(e.panel,l),e.init=function(){e.Math=Math,e.sjs=e.sjs||sjsResource(j.current.solr.server+j.current.solr.core_name),e.$on("refresh",function(){e.get_data()}),e.panel.exportSize=e.panel.size*e.panel.pages,e.fields=h,c.isEmpty(e.panel.important_fields)&&(e.panel.important_fields=h.list),e.panel.refresh.enable&&e.set_timer(e.panel.refresh.interval),e.get_data()},e.percent=d.to_percent,e.set_timer=function(a){e.panel.refresh.interval=a,c.isNumber(e.panel.refresh.interval)?(g.cancel(e.refresh_timer),e.realtime()):g.cancel(e.refresh_timer)},e.realtime=function(){e.panel.refresh.enable?(g.cancel(e.refresh_timer),e.refresh_timer=g.register(f(function(){e.realtime(),e.get_data()},1e3*e.panel.refresh.interval))):g.cancel(e.refresh_timer)},e.toggle_micropanel=function(a,b){var f=c.map(e.data,function(a){return a.kibana._source}),g={},h=0;e.panel.calcTopFieldValuesFromAllData?(g=solrSrv.getTopFieldValues(a),h=g.totalcount):(g=d.top_field_values(f,a,10,b),h=c.countBy(f,function(b){return c.contains(c.keys(b),a)})["true"]),e.micropanel={field:a,grouped:b,values:g.counts,hasArrays:g.hasArrays,related:d.get_related_fields(f,a),count:h}},e.micropanelColor=function(a){var b=["bar-success","bar-warning","bar-danger","bar-info","bar-primary"];return a>b.length?"":b[a]},e.set_sort=function(a){e.panel.sort[0]===a?e.panel.sort[1]="asc"===e.panel.sort[1]?"desc":"asc":e.panel.sort[0]=a,e.get_data()},e.toggle_field=function(a){if(c.indexOf(e.panel.fields,a)>-1)e.panel.fields=c.without(e.panel.fields,a);else{if(!(c.indexOf(h.list,a)>-1))return;e.panel.fields.push(a)}},e.toggle_important_field=function(a){c.indexOf(e.panel.important_fields,a)>-1?e.panel.important_fields=c.without(e.panel.important_fields,a):e.panel.important_fields.push(a)},e.toggle_highlight=function(a){c.indexOf(e.panel.highlight,a)>-1?e.panel.highlight=c.without(e.panel.highlight,a):e.panel.highlight.push(a)},e.toggle_details=function(a){a.kibana.details=a.kibana.details?!1:!0,a.kibana.view=a.kibana.view||"table"},e.page=function(a){e.panel.offset=a*e.panel.size,e.get_data()},e.build_search=function(b,d,f){var g;c.isArray(d)?g="("+c.map(d,function(b){return a.toJson(b)}).join(" AND ")+")":c.isUndefined(d)?(g="*:*",f=!f):g=a.toJson(d),k.set({type:"field",field:b,query:g,mandate:f?"mustNot":"must"}),e.panel.offset=0,j.refresh()},e.fieldExists=function(a,b){k.set({type:"exists",field:a,mandate:b}),j.refresh()},e.get_data=function(a,b){if(e.panel.error=!1,delete e.panel.error,0!==j.indices.length){e.panelMeta.loading=!0,e.panel.queries.ids=i.idsByMode(e.panel.queries),e.panel.calcTopFieldValuesFromAllData&&(e.panel.important_fields.length>e.panel.maxNumCalcTopFields?alert("You cannot specify more than "+e.panel.maxNumCalcTopFields+" fields for the calculation. Please select less fields."):solrSrv.calcTopFieldValues(e.panel.important_fields));var f=c.isUndefined(a)?0:a;e.segment=f,e.sjs.client.server(j.current.solr.server+j.current.solr.core_name);var g=e.sjs.Request().indices(j.indices[f]);e.panel_request=g;var h="";k.getSolrFq()&&(h="&"+k.getSolrFq());var l,m=e.panel.size*e.panel.pages,n="&wt=json",o="";void 0!==e.panel.sort[0]&&void 0!==e.panel.sort[1]&&e.panel.sortable&&(o="&sort="+e.panel.sort[0]+" "+e.panel.sort[1]),l=void 0!==m&&0!==m?"&rows="+m:"&rows=25",e.panel.queries.basic_query=i.getORquery()+h+o,e.panel.queries.query=e.panel.queries.basic_query+n+l,g=null!=e.panel.queries.custom?g.setQuery(e.panel.queries.query+e.panel.queries.custom):g.setQuery(e.panel.queries.query);var p=g.doSearch();p.then(function(a){return e.panel.offset=0,e.panelMeta.loading=!1,0===f?(e.hits=0,e.data=[],b=e.query_id=(new Date).getTime()):e.data=[],c.isUndefined(a.error)?void(e.query_id===b&&(e.data=e.data.concat(c.map(a.response.docs,function(a){var b=c.clone(a);return b.kibana={_source:d.flatten_json(a),highlight:d.flatten_json(a.highlight||{})},b})),e.hits=a.response.numFound,e.data=e.data.slice(0,e.panel.size*e.panel.pages),e.panel.important_fields=[],c.each(e.data,function(a){e.panel.important_fields=c.union(c.keys(a.kibana._source))}),(e.data.length<e.panel.size*e.panel.pages||!c.contains(k.timeField(),e.panel.sort[0])||"desc"!==e.panel.sort[1])&&f+1<j.indices.length&&e.get_data(f+1,e.query_id))):void(e.panel.error=e.parse_error(a.error.msg))})}},e.exportfile=function(a){var b="&omitHeader=true",c="&rows="+(e.panel.exportSize||e.panel.size*e.panel.pages),f="";if(!e.panel.exportAll){f="&fl=";for(var g=0;g<e.panel.fields.length;g++)f+=e.panel.fields[g]+(g!==e.panel.fields.length-1?",":"")}var h=e.panel.queries.basic_query+"&wt="+a+b+c+f,i=e.panel_request;i=null!=e.panel.queries.custom?i.setQuery(h+e.panel.queries.custom):i.setQuery(h);var j=i.doSearch();j.then(function(b){d.download_response(b,a,"table")})},e.facet_label=function(a){return k.translateLanguageKey("facet",a,j.current)},e.populate_modal=function(b){e.inspector=a.toJson(JSON.parse(b.toString()),!0)},e.without_kibana=function(a){var b=c.clone(a);return delete b.kibana,b},e.set_refresh=function(a){e.refresh=a},e.close_edit=function(){e.panel.refresh.enable&&e.set_timer(e.panel.refresh.interval),e.refresh&&e.get_data(),e.refresh=!1},e.locate=function(a,b){b=b.split(".");for(var c=/(.+)\[(\d+)\]/,d=0;d<b.length;d++){var e=c.exec(b[d]);a=e?a[e[1]][parseInt(e[2],10)]:a[b[d]]}return a}}]),f.filter("tableHighlight",function(){return function(a){return!c.isUndefined(a)&&!c.isNull(a)&&a.toString().length>0?a.toString().replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\r?\n/g,"<br/>").replace(/@start-highlight@/g,'<code class="highlight">').replace(/@end-highlight@/g,"</code>"):""}}),f.filter("tableTruncate",function(){return function(a,b,d,e,f){return"undefined"!=typeof e&&f.length>0&&c.contains(f,e)?a:!c.isUndefined(a)&&!c.isNull(a)&&a.toString().length>0?a.length>b/d?a.substr(0,b/d)+"...":a:""}}),f.filter("tableJson",function(){var b;return function(d,e){return!c.isUndefined(d)&&!c.isNull(d)&&d.toString().length>0?(b=a.toJson(d,e>0?!0:!1),b=b.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),e>1&&(b=b.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,function(a){var b="number";return/^"/.test(a)?b=/:$/.test(a)?"key strong":"":/true|false/.test(a)?b="boolean":/null/.test(a)&&(b="null"),'<span class="'+b+'">'+a+"</span>"})),b):""}}),f.filter("tableFieldFormat",["fields",function(a){return function(b,d,f,g){var h;return c.isUndefined(a.mapping[f._index])||c.isUndefined(a.mapping[f._index][f._type])||(h=a.mapping[f._index][f._type][d].type,"date"!==h||!g.panel.normTimes)?b:e(b).format("YYYY-MM-DD HH:mm:ss")}}]),f.filter("tableDisplayImageField",function(){return function(a,b,d,e,f){return"undefined"!=typeof b&&d.length>0&&c.contains(d,b)?'<img style="width:'+e+"; height:"+f+';" src="'+a+'">':a}})});