class SessionsController < ApplicationController
  def new
    
  end

  def index
    @user_name = params[:user_name]
    @user = User.create(name: @user_name)
    session[:user_id] = @user.id
  end

  def loadjson
    @json= File.read("start3.json")
    render json: @json
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