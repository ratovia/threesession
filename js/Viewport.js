THREESESSION.Viewport = function(parameters){
  //
  var _container = document.getElementById('main'),
      _width = _container.clientWidth,
  		_height = _container.clientHeight,
  		_radius = 500,
  		_this = this,
      _select_object,
      _select_frame,
      _select_edge,
      _select_flag = true,
      _select_vertex,
      _mouse = new THREE.Vector2(),
  		SHADOW_MAP_WIDTH = 2048,
      PARTICLE_SIZE = 20,
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
  var object_controls = new THREE.TransformControls(_this.camera,_this.renderer.domElement);
  object_controls.addEventListener("change",_this.render);


  this.scene = new THREE.Scene();
  this.scene.add(this.camera);

  var gridHelper = new THREE.GridHelper( 480,80,0xFF0000,0x2B2B2B);
  this.scene.add( gridHelper );

  var directionalLight = new THREE.DirectionalLight( 0xffffff );
  directionalLight.position.set( 0.3, 0.7, 0.5 );
  this.scene.add( directionalLight );



  /////////////////////////////////////////////////////
  //////////////// public method //////////////////////
  /////////////////////////////////////////////////////

  this.set_defoult_objects = function (){
    var mesh = _this.addPrimitive("cube");
    _this.select(mesh);
    object_controls.attach(mesh);
  };

  this.vertex_perticle = function(geometry){
    var vertices = geometry.vertices;
		var positions = new Float32Array( vertices.length * 3 );
		var colors = new Float32Array( vertices.length * 3 );
		var sizes = new Float32Array( vertices.length );

		var vertex;
		// var color = new THREE.Color(0xff00ff);

		for ( var i = 0, l = vertices.length; i < l; i ++ ) {

			vertex = vertices[ i ];
			vertex.toArray( positions, i * 3 );
			sizes[ i ] = PARTICLE_SIZE * 0.5;

		}

		var vertex_geometry = new THREE.BufferGeometry();
		vertex_geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
		// vertex_geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
		vertex_geometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1) );

    var material = new THREE.PointsMaterial( { size: 10,color: 0x8f8f8f} );

    _select_vertex = new THREE.Points( vertex_geometry, material );
		_this.scene.add( _select_vertex );
  };

  this.onmousemove = function(event){
    var rect = event.target.getBoundingClientRect();
    var x =  event.clientX - rect.left;
    var y =  event.clientY - rect.top;
    _mouse.x =  (x / _width) * 2 - 1;
    _mouse.y = -(y / _height) * 2 + 1;
  };

  this.picking = function(event){
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(_mouse,_this.camera);
    var intersects = raycaster.intersectObjects(_this.scene.children);
    if(intersects.length > 0 && _select_flag == true){
      _this.select(intersects[0].object);
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
    _this.renderer.render( _this.scene, _this.camera );
  };

  this.animate = function() {
    requestAnimationFrame( _this.animate );
    _this.render();
  };


  this.select = function(obj){
    if(_select_object !== obj){//新しく選択されたら
      if(_select_object){//元の選択を消す
        _this.scene.remove(_select_edge);
      }
      _select_object = obj;
      var frame = _this.create_frame(obj);
      var vertex = _this.create_vertex(obj);
      frame.visible = false;
      vertex.visible = false;
      frame.add(vertex);
      _this.scene.add(frame);
      _select_frame = frame;
      _select_vertex = vertex;
      _select_edge = new THREE.EdgesHelper( _select_object, 0xffa800 );
      _this.scene.add(_select_edge);
      object_controls.attach(_select_object);
      _this.scene.add(object_controls);
    }
  };

  this.addPrimitive = function(type){
    var mesh = _this.create_mesh(type);
    _this.scene.add(mesh);
    _this.select(mesh);
    return mesh;
  };

  this.create_vertex = function(mesh){
    var material = new THREE.PointsMaterial({
      size: 10,color: 0xFFFFFF
    });
    var vertices = mesh.geometry.vertices;
    var particle = new THREE.Geometry();
    console.log(mesh);
    for(var i = 0,l = vertices.length; i < l; i++){
      // console.log(particle);
      particle.vertices.push(vertices[i]);
    }
    var mesh = new THREE.Points(particle,material);
    console.log(vertices);
    console.log(particle.vertices);

    return mesh;
  }

  this.create_frame = function(mesh){
    frame = new THREE.WireframeHelper( mesh, 0x00ff00 );
    return frame;
  };

  this.create_mesh = function(type){
    var material,
        geometry,
        mesh,
        name,
        whitemap,
        rotation;
    material = new THREE.MeshPhongMaterial({wireframe:false,color:0xFFFFFF,shading: THREE.SmoothShading});
    if(type === "cube"){
      geometry = new THREE.BoxGeometry(60,60,60,1,1,1);
      name = "cube";

    }else if(type === "plane"){
      geometry = new THREE.PlaneGeometry(120,120,3,3);
      name = "plane";
      // TODO rotation
    }else if(type === "cylinder"){
      geometry = new THREE.CylinderGeometry(100, 100, 100, 16);
      meshName = 'cylinder';
    }else if(type === "sphere"){
      geometry = new THREE.SphereGeometry(100,16,16);
      meshName = 'THREE.SphereGeometry';
    }
    mesh = new THREE.Mesh(geometry, material);
    return mesh;
  };

  this.mode_switch = function(){
    if(_select_object !== gridHelper){
      if(_select_flag){
        _select_flag = false;// to edit mode
        _select_object.visible = false;
        _select_frame.visible = true;
        _select_vertex.visible = true;
        _select_edge.visible = false;
        // console.log(_select_object);
        // _this.scene.remove(_select_object);
      }else {
        _select_flag = true;//to object mode
        _select_object.visible = true;
        _select_edge.visible = true;
        _select_vertex.visible = false;
        _select_frame.visible = false;
        // _this.scene.add(_select_object);
      }
    }
  };

  this.onkeydown = function(event){
    switch ( event.keyCode ) {
      case 9: // tab
        _this.mode_switch();
      break;

      case 17: // Ctrl
        object_controls.setTranslationSnap( 100 );
        object_controls.setRotationSnap( THREE.Math.degToRad( 15 ) );
      break;

      case 71: // g
        object_controls.setMode( "translate" );
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
}
