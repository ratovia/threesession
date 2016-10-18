/**
 * Created by ratovia on 2016/10/15.
 */
{
  $(document).ready(function(){
    var menu = new THREESESSION.Menu();
    var view = new THREESESSION.View();
    var mesh = view.primitive("cube");
    view.add_obj_group(mesh);
    view.init(mesh);
    
    
    view.setSize();

    $('#cube').on('click', function() {
      var mesh = view.primitive("cube");
      view.add_obj_group(mesh);
    });
    $('#plane').on('click', function() {
      var mesh = view.primitive("plane");
      view.add_obj_group(mesh);
    });
    $('#cylinder').on('click', function() {
      var mesh = view.primitive("cylinder");
      view.add_obj_group(mesh);
    });
    $('#sphere').on('click', function() {
      var mesh = view.primitive("sphere");
      view.add_obj_group(mesh);
    });

    window.addEventListener( 'keydown', function ( event ) {
      switch(event.key){
        case "Tab":
          if(view.get_state() == 0) {
            view.mode_switch("edit");
          }else if(view.get_state() == 1) {
            view.mode_switch("object");
          }
          break;
        case "g":
          break;
        case "x":
          view.remove();
          break;
        case "r":
          break;
        case "s":
          break;
      }
    }, false);

    window.addEventListener("mousemove", function(event){
      view.onmousemove(event);
    }, false);

    var dom = view.get_renderer_element();
    dom.addEventListener('mousedown',function(){
      view.picking();
    });

  });
}