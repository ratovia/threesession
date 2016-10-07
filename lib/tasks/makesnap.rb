require "#{Rails.root}/app/models/snap"
require "#{Rails.root}/app/models/edit"
class Makesnap
  def self.make_snap
    edit = Edit.all

    edit.each do |data|
      snap = Snap.find_by(uuid: data.uuid)

      if data.operation == 'edit'
        vertices_array = []
        vertices_array += snap.vertices_data.split(',').map(&:to_i)
        value_array = []
        value_array += data.value.split(',').map(&:to_i)

        3.times do |i|
          vertices_array[data.target.to_i * 3 + i] = value_array[i]
        end

        snap.vertices_data = vertices_array.join(',')
        snap.save
        data.destroy
      end

    end

  end

end