require 'rubygems'
require 'nokogiri'
require 'open-uri'
require 'date'

class CrimeFighter
  URL = [
    "http://www.crimemapping.com/DetailedReport.aspx?db=",
    "+00:00:00&de=",
    "+23:59:00&ccs=AR,AS,BU,DP,DR,DU,FR,HO,VT,RO,SX,TH,VA,VB,WE&xmin=-13635654.02571286&ymin=4543995.01718537&xmax=-13619640.468287138&ymax=4551438.072814629"
  ]

  def self.grab_sf_crime
    today_date = Time.now.to_date.strftime("%m/%d/%Y")
    last_week_date = (Time.now.to_date - 7).strftime("%m/%d/%Y")
    # Who love's ASP.NET generated URLs again...?
    todays_url = URL[0] + last_week_date + URL[1] + today_date + URL[2]
    html = Nokogiri::HTML(open(todays_url))
    html.css("div.report table.report-grid tr").each do |table_row|
      logo, crime, case_number, address, agency, date = table_row.css("td")
      if crime && address && date
        puts "Crime: " + crime.content.split("Service:")[1].strip
        puts "\tAddress: " + address.content
        puts "\tDate: " + date.content
      end
    end
  end
end

CrimeFighter.grab_sf_crime