require 'rubygems'
require 'nokogiri'
require 'open-uri'
require 'date'
require 'json'
require 'csv'

class CrimeFighter
  URL = [
    "http://www.crimemapping.com/DetailedReport.aspx?db=",
    "+00:00:00&de=",
    "+23:59:00&ccs=AR,AS,BU,DP,DR,DU,FR,HO,VT,RO,SX,TH,VA,VB,WE&xmin=-13635654.02571286&ymin=4543995.01718537&xmax=-13619640.468287138&ymax=4551438.072814629"
  ]

  CRIMES = {}

  def self.get_sf_crime_doc
    today_date      = Time.now.to_date.strftime("%m/%d/%Y")
    last_week_date  = (Time.now.to_date - 7).strftime("%m/%d/%Y")
    # Who love's ASP.NET generated URLs again...?
    todays_url      = URL[0] + last_week_date + URL[1] + today_date + URL[2]
    html            = Nokogiri::HTML(open(todays_url))
  end    

  def self.populate_sf_crime
    html = self.get_sf_crime_doc
    html.css("div.report table.report-grid tr").each do |table_row|
      logo, crime, case_number, address, agency, date = table_row.css("td")
      if crime && address && case_number && date
        crime_name = crime.content.split("Service:")[1].strip
        CRIMES[case_number.content] = {
          :crime    => crime_name,
          :address  => address.content,
          :date     => date.content
        }
      end
    end  
    CRIMES
  end

  def self.sf_crime_json
    self.populate_sf_crime if CRIMES.keys.length == 0
    CRIMES.to_json
  end

  def self.sf_crime_to_csv
    self.populate_sf_crime if CRIMES.keys.length == 0
    CSV.open('crimes-' + Time.now.to_date.to_s +  '.csv', 'wb') do |csv|
      CRIMES.each_key do |case_number|
        crime = CRIMES[case_number]
        csv << [crime[:crime], crime[:address], crime[:date]]
      end
    end
  end
end
