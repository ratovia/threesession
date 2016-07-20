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
}
