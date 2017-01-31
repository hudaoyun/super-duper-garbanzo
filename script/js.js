var adminid='0',apiurl='',token='',adminname='',userinfo={},adminface='images/noface.png';
var get=function(id){return document.getElementById(id)};
var isempt=function(an){var ob	= false;if(an==''||an==null||typeof(an)=='undefined'){ob=true;}return ob;}
var form=function(an,fna){if(!fna)fna='myform';return document[fna][an]}
var xy10=function(s){var s1=''+s+'';if(s1.length<2)s1='0'+s+'';return s1;};
var js={};
js.getarr=function(caa,bo){
	var s='';
	for(var a in caa)s+=' @@ '+a+'=>'+caa[a]+'';
	if(!bo)alert(s);
	return s;
}
function initbody(){}
$(document).ready(function(){
	adminid = js.getoption('adminid','0');
	token 	= js.getoption('token');
	initbody();
});
js.getrand=function(){
	var r;
	r = ''+new Date().getTime()+'';
	r+='_'+parseInt(Math.random()*9999)+'';
	return r;
}
js.formatsize=function(size){
	var arr = new Array('Byte', 'KB', 'MB', 'GB', 'TB', 'PB');
	var e	= Math.floor(Math.log(size)/Math.log(1024));
	var fs	= size/Math.pow(1024,Math.floor(e));
	return js.float(fs)+' '+arr[e];
}
js.request=function(name,url){
	if(!name)return '';
	if(!url)url=location.href;
	if(url.indexOf('\?')<0)return '';
	neurl=url.split('\?')[1];
	neurl=neurl.split('&');
	var value=''
	for(i=0;i<neurl.length;i++){
		val=neurl[i].split('=');
		if(val[0].toLowerCase()==name.toLowerCase()){
			value=val[1];
			break;
		}
	}
	if(!value)value='';
	return value;
}
js.now=function(type,sj){
	if(!type)type='Y-m-d';
	if(type=='now')type='Y-m-d H:i:s';
	var dt,ymd,his,weekArr,Y,m,d,w,H=0,i=0,s=0,W;
	if(typeof(sj)=='string')sj=sj.replace(/\//gi,'-');
	if(/^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}/.test(sj)){
		sj=sj.split(' ');
		ymd=sj[0];
		his=sj[1];if(!his)his='00:00:00';
		ymd=ymd.split('-');
		his=his.split(':');
		H = his[0];if(his.length>1)i = his[1];if(his.length>2)s = his[2];
		dt=new Date(ymd[0],ymd[1]-1,ymd[2],H,i,s);
	}else{
		dt=(typeof(sj)=='number')?new Date(sj):new Date();
	}
	weekArr=new Array('日','一','二','三','四','五','六');
	Y=dt.getFullYear();
	m=xy10(dt.getMonth()+1);
	d=xy10(dt.getDate());
	w=dt.getDay();
	H=xy10(dt.getHours());
	i=xy10(dt.getMinutes());
	s=xy10(dt.getSeconds());
	W=weekArr[w];
	if(type=='time'){
		return dt.getTime();
	}else{
		return type.replace('Y',Y).replace('m',m).replace('d',d).replace('H',H).replace('i',i).replace('s',s).replace('w',w).replace('W',W);
	}
}
js.splittime=0;
js.serverdt=function(atype){
	if(!atype)atype='Y-m-d H:i:s';
	var d1=js.now('time')-js.splittime*1000;
	var dt=js.now(atype,d1);
	return dt;
}
js.float=function(num,w){
	if(isNaN(num)||num==''||!num||num==null)num='0';
	num=parseFloat(num);
	if(!w&&w!=0)w=2;
	var m=num.toFixed(w);
	return m;	
}
js.isimg = function(lx){
	var ftype 	= '|png|jpg|bmp|gif|jpeg|';
	var bo		= false;
	if(ftype.indexOf('|'+lx+'|')>-1)bo=true;
	return bo;
}
js.setoption=function(k,v){
	try{
		if(isempt(v)){
			localStorage.removeItem(k);
		}else{
			localStorage.setItem(k, v);
		}
		return true;
	}catch(e){return false}
}
js.getoption=function(k,dev){
	var s = '';
	try{s = localStorage.getItem(k);}catch(e){}
	if(isempt(dev))dev='';
	if(isempt(s))s=dev;
	return s;
}
js.msg = function(lx, txt,sj){
	clearTimeout(this.msgshowtime);
	if(typeof(sj)=='undefined')sj=5;
	$('#msgshowdivla').remove();
	if(lx == 'none' || !lx){
		return;
	}
	if(lx == 'wait'){
		txt	= '<img src="images/loadings.gif" height="14" width="15" align="absmiddle"> '+txt;
		sj	= 60;
	}
	if(lx=='msg')txt='<font color=red>'+txt+'</font>';var t=60;
	var s = '<div id="msgshowdivla" onclick="$(this).remove()" style="position:fixed;top:'+t+'px;z-index:20;width:100%" align="center"><div style="padding:8px;margin:0px 20px; background:rgba(0,0,0,0.7);color:white;font-size:16px;">'+txt+'</div></div>';
	$('body').append(s);
	if(sj>0)this.msgshowtime= setTimeout("$('#msgshowdivla').remove()",sj*1000);	
}
js.decode=function(str){
	var arr	= {length:-1};
	try{
		arr	= new Function('return '+str+'')();
	}catch(e){}
	return arr;
}
js.apply=function(a,b){
	if(!a)a={};
	if(!b)b={};
	for(var c in b)a[c]=b[c];
	return a;
}
js.apiurl=function(m,a){
	var url=''+apiurl+'api.php?m='+m+'&a='+a+'&adminid='+adminid+'';
	var cfrom='app'+api.systemType+'';
	url+='&device='+api.deviceId+'';
	url+='&cfrom='+cfrom+'';
	url+='&token='+token+'';
	return url;
}
js.ajaxbool = false;
js.ajaxwurbo = false;
js.ajax=function(m,a,d,fun1,mod,checs,errf){
	if(js.ajaxbool && !js.ajaxwurbo)return;
	clearTimeout(js.ajaxrequestime);
	if(!fun1)fun1=function(){};
	if(!errf)errf=function(){};
	if(!checs)checs=function(){};
	var bs = checs(d);
	if(typeof(bs)=='string'&&bs!=''){
		js.msg('msg', bs);
		return;
	}
	if(typeof(bs)=='object')d=js.apply(d,bs);
	if(!mod)mod='mod';
	js.ajaxbool=true;
	var tsnr = '努力处理中...';
	if(mod=='mod'){
		api.showProgress({title: tsnr,text: '',modal: true});
	}else if(mod=='wait'){
		js.msg(mod, tsnr);
	}
	var url=js.apiurl(m,a);
	api.ajax({
		url: url,
		method: 'post',
		dataType:'json',
		data: {values:d}
	},function(ret, err){
		js.ajaxbool=false;
		api.refreshHeaderLoadDone();
		api.hideProgress();
		clearTimeout(js.ajaxrequestime);
		js.msg('none');
		if(ret){
			if(ret.code!=200){
				js.msg('msg', 'err1:'+ret.msg);
			}else{
				fun1(ret.data);
			}
		}else{
			js.msg('msg', 'err:'+err.msg);
			errf(err);
		}
	});
	js.ajaxrequestime=setTimeout(function(){
		api.refreshHeaderLoadDone();
		js.ajaxbool=false;
		api.hideProgress();
		js.msg('msg', 'err:请求超时');
		errf();
	},1000*30);
}
js.sendevent=function(typ,na,d){
	if(!d)d={};
	d.opttype=typ;
	if(!na)na='xinhuhome';
	api.sendEvent({
		name: na,
		extra:d
	});
}
js.openwin=function(name,url,cns,pls){
	var psh = (pls)?'html/':'';
	if(url.indexOf('.')<0){
		url=''+apiurl+'task.php?fn='+url+'';
	}else{
		if(url.indexOf('http')!=0)url = apiurl+url;
	}
	url+='&adminid='+adminid+'&token='+token+'';
	if(cns)for(var i in cns)url+='&'+i+'='+cns[i]+'';
	api.openWin({
		name:  'url'+js.getrand(),
		url: ''+psh+'url.html',
		bounces:false,
		delay: 200,
		slidBackEnabled:true,
		vScrollBarEnabled:false,
		hScrollBarEnabled:false,
		pageParam:{
			name: name,
			url:url
		}
	});
}
js.openurl = function(url){
	url+='&adminid='+adminid+'&token='+token+'';
	api.openWin({
		name:  'url'+js.getrand(),
		url: url,
		bounces:false,
		slidBackEnabled:true,
		vScrollBarEnabled:false,
		hScrollBarEnabled:false,
		allowEdit:false,
		progress:{ type:'',title:'', text:'',   color:''}
	});
}
js.openwins = function(name,num, csae, pls){
	var psh = (pls)?'html/':'';
	var cans = js.apply({num:num,name:name}, csae);
	api.openWin({
		name: 'win_'+num+'',
		url: ''+psh+'win.html',
		bounces:false,
		delay: 200,
		slidBackEnabled:true,
		vScrollBarEnabled:false,
		hScrollBarEnabled:false,
		pageParam:cans
	});
}
js.openchat=function(type,name,uid,otype){
	var num = ''+type+'_'+uid+'';
	if(!otype)otype=0;
	var nsea='chat_'+num+'';
	if(otype==1)nsea+='_user';
	api.openWin({
		name: nsea,
		url: 'chat.html',
		bounces:false,
		delay: 200,
		slidBackEnabled:true,
		vScrollBarEnabled:false,
		hScrollBarEnabled:false,
		pageParam:{
			type:type,
			num:num,
			uid:uid,
			name:name,
			otype:otype
		}
	});
	dbsite.updatedata('indexchat',"and `type`='"+type+"' and `aid`='"+uid+"'", false,"`stotal`='0'");
}
js.showmenu=function(d){
	$('#menulistshow').remove();
	var d=js.apply({width:200,top:'50%',renderer:function(){},align:'center',onclick:function(){},oncancel:function(){}},d);
	var a=d.data;
	if(!a)return;
	var h1=$(window).height(),h2=document.body.scrollHeight;
	if(h2>h1)h1=h2;
	var col='';
	var s='<div onclick="$(this).remove();" align="center" id="menulistshow" style="background:rgba(0,0,0,0.3);height:'+h1+'px;width:100%;position:absolute;left:0px;top:0px;z-index:9999" >';
	s+='<div id="menulistshow_s" style="width:'+d.width+'px;margin-top:'+d.top+';position:fixed" class="aui-border">';
	s+='<ul class="aui-user-view" style="margin:0;">';
	for(var i=0;i<a.length;i++){
		s+='<li oi="'+i+'" style="color:'+a[i].color+';text-align:'+d.align+'" class="aui-user-view-cell">';
		s1=d.renderer(a[i]);
		if(s1){s+=s1}else{s+=''+a[i].name+'';}
		s+='</li>';
	}
	s+='</ul></div>';
	s+='</div>';
	$('body').append(s);
	var l=($(window).width()-d.width)*0.5,o1 = $('#menulistshow_s'),t = ($(window).height()-o1.height()-10)*0.5;
	o1.css({'left':''+l+'px','margin-top':''+t+'px'});
	$('#menulistshow li').click(function(){
		var oi=parseFloat($(this).attr('oi'));
		d.onclick(a[oi],oi);
	});
	$('#menulistshow').click(function(){
		$(this).remove();
		try{d.oncancel();}catch(e){}
	});
};

