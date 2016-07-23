(function(){
	// // Ready
  $(document).ready(function(){
    var menu = new THREESESSION.Menu();
		var viewport = new THREESESSION.Viewport();
    viewport.set_defoult_objects();
    viewport.animate();
		viewport.setSize();


    $('#cube').on('click', function() {
      viewport.addPrimitive("cube");
    });
    $('#plane').on('click', function() {
      viewport.addPrimitive("plane");
    });
    $('#cylinder').on('click', function() {
      viewport.addPrimitive("cylinder");
    });
    $('#sphere').on('click', function() {
      viewport.addPrimitive("sphere");
    });

		window.addEventListener('resize',function(event){
			viewport.setSize();
		},false);
	});
}());
