Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'sessions#new'
  get 'session' => 'sessions#index'
  get 'load' => 'sessions#loadjson'
  post 'post' => 'sessions#post'
end
