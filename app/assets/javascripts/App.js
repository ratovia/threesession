{
	// // Ready
  $(document).ready(function(){
    var menu = new THREESESSION.Menu();
    var viewport = new THREESESSION.Viewport();
    // viewport.set_defoult_objects();
    viewport.animate();
		viewport.setSize();
    viewport.getjson();

    setInterval(function(){
      viewport.getjson();
    },20000);

    setInterval(function(){
    },5000);
    
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

    viewport.renderer.domElement.addEventListener('mousedown',function(){
      viewport.picking();
    });

    window.addEventListener( 'keydown', function ( event ) {
      viewport.onkeydown(event);
    }, false);

    window.addEventListener("mousemove", function(event){
      viewport.onmousemove(event);
    }, false);

    window.addEventListener("keyup", function(event){
      viewport.onkeyup(event);
    },false);

		window.addEventListener('resize',function(){
			viewport.setSize();
		},false);
	});
}
