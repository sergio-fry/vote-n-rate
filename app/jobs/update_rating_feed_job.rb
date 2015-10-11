class UpdateRatingFeedJob < ActiveJob::Base
  queue_as :default

  def perform(rating=nil)
    if rating.present?
      feed = Feedjira::Feed.fetch_and_parse rating.feed_url

      feed.entries.sort_by(&:published).reverse.each do |entry|
        item = Item.new(id: Time.now.to_f.to_s.sub(".", ""), title: Nokogiri::HTML(entry.title).text, link: entry.url, created_at: entry.published)

        item.text = text_short(entry.content.presence || entry.summary || "")
        unless rating.items.detect { |it| it.link == item.link }
          rating.add_item item
        end
      end

      ids = rating.items.sort_by{ |it| it.created_at || 1.year.ago }.map(&:id)
      (rating.items.size - (rating.items_limit || 50)).times do
        rating.delete_item ids.shift
      end

    else
      Rating.where("NOT feed_url IS NULL").each do |rating|
        self.class.perform_later(rating)
      end
    end
  end

  private

  def text_short(html, max_length=500)
    text = Nokogiri::HTML(html).text

    if text.mb_chars.length > max_length
      text = text.mb_chars[0..max_length-1]

      result = text.sub(/[^.!?]+\z/, "")

      if result.size < (max_length * 0.65)
        result = text[0..-6] + " […] "
      end

      result
    else
      text
    end
  end

end
