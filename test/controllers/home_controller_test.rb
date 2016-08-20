require 'test_helper'

class HomeControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
  end

  test "index view" do
    get :index
    assert_select 'title', "Threesession | 3DCG modeling session"

  end
end
