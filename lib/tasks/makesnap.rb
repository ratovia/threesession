require "#{Rails.root}/app/models/snap"
require "#{Rails.root}/app/models/edit"

class Makesnap
  def self.make_snap
    @edit = Edit.all

    @edit.each do |edit|
      @snap = Snap.find_by(uuid: edit.uuid)

      if edit.operation == 'trans'
        vertices_array = []
        @snap.vertices_data.split(',').each do |data|
          vertices_array.push(data.to_i)
        end
          p vertices_array
        value_array = []
        edit.value.split(',').each do |data|
          value_array.push(data.to_i)
        end
          p value_array
        3.times do |i|
          vertices_array[edit.target.to_i * 3 + i] = value_array[i]
        end
          p vertices_array
        @snap.vertices_data = vertices_array.join(',')
          p @snap.vertices_data
        @snap.save
        edit.destroy
      end

    end

  end

end