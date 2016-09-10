class SessionsController < ApplicationController
  def new
    
  end

  def index
    @user_name = params[:user_name]
    @user = User.create(name: @user_name)
    session[:user_id] = @user.id
  end

  def loadjson
    @json = File.read("start.json")
    render json: @json
  end

  def post
    @target = "aaa"
    @operation = "bbb"
  end
end