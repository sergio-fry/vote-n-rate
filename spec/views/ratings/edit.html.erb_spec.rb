require 'rails_helper'

RSpec.describe "ratings/edit", :type => :view do
  before(:each) do
    @rating = assign(:rating, Rating.create!(
      :title => "MyString",
      :items => "MyText"
    ))
  end

  it "renders the edit rating form" do
    render

    assert_select "form[action=?][method=?]", rating_path(@rating), "post" do

      assert_select "input#rating_title[name=?]", "rating[title]"

      assert_select "textarea#rating_items[name=?]", "rating[items]"
    end
  end
end
