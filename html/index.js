$(function(){

// 添加模态框 栏目管理无遮蔽
	$("#lanmumodal").modal({
		backdrop:false,//无点击背景关闭
		show:false,//初始不显示
	});
	$("#zimodal").modal({
		backdrop:false,//无点击背景关闭
		 // backdrop:true,
		show:false,//初始不显示
	});
	$(".addZiXun").click(function(){
		$("#zimodal").modal("show");
	})


// 选项卡
	
	$(".nav-list>li").click(function(){
		var index=$(".nav-list>li").index(this);
		if (index==1) {
			$("title").text("首页");
		}else if (index==2) {
			$("title").text("栏目管理");
//栏目查询
			search();
		}else if (index==3) {
			$("title").text("资讯管理");
//资讯查询	
			var data={
				page:1,
				pageSize:20
			}	
			ziXunSearch(data);
			delZiXunLine(data);
		
			
		}else{
			$("title").text("用户管理");
		}
		$(".shouye>div:not(:first)").addClass("show");
		$(".shouye>div").eq(index).removeClass("show");
	})
	
/*------&&&&&&&&&&&栏目管理&&&&&&&&&&&&&&&--------*/
//查询栏目函数
	function search(){
		$.get("http://120.78.164.247:8099/manager/category/findAllCategory", function(data){
//清空
			$(".lanmu>tbody").empty();
			// console.log(data.data.length);
			for (var i = 0; i < data.data.length; i++) {
				if (data.data[i].parent==null) {
					data.data[i].parent={name:"无"};
				}
				// console.log(data.data[i].id);
				var tr="<tr><td><input type='checkbox' value='"+data.data[i].id+"'></td><td><div>"+data.data[i].name+"</div></td><td><div>"+data.data[i].parent.name+"</div></td><td><div>"+data.data[i].comment+"</div></td><td><i class='iconfont icon-shanchu shanchu'></i><i class='iconfont icon-xiugai xiugai'></i></td></tr>";
				// console.log(data.data[i].name);
				$(".lanmu>tbody").append(tr);
			}
			Modify();
			del();
		})
	}


//栏目管理添加数据	清除
	$(".add").click(function(){
		var lanmuName=$(".inp1").val("");
		var lanmuComment=$(".inp2").val("");
		// var no=$(".inp3").val("");
		var lanmuParent=$(".inp4").val("");
		$("#lanmumodal").modal("show");
	})
//栏目管理添加数据
	$(".sub").click(function(){
		var lanmuName=$(".inp1").val();			//栏目名称
		var lanmuComment=$(".inp2").val();		//描述
				// var no=$(".inp3").val();
		var lanmuParent=$(".inp4").val();		//父名称
		var hiddenId=$(".hiddenId").text();		
		console.log(hiddenId);
//如果id存在则修改 否则添加
		if (hiddenId) {
			if (lanmuName && lanmuComment) {
				if (lanmuParent) {
					var data={
						id:hiddenId,
						name:lanmuName,
						comment:lanmuComment,
						parentId:Number(lanmuParent)
					}
					console.log(data);
				}else{
					var data={
						id:hiddenId,
						name:lanmuName,
						comment:lanmuComment,
						// parent:lanmuParent
					}
				}
			}else{
				alert("请输入内容");
			}	
		}else{
			if (lanmuName && lanmuComment) {
				if (lanmuParent) {
					var data={
						name:lanmuName,
						comment:lanmuComment,
						parentId:lanmuParent
					}
				}else{
					var data={
						name:lanmuName,
						comment:lanmuComment,
					}
				}
			}else{
				alert("请输入内容");
			}
		}
		// console.log(data);
		$.post("http://120.78.164.247:8099/manager/category/saveOrUpdateCategory",data,function(result){
			if (hiddenId) {
				if (result.status==200) {
					search();
					alert("修改成功");
					
				}else{
					search();
					alert("修改失败");
					
				}
			}else{
				if (result.status=200) {
					search();
					alert("添加成功");
					
				}else{
					search();
					alert("修改失败");
					
				}
			}
		})
	})
//修改按钮处理
	function Modify(){
		$(".xiugai").click(function(event){
			$("#lanmumodal").modal("show");
			$(".modal-header").html("<span data-dismiss='modal'><返回</span>修改页面信息");
			// console.log(event.target);
			// 
	//选取行id
			var id=$(this).parent().siblings(":first").children().val();
			$(".hiddenId").text(id);
			var hiddenId=$(".hiddenId").text();
			// console.log(hiddenId)
			var lanmuName=$(this).parent().siblings(":nth-child(2)").children().text();
			var lanmuComment=$(this).parent().siblings(":nth-child(4)").children().text();
			var lanmuParent=$(this).parent().siblings(":nth-child(3)").children().text();
			$(".inp1").val(lanmuName);
			$(".inp2").val(lanmuComment);
			$(".inp4").val(lanmuParent);
		})
	}
//删除一行
	function del(){
		$(".shanchu").click(function(event){
			var delDataId=$(this).parent().siblings(":first").children().val();
			// console.log(delDataId);
			var str="id="+delDataId;
			$.get("http://120.78.164.247:8099/manager/category/deleteCategoryById", str, function(result){
				if (result.status==200) {
					alert("删除成功")
					search();
				}else{
					alert("删除失败")
					search();
				}
				console.log(result);
			});
		});
	}
//批量删除
	// function batchDel(){
		$(".batchDelete").click(function(){
			var o={};
			var trr=[];
			$(".lanmu").children(":last-child").children().children(":first-child").children(":checked").each(function(index,item){
				$(item).val();
				trr.push($(item).val());
			})
			o.ids=trr.toString();
			// console.log(o);
			//console.log($(".lanmu").children(":last-child").children().children(":first-child").children())
			$.post("http://120.78.164.247:8099/manager/category/batchDeleteCategory", o, function(result){
				if (result.status==200) {
					console.log("删除成功");
					search();
				}else{
					console.log("删除失败");
					search();
				}
			})
		})
	// }
	
 
	
	
	 
 
/*&&&&&&&&&&&----资讯管理-------&&&&&&&&&&&&&&*/	


//资讯查询
	function ziXunSearch(o){
		// console.log(o);
		$.get("http://120.78.164.247:8099/manager/article/findArticle",o,function(result){
			// console.log(o);
			if (result.status===200) {
				$("tbody").find("tr").not(":first").remove();
				// console.log($(".ziXunTbody").children(":first"));
				var datas=result.data.list;
				$(datas).each(function(index,item){
					var cloneTr=$(".ziXunTbody").children(":first").clone(true);
					$(".ziXunTbody").append(cloneTr);
					$(".cloneTr").eq(index+1).find("td").eq(0).children().val(item.id);
					// console.log(item.id);
					$(".cloneTr").eq(index+1).find("td").eq(1).children().text(datas[index].title);
					if (datas[index].category) {
						$(".cloneTr").eq(index+1).find("td").eq(2).children().text(datas[index].category.name);
					}else{
						var name="null";
						$(".cloneTr").eq(index+1).find("td").eq(2).children().text(name);
					}
					if (datas[index].music) {
						$(".cloneTr").eq(index+1).find("td").eq(3).children().text(datas[index].music);
					}else{
						var name="null";
						$(".cloneTr").eq(index+1).find("td").eq(3).children().text(name);
					}
					if (datas[index].author) {
						$(".cloneTr").eq(index+1).find("td").eq(4).children().text(datas[index].author);
					}else{
						var name="null";
						$(".cloneTr").eq(index+1).find("td").eq(4).children().text(name);
					}
					$(".cloneTr").eq(index+1).find("td").eq(5).children().text(datas[index].publishtime);
					$(".cloneTr").eq(index+1).find("td").eq(6).children().text(datas[index].readtimes);
				})	
			}else{
				console.log("更新失败")
			}
		})
		// delZiXunLine();
//查找所属父栏目
		$.get("http://120.78.164.247:8099/manager/category/findAllCategory", function(result){
			$(".selectOption").empty();
			$(result.data).each(function(index,item){
				var option="<option value='"+item.id+"'>"+item.name+"</option>";
				$(".selectOption").append(option);
			})
		});
	}
	
//查找页码，数量
	$(".selectPage button").click(function(){
		var pages=$(".selectPage :nth-child(2)").val();
		var pageSizes=$(".selectPage :nth-child(4)").val();
		if (pages&&pageSizes) {
			var data={
				page:pages,
				pageSize:pageSizes
			}
			delZiXunLine(data);
			ziXunSearch(data);
			
			// console.log("有值得"+pages);
		}else{
			var data={
				page:1,
				pageSize:10
			}
			ziXunSearch(data);
			delZiXunLine(data)
		}
//清空输入框内容
		var pages=$(".selectPage :nth-child(2)").val("");
		var pageSizes=$(".selectPage :nth-child(4)").val("");
	})
	
//删除一行
	function delZiXunLine(data){
		$(".ziXunDel").click(function(){
			var id=$(this).parent().parent().siblings(":first").children().val();
			// console.log(id);
			// var ids="id="+id;
            var ids = {id:id};
			$.get("http://120.78.164.247:8099/manager/article/deleteArticleById", ids, function(result){
				ziXunSearch(data);
			});
			  // console.log("1") ;
		}); 
		// console.log(data);
	}


	// $("ziXunDel").click(function(){
 //        delZiXunLine(data);
	// });

	// function delZiXunLine(data){
	// 	   var ids = {id:id};
	//  		$.get("http://120.78.164.247:8099/manager/article/deleteArticleById", ids, function(result){
				
	// 		});
	// }
//修改
	$(".ziXunUpdate").click(function(){
		var id=$(this).parent().parent().siblings(":first").children().val();
		$("#updateModal").show();
		$(".cancelUpd").click(function(){
			$("#updateModal").hide();
		})
		// console.log($(this).parent().parent().siblings().eq(2).children().text());
		var title=$(this).parent().parent().siblings().eq(1).children().text();
		
		$("#updateModal input").eq(0).val($(this).parent().parent().siblings().eq(1).children().text());
		$("#updateModal input").eq(1).val($(this).parent().parent().siblings().eq(3).children().text());
		$("#updateModal input").eq(2).val($(this).parent().parent().siblings().eq(4).children().text());
		$("#updateModal input").eq(3).val($(this).parent().parent().siblings().eq(5).children().text());
		
//点击确定提交保存
		
		var id= $(this).parent().parent().siblings().eq(0).children().val();
		
		console.log(id);
		$(".ziXunSub").click(function(){
			console.log(id);
			console.log(parentId);
			// var o={
			// 	id:id,

			// }
		})
	})









/*&&&&&&&&&&&----首页-------&&&&&&&&&&&&&&*/




/*首页折线图*/
	$(".lineChart").highcharts({
		credits:{
			enabled:false,
		},
		title:{
			text:'14.85%',
			align:'left',
			x:20,
			style:{
				color:'green',
				fontWeight:'700'
			}

		},
		subtitle:{
			text:'More Visitors',
			align:'left',
			x:22,
			y:28,
			style:{
				fontSize:10,
				color:"#ccc",
			}
		},
		series: [{
					color:'green',
                    name: 'Pageview',
                    data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                }, {
                	color:'#ccc',

                    name: 'Visitor',
                    data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
                }]
	})
/*首页柱状图*/
	$(".barChart-1").highcharts({
		credits:{
			enabled:false,
		},
		chart: {
		type: 'column'
		},
		title: {
			// text: '全球各大城市人口排行'
		},
		// subtitle: {
		// 	text: '数据截止 2017-03，来源: <a href="https://en.wikipedia.org/wiki/List_of_cities_proper_by_population">Wikipedia</a>'
		// },
		xAxis: {
			type: 'category',
			// labels: {
			// 	rotation: -45  // 设置轴标签旋转角度
			// }
		},
		yAxis: {
			min: 0,
			title: {
				text: '人口 (百万)'
			}
		},
		legend: {
			enabled: false
		},
		tooltip: {
			pointFormat: '人口总量: <b>{point.y:.1f} 百万</b>'
		},
		series: [{
			name: '总人口',
			data: [
				['上海', 24.25],
				['卡拉奇', 23.50],
				['北京', 21.51],
			],
			dataLabels: {
				enabled: true,
				rotation: -90,
				color: '#FFFFFF',
				align: 'right',
				format: '{point.y:.1f}', // :.1f 为保留 1 位小数
				y: 10
			}
		}]

	})
/*首页扇形图*/

})