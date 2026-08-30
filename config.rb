# frozen_string_literal: true

require "json"
require "fileutils"

set :layout, "layout"

after_build do
  FileUtils.cp "source/prev/_index.html", "build/prev/_index.html"
end

helpers do
  def navigation_links
    [
      { key: "work", label: "Work", href: "/work/" },
      { key: "ai", label: "AI", href: "/ai/" },
      { key: "experience", label: "Experience", href: "/experience/" },
      { key: "writing", label: "Writing", href: "/writing/" },
      { key: "about", label: "About", href: "/about/" },
      { key: "contact", label: "Contact", href: "/contact/" },
      { label: "Résumé", href: "/download/Renat Ibragimov - Software Engineer.pdf", resume: true }
    ]
  end

  def person_schema
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Renat Ibragimov",
      url: "https://aomega.co/",
      image: "https://aomega.co/img/head-320x320.png",
      jobTitle: "Senior Software Engineer",
      homeLocation: { "@type": "Place", name: "Austin, Texas" },
      sameAs: ["https://github.com/mpakus", "https://linkedin.com/in/mpakus"]
    }
  end
end
