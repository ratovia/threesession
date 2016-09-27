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

        value_array = []
        edit.value.split(',').each do |data|
          value_array.push(data.to_i)
        end

        3.times do |i|
          vertices_array[edit.target.to_i * 3 + i] = edit.value[i]
        end

        @snap.vertices_data = vertices_array.join(',')
        @snap.save
        edit.destroy
      end

    end

  end

end