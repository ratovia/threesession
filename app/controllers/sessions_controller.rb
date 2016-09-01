class SessionsController < ApplicationController
  def new
    
  end

  def index
    @user_name = params[:user_name]
    @user = User.create(name: @user_name)
    session[:user_id] = @user.id
  end
end