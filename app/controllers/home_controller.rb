class HomeController < ApplicationController
  def index
  end

  def create
    session[':user_id'] = SecureRandom.urlsafe_base64
    # TODO このユーザーがを知らなかったら
    # TODO 差分からスナップショット
    # TODO そのスナップを描画
  end
end
