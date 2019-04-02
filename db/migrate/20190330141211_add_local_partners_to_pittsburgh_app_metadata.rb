class AddLocalPartnersToPittsburghAppMetadata < ActiveRecord::Migration
  def change
    city_obj = City.find_by_name("Pittsburgh")

    city_obj.app_metadata = {
      "side_menu_background_url" => "/img/app-images/side-menu-backgrounds/pittsburgh-pa.png",
      "side_menu_background_color" => "#97c93c",
      "smell_description_placeholder_text" => "industrial, woodsmoke, rotten-eggs",
      "local_partners_content" => "<h3>Pittsburgh</h3><p>The Smell MyCity app is an extension of the Smell Pittsburgh app, which launched in 2016. This work was made possible with support from <a href='http://www.heinz.org/' target='_blank'>The Heinz Endowments</a> and contributions from our founding Pittsburgh partners, who are described below.</p><p><u>Allegheny County Clean Air Now</u><br><a href='http://accan.org/' target='_blank'>Allegheny County Clean Air Now</a> (ACCAN) was founded in June, 2014 to give a voice to the residents living downwind from the DTE Energy's Shenango Coke Plant on Neville Island.</p><p><u>Breathe Project</u><br><a href='https://breatheproject.org/about/' target='_blank'>Breathe Project</a> is a clearinghouse for information on air quality in Pittsburgh, southwestern Pennsylvania and beyond. We use the best available science and technology to better understand the quality of the air we breathe and provide opportunities for citizens to engage and take action.</p><p><u>PennEnvironment Research & Policy Center</u><br><a href='https://pennenvironmentcenter.org/' target='_blank'>PennEnvironment Research & Policy Center</a> is dedicated to protecting our air, water and open spaces. We investigate problems, craft solutions, educate the public and decision-makers, and help the public make their voices heard in local, state and national debates over the quality of our environment and our lives.</p><p><u>Group Against Smog and Pollution</u><br>For fifty years the <a href='https://gasp-pgh.org/' target='_blank'>Group Against Smog and Pollution</a> (GASP) has worked to improve air quality in southwestern Pennsylvania in order to safeguard human, environmental and economic health in the region. Our work to improve air quality involves education, advocacy, legal, and policy work.</p><p><u>Blue Lens, LLC</u><br><a href='http://lens.blue/' target='_blank'>Blue Lens, LLC</a> embodies the work of Mark Dixon, an award-winning filmmaker, photographer, media consultant, activist, and public speaker exploring the frontiers of social change on a finite planet. After graduating from Stanford University with a degree in industrial engineering, he worked for start-up companies in Silicon Valley before turning to documentary filmmaking. His productions include 'YERT-Your Environmental Road Trip' (a year-long 'eco-expedition' through all 50 United States exploring environmental sustainability) and, 'The Power of One Voice: A 50-Year Perspective on the Life of Rachel Carson.' He is currently working on a new documentary entitled 'Inversion: The Unfinished Business of Pittsburgh's Air.' Mark has given presentations on environmental topics to diverse audiences including Carnegie Mellon University, Yale University, Stanford University, Sony Pictures, TEDx Pittsburgh, and the U.S.</p><p><u>Clean Water Action</u><br>Since its founding during the campaign to pass the landmark Clean Water Act in 1972, <a href='https://www.cleanwateraction.org/' target='_blank'>Clean Water Action</a> has worked to win strong health and environmental protections by bringing issue expertise, solution-oriented thinking and people power to the table.</p><p><u>Sierra Club</u><br>The <a href='https://www.sierraclub.org/home' target='_blank'>Sierra Club</a> is the most enduring and influential grassroots environmental organization in the United States. We amplify the power of our 3.5+ million members and supporters to defend everyone's right to a healthy world.</p><p><u>PennFuture</u><br><a href='https://www.pennfuture.org/' target='_blank'>PennFuture</a> is leading the transition to a clean energy economy in Pennsylvania and beyond. We are protecting our air, water and land, and empowering citizens to build sustainable communities for future generations.</p><p><u>Clean Air Council</u><br><a href='https://cleanair.org/' target='_blank'>Clean Air Council</a> is a member-supported environmental organization serving the Mid-Atlantic Region and has been fighting for everyone's right to breathe clean air since 1967. The Council uses public education, community action, government oversight and enforcement of environmental laws to advocate for healthy air.</p><p><u>ROCIS</u><br>The mission of <a href='http://rocis.org/' target='_blank'>ROCIS</a> (Reducing Outdoor Contaminants in Indoor Spaces) is to reduce the impact of exterior environmental pollution in southwestern Pennsylvania to improve healthy and energy efficient indoor environments where we live, work, and learn.</p>"
    }
    city_obj.save!
  end
end
