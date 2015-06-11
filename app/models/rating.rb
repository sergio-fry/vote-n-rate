class Rating < ActiveRecord::Base
  include PgSearch

  validates :title, :presence => true
  validates :user_id, :presence => true

  before_save :set_state
  scope :published, lambda { where(state: "published") }
  scope :recent, lambda { order("created_at DESC") }

  pg_search_scope :search_by_hashtags,
    :against => [:title, :description],
    :using => {
      :tsearch => {:any_word => true},
      :dmetaphone => {:any_word => true, :sort_only => true},
    }

  def items
    super.to_s.split("\n").map do |line|
      item = Item.load line.strip
      item.rating_id = id

      item
    end
  end

  def add_item(item)
    update_attribute :items, (items + [item]).map { |it| Item.dumb(it) }.join("\n")
  end

  def delete_item(id)
    update_attribute :items, items.reject { |it| it.id.to_i == id.to_i }.map { |it| Item.dumb(it) }.join("\n")
  end

  def vote_for(item_id, identity)
    item = items.find { |it| it.id == item_id }

    if item.present? && !item.vote_for.include?(identity)
      item.rating += delta
      item.vote_identites << identity
    end

    update_attribute :items, items.map { |it| Item.dumb(it) }.join("\n")

    item
  end

  def vote_for(item_id, identity)
    item = items.find { |it| it.id == item_id }

    if item.present? && !item.vote_for.include?(identity)
      item.rating += delta
      item.vote_identites << identity
    end

    update_attribute :items, items.map { |it| Item.dumb(it) }.join("\n")

    item
  end

  def update_item(item_id, attributes)
    _items = items
    item = _items.find { |it| it.id == item_id }

    item.attributes = attributes

    update_attribute :items, _items.map { |it| Item.dumb(it) }.join("\n")
  end

  def similar
    self.class.search_by_hashtags(hashtags.join(" ")).where.not(id: id).published
  end

  def hashtags
    Twitter::Extractor.extract_hashtags "#{title} #{description}"
  end

  private

  def set_state
    self.state = items.size == 0 ? "draft" : "published"
  end
end
