# JTDHASS

Home Assistant add-ons by JTD: dashboard cards today, with room for blueprints, themes and more.

## What's inside

| | Name | Type | Docs |
| --- | --- | --- | --- |
| <img src="cards/calendar/docs/images/month-light.png" width="260" alt="Month calendar card"> | **Month Calendar & Weather** | Dashboard card (`custom:jtd-calendar-card`) | [cards/calendar](cards/calendar/README.md) |

A month calendar and expandable Sunday–Saturday week view for your Home Assistant calendars, with
recorded, forecast and typical weather on every day of the month.

## Installation

Every card in this repository is built into one file, `dist/jtdhass.js`, so one install gives you all
of them and new cards appear with HACS updates.

### HACS (recommended)

1. In Home Assistant open **HACS**, select the **⋮** menu (top right), then **Custom repositories**.
2. Add `https://github.com/jtddigital/JTDHASS` with type **Dashboard**.
3. Search for **JTD Home Assistant Cards**, open it, and select **Download**.
4. Reload the browser when HACS asks you to.

HACS adds the dashboard resource for you. Then edit a dashboard, select **Add card** and search for
the card by name.

### Manual

1. Download [`dist/jtdhass.js`](dist/jtdhass.js) and copy it to `/config/www/jtdhass.js`.
2. Go to **Settings → Dashboards**, select the **⋮** menu (top right), then **Resources**. If you don't
   see **Resources**, turn on **Advanced mode** in your user profile first.
3. Select **Add resource**, enter URL `/local/jtdhass.js`, choose **JavaScript module**, and save.
4. Reload the browser.

Each card is also built on its own (for example [`dist/jtd-calendar-card.js`](dist/jtd-calendar-card.js))
if you only want one.

> **Installed the calendar card through HACS before the bundle existed?** Updating it in HACS switches
> its dashboard resource from `jtd-calendar-card.js` to `jtdhass.js` for you. Manual installs of
> `jtd-calendar-card.js` keep working; if you later add `jtdhass.js` too, remove the old resource.

## Repository layout

```text
cards/                    Dashboard cards, one folder each (npm workspaces)
  calendar/
    package.json          card name, version and build settings ("jtdhass" block)
    src/                  TypeScript + Lit source
    test/                 unit tests (Vitest)
    demo/                 page that renders the card with a mocked Home Assistant
    docs/images/          screenshots for the card's README
    README.md             card documentation
dist/                     built files, committed so HACS and manual installs work
  jtdhass.js              every card in one file (installed by HACS)
  jtd-calendar-card.js    each card on its own
scripts/build.mjs         builds every card it finds in cards/
tools/demo/               shared demo helpers: ha-card/ha-icon stand-ins, theme, screenshot harness
hacs.json                 HACS settings (Dashboard type, installs dist/jtdhass.js)
```

## Adding things

### A new dashboard card

1. Create `cards/<name>/package.json`:

   ```json
   {
     "name": "jtd-<name>-card",
     "version": "1.0.0",
     "type": "module",
     "private": true,
     "jtdhass": { "kind": "card", "entry": "src/jtd-<name>-card.ts", "output": "jtd-<name>-card.js" },
     "dependencies": { "lit": "^3.3.3" }
   }
   ```

2. Write the card in `cards/<name>/src/`. Register it only if it isn't defined yet, and add it to the
   card picker, so it can be loaded from both the bundle and its own file:

   ```ts
   if (!customElements.get("jtd-<name>-card")) {
     customElements.define("jtd-<name>-card", MyCard);
   }
   window.customCards = window.customCards || [];
   window.customCards.push({ type: "jtd-<name>-card", name: "…", description: "…", preview: true });
   ```

3. Put tests in `cards/<name>/test/*.test.ts` and, optionally, a demo page in `cards/<name>/demo/`
   that uses `/tools/demo/ha-theme.css` and `/tools/demo/ha-stubs.js` (see the calendar card's demo).
4. Run `npm install`, then `npm run check`. The build picks the card up automatically: it lands in
   `dist/jtd-<name>-card.js` and in `dist/jtdhass.js`.
5. Add a row to [What's inside](#whats-inside) and commit the source together with `dist/`.

### Blueprints

Put automation blueprints in `blueprints/automation/<name>.yaml` and script blueprints in
`blueprints/script/<name>.yaml`. They're imported straight from GitHub: in Home Assistant go to
**Settings → Automations & scenes → Blueprints → Import blueprint** and paste the file's GitHub URL.
Add a row for each one to [What's inside](#whats-inside).

### Themes

Put themes in `themes/<name>.yaml`. To use one, copy it into the `themes` folder of your Home
Assistant configuration (with `frontend: themes: !include_dir_merge_named themes` in
`configuration.yaml`) and pick it in your user profile.

### Integrations

HACS installs a repository as a single type, and this one is set up as **Dashboard**. A custom
integration you want to install through HACS should live in its own repository; one that you install
by hand can live in `custom_components/<domain>/` here.

## Development

Requires Node.js 22 or newer.

```bash
npm install
npm run build      # builds every card into dist/ (and the dist/jtdhass.js bundle)
npm run watch      # rebuilds on change
npm test           # unit tests for all cards
npm run typecheck
npm run check      # all of the above
```

Commit the rebuilt `dist/` files with source changes; CI checks that they are up to date. Publishing a
GitHub release attaches the built files to it.
