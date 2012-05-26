require 'rubygems'
require 'sinatra'
require 'json'

get '/' do
    erb :index, :format => :html5
end
