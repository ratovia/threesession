/**
 * Created by ratovia on 2016/10/15.
 */
{
  $(document).ready(function(){
    const poling_time = 100000;
    var menu = new THREESESSION.Menu();
    var view = new THREESESSION.View();
    view.init();
    view.setSize();
    get_json();

    $('#cube').on('click', function() {
      var mesh = view.primitive("cube");
      view.add_obj_group(mesh);
      view.add_uuid_array(mesh.uuid);
      post_edit("primitive",mesh.uuid,"cube",0);
    });
    $('#plane').on('click', function() {
      var mesh = view.primitive("plane");
      view.add_obj_group(mesh);
      view.add_uuid_array(mesh.uuid);

      post_edit("primitive",mesh.uuid,"plane",0);
    });
    $('#cylinder').on('click', function() {
      var mesh = view.primitive("cylinder");
      view.add_obj_group(mesh);
      view.add_uuid_array(mesh.uuid);
      post_edit("primitive",mesh.uuid,"cylinder",0);
    });
    $('#sphere').on('click', function() {
      var mesh = view.primitive("sphere");
      view.add_obj_group(mesh);
      view.add_uuid_array(mesh.uuid);
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
          if(view.get_state() != 0) {
            view.mode_switch("trans");
            view.picking();
          }
          break;
        case "x":
          if(view.get_state() == 0){
            post_edit("remove",view.get_selector().get_select().uuid,0,0);
            view.remove();
          }else if(view.get_state() == 1){
            view.get_selector().delete_point();
            post_edit("delete",view.get_selector().get_select().uuid,view.get_selector().get_edit().target,0);
          }
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
          if(view.get_state() == 2) {
            view.trans_end();
            var edit = view.get_selector().get_edit();
            post_edit("edit", view.get_selector().get_select().uuid, edit.target, edit.value);
          }
          break;
      }
    },false);

    window.addEventListener("mousemove", function(event){
      view.onmousemove(event);
    }, false);

    var dom = view.get_renderer_element();
    dom.addEventListener('mousedown',function(){
      view.picking();
    });

    setInterval(get_json,poling_time);

    function get_json(){
      $.ajax({
        url: "/load",
        type: "get"
      }).done(function (json) {
        console.info(json);
        var changeflag = true;
        if(json.uuid_array.toString() == view.get_uuid_array().toString()){
          changeflag = false;
        }
        console.log(json.uuid_array);
        console.log(view.get_uuid_array());
        console.log(changeflag);
        if(changeflag){
          //init
          var select = view.get_selector().get_select();
          view.removeall();
          //snap
          for(var i = 0,l = json.geometries.length;i<l;i++){
            var mesh = view.makemesh(json.geometries[i].data,json.geometries[i].uuid);
            view.add_obj_group(mesh);
            view.add_uuid_array(mesh.uuid);
          }
          //edit apply
          apply_edit(json.edit);
          if(select) {
            view.get_selector().set_select(select);
            if(!view.get_selector().get_edge()) {
              view.add_obj_group(view.get_selector().set_edge());
            }
            if(view.get_state() == 1){
              view.mode_switch("edit");
            }else if(view.get_state() == 2){
              view.mode_switch("trans");
            }
          }
        }else{
          //edit apply
          apply_edit(json.edit);
        }

      });
    }
    
    function apply_edit(edit){
      var state = view.get_state();
      for(var i = 0,l = edit.length;i < l;i++){
        var ope = edit[i].operation;
        if(ope == "edit"){
          var select = view.get_selector().get_select();
          var value = edit[i].value.split(",");
          if(select && select.uuid == edit[i].uuid){
            if(state == 0){
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
          view.add_uuid_array(mesh.uuid);
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
            if(state == 0){
              view.delete_point(edit[i].target, edit[i].uuid);
              view.mode_switch("edit");
              view.mode_switch("object");
            }else if(state == 1){
              if(view.get_selector().get_edit().target == edit[i].target) {
                view.get_selector().delete_point();
              }else{
                view.delete_point(edit[i].target, edit[i].uuid);
              }
            }else if(state == 2){
            }
          }else{
            if(view.get_uuid_array().includes(edit[i].uuid)) {
              view.trans_point(edit[i].target, edit[i].uuid, value);
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
        console.info("post success");
      }).fail(function(){
        console.assert("post failed");
      });
    }
  });
}