class PopulateClientIdForSmellmycityWebsite < ActiveRecord::Migration
  def up
    time = Time.now.to_i.to_s
    token = Digest::MD5.hexdigest time+rand.to_s
    client = Client.new
    client.id = 5
    client.name = "Smell MyCity Website"
    client.description = "Website for Smell MyCity."
    client.secret_token = token
    client.website = "https://smellmycity.org"
    client.save!
  end
end
