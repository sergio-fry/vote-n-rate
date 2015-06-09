Rails.application.routes.draw do

  scope 'iframe' do
    scope 'uploader', controller: "uploader" do
      post 'upload'
      get 'file'
    end
  end

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
