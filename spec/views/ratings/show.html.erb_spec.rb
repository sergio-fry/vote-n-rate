require 'rails_helper'

RSpec.describe "ratings/show", :type => :view do
  before(:each) do
    @rating = assign(:rating, Rating.create!(
      :title => "Title",
      :items => "MyText"
    ))
  end

  it "renders attributes in <p>" do
    render
    expect(rendered).to match(/Title/)
    expect(rendered).to match(/MyText/)
  end
end
