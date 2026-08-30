# frozen_string_literal: true

require "json"
require "pathname"
require "rexml/document"
require "set"

ROOT = Pathname(__dir__).join("..").expand_path
BUILD = ROOT.join("build")
NAV_SECTIONS = %w[work ai experience writing about contact].freeze

def attributes(tag)
  tag.scan(/([\w:-]+)="([^"]*)"/).to_h
end

def built_target(url)
  path = url.split(/[?#]/, 2).first
  relative = path.delete_prefix("/")
  relative = relative.empty? ? "index.html" : File.join(relative, "index.html") if path.end_with?("/")
  BUILD.join(relative)
end

errors = []

manifest = JSON.parse(BUILD.join("manifest.json").read)
errors << "manifest.json has no name" if manifest["name"].to_s.empty?

sitemap = REXML::Document.new(BUILD.join("sitemap.xml").read)
routes = REXML::XPath.match(sitemap, "//*[local-name()='loc']").map(&:text)
pages = routes.map { |url| built_target(url.sub("https://aomega.co", "")) } + [BUILD.join("404.html")]

pages.each do |page|
  unless page.file?
    errors << "Missing generated page: #{page.relative_path_from(BUILD)}"
    next
  end

  html = page.read
  relative = page.relative_path_from(BUILD).to_s
  errors << "#{relative}: expected one h1" unless html.scan(/<h1(?:\s|>)/).length == 1

  ids = html.scan(/\sid="([^"]+)"/).flatten
  duplicates = ids.tally.select { |_id, count| count > 1 }.keys
  errors << "#{relative}: duplicate IDs #{duplicates.join(', ')}" unless duplicates.empty?

  html.scan(/<img\b[^>]*>/).each do |tag|
    attrs = attributes(tag)
    errors << "#{relative}: image missing alt" unless attrs.key?("alt")
    errors << "#{relative}: image missing dimensions" unless attrs["width"] && attrs["height"]
  end

  html.scan(/<a\b[^>]*>/).each do |tag|
    attrs = attributes(tag)
    if attrs["target"] == "_blank" && !attrs.fetch("rel", "").split.include?("noreferrer")
      errors << "#{relative}: new-tab link missing noreferrer"
    end
  end

  html.scan(/(?:href|src)="(\/[^"]*)"/).flatten.each do |url|
    target = built_target(url)
    errors << "#{relative}: missing local target #{url}" unless target.exist?

    fragment = url.split("#", 2)[1]
    next unless fragment && target.file? && target.extname == ".html"

    target_ids = target.read.scan(/\sid="([^"]+)"/).flatten.to_set
    errors << "#{relative}: missing fragment #{url}" unless target_ids.include?(fragment)
  end

  footer = ["Renat Ibragimov", "Senior software engineer · Made in Austin☆Texas", "© 2026"]
  errors << "#{relative}: footer copy drift" unless footer.all? { |text| html.include?(text) }

  section = relative.split("/").first
  active_links = html.scan(/<a\b[^>]*aria-current="page"[^>]*>/)
  if NAV_SECTIONS.include?(section)
    errors << "#{relative}: expected two active navigation links" unless active_links.length == 2
    errors << "#{relative}: wrong active navigation" unless active_links.all? { |tag| attributes(tag)["href"] == "/#{section}/" }
  elsif active_links.any?
    errors << "#{relative}: unexpected active navigation"
  end
end

errors << "CNAME must contain aomega.co" unless BUILD.join("CNAME").read.strip == "aomega.co"
errors << "Archived prev/_index.html was not preserved" unless BUILD.join("prev/_index.html").file?

abort errors.join("\n") unless errors.empty?

puts "PASS: #{pages.length} generated pages; routes, headings, IDs, images, links, navigation, metadata, footer, and legacy archive checked"
