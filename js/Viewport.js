THREESESSION.Viewport = function(parameters){
  //
  var _container = document.getElementById('main'),
      _width = _container.clientWidth,
  		_height = _container.clientHeight,
  		_radius = 500,
  		_this = this,
      _select_object,
  		SHADOW_MAP_WIDTH = 2048,
      PARTICLE_SIZE = 20,
  		SHADOW_MAP_HEIGHT = 1024;
  //
  // this.camera = new THREE.PerspectiveCamera(30, _width / _height,1,10000);
  this.camera = new THREE.OrthographicCamera(_width / - 2, _width / 2, _height / 2, _height / - 2, 1, 10000);
  this.camera.position.set(1200,500,600);
  this.camera.name = 'Camera';
  this.camera.lookAt(new THREE.Vector3());
  var controls = new THREE.OrbitControls(this.camera);

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

  this.scene = new THREE.Scene();
  this.scene.add(this.camera);

  var gridHelper = new THREE.GridHelper( 640,80,0xFF0000,0x2B2B2B);
  this.scene.add( gridHelper );

  var directionalLight = new THREE.DirectionalLight( 0xffffff );
  directionalLight.position.set( 0.3, 0.7, 0.5 );
  this.scene.add( directionalLight );

  /////////////////////////////////////////////////////
  //////////////// public method //////////////////////
  /////////////////////////////////////////////////////

  this.set_defoult_objects = function (){
    var geometry = new THREE.BoxGeometry( 500, 500, 500, 2, 2, 2 );
    var material = new THREE.MeshPhongMaterial( { color: 0xFFFFFF} );
    var object = new THREE.Mesh( geometry, material );

    _this.scene.add( object );
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
    controls.update();
    _this.renderer.render( _this.scene, _this.camera );
  };

  this.animate = function() {
    requestAnimationFrame( _this.animate );
    _this.render();
  };


  this.renderer.domElement.addEventListener('mousedown',function(event){
    var rect = event.target.getBoundingClientRect();
    var x =  event.clientX - rect.left;
    var y =  event.clientY - rect.top;
    var mouse = new THREE.Vector2();
    mouse.x =  (x / _width) * 2 - 1;
    mouse.y = -(y / _height) * 2 + 1;
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse,_this.camera);
    var intersects = raycaster.intersectObjects(_this.scene.children);
    if(intersects.length > 0){
      _this.select(intersects[0].object);
    }
  });

  this.select = function(obj){
    if(_select_object !== obj){
      if(_select_object){
        _select_object.material.color.set(0xFFFFFF);
      }
      _select_object = obj;
      _select_object.material.color.set(0xf19408);
    }
  };

  this.addPrimitive = function(type){
    var material,
        geometry,
        mesh,
        name,
        whitemap,
        rotation;
    material = new THREE.MeshPhongMaterial({wireframe:false,color:0xFFFFFF,shading: THREE.SmoothShading});

    if(type === "cube"){
      geometry = new THREE.BoxGeometry(300,300,300,1,1,1);
      name = "cube";
    }else if(type === "plane"){
      geometry = new THREE.PlaneGeometry(600,600,3,3);
      name = "plane";
      // TODO rotation
    }else if(type === "cylinder"){
      geometry = new THREE.CylinderGeometry(100, 100, 100, 16);
      meshName = 'cylinder';
    }else if(type === "sphere"){
      geometry = new THREE.SphereGeometry(100,16,16);
      meshName = 'THREE.SphereGeometry';
    }else if(type === "pointlight"){

    }else if(type === "directionalLight"){

    }else if(type === "spotlight"){

    }

    mesh = new THREE.Mesh(geometry, material);

    this.scene.add(mesh);

    return mesh;
  };
}
