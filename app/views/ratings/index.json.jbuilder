json.array!(@ratings) do |rating|
  json.extract! rating, :id, :title, :items
  json.url rating_url(rating, format: :json)
end
