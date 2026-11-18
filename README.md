# aomega.co

Renat Ibragimov's portfolio, built with Middleman and Slim and deployed as a static GitHub Pages site.

## Local development

Requirements: Ruby 3.4.2 and Bundler.

```sh
bundle install
bundle exec middleman server
```

Open `http://localhost:4567`.

## Build

```sh
bundle exec middleman build
bundle exec ruby script/check_build.rb
```

The generated site is written to `build/` and is intentionally ignored by Git.

## Source structure

- `source/layouts/layout.slim`: common HTML shell.
- `source/partials/`: shared head, header, navigation, and footer.
- `source/**/*.html.slim`: page content and frontmatter.
- `source/css/`, `source/img/`, and `source/download/`: public assets.
- `config.rb`: small shared helper configuration.

## GitHub Pages

The workflow in `.github/workflows/pages.yml` builds the site and deploys the `build/` artifact on pushes to `main` or manual runs.

The build job uses `ubuntu-24.04` so the Ruby 3.4.2 version pinned in `.ruby-version` remains available from `ruby/setup-ruby`. Newer runner images only provide the latest patch releases of each Ruby series.

Before the first deployment, select **GitHub Actions** as the publishing source in the repository's **Settings → Pages**. The generated artifact includes `CNAME` for `aomega.co`.
