require 'rubygems'
require 'sinatra'
require 'json'
require_relative '../lib/crimefighter'

get '/' do
    erb :index, :format => :html5
end

get '/get_crime_json' do
  content_type :json
  CrimeFighter.read_crime_json
end
