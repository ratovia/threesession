class SessionsController < ApplicationController
  def new
    
  end

  def index
    user_name = params[:user_name]
    user = User.create(name: user_name)
    session[:user_id] = user.id
  end

  def loadjson
    snap = Snap.all
    array1 = []
    array2 = []
    array4 = []
    snap.each do |data|
      matrix_array = text_to_array(data.matrix)
      faces_array = text_to_array(data.faces_data)
      normals_array = text_to_array(data.normals_data)
      vertices_array = text_to_array(data.vertices_data)
      uvs_array = text_to_array(data.uvs_data)

      hash1 = {
        :name => data.name,
        :uuid => data.uuid,
        :matrix => matrix_array,
        :visible => true,
        :type => 'Mesh'
      }

      hash2 = {
        :data => {
          :metadata => {
            :faces => data.faces,
            :version => data.version,
            :normals => data.normals,
            :vertices => data.vertices,
            :uvs => data.uvs,
            :generator => 'io_three'
          },
          :name => data.name,
          :faces => faces_array,
          :normals => normals_array,
          :vertices => vertices_array,
          :uvs => uvs_array
        },
        :type => 'Mesh',
        :uuid => data.uuid
      }

      array1.append(hash1)
      array2.append(hash2)
      array4.append(data.uuid)
    end

    edit = Edit.all
    array3 = []
    edit.each do |data|
      hash4 = {
        :id => data.id,
        :operation => data.operation,
        :uuid => data.uuid,
        :target => data.target,
        :value => data.value
      }
      array3.push(hash4)
    end

    hash3 = {
      :matadata => {
        :version => 4.4,
        :type => 'Object',
        :generator => 'io_three'
      },
      :materials => [],
      :textures => [],
      :images => [],
      :animations => [{
        :name => 'default',
        :fps => 24,
        :tracks => []
       }],
      :object => {
        :children => array1,
        :type => 'Scene',
        :matrix => [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
        :uuid => '9D73C9AE-06F7-4F28-989A-9B8CCBD47A09'
      },
      :geometries => array2,
      :edit => array3,
      :uuid_array => array4
    }

    data = JSON.generate(hash3)
    # # # snap = Snap.where(userのroomのidで検索)
    render json: data
  end

  def post
    operation = params[:operation]
    uuid = params[:uuid]
    target = params[:target]
    value = params[:value]
    # 衝突回避処理
    Edit.create(:operation => operation, :uuid => uuid, :target => target, :value => value)
  end

  private
    def text_to_array(data)
      array = []
      array += data.split(',').map(&:to_i)
      array
    end
end