/**
 * Created by ratovia on 2016/10/15.
 */
{
  $(document).ready(function(){
    var menu = new THREESESSION.Menu();
    var view = new THREESESSION.View();
    view.init();
    view.setSize();
    get_json();

    $('#cube').on('click', function() {
      var mesh = view.primitive("cube");
      view.add_obj_group(mesh);
      post_edit("primitive",mesh.uuid,"cube",0);
    });
    $('#plane').on('click', function() {
      var mesh = view.primitive("plane");
      view.add_obj_group(mesh);
      post_edit("primitive",mesh.uuid,"plane",0);
    });
    $('#cylinder').on('click', function() {
      var mesh = view.primitive("cylinder");
      view.add_obj_group(mesh);
      post_edit("primitive",mesh.uuid,"cylinder",0);
    });
    $('#sphere').on('click', function() {
      var mesh = view.primitive("sphere");
      view.add_obj_group(mesh);
      post_edit("primitive",mesh.uuid,"sphere",0);
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
          view.mode_switch("trans");
          view.picking();
          break;
        case "x":
          post_edit("remove",view.get_selector().get_select().uuid,0,0);
          view.remove();
          break;
        case "r":
          break;
        case "s":
          break;
      }
    }, false);

    window.addEventListener('keyup', function (event){
      switch(event.key){
        case "g":
          view.trans_end();
          var edit = view.get_selector().get_edit();
          post_edit("edit",view.get_selector().get_select().uuid,edit.target,edit.value);
      }
    },false);

    window.addEventListener("mousemove", function(event){
      view.onmousemove(event);
    }, false);

    var dom = view.get_renderer_element();
    dom.addEventListener('mousedown',function(){
      view.picking();
    });

    setInterval(get_json,10000);

    function get_json(){
      $.ajax({
        url: "/load",
        type: "get"
      }).done(function (json) {
        console.log(json);
        var changeflag = true;
        if(json.uuid_array.toString() == view.get_uuid_array().toString()){
          changeflag = false;
        }
        
        if(changeflag){
          //init
          view.removeall();
          //snap
          for(var i = 0,l = json.geometries.length;i<l;i++){
            var mesh = view.makemesh(json.geometries[i].data,json.geometries[i].uuid)
            view.add_obj_group(mesh);
          }
          //edit apply
          apply_edit(json.edit);
        }else{
          //edit apply
          apply_edit(json.edit);
        }
      });
    }
    
    function apply_edit(edit){
      var state = view.get_state();
      console.log(state);
      for(var i = 0,l = edit.length;i < l;i++){
        var ope = edit[i].operation;
        if(ope == "edit"){
          var select = view.get_selector().get_select();
          var value = edit[i].value.split(",");
          if(select && select.uuid == edit[i].uuid){
            if(state == 0){
              console.log("call");
              view.trans_point(edit[i].target, edit[i].uuid, value);
              view.mode_switch("edit");
              view.mode_switch("object");
            }else if(state == 1){
              if(view.get_selector().get_edit().target == edit[i].target) {
                view.get_selector().trans_point(value);
              }else{
                view.trans_point(edit[i].target, edit[i].uuid, value);
              }
            }else if(state == 2){
            }
          }else{
            if(view.get_uuid_array().includes(edit[i].uuid)) {
              view.trans_point(edit[i].target, edit[i].uuid, value);
            }
          }
        }else if(ope == "primitive"){
          var mesh = view.primitive(edit[i].target);
          mesh.uuid = edit[i].uuid;
          view.add_obj_group(mesh);
        }else if(ope == "remove"){
          var select = view.get_selector().get_select();
          if(select && select.uuid == edit[i].uuid){
            view.remove();
          }else{
            if(view.get_uuid_array().includes(edit[i].uuid)) {
              view.remove_uuid(edit[i].uuid);
            }
          }
        }else if(ope == "delete"){
          var select = view.get_selector().get_select();
          var value = edit[i].value.split(",");
          if(select && select.uuid == edit[i].uuid){
            view.get_selector().delete_point(edit[i].target);
          }else{
            if(view.get_uuid_array().includes(edit[i].uuid)) {
              view.delete_point(edit[i].target, edit[i].uuid);
            }
          }
        }
      }
    }
    
    function post_edit(operation,uuid,target,value){
      var val;
      if(operation == "edit") {
        val = value.x + "," + value.y + "," + value.z;
      }else if(operation == "primitive"){
        val = value;
      }else if(operation == "remove"){
        val = value;
      }else if(operation == "delete"){
        val = value;
      }
      $.ajax({
        url: "/post",
        type: "post",
        data: {"operation": operation,"uuid": uuid,"target": target,"value": val }
      }).done(function(){
        console.log("post success");
      }).fail(function(){
        console.log("post failed");
      });
    }
  });
}