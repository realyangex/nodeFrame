$(function(){

			var currentPage = 1;
			var currentType = 1;
    		function getData(page,type)
    		{	
    			$.ajax({
    				url:'/need',
    				data:{page:page,type:type},
    				type:'get',
    				success:function(data)
    				{
    					console.log(data);

    					var html = "";

    					//移除查看更多
			    		$("#showMore").remove();
    					for(var i =0;i<data.length;i++)
    					{
	    					html += '<div class="contentBox" >\
				    		<div class="contentInnerBox"  >\
					    		<div class="headerContent"  >\
					    			<img src="public/images/mn.jpg" class="pic">\
					    			<span class="username">'+data[i].name+'</span>\
					    			<span class="time" >'+data[i].date+'</span>\
					    		</div>\
					    		<div class="contentText">'+data[i].content+'</div>\
						    	<div height:30px>\
						    		<span style="font-size:28px;">···</span>\
						    		<div class="fr delete" style="margin-top:6px;cusor:pointer" data-id='+data[i].id+'>\
							    		<span class="fa fa-trash "  > 删除</span>\
						    		</div>\
						    	</div>\
					    	</div>\
				    	</div>'
    					}
    					if(data.length==0){
    						
    						html+= '<div style="height:80px;padding:3px 0 6px 0;">\
			    		<center  >\
			    			<span style="color:#777777" class="more" >已经到底</span>\
			    		</center>\
			    	</div>'
    					}else if(data.length>2){
    						html+= '<div style="height:80px;padding:3px 0 6px 0;color:#1EA076;" id="showMore">\
			    		<center  >\
			    			<span style="" class="more">查看更多</span>\
			    			<span class="fa fa-angle-down more" ></span>\
			    		</center>\
			    	</div>'
    					}
    					

			    	

			    	$("#showSection").append(html);
    				}
    			})
    		}

    		//查看更多按钮点击事件
    		$(document).on("click",".more",function(){
    			currentPage++;
    			getData(currentPage,currentType);
    		})

    		// 项目按钮点击事件
    		$(document).on("click",".item li",function(){
    			var cla = $(this).attr("class");
    			 
    			if(cla=="current"){
    				return;
    			}else{
    				$(".item li").eq(0).removeClass('current');
    				$(".item li").eq(1).removeClass('current');
    				$(this).addClass('current');

    				var type = $(this).attr('type');
    				currentType = type;
    				//清空内容
    				$("#showSection").html("");

    				getData(1,currentType);
    			}
    			
    		})
			
			//删除点击事件
			$(document).on("click",".delete",function(){
				var id = $(this).attr("data-id");
			
				$("#text").text("是否删除该记录");
				$("#showTip").show();
				$("#cancel").click(function(){
					$("#showTip").hide();
				})
				
				$("#ok").click(function(){
					
					$.ajax({
						url:'/admin/delneed',
						data:{id:id},
						type:'post',
						success:function(data){
							$("#showTip").hide();
							window.location.href="/admin";
						}
					});
				
				})
				
			})
			
			
			
    		getData(currentPage,currentType);

    	})