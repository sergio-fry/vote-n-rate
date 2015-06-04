class Rating < ActiveRecord::Base
  def items
    @_items ||= 
      super.split("\n").map do |line|
        Item.load line.strip
      end
  end

  def vote_for(item_id, delta=1)
    item = items.find { |it| it.id == item_id }

    if item.present?
      item.rating += delta
    end

    update_attribute :items, items.map { |it| Item.dumb(it) }.join("\n")
  end
end
