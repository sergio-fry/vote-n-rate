require 'rails_helper'

RSpec.describe "ratings/index", :type => :view do
  before(:each) do
    assign(:ratings, [
      Rating.create!(
        :title => "Title",
        :items => "MyText"
      ),
      Rating.create!(
        :title => "Title",
        :items => "MyText"
      )
    ])
  end

  it "renders a list of ratings" do
    render
    assert_select "tr>td", :text => "Title".to_s, :count => 2
    assert_select "tr>td", :text => "MyText".to_s, :count => 2
  end
end
