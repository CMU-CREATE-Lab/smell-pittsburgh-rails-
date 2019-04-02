class VisualizationController < ApplicationController

  def index
    response.headers.delete('X-Frame-Options')

    pgh = City.find(1)
    latLng = params["latLng"].blank? ? [] : params["latLng"].split(",")
    zipCode = params["zipCode"]
    clientToken = params["client_token"].blank? ? "" : params["client_token"]
    client = Client.find_by_secret_token(clientToken) || Client.first

    if latLng.size == 2
      # latLng is the GPS user location, passed from the app
      @latitude = latLng[0]
      @longitude = latLng[1]
    end

    if zipCode
      zip_code = ZipCode.find_by_zip(zipCode)
      @city = zip_code.cities.first if zip_code
    elsif latLng.size == 2
      # request reverse geocode object
      geo = Geokit::Geocoders::GoogleGeocoder.reverse_geocode( "#{@latitude}, #{@longitude}" )
      zip_code = ZipCode.find_or_create_by(zip: geo.zip)
      @city = zip_code.cities.first
    end

    @client_id = client.id
    @cities = City.all.to_json(:except => [:created_at, :updated_at, :app_metadata, :description]).html_safe

    if @client_id == CLIENT_ID_SMELLPGH or @client_id == CLIENT_ID_SMELLPGHWEBSITE
      @zoom = pgh.zoom_level
      @city = pgh.to_json(:except => [:created_at, :updated_at, :app_metadata, :description]).html_safe
    elsif @city
      @zoom = @city.zoom_level
      @city = @city.to_json(:except => [:created_at, :updated_at, :app_metadata, :description]).html_safe
    end

    # Defaults. Many of these will be ignored depending upon the client used
    @city = "{}" unless @city
    @zoom = 11 unless @zoom
    @latitude = pgh.latitude unless @latitude
    @longitude = pgh.longitude unless @longitude
  end
end
