THREESESSION.Menu = function(){
	$(".toggle-menu").on("click",function(){
		if ($('#side_bar').hasClass("menu-open")){
			$('#side_bar').css("left","-200px");
			$('#side_bar').removeClass("menu-open")
		} else {
			$('#side_bar').css("left","0px");
			$('#side_bar').addClass("menu-open")
		}
	});
	$(".toggle-edit-pannel").on("click",function(){
		if ($('#edit-panel').hasClass("menu-open")){
			$('#edit-panel').css("right","-200px");
			$('#edit-panel').removeClass("menu-open")
		} else {
			$('#edit-panel').css("right","0px");
			$('#edit-panel').addClass("menu-open")
		}
	});
	$(".toggle-list-menu").on("click",function(){
		let child = $(this).children("ul");
		if(child.hasClass("menu-open")){
			child.css("display","none");
			child.removeClass("menu-open");
		}else{
			child.css("display","block");
			child.addClass("menu-open");
		}
	});
	$(".toggle-operations-menu").on("mouseover",function(){
		let child = $(this).children("ul")
		child.css("display","block");
	});
	$(".toggle-operations-menu").on("mouseout",function(){
		let child = $(this).children("ul")
		child.css("display","none");
	});
}
