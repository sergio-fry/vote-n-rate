FROM ruby:2.2.2


RUN gem install bundler -v '1.10.6' --no-ri --no-rdoc

RUN mkdir -p /app
WORKDIR /app
COPY Gemfile* /app/
COPY ./vendor /app/vendor
RUN  bundle install -j $(nproc)

COPY . /app
