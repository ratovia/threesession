THREESESSION.Viewport = function(parameters){
  //
  var _container = document.createElement('div'),
      _width = window.innerWidth,
  		_height = window.innerHeight,
  		_radius = 500,
  		_this = this,
  		SHADOW_MAP_WIDTH = 2048,
      PARTICLE_SIZE = 20,
  		SHADOW_MAP_HEIGHT = 1024;
  //
  document.body.appendChild( _container );

  this.camera = new THREE.PerspectiveCamera(30, _width / _height,1,10000);
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
  this.renderer.shadowMapEnabled = true;
  this.renderer.shadowMapSoft = true;
  _container.appendChild(this.renderer.domElement);

  this.scene = new THREE.Scene();
  this.scene.add(this.camera);

  var gridHelper = new THREE.GridHelper( 640,80,0xFF0000,0x2B2B2B);
  this.scene.add( gridHelper );

  var directionalLight = new THREE.DirectionalLight( 0xffffff );
  directionalLight.position.set( 0.3, 0.7, 0.5 );
  this.scene.add( directionalLight );

  ////////////////////////////////////////////////////
  //////////////// public method /////////////////////
  ////////////////////////////////////////////////////

  this.set_defoult_objects = function (){
    var geometry = new THREE.BoxGeometry( 500, 500, 500, 2, 2, 2 );
    var material = new THREE.MeshPhongMaterial( { color: 0xff0000} );
    var object = new THREE.Mesh( geometry, material );
    _this.scene.add( object );
  };

  this.setSize = function ( width, height ) {
    _width = width;
    _height = height;
    _this.camera.aspect = width / height;
    _this.camera.updateProjectionMatrix();
    _this.renderer.setSize( width, height );
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
}
