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

  /////////////////////////////////////////////////////
  //////////////// public method //////////////////////
  /////////////////////////////////////////////////////

  this.set_defoult_objects = function (){
    var geometry = new THREE.BoxGeometry( 500, 500, 500, 2, 2, 2 );
    var material = new THREE.MeshPhongMaterial( { color: 0xff0000} );
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


  this.renderer.domElement.addEventListener('mousedown',function(ev){
    var projector = new THREE.Projector();
    //マウスのグローバル変数
    var mouse = { x: 0, y: 0 };
    //オブジェクト格納グローバル変数

     //マウス座標2D変換
     var rect = ev.target.getBoundingClientRect();
     mouse.x =  ev.clientX - rect.left;
     mouse.y =  ev.clientY - rect.top;

     //マウス座標3D変換 width（横）やheight（縦）は画面サイズ
     mouse.x =  (mouse.x / _width) * 2 - 1;
     mouse.y = -(mouse.y / _height) * 2 + 1;

     // マウスベクトル
     var vector = new THREE.Vector3( mouse.x, mouse.y ,1);

    // vector はスクリーン座標系なので, オブジェクトの座標系に変換
     vector = vector.unproject( this.camera );

     // 始点, 向きベクトルを渡してレイを作成
     var ray = new THREE.Raycaster( this.camera.position, vector.sub( this.camera.position ).normalize() );

      // クリック判定
     var obj = ray.intersectObjects( this.scene.children );

      // クリックしていたら、alertを表示
     if ( obj.length > 0 ){

       alert("click!!")

     }

  });
  this.select = function(obj){

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
