class SessionsController < ApplicationController
  def new
    
  end

  def index
    @user_name = params[:user_name];
  end
end