var dbsite={
	dbsitename:'rockxinhu',
	init:function(funs){
		this.dbsite=api.require('db');
		this.dbsite.openDatabase({
			name: this.dbsitename
		}, function(ret, err){
			if(ret.status){
				dbsite.createtable('option','name varchar(50),num varchar(50),pnum varchar(50),value varchar(1000),sort INTEGER DEFAULT 0');
				var str = 'uid INTEGER DEFAULT 0,aid INTEGER DEFAULT 0,did INTEGER DEFAULT 0,pid INTEGER DEFAULT 0,stotal INTEGER DEFAULT 0,type varchar(30),atype varchar(30),`name` varchar(50),`face` varchar(100),content varchar(2000),optdt datetime,sort INTEGER DEFAULT 0';
				for(var i=0;i<=5;i++)str+=',field'+i+' varchar(100)';
				dbsite.createtable('mtable', str);
				dbsite.inits(funs);
			}else{
				api.toast({msg:'error无法打开数据'});
			}
		});
	},
	inits:function(funs){
		if(!this.dbsite)this.dbsite=api.require('db');
		if(!funs)funs=function(){};
		this.getoption('apiurl,adminid,token,userinfo,splittime',function(a){
			apiurl=a.apiurl;
			adminid=a.adminid;
			token=a.token;
			if(a.splittime)js.splittime=parseFloat(a.splittime);
			if(a.userinfo){
				userinfo=js.decode(a.userinfo);
				adminname=userinfo.name;
				adminface=userinfo.face;
			}
			funs(a);
		});
	},
	droptable:function(){
		this.executeSql('drop table option');
		this.executeSql('drop table mtable');
	},
	createtable:function(name, cont, funs){
		var  sql = "CREATE TABLE IF NOT EXISTS `"+name+"`(id INTEGER PRIMARY KEY AUTOINCREMENT,"+cont+")";
		this.executeSql(sql, funs);
	},
	executeSql:function(sql, clas){
		if(!clas)clas=function(){};
		this.dbsite.executeSql({
			name: this.dbsitename,
			sql: sql
		},function(ret, err){
			if(ret.status){
				clas(ret);
			}else{
				api.toast({msg:err.msg});
			}
		});
	},
	selectSql:function(sql, clas){
		if(!clas)clas=function(){};
		this.dbsite.selectSql({
			name: this.dbsitename,
			sql: sql
		},function(ret, err){
			if(ret.status){
				clas(ret);
			}else{
				api.toast({msg:err.msg});
			}
		});
	},
	setoption:function(num, val, funs){
		var where = "where `num`='"+num+"'";
		var sql = "SELECT * FROM `option` "+where+"";
		this.selectSql(sql, function(ret){
			if(ret.data==''){
				var sql = "insert into `option`(`num`,`value`)values('"+num+"', '"+val+"')";
				dbsite.executeSql(sql, funs);
			}else{
				var sql = "update `option` set `value`='"+val+"' "+where+" ";
				dbsite.executeSql(sql, funs);
			}
		});
	},
	getoption:function(num, bas){
		var whe = "`num`='"+num+"'",bs='';
		if(num.indexOf(',')>0){
			var as1 = num.split(','),i;
			bs={};
			for(i=0;i<as1.length;i++)bs[as1[i]]='';
			whe=" `num` in('"+(num.replace(/\,/g,"','"))+"')";
		}
		var sql = "SELECT * FROM `option` where "+whe+"";
		this.selectSql(sql, function(ret){
			if(ret.data==''){
				bas(bs);
			}else{
				if(num.indexOf(',')>0){
					var d = ret.data,i;
					for(i=0;i<d.length;i++)bs[d[i].num]=d[i].value;
				}else{
					bs = ret.data[0].value;
				}
				bas(bs);
			}
		});
	},
	getdata:function(atype, whes, xbo, funs){
		var whe= "`atype`='"+atype+"'";
		if(!xbo)whe+="  and `uid`='"+adminid+"' ";
		if(!whes)whes='';
		var sql="SELECT * FROM `mtable` where "+whe+" "+whes+"";
		var farr = this.mtablefield[atype];
		this.selectSql(sql, function(ret){
			var data = ret.data,i,oi;
			if(data)for(i=0;i<data.length;i++){
				for(oi in farr)data[i][oi]=data[i][farr[oi]];
			}
			funs(data);
		});
	},
	adddata:function(atype,wyw, xbo, arr, funs, zjaddbo){
		if(!wyw)wyw='';
		var whe= "`atype`='"+atype+"'";
		if(!xbo)whe+="  and `uid`='"+adminid+"' ";
		whe+=" "+wyw+"";
		var sql = "SELECT `id` FROM `mtable` where "+whe+"";
		var files='',file1='',cont='';
		var farr = this.mtablefield[atype],cai,val;
		for(var i in arr){
			cai = i;
			if(farr[i])cai=farr[i];
			val=arr[i];
			if(isempt(val))val='';
			files+=",`"+cai+"`";
			file1+=",'"+val+"'";
			cont+=",`"+cai+"`='"+val+"'";
		}
		var addsql = "insert into `mtable`(`atype`,`uid`"+files+")values('"+atype+"', '"+adminid+"'"+file1+")";
		if(zjaddbo){
			this.executeSql(addsql, funs);	
			return;
		}
		this.selectSql(sql, function(ret){
			if(ret.data==''){
				dbsite.executeSql(addsql, funs);
			}else{
				var sql = "update `mtable` set `atype`='"+atype+"',`uid`='"+adminid+"'"+cont+" where "+whe+" ";
				dbsite.executeSql(sql, funs);
			}
		});
	},
	updatedata:function(atype,wyw, xbo, cont, funs){
		if(!wyw)wyw='';
		var whe= "`atype`='"+atype+"'";
		if(!xbo)whe+="  and `uid`='"+adminid+"' ";
		whe+=" "+wyw+"";
		var sql = "update `mtable` set "+cont+" where "+whe+" ";
		dbsite.executeSql(sql, funs);
	},
	deletedata:function(atype,wyw, xbo, funs){
		if(!wyw)wyw='';
		var whe= "`atype`='"+atype+"'";
		if(!xbo)whe+="  and `uid`='"+adminid+"' ";
		whe+=" "+wyw+"";
		var sql = "delete from `mtable` where "+whe+" ";
		dbsite.executeSql(sql, funs);
	},
	mtablefield:{
		'indexchat':{
		},
		'user':{
			'deptid':'did',
			'deptname':'field0',
			'ranking':'field1',
			'tel':'field2',
			'mobile':'field3',
			'sex':'field4'
		},
		'dept':{},
		'group':{},
		'file':{
			'path':'face',
			'thumbpath':'field0',
			'filepath':'field1',
			'filesizecn':'field2',
			'filesize':'stotal',
			'filename':'field3'
		},
		'record':{
			'zt' :'pid',
			'receid':'did',
			'fileid':'stotal',
			'sendid':'sort'
		}
	}
};
js.fileall=',aac,ace,ai,ain,amr,app,arj,asf,asp,aspx,av,avi,bin,bmp,cab,cad,cat,cdr,chm,com,css,cur,dat,db,dll,dmv,doc,docx,dot,dps,dpt,dwg,dxf,emf,eps,et,ett,exe,fla,ftp,gif,hlp,htm,html,icl,ico,img,inf,ini,iso,jpeg,jpg,js,m3u,max,mdb,mde,mht,mid,midi,mov,mp3,mp4,mpeg,mpg,msi,nrg,ocx,ogg,ogm,pdf,php,png,pot,ppt,pptx,psd,pub,qt,ra,ram,rar,rm,rmvb,rtf,swf,tar,tif,tiff,txt,url,vbs,vsd,vss,vst,wav,wave,wm,wma,wmd,wmf,wmv,wps,wpt,wz,xls,xlsx,xlt,xml,zip,';