THREESESSION.Viewport = function(parameters){
  var _container = document.createElement('div'),
	    _width = window.innerWidth,
			_height = window.innerHeight,
			_radius = 500,
			_this = this,
			SHADOW_MAP_WIDTH = 2048,
			SHADOW_MAP_HEIGHT = 1024;

	document.body.appendChild( _container );

	this.camera = new THREE.PerspectiveCamera(30, _width / _height,1,10000);
	this.camera.position.set(1200,500,600);
	this.camera.name = 'Camera';
	this.camera.lookAt(new THREE.Vector3());

	this.renderer = new THREE.WebGLRenderer({clearAlpha: 1,clearColor: 0x2B2B2B});
	this.renderer.setSize(_width,_height);
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

  this.controls = new THREE.ViewportControls( this.camera, this.renderer.domElement);
	this.controls.rotateSpeed = 1.1;
  this.controls.zoomSpeed = 2.0;
  this.controls.panSpeed = 2.0;
  this.controls.noZoom = false;
  this.controls.noPan = false;
  this.controls.staticMoving = false;
  this.controls.dynamicDampingFactor = 0.3;
  this.controls.minDistance = 0;
  this.controls.maxDistance = _radius * 100;
  this.controls.keys = [ 65, 83, 68 ]; // [ rotateKey, zoomKey, panKey ]

	this.scene = new THREE.Scene();
	this.scene.add(this.camera);

	this.grid = new THREE.Grid();
	this.scene.add(this.grid);

  // TODO manipulator



	var directionalLight = new THREE.DirectionalLight( 0xffffff );
  directionalLight.position.set( 0.3, 0.7, 0.5 );
  this.scene.add( directionalLight );

  var geometry = new THREE.CubeGeometry( 300, 300, 300 );
  var material = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
  var mesh = new THREE.Mesh( geometry, material );
  this.scene.add( mesh );

	this.setSize = function ( width, height ) {

    _width = width;
    _height = height;

    _this.camera.aspect = width / height;
    //_this.camera.toPerspective();
    _this.camera.updateProjectionMatrix();

    _this.controls.screen.width = width;
    _this.controls.screen.height = height;

    _this.renderer.setSize( width, height );
    _this.render();

  };

	this.render = function() {

    // var delta = clock.getDelta();

    _this.controls.update();
		//
    // if( _this.animating ) {
    //   _this._SELECTED.updateAnimation( 1000 * delta );
    // }

    //this.processParticles();

    _this.renderer.render( _this.scene, _this.camera );
  };

	this.animate = function() {
    requestAnimationFrame( _this.animate );
    _this.render();
  };

	this.renderer.domElement.addEventListener('dblclick',function(e){
		_this.animating = false;
    _this._SELECTED.geometry.computeBoundingBox();

    var bb = _this._SELECTED.geometry.boundingBox;

    _this.camera.position.x = _this._SELECTED.position.x;
    _this.camera.position.y = _this._SELECTED.position.y + _this._SELECTED.boundRadius;
    if(bb.z) {
      _this.camera.position.z = _this._SELECTED.position.z + (bb.z[1]+300);
    }
    _this.controls.target = _this._SELECTED.position;

	});
}
