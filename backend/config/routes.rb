Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html


  namespace :api do
    resources :messages, only: [:create, :update]
    resources :users, only: [:create, :show]
    resources :listings, only: [:index, :show, :destroy, :create]
    post '/login', to: 'auth#create'
    get '/current_user', to: 'auth#show'
    get '/fetch_distance', to: 'google_maps#fetch_distance'
  end

end
