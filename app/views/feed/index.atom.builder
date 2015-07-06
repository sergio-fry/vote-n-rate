atom_feed do |feed|
  feed.title("Vote'n'Rate! Бесплатная система рейтингов")
  feed.updated(Rating.published.maximum(:updated_at))

  @ratings.each do |rating|
    feed.entry(rating) do |entry|
      entry.title(rating.title)
      entry.content(rating.description, type: 'html')
    end
  end
end
