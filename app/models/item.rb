class Item < OpenStruct
  def self.load(line)
    new(JSON.parse(line))
  end

  def self.dumb(item)
    to_json.to_s
  end

  def attributes=(new_attrs)
    self.title = new_attrs[:title]
  end

  def to_s
    title
  end

  def as_json(options)
    { id: id, title: title, rating: rating }
  end

  def to_param
    id
  end
end
