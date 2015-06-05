class Rating < ActiveRecord::Base
  def items
    @_items ||= 
      super.to_s.split("\n").map do |line|
        Item.load line.strip
      end
  end

  def add_item(item)
    update_attribute :items, (items + [item]).map { |it| Item.dumb(it) }.join("\n")
  end

  def delete_item(id)
    update_attribute :items, items.reject { |it| it.id.to_i == id.to_i }.map { |it| Item.dumb(it) }.join("\n")
  end

  def vote_for(item_id, delta=1)
    item = items.find { |it| it.id == item_id }

    if item.present?
      item.rating += delta
    end

    update_attribute :items, items.map { |it| Item.dumb(it) }.join("\n")
  end
end
