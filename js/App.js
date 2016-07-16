(function(){
	// // Ready
  $(document).ready(function(){
		var viewport = new THREESESSION.Viewport();
    viewport.set_defoult_objects();
    viewport.animate();
		viewport.setSize( window.innerWidth, window.innerHeight );

		window.addEventListener('resize',function(event){
			viewport.setSize( window.innerWidth,window.innerHeight);
		},false);
	});
}());
