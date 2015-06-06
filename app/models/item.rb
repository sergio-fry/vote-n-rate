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
    title
  end

  def as_json(options)
    {item: { id: id, title: title, rating: rating } }
  end

  def to_param
    id
  end
end
