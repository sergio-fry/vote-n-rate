class Item < OpenStruct
  # :title, :text, :picture_file, :link

  def self.load(line)
    new(JSON.parse(line))
  end

  def self.dumb(item)
    item.to_json.to_s
  end

  def id
    super.to_s
  end

  def rating
    super.to_i
  end

  def created_at
    super.try(:to_time)
  end

  def vote_identites
    (super || []).uniq
  end

  def attributes=(new_attrs)
    new_attrs = new_attrs.clone.symbolize_keys
    new_attrs.delete :id # protected


    @table.merge!(new_attrs)

    @table
  end

  def to_s
    title
  end

  def as_json(options)
    to_h.merge(id: id, vote_identites: vote_identites)
  end

  def to_param
    id
  end
end
