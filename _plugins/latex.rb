require "mathematical"

# module Jekyll
# 	class LatexGenerator < Generator
# 		safe true
# 		def generate(site)
# 			blockRgx = /\$\$[^\$]+\$\$/
# 			site.posts.each do |post|
# 				buf = StringIO.new
# 				prev = 0
# 				post.content.to_enum(:match, blockRgx).with_index.each do |match, i|
# 					a, b = match.offset(i)
# 					buf << post.content[prev..a]
					
# 					render = Mathematical.new.render(match[i])
# 					buf << render[:data]

# 					prev = b
# 				end
# 				buf << post.content[prev..post.content.length]
# 				p buf.string
# 			end
# 			inlineRgx = /[^\$]\$[^\$]+\$[^\$]/
# 			site.posts.each do |post|
# 				p post.content.scan(inlineRgx)
# 			end
# 		end
# 	end
# end

$blockRgx = /((?<block>\$\$[^\$]+\$\$)|[^\$](?<inline>\$[^\$]+\$)[^\$])/

module Jekyll
	class InlineLatex < Converter
		safe true
		priority :high

		def matches(ext)
			ext =~ /^\.md$/i
		end

		def output_ext(ext)
			".md"
		end

		def convert(content)
			# first pass
			buf = StringIO.new
			prev = 0
			renderer = Mathematical.new({:base64 => true, :format => :svg})
			content.to_enum(:scan, $blockRgx).map { Regexp.last_match }.to_enum.with_index.each do |match, i|
				if match[:block] != nil
					code = match[:block]
					a, b = match.offset(:block)
				else
					code = match[:inline]
					a, b = match.offset(:inline)
				end

				buf << content[prev..a].gsub(/^\$?\$/, "").gsub(/\$?\$$/, "")

				render = renderer.render(code)
				buf << "<img src='" + render[:data] + "' />"
				prev = b - 1
			end
			buf << content[prev..content.length].gsub(/^\$?\$/, "")
			return buf.string
		end
	end
end
