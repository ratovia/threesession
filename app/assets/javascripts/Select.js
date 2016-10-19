/**
 * Created by ratovia on 2016/10/15.
 */
THREESESSION.Select = function(){
  /////////////////////////////////////////////////
  /////////////////定数/////////////////////////////
  const material = {
    vertex: new THREE.PointsMaterial({
      size: 20,color: 0xFFFFFF
    }),
    select_particle: new THREE.PointsMaterial({
      size: 30,color: 0xFF7A00
    })
  };
  /////////////////////////////////////////////////
  /////////////////変数/////////////////////////////
  var select;// 選択したオブジェクト
  var edge;// 選択したオブジェクトの辺
  var vertex;// editの時の頂点
  var select_vertex = new THREE.Geometry();//選択した頂点列
  var select_particle;//選択した頂点列のmesh
  /////////////////////////////////////////////////
  /////////////////private function////////////////
  function distance(vec1,vec2){
    return Math.sqrt(Math.pow(Math.floor(vec1.x) - Math.floor(vec2.x), 2) + Math.pow(Math.floor(vec1.y) - Math.floor(vec2.y), 2) + Math.pow(Math.floor(vec1.z) - Math.floor(vec2.z), 2));
  }

  function current_vertices_position(){
    var vertices = select.geometry.vertices;
    var mat = select.matrix;
    var vec = new THREE.Vector3();
    for(var i = 0, l = vertices.length;i < l ; i++){
      vec = vertices[i];
      vertices[i].x = mat.elements[0] * vec.x + mat.elements[4] * vec.y + mat.elements[8]  * vec.z + mat.elements[12] * 1;
      vertices[i].y = mat.elements[1] * vec.x + mat.elements[5] * vec.y + mat.elements[9]  * vec.z + mat.elements[13] * 1;
      vertices[i].z = mat.elements[2] * vec.x + mat.elements[6] * vec.y + mat.elements[10] * vec.z + mat.elements[14] * 1;
    }
    return vertices;
  }
  /////////////////////////////////////////////////
  /////////////////Public function/////////////////
  this.get_edge = function(){
    return edge;
  };
  
  this.get_select = function(){
    return select;  
  };

  this.get_select_particle = function(){
    return select_particle
  };

  this.get_vertex = function(){
    return vertex;
  };

  this.get_select_vertex = function(){
    return select_vertex;
  };

  this.set_select = function(obj){
    select = obj;
  };

  this.set_edge = function(){
    edge = new THREE.EdgesHelper(select,0xffa800);
    return edge;
  };

  this.set_vertex = function(){
    var particle = new THREE.Geometry();

    for(var i = 0,l = select.geometry.vertices.length; i < l; i++){
      particle.vertices.push(select.geometry.vertices[i]);
    }
    vertex = new THREE.Points(particle,material.vertex);
    return vertex;
  };

  this.set_select_particle = function(){
    var particle = new THREE.Geometry();
    for(var i = 0,l = select_vertex.vertices.length; i < l; i++){
      particle.vertices.push(select_vertex.vertices[i]);
    }
    select_particle = new THREE.Points(particle,material.select_particle);
    return select_particle;
  };

  this.set_select_vertex = function(point){
    var d, min_d = 10000, min_idx = -1;
    var vertex;
    var vertices = current_vertices_position();
    for(var i = 0,l = vertices.length; i < l ;i++){
      vertex = vertices[i];
      d = distance(point,vertex);
      if(min_d > d){
        min_d = d;
        min_idx = i;
      }
    }
    var tmp = select_vertex.vertices;
    var min_vertex = vertices[min_idx];
    if(tmp.includes(min_vertex)){
      tmp.splice(tmp.indexOf(min_vertex),1);
    }else{
      tmp.push(min_vertex);
    }
  };

  this.init = function(){
    select = null;
    edge = null;
    vertex = null;
    select_vertex = new THREE.Geometry();
    select_particle = null;
  };
};