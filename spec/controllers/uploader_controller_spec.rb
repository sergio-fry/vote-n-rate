require 'rails_helper'

RSpec.describe UploaderController, :type => :controller do

  describe "GET new" do
    it "returns http success" do
      get :new
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET success" do
    it "returns http success" do
      get :success
      expect(response).to have_http_status(:success)
    end
  end

end
