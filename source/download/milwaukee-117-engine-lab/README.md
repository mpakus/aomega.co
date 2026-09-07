# Milwaukee-Eight 117 — Engine Lab

A portable, English-language Three.js engine explorer with 154 selectable components, animated startup and operation, a 720° crank-angle scrubber, X-ray and cutaway views, individual part inspection, an exploded view, and an eight-layer teardown.

The assembled view has been refined with photo-referenced intake and cover shapes, black exhaust heat shields, textured cast surfaces, machined fin edges, chrome pushrod tubes and studio lighting. It remains an educational reconstruction, not an exact factory scan.

## Open on your computer

**Fastest: double-click `standalone.html`.** It contains the complete application, styles and Three.js in one file. You can move it anywhere and open it in a current browser with WebGL 2. No internet, server, account, build step or package installation is needed. The reference links require internet only if you open them.

For editing the modular source, serve this folder locally with Python 3:

```bash
cd milwaukee-117-engine-lab
python3 start-local.py
```

On Windows:

```powershell
py -3 start-local.py
```

The launcher opens the app at `http://127.0.0.1:8000/`. Keep the terminal open and press Ctrl+C to stop. You can also launch `Start-local.command` on macOS or `Start-local.bat` on Windows with Python 3 installed. If macOS does not run the command file, use the terminal command above.

If port 8000 is occupied:

```bash
python3 start-local.py --port 8080
```

Double-clicking the modular `index.html` redirects to `standalone.html`, because browsers restrict ES-module imports on `file:` URLs. Use the local server to see edits to `app.js`, `engine.js`, or `style.css`.

## GitHub Pages: publish the static folder

Choose one publishing method below. Both support GitHub project URLs such as `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/` and custom domains. All application asset paths are relative.

### Method A — repository branch, no custom workflow

1. Create a GitHub repository and put the **contents** of this folder in its root, so `index.html` is at the repository root.
2. Omit or remove `.github/workflows/pages.yml` when using this method. Keep the `.nojekyll` file.
3. Commit and push to `main`.
4. In the repository, open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**, branch **main**, folder **/(root)**, and save.
6. Open the site URL shown by GitHub after the deployment completes.

For an existing repository that publishes its `/docs` folder, copy `index.html`, `app.js`, `engine.js`, `style.css`, `standalone.html`, `.nojekyll`, and `vendor/` into `/docs`, then select `main` and `/docs` in Pages settings.

### Method B — included GitHub Actions workflow

1. Put the contents of this folder at the repository root, including `.github/workflows/pages.yml`.
2. In **Settings → Pages → Build and deployment → Source**, select **GitHub Actions**.
3. Push to `main`, or select **Actions → Publish Engine Lab → Run workflow**.
4. The workflow stages and publishes the static assets. Its deployment output gives the site URL.

The workflow assumes a branch named `main`; change `branches: [main]` if needed. If you put this app inside an existing repository subfolder, keep the workflow at the repository root and update its staging commands to copy from that subfolder. For a minimal upload, just rename `standalone.html` to `index.html` in your publishing directory and use Method A.

The included workflow is prepared for your repository; this download does not create a GitHub repository or publish to your account.

Official instructions: [configuring a Pages publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), [using a custom Pages workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), and [creating a Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).

## Host in any static folder

Copy `index.html`, `app.js`, `engine.js`, `style.css`, `standalone.html`, and `vendor/` to your static host. Preserve the file names and directory structure. Open the folder URL with a trailing slash, for example `https://example.com/tools/engine-lab/`.

No backend, routing rewrites, environment variables, API keys or CDN are required. Serve `.js` files with a JavaScript MIME type. The server must allow the inline import map in `index.html`; a strict custom Content Security Policy may require an appropriate hash or nonce. The single-file version contains inline styles and script as well.

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | Modular static-site entry point |
| `app.js` | Viewer, controls, component catalog and English UI |
| `engine.js` | Procedural geometry, component information and animation |
| `style.css` | Responsive application styles |
| `vendor/` | Local Three.js r180 dependencies and MIT license |
| `standalone.html` | Complete single-file offline version |
| `start-local.py` | Dependency-free Python 3 local launcher |
| `Start-local.command` / `Start-local.bat` | macOS / Windows launchers |
| `.github/workflows/pages.yml` | Optional GitHub Pages deployment workflow |
| `.nojekyll` | Disables Jekyll processing for branch publishing |
| `verify.mjs` | Engine-constraint and static-module verification |
| `package.json` | Optional `npm run check` shortcut; no dependencies |

The modular and single-file versions are independent snapshots. If you edit the source, serve `index.html` over HTTP to see your edits. The included `standalone.html` will continue to contain the original packaged version.

## Controls

- Drag to orbit; scroll or pinch to zoom; right-drag or use two fingers to pan.
- Start the engine and choose **Study · 0.015×** for slow mechanical motion.
- Pause, step by 15°, or scrub the crank angle through a complete four-stroke cycle.
- Click a modeled part or its catalog entry to inspect, focus, isolate or remove it.
- Use **Explode all**, the disassembly slider or **Guided teardown** to expose parts.
- Use **Reassemble** or **Restore all** to restore the complete modeled assembly.

## Verification and model accuracy

With Node.js 22.15+ installed, run `node verify.mjs` or `npm run check`. No `npm install` is required. The checks cover rod length, the 114.3 mm stroke, firing TDCs, eight-valve/four-plug architecture, annotations, finite animation transforms, hide/isolate/restore behavior and local module imports. These are programmatic checks, not a browser rendering test.

This is an educational reconstruction of the 2023 Low Rider ST engine, not OEM CAD or a complete factory parts catalog. Shapes, connecting-rod length and geometry, ports, timing, hardware placement, balance drive and oil routing are simplified. Some small internal assemblies are grouped or omitted. See **Model & sources** inside the app for detailed limitations and primary references. The teardown is an inspection sequence, not a workshop service procedure.

Three.js r180 is distributed under the MIT license reproduced in `vendor/LICENSE` and in the single-file export. Harley-Davidson and Milwaukee-Eight are trademarks of their respective owner; this is an independent educational project.
