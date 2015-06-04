class Item < OpenStruct
  def self.load(line)
    id, title, rating = line.strip.split("|")

    new({
      id: id,
      title: title,
      rating: (rating.to_i || 0)
    })
  end

  def self.dumb(item)
    [item.id, item.title, item.rating].join("|")
  end

  def to_s
    self.class.dumb(self)
  end
end
