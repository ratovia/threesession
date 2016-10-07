THREESESSION.Viewport = function(){
  //
  const _container = document.getElementById('main');
  const _this = this;
  var _width = _container.clientWidth,
  		_height = _container.clientHeight,
  		_select_object,
      _select_edge,
      _selected,
      _vertex,
      _select_vertex,
      _select_vertex_idx,
      _mode = {
        OBJECTMODE:0,
        EDITMODE:1,
        TRANSMODE:2
      },
      _state = _mode.OBJECTMODE,
      _mouse = new THREE.Vector2(),
  		SHADOW_MAP_WIDTH = 2048,
  		SHADOW_MAP_HEIGHT = 1024;
  //
  // this.camera = new THREE.PerspectiveCamera(30, _width / _height,1,10000);
  this.camera = new THREE.OrthographicCamera(_width / - 2, _width / 2, _height / 2, _height / - 2, 1, 10000);
  this.camera.position.set(500,200,400);
  this.camera.name = 'Camera';
  this.camera.lookAt(new THREE.Vector3());
  this.renderer = new THREE.WebGLRenderer({clearAlpha: 1,clearColor: 0x2B2B2B});
  this.renderer.shadowCameraNear = 3;
  this.renderer.shadowCameraFar = this.camera.far;
  this.renderer.shadowCameraFov = 50;
  this.renderer.shadowMapBias = 0.0039;
  this.renderer.shadowMapDarkness = 0.5;
  this.renderer.shadowMapWidth = SHADOW_MAP_WIDTH;
  this.renderer.shadowMapHeight = SHADOW_MAP_HEIGHT;
  this.renderer.shadowMap.enabled = true;
  this.renderer.shadowMapSoft = true;
  _container.appendChild(this.renderer.domElement);
  var camera_controls = new THREE.OrbitControls(this.camera);
  var object_controls = new THREE.TransformControls(_this.camera,this.renderer.domElement);
  object_controls.addEventListener("change",_this.render);

  this.scene = new THREE.Scene();
  this.scene.add(this.camera);



  var gridHelper = new THREE.GridHelper( 480,80,0xFF0000,0x2B2B2B);
  this.scene.add( gridHelper );

  var directionalLight1 = new THREE.DirectionalLight( 0xffffff );
  directionalLight1.position.set( 0.3, 0.7, 0.5 );
  this.scene.add( directionalLight1 );
  var directionalLight2 = new THREE.DirectionalLight( 0xffffff );
  directionalLight2.position.set( -0.3, -0.7, -0.5 );
  this.scene.add( directionalLight2 );

  this.object_group = new THREE.Group();
  this.scene.add(this.object_group);

  var materialk = new THREE.MeshPhongMaterial({
    wireframe:false,color:0xFF0000,shading: THREE.SmoothShading,
    transparent: true,opacity:0.0
  });
  var plane = new THREE.PlaneGeometry(2000,2000,1,1);
  var intersect_object = new THREE.Mesh(plane,materialk);
  this.scene.add(intersect_object);

  /////////////////////////////////////////////////////
  //////////////// public method //////////////////////
  /////////////////////////////////////////////////////

  this.set_defoult_objects = function (){
    var mesh = _this.addPrimitive("cube");
    _this.select(mesh);
  };

  this.getjson = function(){
    $.ajax({
      url: "/load",
      type: "get"
    }).done(function (json) {
      var material = new THREE.MeshPhongMaterial({
        wireframe:false,color:0xFFFFFF,shading: THREE.SmoothShading
      });
      var loader = new THREE.JSONLoader();
      _this.scene.remove(_this.object_group);
      _this.removeall(_this.object_group);
      for(var i = 0, l = json.geometries.length; i< l;i++){
        for(var i2 = 0,l2 = json.edit.length;i2 < l2 ; i2++){
          if(json.geometries[i].uuid == json.edit[i2].uuid){
            if(json.edit[i2].operation == "trans"){
              var value_array = json.edit[i2].value.split(',');
              for(var i3 = 0; i3 < 3;i3++){
                json.geometries[i].data.vertices[3 * parseInt(json.edit[i2].target) + i3] = parseFloat(value_array[i3]);
              }
              json.geometries.verticesNeedUpdate = true;
            }
          }
        }
        var model = loader.parse(json.geometries[i].data);
        var mesh = new THREE.Mesh(model.geometry, material);
        mesh.uuid = json.geometries[0].uuid;
        _this.object_group.add(mesh);
        if(_select_object && _select_object.uuid == mesh.uuid){
          var state = _state;
          _this.mode_switch(_mode.OBJECTMODE);
          _this.select(mesh);
          _this.mode_switch(state);
        }
      }
      _this.scene.add(_this.object_group);
    }).fail(function () {
      console.log("Ajax getjson failed");
    });
  };

  this.postedit = function(operation,uuid,target,value){
    if(operation == "edit"){
      var val = value.x + "," + value.y + "," + value.z;
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

  };

  this.removeall = function(group){
    for(var i = group.children.length - 1;i >= 0; i-- ){
      group.remove(group.children[i]);
    }
  };

  this.onmousemove = function(event){
    var rect = event.target.getBoundingClientRect();
    var x =  event.clientX - rect.left;
    var y =  event.clientY - rect.top;
    _mouse.x =  (x / _width) * 2 - 1;
    _mouse.y = -(y / _height) * 2 + 1;
  };

  this.picking = function(){
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(_mouse,_this.camera);
    var intersects;
    if(_state == _mode.OBJECTMODE){
      intersects = raycaster.intersectObjects(_this.object_group.children);
      if(intersects.length > 0) {
        _this.select(intersects[0].object);
      }
    }else if(_state == _mode.EDITMODE){
      intersects = raycaster.intersectObjects(_this.object_group.children);
      if(intersects.length > 0) {
        var d, min_d = 10000, min_idx = -1;
        var vec1 = intersects[0].point;
        var vec2 = new THREE.Vector3();
        var vertices = _this.fix_vertices(_select_object.geometry.clone().vertices);
        for (var i = 0, l = _select_object.geometry.vertices.length; i < l; i++) {
          vec2 = vertices[i];
          d = Math.sqrt(Math.pow(Math.floor(vec1.x) - Math.floor(vec2.x), 2) + Math.pow(Math.floor(vec1.y) - Math.floor(vec2.y), 2) + Math.pow(Math.floor(vec1.z) - Math.floor(vec2.z), 2));
          if (min_d > d) {
            min_d = d;
            min_idx = i;
          }
        }
        _select_vertex_idx = min_idx;
        _this.select(_select_object.geometry.vertices[min_idx]);
      }
    }else if(_state == _mode.TRANSMODE){
      intersects = raycaster.intersectObjects(_this.scene.children);
      if(intersects.length > 0) {
        var x = intersects[0].point.x;
        var y = intersects[0].point.y;
        var z = intersects[0].point.z;
        _selected.geometry.vertices[0].set(x,y,z);
        _select_object.geometry.vertices[_select_vertex_idx].set(x,y,z);
        _vertex.geometry.vertices[_select_vertex_idx].set(x,y,z);
        _select_vertex.set(x,y,z);
        _select_object.geometry.verticesNeedUpdate = true;
        _selected.geometry.verticesNeedUpdate = true;
        _vertex.geometry.verticesNeedUpdate = true;
        _select_vertex.verticesNeedUpdate = true;
        this.mode_switch(_mode.EDITMODE);
        this.postedit("edit",_select_object.uuid,_select_vertex_idx,intersects[0].point);
      }
    }
  };


  this.fix_vertices = function(vertices){
    var mat = _select_object.matrix;
    var vec = new THREE.Vector3();
    for(var i = 0, l = vertices.length;i < l ; i++){
      vec = vertices[i];
      vertices[i].x = mat.elements[0] * vec.x + mat.elements[4] * vec.y + mat.elements[8]  * vec.z + mat.elements[12] * 1;
      vertices[i].y = mat.elements[1] * vec.x + mat.elements[5] * vec.y + mat.elements[9]  * vec.z + mat.elements[13] * 1;
      vertices[i].z = mat.elements[2] * vec.x + mat.elements[6] * vec.y + mat.elements[10] * vec.z + mat.elements[14] * 1;
    }
    return vertices;
  };

  this.select = function(obj){
    if(_state == _mode.OBJECTMODE){//obj
      if(_select_object !== obj){//新しく選択されたら
        if(_select_object){//元の選択を消す
          _this.object_group.remove(_select_edge);
        }
        _select_object = obj;
        _select_object.verticesNeedUpdate = true;
        _vertex = _this.create_vertex(obj.geometry.vertices);
        _vertex.visible = false;
        _select_object.add(_vertex);
        _select_edge = new THREE.EdgesHelper( _select_object, 0xffa800 );
        _this.object_group.add(_select_edge);
        object_controls.attach(_select_object);
        _this.object_group.add(object_controls);
      }
    }else if(_state == _mode.EDITMODE){//edit
      if(_select_vertex !== obj){
        if(_select_vertex){
          _select_object.remove(_selected);
        }
        _select_vertex = obj;
        _selected = _this.create_selected(_select_vertex);
        _select_object.add(_selected);
      }
    }
  };

  this.addPrimitive = function(type){
    var material,
        geometry,
        mesh;
    material = new THREE.MeshPhongMaterial({
      wireframe:false,color:0xFFFFFF,shading: THREE.SmoothShading
    });
    if(type === "cube"){
      geometry = new THREE.BoxGeometry(60,60,60,1,1,1);
    }else if(type === "plane"){
      geometry = new THREE.PlaneGeometry(120,120,3,3);
      // TODO rotation
    }else if(type === "cylinder"){
      geometry = new THREE.CylinderGeometry(100, 100, 100, 16);
    }else if(type === "sphere"){
      geometry = new THREE.SphereGeometry(100,16,16);
    }
    mesh = new THREE.Mesh(geometry, material);
    _this.object_group.add(mesh);
    _this.select(mesh);
    this.postedit("primitive",mesh.uuid,type);
    return mesh;
  };

  this.create_selected = function(vertex){
    var material = new THREE.PointsMaterial({
      size:30,color: 0xff7a00
    });
    var particle = new THREE.Geometry();
    particle.vertices.push(vertex);
    return new THREE.Points(particle,material);
  };

  this.create_vertex = function(vertices){
    var material = new THREE.PointsMaterial({
      size: 20,color: 0xFFFFFF
    });
    var particle = new THREE.Geometry();
    for(var i = 0,l = vertices.length; i < l; i++){
      particle.vertices.push(vertices[i]);
    }
    return new THREE.Points(particle,material);
  };

  this.mode_switch = function(mode){
    if(mode == _mode.EDITMODE){
      _select_object.material.wireframe = true;
      _select_object.material.color.set(0x00FF00);
      _state = _mode.EDITMODE;// to edit mode
      _select_object.visible = true;
      _vertex.visible = true;
      _select_edge.visible = false;
      object_controls.detach(_select_object);
    }else if(mode == _mode.OBJECTMODE){
      _select_object.material.wireframe = false;
      _select_object.material.color.set(0xFFFFFF);
      _state = _mode.OBJECTMODE;//to object mode
      _select_object.visible = true;
      _vertex.visible = false;
      if(_selected){
        _selected.visible = false;
      }
      _this.object_group.remove(_select_edge);
      _select_edge = new THREE.EdgesHelper( _select_object, 0xffa800 );
      _this.object_group.add(_select_edge);
      object_controls.attach(_select_object);
    }else if(mode == _mode.TRANSMODE){
      _state = _mode.TRANSMODE;
    }
  };

  this.onkeydown = function(event){
    switch ( event.keyCode ) {
      case 9: // tab
        if(_select_object !== gridHelper){
          if(_state == _mode.OBJECTMODE){
            _this.mode_switch(_mode.EDITMODE);
          }else if(_state == _mode.EDITMODE){
            _this.mode_switch(_mode.OBJECTMODE);
          }
        }
      break;

      case 17: // Ctrl
        object_controls.setTranslationSnap( 100 );
        object_controls.setRotationSnap( THREE.Math.degToRad( 15 ) );
      break;

      case 71: // g
        if(_state == _mode.OBJECTMODE){
          object_controls.setMode( "translate" );
        }else if(_state == _mode.EDITMODE){
          _this.mode_switch(_mode.TRANSMODE);
        }
      break;

      case 82: // r
        object_controls.setMode( "rotate" );
      break;

      case 83: // s
        object_controls.setMode( "scale" );
      break;

      case 187:
      case 107: // +, =, num+
        object_controls.setSize( object_controls.size + 0.1 );
      break;

      case 189:
      case 109: // -, _, num-
        object_controls.setSize( Math.max( object_controls.size - 0.1, 0.1 ) );
      break;

    }
  };

	this.onkeyup = function(event){
  	switch ( event.keyCode ) {
  		case 17: // Ctrl
  			object_controls.setTranslationSnap( null );
  			object_controls.setRotationSnap( null );
      break;
  	}
	};

  this.setSize = function () {
    _width = _container.clientWidth;
    _height = _container.clientHeight;
    _this.camera.aspect = _width / _height;
    _this.camera.updateProjectionMatrix();
    _this.renderer.setSize( _width, _height );
    _this.render();
  };

  this.render = function() {
    camera_controls.update();
    _this.intersecter();
    _this.renderer.render( _this.scene, _this.camera );
  };
  
  this.intersecter = function(){
    var sm = new THREE.Matrix4().set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);
    var cm = _this.camera.matrixWorld.clone();
    cm.elements[12] = 0;
    cm.elements[13] = 0;
    cm.elements[14] = 0;

    intersect_object.matrixNeedsUpdate = true;
    intersect_object.matrixAutoUpdate = false;
    intersect_object.matrix = sm.multiply(cm);

  };
  this.animate = function() {
    requestAnimationFrame( _this.animate );
    _this.render();
  };
};



