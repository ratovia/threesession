THREESESSION.Menu = function(parameters){
	$(".view-menu-trigger").hover(
	  function () {
	    $("#view-menu").show();
	  },
	  function () {
	    $("#view-menu").hide();
	  }
  );
	$(".add-menu-trigger").hover(
	  function () {
	    $("#add-menu").show();
	  },
	  function () {
	    $("#add-menu").hide();
	  }
  );

	$(".file-menu-trigger").hover(
	  function () {
	    $("#file-menu").show();
	  },
	  function () {
	    $("#file-menu").hide();
	  }
	);

	$(".toggle-menu").on("click",function(){
		if ($('#side_bar').hasClass(".menu-open")){
			$('#side_bar').css("left","-200px");
			$('#side_bar').removeClass(".menu-open")
		} else {
			$('#side_bar').css("left","0px");
			$('#side_bar').addClass(".menu-open")
		}
	})
	$(".toggle-list-menu").on("click",function(){
		let child = $(this).children("ul")
		if (child.hasClass(".menu-open")){
			child.css("display","none");
			child.removeClass(".menu-open")
		} else {
			child.css("display","block");
			child.addClass(".menu-open");
		}
	})
}
