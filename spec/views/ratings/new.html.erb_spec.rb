require 'rails_helper'

RSpec.describe "ratings/new", :type => :view do
  before(:each) do
    assign(:rating, Rating.new(
      :title => "MyString",
      :items => "MyText"
    ))
  end

  it "renders new rating form" do
    render

    assert_select "form[action=?][method=?]", ratings_path, "post" do

      assert_select "input#rating_title[name=?]", "rating[title]"

      assert_select "textarea#rating_items[name=?]", "rating[items]"
    end
  end
end
