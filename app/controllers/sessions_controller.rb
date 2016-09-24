class SessionsController < ApplicationController
  def new
    
  end

  def index
    @user_name = params[:user_name]
    @user = User.create(name: @user_name)
    session[:user_id] = @user.id
  end

  def loadjson
    @snap = Snap.all
    @array1 = []
    @snap.each do |snap|

      matrix_array = []

      snap.matrix.split(',').each do |data|
        matrix_array.push(data.to_i)
      end

      @hash1 = {
        :name => snap.name,
        :uuid => snap.uuid,
        :matrix => matrix_array,
        :visible => true,
        :type => 'Mesh'
      }
      @array1.append(@hash1)
    end

    @array2 = []
    @snap.each do |snap|
      faces_array = []
      normals_array = []
      vertices_array = []
      uvs_array = []
      snap.faces_data.split(',').each do |data|
        faces_array.push(data.to_i)
      end
      snap.normals_data.split(',').each do |data|
        normals_array.push(data.to_i)
      end
      snap.vertices_data.split(',').each do |data|
        vertices_array.push(data.to_i)
      end
      snap.uvs_data.split(',').each do |data|
        uvs_array.push(data.to_i)
      end
      @hash2 = {
        :data => {
          :metadata => {
            :faces => snap.faces,
            :version => snap.version,
            :normals => snap.normals,
            :vertices => snap.vertices,
            :uvs => snap.uvs,
            :generator => 'io_three'
          },
          :name => snap.name,
          :faces => faces_array,
          :normals => normals_array,
          :vertices => vertices_array,
          :uvs => uvs_array
        },
        :type => 'Mesh',
        :uuid => snap.uuid
      }
      @array2.append(@hash2)
    end

    # puts @array2



    @hash3 = {
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
        :children => @array1,
        :type => 'Scene',
        :matrix => [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
        :uuid => '9D73C9AE-06F7-4F28-989A-9B8CCBD47A09'
      },
      :geometries => @array2
    }

    @data = JSON.generate(@hash3)
    # # # @snap = Snap.where(userのroomのidで検索)
    render json: @data
  end

  def post
    @operation = params[:operation]
    @uuid = params[:uuid]
    @target = params[:target]
    @value = params[:value]
    puts(@value)





    Edit.create(:operation => @operation, :uuid => @uuid, :target => @target, :value => @value)

  end
end