(function(){
	// // Ready
  $(document).ready(function(){
    var menu = new THREESESSION.Menu();
		var viewport = new THREESESSION.Viewport();
    viewport.set_defoult_objects();
    viewport.animate();
		viewport.setSize();

		window.addEventListener('resize',function(event){
			viewport.setSize();
		},false);
	});
}());
