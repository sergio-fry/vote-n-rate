Rails.application.routes.draw do
  root "ratings#index"

  resources :ratings do
    resources :items do
      member do
        get :vote
      end
    end
  end
  #get 'rating/:id/items/:item_id/vote' => 'ratings#vote', as: :vote
end
