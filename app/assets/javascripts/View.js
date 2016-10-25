/**
 * Created by ratovia on 2016/10/14.
 */
THREESESSION.View = function(){
  /////////////////////////////////////////////////
  /////////////////定数/////////////////////////////
  const container = document.getElementById('main');
  const mode = {
    OBJECTMODE:0,
    EDITMODE:1,
    TRANSMODE:2
  };
  const material = {
    intersect: new THREE.MeshPhongMaterial({
      wireframe:false,color:0xFF0000,shading: THREE.SmoothShading,
      transparent: true,opacity:0.0
    }),
    mesh: new THREE.MeshPhongMaterial({
      wireframe:false,color:0xFFFFFF,shading: THREE.SmoothShading
    }),
    wireframe: new THREE.MeshPhongMaterial({
      wireframe:true,color:0x00FF00,shading: THREE.SmoothShading
    })
  };
  /////////////////////////////////////////////////
  /////////////////変数/////////////////////////////
  var width = container.clientWidth;
  var height = container.clientHeight;
  var state = mode.OBJECTMODE;
  var mouse = new THREE.Vector2();
  var camera;
  var camera_controls;
  var intersecter;
  var renderer = new THREE.WebGLRenderer({clearAlpha: 1,clearColor: 0x2B2B2B});
  var scene = new THREE.Scene();
  var env_group = new THREE.Group();
  var obj_group = new THREE.Group();
  var loader = new THREE.JSONLoader();
  var selector = new THREESESSION.Select();
  var uuid_array = [];
  /////////////////////////////////////////////////
  /////////////////private function////////////////
  function set_camera(type){
    type = type || "camera";
    var orthocamera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 10000);
    var parscamera = new THREE.PerspectiveCamera(30, width / height,1,10000);
    switch(type){
      case "camera":
        camera = orthocamera;
        camera.position.set(500,200,400);
        camera.lookAt(new THREE.Vector3());
        break;
      case "pars":
        camera = parscamera;
        camera.position.set(500,200,400);
        camera.lookAt(new THREE.Vector3());
        break;
      default:
        camera = orthocamera;
        camera.position.set(500,200,400);
        camera.lookAt(new THREE.Vector3());
        break;
    }
    camera_controls = new THREE.OrbitControls(camera);
  }

  function get_uuid_to_obj(uuid){
    var obj = null;
    for(var i = 0,l = obj_group.children.length;i < l;i++){
      if(obj_group.children[i].uuid == uuid){
        obj = obj_group.children[i];
      }
    }
    return obj;
  }

  function animate(){
    requestAnimationFrame(animate);
    render();
  }

  function render(){
    camera_controls.update();
    intersect_matrix_update();
    renderer.render(scene,camera);
  }
  
  function env(){
    var directionalLight1 = new THREE.DirectionalLight( 0xffffff );
    var directionalLight2 = new THREE.DirectionalLight( 0xffffff );
    var gridHelper = new THREE.GridHelper( 480,80,0xFF0000,0x2B2B2B);
    intersecter = new THREE.Mesh(new THREE.PlaneGeometry(2000,2000,1,1),material.intersect);
    directionalLight1.position.set( 0.3, 0.7, 0.5 );
    directionalLight2.position.set( -0.3, -0.7, -0.5 );
    env_group.add(intersecter);
    env_group.add(gridHelper);
    env_group.add(directionalLight1);
    env_group.add(directionalLight2);
  }

  function intersect_matrix_update(){
    var im = new THREE.Matrix4();
    var cm = camera.matrixWorld.clone();
    cm.elements[12] = cm.elements[13] = cm.elements[14] = 0;
    intersecter.matrixNeedsUpdate = true;
    intersecter.matrixAutoUpdate = false;
    intersecter.matrix = im.multiply(cm);
  }
  /////////////////////////////////////////////////
  /////////////////Public function/////////////////
  this.init = function(){
    set_camera();
    container.appendChild(renderer.domElement);
    env();
    scene.add(obj_group);
    scene.add(env_group);
    scene.add(camera);
    animate();
  };

  this.get_state = function(){
    return state;
  };

  this.add_obj_group = function(obj){
    obj_group.add(obj);
    uuid_array.push(obj.uuid);
  };

  this.get_selector = function(){
    return selector;
  };

  this.trans_point = function(target,uuid,value){
    var mesh = get_uuid_to_obj(uuid);
    mesh.geometry.vertices[target].set(value[0], value[1], value[2]);
    mesh.geometry.verticesNeedUpdate = true;
  };

  this.setSize = function(){
    width = container.clientWidth;
    height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width,height);
    render();
  };
  
  this.get_renderer_element = function(){
    return renderer.domElement;
  };

  this.primitive = function (type){
    var json,model,mesh;
    switch(type) {
      case "cube":
        json = {
          "vertices":[30,-30,-30,30,-30,30,-30,-30,30,-30,-30,-30,30,30,-30,30,30,30,-30,30,30,-30,30,-30],
          "faces":[33,0,1,2,3,0,0,0,0,33,4,7,6,5,1,1,1,1,33,0,4,5,1,2,2,2,2,33,1,5,6,2,3,3,3,3,33,2,6,7,3,4,4,4,4,33,4,0,3,7,5,5,5,5],
          "name":"CubeGeometry",
          "metadata":{
            "vertices":8,
            "faces":6,
            "generator":"io_three",
            "normals":6,
            "type":"Geometry",
            "uvs":0,
            "version":3
          },
          "uvs":[],
          "normals":[-0,0,1,0,-0,-1,1,0,-0,-0,1,0,-1,-0,0,0,-1,-0]
        };
        break;
      case "plane":
        json = {
          "vertices":[-30,1e-06,30,30,1e-06,30,-30,-1e-06,-30,30,-1e-06,-30],
          "faces":[33,0,1,3,2,0,0,0,0],
          "name":"PlaneGeometry",
          "metadata":{
            "vertices":4,
            "faces":1,
            "generator":"io_three",
            "normals":1,
            "type":"Geometry",
            "uvs":0,
            "version":3
          },
          "uvs":[],
          "normals":[0,-0,-1]
        };
        break;
      case "cylinder":
        json = {
          "vertices":[0,-30,-30,0,30,-30,11.4805,-30,-27.7164,11.4805,30,-27.7164,21.2132,-30,-21.2132,21.2132,30,-21.2132,27.7164,-30,-11.4805,27.7164,30,-11.4805,30,-30,3e-06,30,30,0,27.7164,-30,11.4805,27.7164,30,11.4805,21.2132,-30,21.2132,21.2132,30,21.2132,11.4805,-30,27.7164,11.4805,30,27.7164,5e-06,-30,30,5e-06,30,30,-11.4805,-30,27.7164,-11.4805,30,27.7164,-21.2132,-30,21.2132,-21.2132,30,21.2132,-27.7164,-30,11.4805,-27.7164,30,11.4805,-30,-30,1e-06,-30,30,-2e-06,-27.7164,-30,-11.4805,-27.7164,30,-11.4805,-21.2132,-30,-21.2132,-21.2132,30,-21.2132,-11.4805,-30,-27.7164,-11.4805,30,-27.7164],
          "faces":[33,0,1,3,2,0,0,0,0,33,2,3,5,4,1,1,1,1,33,4,5,7,6,2,2,2,2,33,6,7,9,8,3,3,3,3,33,8,9,11,10,4,4,4,4,33,10,11,13,12,5,5,5,5,33,12,13,15,14,6,6,6,6,33,14,15,17,16,7,7,7,7,33,16,17,19,18,8,8,8,8,33,18,19,21,20,9,9,9,9,33,20,21,23,22,10,10,10,10,33,22,23,25,24,11,11,11,11,33,24,25,27,26,12,12,12,12,33,26,27,29,28,13,13,13,13,32,5,3,1,14,14,14,32,1,31,29,15,15,15,32,29,27,25,16,16,16,32,25,23,21,14,14,14,32,21,19,17,14,14,14,32,17,15,13,15,15,15,32,13,11,9,14,14,14,32,9,7,5,17,17,17,32,5,1,29,18,18,18,32,29,25,21,19,19,19,32,21,17,13,15,15,15,32,13,9,5,20,20,20,32,5,29,21,21,21,21,32,21,13,5,22,22,22,33,28,29,31,30,23,23,23,23,33,1,0,30,31,24,24,24,24,32,30,0,2,25,25,25,32,2,4,6,26,26,26,32,6,8,10,27,27,27,32,10,12,14,28,28,28,32,14,16,18,26,26,26,32,18,20,22,29,29,29,32,22,24,26,26,26,26,32,26,28,30,26,26,26,32,30,2,6,26,26,26,32,6,10,14,30,30,30,32,14,18,22,31,31,31,32,22,26,30,26,26,26,32,30,6,14,32,32,32,32,14,22,30,33,33,33],
          "name":"Cylinder.001Geometry",
          "metadata":{
            "vertices":32,
            "faces":44,
            "generator":"io_three",
            "normals":34,
            "type":"Geometry",
            "uvs":0,
            "version":3
          },
          "uvs":[],
          "normals":[0.19509,-0.980785,0,0.55557,-0.83147,0,0.83147,-0.55557,0,0.980785,-0.19509,0,0.980785,0.19509,-0,0.83147,0.55557,-0,0.55557,0.83147,-0,0.19509,0.980785,-0,-0.19509,0.980785,-0,-0.55557,0.83147,-0,-0.831469,0.55557,-0,-0.980785,0.19509,-0,-0.980785,-0.195091,0,-0.831469,-0.55557,0,0,0,-1,0,0,-1,0,0,-1,-0,0,-1,-0,0,-1,0,-0,-1,-0,-0,-1,0,-0,-1,-0,-0,-1,-0.55557,-0.83147,0,-0.19509,-0.980785,0,-0,0,1,0,0,1,0,-0,1,0,0,1,-0,0,1,-0,-0,1,0,0,1,-0,0,1,0,0,1]
        };
        break;
      case "sphere":
        json = {
          "vertices":[0,29.4236,-5.85271,0,24.9441,-16.6671,0,16.6671,-24.9441,0,11.4805,-27.7164,0,1e-06,-30,0,-11.4805,-27.7164,0,-16.6671,-24.9441,0,-24.9441,-16.6671,0,-27.7164,-11.4805,0,-29.4236,-5.8527,2.23974,29.4236,-5.4072,4.3934,27.7164,-10.6066,6.37823,24.9441,-15.3984,8.11795,21.2132,-19.5984,9.54569,16.6671,-23.0453,10.6066,11.4805,-25.6066,11.2599,5.85271,-27.1838,11.4805,1e-06,-27.7164,11.2599,-5.85271,-27.1838,10.6066,-11.4805,-25.6066,9.54569,-16.6671,-23.0453,8.11795,-21.2132,-19.5984,6.37823,-24.9441,-15.3984,4.3934,-27.7164,-10.6066,2.23974,-29.4236,-5.40719,4.1385,29.4236,-4.13849,8.11795,27.7164,-8.11794,11.7854,24.9441,-11.7854,15,21.2132,-15,17.6381,16.6671,-17.6381,19.5985,11.4805,-19.5984,20.8056,5.85271,-20.8056,21.2132,1e-06,-21.2132,20.8056,-5.85271,-20.8056,19.5985,-11.4805,-19.5984,17.6381,-16.6671,-17.6381,15,-21.2132,-15,11.7854,-24.9441,-11.7854,8.11795,-27.7164,-8.11793,4.13849,-29.4236,-4.13848,5.40721,29.4236,-2.23973,10.6066,27.7164,-4.39339,15.3984,24.9441,-6.37822,19.5985,21.2132,-8.11793,23.0453,16.6671,-9.54568,25.6066,11.4805,-10.6066,27.1838,5.85271,-11.2599,27.7164,2e-06,-11.4805,27.1838,-5.85271,-11.2599,25.6066,-11.4805,-10.6066,23.0453,-16.6671,-9.54568,19.5985,-21.2132,-8.11793,15.3984,-24.9441,-6.37822,10.6066,-27.7164,-4.39339,5.4072,-29.4236,-2.23972,5.85272,29.4236,9e-06,11.4805,27.7164,1e-05,16.6671,24.9441,1e-05,21.2132,21.2132,1.1e-05,24.9441,16.6671,1.2e-05,27.7164,11.4805,1.1e-05,29.4236,5.85271,1.1e-05,30,2e-06,1.3e-05,29.4236,-5.85271,1.2e-05,27.7164,-11.4805,1.4e-05,24.9441,-16.6671,1.3e-05,21.2132,-21.2132,1.3e-05,16.6671,-24.9441,1.3e-05,11.4805,-27.7164,1.3e-05,5.85271,-29.4236,1.2e-05,5.40721,29.4236,2.23975,10.6066,27.7164,4.39341,15.3984,24.9441,6.37824,19.5984,21.2132,8.11796,23.0453,16.6671,9.5457,25.6066,11.4805,10.6066,27.1838,5.85271,11.2599,27.7164,3e-06,11.4805,27.1838,-5.85271,11.2599,25.6066,-11.4805,10.6066,23.0453,-16.6671,9.54571,19.5984,-21.2132,8.11796,15.3984,-24.9441,6.37824,10.6066,-27.7164,4.39341,5.4072,-29.4236,2.23975,4.13849,29.4236,4.13851,8.11795,27.7164,8.11796,11.7854,24.9441,11.7854,15,21.2132,15,17.6381,16.6671,17.6382,19.5984,11.4805,19.5985,20.8056,5.85271,20.8056,21.2132,3e-06,21.2132,20.8056,-5.85271,20.8056,19.5984,-11.4805,19.5985,17.6381,-16.6671,17.6382,15,-21.2132,15,11.7854,-24.9441,11.7854,8.11794,-27.7164,8.11796,4.13849,-29.4236,4.1385,2.23974,29.4236,5.40722,4.3934,27.7164,10.6066,6.37822,24.9441,15.3984,8.11794,21.2132,19.5985,9.54569,16.6671,23.0453,10.6066,11.4805,25.6066,11.2599,5.85271,27.1838,11.4805,3e-06,27.7164,11.2599,-5.85271,27.1838,10.6066,-11.4805,25.6066,9.54569,-16.6671,23.0453,8.11794,-21.2132,19.5985,6.37822,-24.9441,15.3984,4.3934,-27.7164,10.6066,2.23973,-29.4236,5.40721,-2e-06,29.4236,5.85273,-3e-06,27.7164,11.4805,-4e-06,24.9441,16.6671,-3e-06,21.2132,21.2132,-7e-06,16.6671,24.9441,-6e-06,11.4805,27.7164,-4e-06,5.85271,29.4236,-7e-06,4e-06,30,-4e-06,-5.85271,29.4236,-8e-06,-11.4805,27.7164,-7e-06,-16.6671,24.9441,-3e-06,-21.2132,21.2132,-5e-06,-24.9441,16.6671,-5e-06,-27.7164,11.4805,-2e-06,-29.4236,5.85272,-2.23974,29.4236,5.40721,-4.3934,27.7164,10.6066,-6.37823,24.9441,15.3984,-8.11795,21.2132,19.5984,-9.5457,16.6671,23.0453,-10.6066,11.4805,25.6066,-11.2599,5.85271,27.1838,-11.4805,3e-06,27.7164,-11.2599,-5.85271,27.1838,-10.6066,-11.4805,25.6066,-9.5457,-16.6671,23.0453,-8.11795,-21.2132,19.5985,-6.37823,-24.9441,15.3984,-4.3934,-27.7164,10.6066,-2.23974,-29.4236,5.40721,-4.1385,29.4236,4.1385,-8.11795,27.7164,8.11795,-11.7854,24.9441,11.7854,-15,21.2132,15,-17.6381,16.6671,17.6381,-19.5985,11.4805,19.5985,-20.8056,5.85271,20.8056,-21.2132,3e-06,21.2132,-20.8056,-5.85271,20.8056,-19.5985,-11.4805,19.5984,-17.6381,-16.6671,17.6381,-15,-21.2132,15,-11.7854,-24.9441,11.7854,-8.11795,-27.7164,8.11795,-4.13849,-29.4236,4.1385,-9e-06,30,1.2e-05,-5.40721,29.4236,2.23974,-10.6066,27.7164,4.3934,-15.3984,24.9441,6.37823,-19.5984,21.2132,8.11794,-23.0453,16.6671,9.54569,-25.6066,11.4805,10.6066,-27.1838,5.85271,11.2599,-27.7164,3e-06,11.4805,-27.1838,-5.85271,11.2599,-25.6066,-11.4805,10.6066,-23.0453,-16.6671,9.54569,-19.5984,-21.2132,8.11795,-15.3984,-24.9441,6.37823,-10.6066,-27.7164,4.3934,-5.4072,-29.4236,2.23975,-5.85272,29.4236,6e-06,-11.4805,27.7164,4e-06,-16.6671,24.9441,1e-06,-21.2132,21.2132,2e-06,-24.9441,16.6671,-4e-06,-27.7164,11.4805,-2e-06,-29.4236,5.85271,1e-06,-30,2e-06,-2e-06,-29.4236,-5.85271,2e-06,-27.7164,-11.4805,-1e-06,-24.9441,-16.6671,-2e-06,-21.2132,-21.2132,3e-06,-16.6671,-24.9441,3e-06,-11.4805,-27.7164,4e-06,-5.85271,-29.4236,9e-06,-5.40721,29.4236,-2.23973,-10.6066,27.7164,-4.3934,-15.3984,24.9441,-6.37823,-19.5984,21.2132,-8.11794,-23.0453,16.6671,-9.54569,-25.6066,11.4805,-10.6066,-27.1838,5.85271,-11.2599,-27.7164,2e-06,-11.4805,-27.1838,-5.85271,-11.2599,-25.6066,-11.4805,-10.6066,-23.0453,-16.6671,-9.54569,-19.5984,-21.2132,-8.11794,-15.3984,-24.9441,-6.37822,-10.6066,-27.7164,-4.39339,-5.4072,-29.4236,-2.23973,-4.13849,29.4236,-4.13849,-8.11794,27.7164,-8.11794,-11.7854,24.9441,-11.7854,-15,21.2132,-15,-17.6381,16.6671,-17.6381,-19.5984,11.4805,-19.5984,-20.8056,5.85271,-20.8056,-21.2132,1e-06,-21.2132,-20.8056,-5.85271,-20.8056,-19.5984,-11.4805,-19.5984,-17.6381,-16.6671,-17.6381,-15,-21.2132,-15,-11.7854,-24.9441,-11.7854,-8.11794,-27.7164,-8.11794,-4.13849,-29.4236,-4.13848,-2.23974,29.4236,-5.4072,-4.3934,27.7164,-10.6066,-6.37822,24.9441,-15.3984,-8.11793,21.2132,-19.5984,-9.54567,16.6671,-23.0453,-10.6066,11.4805,-25.6066,-11.2599,5.85271,-27.1838,-11.4805,1e-06,-27.7164,-11.2599,-5.85271,-27.1838,-10.6066,-11.4805,-25.6066,-9.54567,-16.6671,-23.0453,-8.11793,-21.2132,-19.5984,-6.37822,-24.9441,-15.3984,-4.39339,-27.7164,-10.6066,-2.23973,-29.4236,-5.40719,5e-06,27.7164,-11.4805,1e-05,21.2132,-21.2132,1.2e-05,5.85271,-29.4235,1.2e-05,-5.85271,-29.4235,1e-05,-21.2132,-21.2132,0,-30,1.1e-05],
          "faces":[33,239,4,17,18,0,0,0,0,33,236,0,10,11,1,1,1,1,33,5,239,18,19,2,2,2,2,33,1,236,11,12,3,3,3,3,33,6,5,19,20,4,4,4,4,33,237,1,12,13,5,5,5,5,33,240,6,20,21,6,6,6,6,33,2,237,13,14,7,7,7,7,33,7,240,21,22,8,8,8,8,33,3,2,14,15,9,9,9,9,33,8,7,22,23,10,10,10,10,33,238,3,15,16,11,11,11,11,33,9,8,23,24,12,12,12,12,33,4,238,16,17,13,13,13,13,32,0,160,10,14,14,14,32,241,9,24,15,15,15,33,17,16,31,32,16,16,16,16,32,10,160,25,17,17,17,32,241,24,39,18,18,18,33,18,17,32,33,19,19,19,19,33,11,10,25,26,20,20,20,20,33,19,18,33,34,21,21,21,21,33,12,11,26,27,22,22,22,22,33,20,19,34,35,23,23,23,23,33,13,12,27,28,24,24,24,24,33,21,20,35,36,25,25,25,25,33,14,13,28,29,26,26,26,26,33,22,21,36,37,27,27,27,27,33,15,14,29,30,28,28,28,28,33,23,22,37,38,29,29,29,29,33,16,15,30,31,30,30,30,30,33,24,23,38,39,31,31,31,31,33,36,35,50,51,32,32,32,32,33,29,28,43,44,33,33,33,33,33,37,36,51,52,34,34,34,34,33,30,29,44,45,35,35,35,35,33,38,37,52,53,36,36,36,36,33,31,30,45,46,37,37,37,37,33,39,38,53,54,38,38,38,38,33,32,31,46,47,39,39,39,39,32,25,160,40,40,40,40,32,241,39,54,41,41,41,33,33,32,47,48,42,42,42,42,33,26,25,40,41,43,43,43,43,33,34,33,48,49,44,44,44,44,33,27,26,41,42,45,45,45,45,33,35,34,49,50,46,46,46,46,33,28,27,42,43,47,47,47,47,32,40,160,55,48,48,48,32,241,54,69,49,49,49,33,48,47,62,63,50,50,50,50,33,41,40,55,56,51,51,51,51,33,49,48,63,64,52,52,52,52,33,42,41,56,57,53,53,53,53,33,50,49,64,65,54,54,54,54,33,43,42,57,58,55,55,55,55,33,51,50,65,66,56,56,56,56,33,44,43,58,59,57,57,57,57,33,52,51,66,67,58,58,58,58,33,45,44,59,60,59,59,59,59,33,53,52,67,68,60,60,60,60,33,46,45,60,61,61,61,61,61,33,54,53,68,69,62,62,62,62,33,47,46,61,62,63,63,63,63,33,59,58,73,74,64,64,64,64,33,67,66,81,82,65,65,65,65,33,60,59,74,75,66,66,66,66,33,68,67,82,83,67,67,67,67,33,61,60,75,76,68,68,68,68,33,69,68,83,84,69,69,69,69,33,62,61,76,77,70,70,70,70,32,55,160,70,71,71,71,32,241,69,84,72,72,72,33,63,62,77,78,73,73,73,73,33,56,55,70,71,74,74,74,74,33,64,63,78,79,75,75,75,75,33,57,56,71,72,76,76,76,76,33,65,64,79,80,77,77,77,77,33,58,57,72,73,78,78,78,78,33,66,65,80,81,79,79,79,79,33,78,77,92,93,80,80,80,80,33,71,70,85,86,81,81,81,81,33,79,78,93,94,82,82,82,82,33,72,71,86,87,83,83,83,83,33,80,79,94,95,84,84,84,84,33,73,72,87,88,85,85,85,85,33,81,80,95,96,86,86,86,86,33,74,73,88,89,87,87,87,87,33,82,81,96,97,88,88,88,88,33,75,74,89,90,89,89,89,89,33,83,82,97,98,90,90,90,90,33,76,75,90,91,91,91,91,91,33,84,83,98,99,92,92,92,92,33,77,76,91,92,93,93,93,93,32,70,160,85,94,94,94,32,241,84,99,95,95,95,33,97,96,111,112,96,96,96,96,33,90,89,104,105,97,97,97,97,33,98,97,112,113,98,98,98,98,33,91,90,105,106,99,99,99,99,33,99,98,113,114,100,100,100,100,33,92,91,106,107,101,101,101,101,32,85,160,100,102,102,102,32,241,99,114,103,103,103,33,93,92,107,108,104,104,104,104,33,86,85,100,101,105,105,105,105,33,94,93,108,109,106,106,106,106,33,87,86,101,102,107,107,107,107,33,95,94,109,110,108,108,108,108,33,88,87,102,103,109,109,109,109,33,96,95,110,111,110,110,110,110,33,89,88,103,104,111,111,111,111,33,109,108,123,124,112,112,112,112,33,102,101,116,117,113,113,113,113,33,110,109,124,125,114,114,114,114,33,103,102,117,118,115,115,115,115,33,111,110,125,126,116,116,116,116,33,104,103,118,119,117,117,117,117,33,112,111,126,127,118,118,118,118,33,105,104,119,120,119,119,119,119,33,113,112,127,128,120,120,120,120,33,106,105,120,121,121,121,121,121,33,114,113,128,129,122,122,122,122,33,107,106,121,122,123,123,123,123,32,100,160,115,124,124,124,32,241,114,129,125,125,125,33,108,107,122,123,126,126,126,126,33,101,100,115,116,127,127,127,127,33,128,127,142,143,128,128,128,128,33,121,120,135,136,129,129,129,129,33,129,128,143,144,130,130,130,130,33,122,121,136,137,131,131,131,131,32,115,160,130,132,132,132,32,241,129,144,133,133,133,33,123,122,137,138,134,134,134,134,33,116,115,130,131,135,135,135,135,33,124,123,138,139,136,136,136,136,33,117,116,131,132,137,137,137,137,33,125,124,139,140,138,138,138,138,33,118,117,132,133,139,139,139,139,33,126,125,140,141,140,140,140,140,33,119,118,133,134,141,141,141,141,33,127,126,141,142,142,142,142,142,33,120,119,134,135,143,143,143,143,33,132,131,146,147,144,144,144,144,33,140,139,154,155,145,145,145,145,33,133,132,147,148,146,146,146,146,33,141,140,155,156,147,147,147,147,33,134,133,148,149,148,148,148,148,33,142,141,156,157,149,149,149,149,33,135,134,149,150,150,150,150,150,33,143,142,157,158,151,151,151,151,33,136,135,150,151,152,152,152,152,33,144,143,158,159,153,153,153,153,33,137,136,151,152,154,154,154,154,32,130,160,145,155,155,155,32,241,144,159,156,156,156,33,138,137,152,153,157,157,157,157,33,131,130,145,146,158,158,158,158,33,139,138,153,154,159,159,159,159,33,151,150,166,167,160,160,160,160,33,159,158,174,175,161,161,161,161,33,152,151,167,168,162,162,162,162,32,145,160,161,163,163,163,32,241,159,175,164,164,164,33,153,152,168,169,165,165,165,165,33,146,145,161,162,166,166,166,166,33,154,153,169,170,167,167,167,167,33,147,146,162,163,168,168,168,168,33,155,154,170,171,169,169,169,169,33,148,147,163,164,170,170,170,170,33,156,155,171,172,171,171,171,171,33,149,148,164,165,172,172,172,172,33,157,156,172,173,173,173,173,173,33,150,149,165,166,174,174,174,174,33,158,157,173,174,175,175,175,175,33,171,170,185,186,176,176,176,176,33,164,163,178,179,177,177,177,177,33,172,171,186,187,178,178,178,178,33,165,164,179,180,179,179,179,179,33,173,172,187,188,180,180,180,180,33,166,165,180,181,181,181,181,181,33,174,173,188,189,182,182,182,182,33,167,166,181,182,183,183,183,183,33,175,174,189,190,184,184,184,184,33,168,167,182,183,185,185,185,185,32,161,160,176,186,186,186,32,241,175,190,187,187,187,33,169,168,183,184,188,188,188,188,33,162,161,176,177,189,189,189,189,33,170,169,184,185,190,190,190,190,33,163,162,177,178,191,191,191,191,33,190,189,204,205,192,192,192,192,33,183,182,197,198,193,193,193,193,32,176,160,191,194,194,194,32,241,190,205,195,195,195,33,184,183,198,199,196,196,196,196,33,177,176,191,192,197,197,197,197,33,185,184,199,200,198,198,198,198,33,178,177,192,193,199,199,199,199,33,186,185,200,201,200,200,200,200,33,179,178,193,194,201,201,201,201,33,187,186,201,202,202,202,202,202,33,180,179,194,195,203,203,203,203,33,188,187,202,203,204,204,204,204,33,181,180,195,196,205,205,205,205,33,189,188,203,204,206,206,206,206,33,182,181,196,197,207,207,207,207,33,194,193,208,209,208,208,208,208,33,202,201,216,217,209,209,209,209,33,195,194,209,210,210,210,210,210,33,203,202,217,218,211,211,211,211,33,196,195,210,211,212,212,212,212,33,204,203,218,219,213,213,213,213,33,197,196,211,212,214,214,214,214,33,205,204,219,220,215,215,215,215,33,198,197,212,213,216,216,216,216,32,191,160,206,217,217,217,32,241,205,220,218,218,218,33,199,198,213,214,219,219,219,219,33,192,191,206,207,220,220,220,220,33,200,199,214,215,221,221,221,221,33,193,192,207,208,222,222,222,222,33,201,200,215,216,223,223,223,223,33,213,212,227,228,224,224,224,224,32,206,160,221,225,225,225,32,241,220,235,226,226,226,33,214,213,228,229,227,227,227,227,33,207,206,221,222,228,228,228,228,33,215,214,229,230,229,229,229,229,33,208,207,222,223,230,230,230,230,33,216,215,230,231,231,231,231,231,33,209,208,223,224,232,232,232,232,33,217,216,231,232,233,233,233,233,33,210,209,224,225,234,234,234,234,33,218,217,232,233,235,235,235,235,33,211,210,225,226,236,236,236,236,33,219,218,233,234,237,237,237,237,33,212,211,226,227,238,238,238,238,33,220,219,234,235,239,239,239,239,33,232,231,6,240,240,240,240,240,33,225,224,237,2,241,241,241,241,33,233,232,240,7,242,242,242,242,33,226,225,2,3,243,243,243,243,33,234,233,7,8,244,244,244,244,33,227,226,3,238,245,245,245,245,33,235,234,8,9,246,246,246,246,33,228,227,238,4,247,247,247,247,32,221,160,0,248,248,248,32,241,235,9,249,249,249,33,229,228,4,239,250,250,250,250,33,0,236,222,221,251,251,251,251,33,230,229,239,5,252,252,252,252,33,223,222,236,1,253,253,253,253,33,231,230,5,6,254,254,254,254,33,224,223,1,237,255,255,255,255],
          "name":"SphereGeometry",
          "metadata":{
            "vertices":242,
            "faces":256,
            "generator":"io_three",
            "normals":256,
            "type":"Geometry",
            "uvs":0,
            "version":3
          },
          "uvs":[],
          "normals":[0.194186,-0.976241,0.096152,0.057645,-0.289802,-0.955349,0.186989,-0.940062,0.285164,0.093357,-0.469338,-0.87807,0.172787,-0.868657,0.464306,0.125195,-0.629403,-0.766928,0.151975,-0.764031,0.627025,0.151975,-0.764031,-0.627024,0.125196,-0.629402,0.766928,0.172787,-0.868657,-0.464307,0.093357,-0.469338,0.87807,0.186989,-0.940062,-0.285164,0.057645,-0.289802,0.955349,0.194186,-0.976241,-0.096152,0.019493,-0.097998,-0.994996,0.019493,-0.097998,0.994996,0.552996,-0.827617,-0.096151,0.055512,-0.083079,-0.994996,0.055512,-0.083079,0.994996,0.552996,-0.827617,0.096151,0.16416,-0.245682,-0.955349,0.532502,-0.796946,0.285165,0.265859,-0.397885,-0.87807,0.492054,-0.736412,0.464306,0.356528,-0.533581,-0.766928,0.432789,-0.647714,0.627024,0.432789,-0.647715,-0.627024,0.356528,-0.533581,0.766928,0.492054,-0.736412,-0.464307,0.265859,-0.397885,0.87807,0.532502,-0.796946,-0.285165,0.16416,-0.245682,0.955349,0.647715,-0.432789,0.627024,0.647715,-0.432789,-0.627024,0.533581,-0.356527,0.766928,0.736412,-0.492054,-0.464307,0.397886,-0.265858,0.87807,0.796946,-0.532502,-0.285165,0.245682,-0.164159,0.955349,0.827617,-0.552996,-0.096152,0.083079,-0.055512,-0.994996,0.083079,-0.055512,0.994996,0.827617,-0.552996,0.096152,0.245682,-0.16416,-0.955349,0.796946,-0.532502,0.285164,0.397885,-0.265858,-0.87807,0.736412,-0.492054,0.464307,0.533581,-0.356527,-0.766928,0.097998,-0.019493,-0.994996,0.097998,-0.019493,0.994996,0.976241,-0.194186,0.096152,0.289802,-0.057645,-0.955349,0.940062,-0.18699,0.285164,0.469338,-0.093357,-0.87807,0.868657,-0.172786,0.464307,0.629402,-0.125196,-0.766928,0.764031,-0.151975,0.627024,0.764031,-0.151975,-0.627024,0.629402,-0.125196,0.766928,0.868657,-0.172786,-0.464307,0.469338,-0.093357,0.87807,0.940062,-0.18699,-0.285164,0.289802,-0.057645,0.955349,0.976241,-0.194186,-0.096152,0.764031,0.151976,-0.627024,0.629402,0.125196,0.766928,0.868656,0.172787,-0.464307,0.469338,0.093357,0.87807,0.940062,0.18699,-0.285164,0.289802,0.057645,0.955349,0.976241,0.194187,-0.096152,0.097998,0.019493,-0.994996,0.097998,0.019493,0.994996,0.976241,0.194187,0.096152,0.289802,0.057645,-0.955349,0.940062,0.18699,0.285165,0.469338,0.093357,-0.87807,0.868656,0.172787,0.464307,0.629402,0.125196,-0.766928,0.764031,0.151976,0.627024,0.827617,0.552996,0.096152,0.245682,0.16416,-0.955349,0.796946,0.532502,0.285165,0.397885,0.265859,-0.87807,0.736411,0.492055,0.464307,0.533581,0.356528,-0.766928,0.647715,0.432789,0.627024,0.647714,0.432789,-0.627024,0.533581,0.356528,0.766928,0.736411,0.492054,-0.464307,0.397885,0.265859,0.87807,0.796946,0.532502,-0.285164,0.245682,0.164159,0.955349,0.827617,0.552996,-0.096152,0.083079,0.055512,-0.994996,0.083079,0.055512,0.994996,0.356528,0.533582,0.766928,0.492054,0.736411,-0.464307,0.265859,0.397886,0.87807,0.532502,0.796946,-0.285164,0.164159,0.245682,0.955349,0.552996,0.827617,-0.096151,0.055512,0.083079,-0.994996,0.055512,0.083079,0.994996,0.552996,0.827617,0.096151,0.16416,0.245682,-0.955349,0.532502,0.796946,0.285165,0.265858,0.397886,-0.87807,0.492054,0.736412,0.464307,0.356528,0.533582,-0.766928,0.432789,0.647715,0.627024,0.432789,0.647714,-0.627024,0.18699,0.940062,0.285164,0.093357,0.469338,-0.87807,0.172786,0.868656,0.464307,0.125196,0.629402,-0.766928,0.151975,0.764032,0.627024,0.151975,0.764031,-0.627025,0.125196,0.629402,0.766928,0.172786,0.868656,-0.464307,0.093357,0.469338,0.87807,0.18699,0.940062,-0.285164,0.057645,0.289802,0.955349,0.194186,0.976241,-0.096152,0.019493,0.097999,-0.994996,0.019493,0.097998,0.994996,0.194186,0.976241,0.096152,0.057645,0.289802,-0.955349,-0.093357,0.469338,0.87807,-0.18699,0.940062,-0.285164,-0.057645,0.289801,0.955349,-0.194187,0.976241,-0.096152,-0.019493,0.097999,-0.994996,-0.019493,0.097998,0.994996,-0.194187,0.976241,0.096152,-0.057645,0.289802,-0.955349,-0.18699,0.940062,0.285164,-0.093357,0.469338,-0.87807,-0.172787,0.868656,0.464307,-0.125196,0.629402,-0.766928,-0.151976,0.764032,0.627024,-0.151976,0.764031,-0.627025,-0.125196,0.629402,0.766928,-0.172787,0.868656,-0.464308,-0.265859,0.397885,-0.87807,-0.492055,0.736411,0.464307,-0.356528,0.533582,-0.766928,-0.432789,0.647714,0.627024,-0.432789,0.647714,-0.627025,-0.356528,0.533581,0.766928,-0.492055,0.736411,-0.464307,-0.265859,0.397886,0.87807,-0.532503,0.796946,-0.285164,-0.164159,0.245682,0.955349,-0.552996,0.827617,-0.096152,-0.055512,0.083079,-0.994996,-0.055512,0.083079,0.994996,-0.552996,0.827617,0.096152,-0.16416,0.245682,-0.955349,-0.532503,0.796946,0.285164,-0.796946,0.532502,-0.285164,-0.245682,0.164159,0.955349,-0.827617,0.552996,-0.096152,-0.083079,0.055512,-0.994996,-0.083079,0.055512,0.994996,-0.827617,0.552996,0.096152,-0.245682,0.16416,-0.955349,-0.796946,0.532502,0.285164,-0.397886,0.265858,-0.87807,-0.736412,0.492054,0.464307,-0.533582,0.356528,-0.766928,-0.647715,0.432789,0.627024,-0.647715,0.432789,-0.627024,-0.533582,0.356528,0.766928,-0.736411,0.492054,-0.464307,-0.397886,0.265859,0.878069,-0.868657,0.172786,0.464306,-0.629402,0.125196,-0.766928,-0.764031,0.151975,0.627024,-0.764031,0.151975,-0.627024,-0.629403,0.125196,0.766928,-0.868656,0.172786,-0.464307,-0.469338,0.093357,0.87807,-0.940062,0.18699,-0.285163,-0.289802,0.057645,0.955349,-0.976241,0.194186,-0.096153,-0.097999,0.019493,-0.994996,-0.097998,0.019493,0.994996,-0.976241,0.194186,0.096152,-0.289802,0.057645,-0.955349,-0.940062,0.18699,0.285164,-0.469338,0.093357,-0.87807,-0.289802,-0.057645,0.955349,-0.976241,-0.194187,-0.096153,-0.097999,-0.019493,-0.994996,-0.097998,-0.019493,0.994996,-0.976241,-0.194187,0.096153,-0.289802,-0.057645,-0.955349,-0.940062,-0.18699,0.285164,-0.469338,-0.093357,-0.87807,-0.868657,-0.172787,0.464307,-0.629402,-0.125196,-0.766928,-0.764031,-0.151976,0.627024,-0.764031,-0.151976,-0.627024,-0.629403,-0.125196,0.766928,-0.868656,-0.172787,-0.464307,-0.469338,-0.093357,0.878069,-0.940062,-0.18699,-0.285164,-0.533581,-0.356528,-0.766928,-0.647714,-0.432789,0.627024,-0.647714,-0.432789,-0.627024,-0.533581,-0.356528,0.766928,-0.736411,-0.492055,-0.464307,-0.397885,-0.265859,0.87807,-0.796946,-0.532503,-0.285163,-0.245682,-0.16416,0.955349,-0.827617,-0.552996,-0.096153,-0.083079,-0.055512,-0.994996,-0.083079,-0.055512,0.994996,-0.827617,-0.552996,0.096153,-0.245682,-0.16416,-0.955349,-0.796946,-0.532503,0.285164,-0.397885,-0.265859,-0.87807,-0.736411,-0.492055,0.464307,-0.552996,-0.827617,-0.096153,-0.055512,-0.083079,-0.994996,-0.055512,-0.083079,0.994996,-0.552996,-0.827617,0.096153,-0.16416,-0.245682,-0.955349,-0.532502,-0.796946,0.285164,-0.265858,-0.397886,-0.87807,-0.492054,-0.736412,0.464307,-0.356528,-0.533582,-0.766928,-0.432789,-0.647715,0.627024,-0.432789,-0.647715,-0.627024,-0.356528,-0.533582,0.766928,-0.492054,-0.736411,-0.464308,-0.265858,-0.397886,0.87807,-0.532502,-0.796946,-0.285163,-0.164159,-0.245682,0.955349,-0.151975,-0.764031,0.627025,-0.151975,-0.764031,-0.627025,-0.125196,-0.629403,0.766928,-0.172787,-0.868656,-0.464307,-0.093357,-0.469338,0.87807,-0.18699,-0.940062,-0.285163,-0.057645,-0.289802,0.955349,-0.194186,-0.976241,-0.096154,-0.019493,-0.097999,-0.994996,-0.019493,-0.097998,0.994996,-0.194186,-0.976241,0.096154,-0.057645,-0.289802,-0.955349,-0.18699,-0.940062,0.285163,-0.093357,-0.469338,-0.87807,-0.172787,-0.868657,0.464306,-0.125196,-0.629403,-0.766928]
        };
        break;
    }
    model = loader.parse(json);
    mesh = new THREE.Mesh(model.geometry,material.mesh);
    return mesh;
  };
  
  this.picking = function(){
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse,camera);
    var intersects;
    switch(state){
      case mode.OBJECTMODE:
        intersects = raycaster.intersectObjects(obj_group.children);
        if(intersects.length > 0) {
          if(intersects[0].object != selector.get_edge()){
            selector.set_select(intersects[0].object);
            if(!selector.get_edge()) {
              obj_group.add(selector.set_edge());
            }
          }
        }
        break;
      case mode.EDITMODE:
        intersects = raycaster.intersectObjects(obj_group.children);
        if(intersects.length > 0){
          selector.set_select_vertex(intersects[0].point);
          obj_group.remove(selector.get_select_particle());
          obj_group.add(selector.set_select_particle());
        }
        break;
      case mode.TRANSMODE:
        intersects = raycaster.intersectObject(intersecter);
        if(intersects.length > 0){
          var point = [intersects[0].point.x,intersects[0].point.y,intersects[0].point.z];
          selector.trans_point(point);
        }
        break;
    }
  };

  this.onmousemove = function(event){
    var rect = event.target.getBoundingClientRect();
    var x =  event.clientX - rect.left;
    var y =  event.clientY - rect.top;
    mouse.x =  (x / width) * 2 - 1;
    mouse.y = -(y / height) * 2 + 1;
  };
  
  this.trans_end = function(){
    state = mode.EDITMODE;  
  };
  
  this.get_uuid_array = function(){
    return uuid_array;  
  };

  this.mode_switch = function(str){
    if(selector.get_select()) {
      var mesh;
      switch (str) {
        case "object":
          state = mode.OBJECTMODE;
          mesh = selector.get_select();
          mesh.material = material.mesh;
          obj_group.add(selector.set_edge());
          obj_group.remove(selector.get_select_particle());
          obj_group.remove(selector.get_vertex());
          break;
        case "edit":
          state = mode.EDITMODE;
          mesh = selector.get_select();
          mesh.material = material.wireframe;
          obj_group.remove(selector.get_edge());
          obj_group.add(selector.set_vertex());
          obj_group.add(selector.set_select_particle());
          break;
        case "trans":
          state = mode.TRANSMODE;
          break;
      }
    }
  };

  this.removeall = function(){
    for(var i = obj_group.children.length - 1;i >= 0; i--){
      obj_group.remove(obj_group.children[i]);
    }
    uuid_array = [];
    selector.init();
    state = mode.OBJECTMODE;
  };
  
  this.makemesh = function(json,uuid){
    var model = loader.parse(json);
    var mesh = new THREE.Mesh(model.geometry,material.mesh); 
    mesh.uuid = uuid;
    return mesh;
  };
  
  this.remove = function(){
    obj_group.remove(selector.get_edge());
    obj_group.remove(selector.get_vertex());
    obj_group.remove(selector.get_select_particle());
    obj_group.remove(selector.get_select());
    uuid_array.splice(uuid_array.indexOf(selector.get_select().uuid),1);
    selector.init();
    state = mode.OBJECTMODE;
  };

  this.remove_uuid = function(uuid){
    for(var i = 0,l = obj_group.children.length;i < l;i++){
      if(obj_group.children[i].uuid == uuid){
        obj_group.remove(obj_group.children[i]);
        uuid_array.splice(uuid_array.indexOf(uuid));
      }
    }
  };
};