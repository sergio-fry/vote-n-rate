Rails.application.routes.draw do
  get 'home' => 'home#index', as: :home

  root "ratings#index"

  resources :ratings do
    resources :items do
      member do
        put :vote
        put :unvote
      end
    end
  end
end
