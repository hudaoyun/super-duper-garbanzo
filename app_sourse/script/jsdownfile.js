js.filers={};
js.openfile =function(fid, audo){
	if(js.filers[fid]){
		js.openfiles(fid);
		return;
	}
	dbsite.getdata('file', "and aid='"+fid+"'", true,function(ret){
		if(!ret||ret==''){
			if(audo){
				js.downtofile(fid);
			}else{
				js.msg('msg','文件已不存在,可能已删除');
			}
		}else{
			var a=ret[0];
			js.filers[a.aid]=a;
			js.openfiles(a.aid);
		}
	});
}
js.downtofile=function(fid){
	js.ajax('upload','getfile',{fileid:fid},function(dfs){
		if(!dfs){
			js.msg('msg','文件已不存在');
			return;
		}
		dbsite.adddata('file',"and aid='"+dfs.id+"'", true, {
			'aid' 	: dfs.id,
			'thumbpath' 	: dfs.thumbpath, 'filepath' : dfs.filepath,
			'filesizecn' 	: dfs.filesizecn,
			'name' : dfs.optname, 'type' : dfs.fileext, 'optdt': dfs.adddt ,'did':dfs.optid,
			'filename': dfs.filename, 'filesize':dfs.filesize
		},function(){
			setTimeout(function(){js.openfile(fid);}, 100);
		});	
	});
}
js.openfiles=function(fid, zjd){
	var a		= js.filers[fid];
	var url 	= apiurl+a.filepath;
	var path 	= a.path;
	if(!js.isimg(a.type)){
		js.openwins('文件信息','filexiang',{fid:fid});
		return;
	}
	var savePath= 'fs://picture/'+fid+'_'+a.filename+'';
	path = savePath;
	if(path && !zjd){
		if(!js.fsobj)js.fsobj= api.require('fs');
		js.fsobj.exist({
			path:savePath
		},function(ret){
			if(!ret.exist){
				js.openfiles(fid, true);
			}else{
				js.showimg(path);
			}
		});
		return;
	}
	if(!path || zjd){
		api.showProgress({
			style: 'default',
			animationType: 'fade',
			title: '下载中...',
			text: '大小:'+a.filesizecn+'',
			modal: true
		});
		api.download({
			url: url,
			savePath: savePath,
			report: true,
			cache: true,
			allowResume: true
		},function(ret, err){
			if(ret.state == 1){
				api.hideProgress();
				var sav = ret.savePath;
				js.filers[fid].path = sav;
				$('#stats_'+fid+'').html('已下载');
				dbsite.updatedata('file',"and `aid`="+fid+"",true,"`face`='"+sav+"'",function(){
					js.showimg(sav);
				});
			}else if(ret.state==2){
				js.getarr(ret);
			}
		});
	}
}
js.showimg = function(path){
	if(!this.imageBrowser)this.imageBrowser = api.require('imageBrowser');
	this.imageBrowser.openImages({
		imageUrls:[path],
		tapClose:true,
		activeIndex:0
	});
	return;
	var photoBrowser = api.require('photoBrowser');
	photoBrowser.open({
		images: [path],
		bgColor: '#000'
	}, function(ret, err) {
	   
	});
}