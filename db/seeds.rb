# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

# Snap.create(:json => File.read('start2.json'))
# Snap.create(:faces => 6,
#             :version => 3,
#             :normals => 6,
#             :vertices => 8,
#             :uvs => 0,
#             :name => 'CubeGeometry.5',
#             :uuid => '60050563-2B60-3C16-A1E2-1B17F0B6EB83',
#             :matrix => '1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1',
#             :faces_data => '33,0,1,2,3,0,0,0,0,33,4,7,6,5,1,1,1,1,33,0,4,5,1,2,2,2,2,33,1,5,6,2,3,3,3,3,33,2,6,7,3,4,4,4,4,33,4,0,3,7,5,5,5,5',
#             :normals_data => '-0,0,1,0,-0,-1,1,0,-0,-0,1,0,-1,-0,0,0,-1,-0',
#             :vertices_data => '30,-30,-30,30,-30,30,-30,-30,30,-30,-30,-30,30,30,-30,30,30,30,-30,30,30,-30,30,-30',
#             :uvs_data => '')

Snap.create(:faces => 6,
            :version => 3,
            :normals => 6,
            :vertices => 8,
            :uvs => 0,
            :name => 'CubeGeometry',
            :uuid => "66666666",
            :matrix => '1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1',
            :faces_data => '33,0,1,2,3,0,0,0,0,33,4,7,6,5,1,1,1,1,33,0,4,5,1,2,2,2,2,33,1,5,6,2,3,3,3,3,33,2,6,7,3,4,4,4,4,33,4,0,3,7,5,5,5,5',
            :normals_data => '-0,0,1,0,-0,-1,1,0,-0,-0,1,0,-1,-0,0,0,-1,-0',
            :vertices_data => '30,-30,-30,30,-30,30,-30,-30,30,-30,-30,-30,30,30,-30,30,30,30,-30,30,30,-30,30,-30',
            :uvs_data => '')
