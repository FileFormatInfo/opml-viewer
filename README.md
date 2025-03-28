# OPML Outline Viewer [<img alt="Outline Viewer logo" src="public/favicon.svg" height="90" align="right" />](https://opml-viewer.fileformat.info/)

[![NodePing status](https://img.shields.io/nodeping/status/O0XVZ8N8-AB6K-4DZG-80XJ-5P7F7HP3DCMG?label=Current%20status)](https://nodeping.com/reports/checks/O0XVZ8N8-AB6K-4DZG-80XJ-5P7F7HP3DCMG)
[![NodePing uptime](https://img.shields.io/nodeping/uptime/O0XVZ8N8-AB6K-4DZG-80XJ-5P7F7HP3DCMG?label=30-day%20uptime)](https://nodeping.com/reports/uptime/O0XVZ8N8-AB6K-4DZG-80XJ-5P7F7HP3DCMG)
[![deploy](https://github.com/FileFormatInfo/opml-viewer/actions/workflows/gcr-deploy.yaml/badge.svg)](https://github.com/FileFormatInfo/opml-viewer/actions/workflows/gcr-deploy.yaml)

This is a graphical viewer for `opml.xml` outlines.  Try it at [opml-viewer.fileformat.info](https://opml-viewer.fileformat.info/)!

See how to integrate it into your `opml.xml` files so it displays automatically at
[XML.Style](https://www.xml.style/opml/)!

## Running locally

```
./run.sh
```

## License

[GNU Affero General Public License v3.0 or later](LICENSE.txt)

## Credits

[![Google CloudRun](https://www.vectorlogo.zone/logos/google_cloud_run/google_cloud_run-ar21.svg)](https://cloud.google.com/run/ "Hosting")
[![Docker](https://www.vectorlogo.zone/logos/docker/docker-ar21.svg)](https://www.docker.com/ "Deployment")
[![ESLint](https://www.vectorlogo.zone/logos/eslint/eslint-ar21.svg)](https://eslint.org/ "Linting")
[![Git](https://www.vectorlogo.zone/logos/git-scm/git-scm-ar21.svg)](https://git-scm.com/ "Version control")
[![Github](https://www.vectorlogo.zone/logos/github/github-ar21.svg)](https://github.com/ "Code hosting")
[![MUI](https://www.vectorlogo.zone/logos/mui/mui-ar21.svg)](https://mui.com/material-ui/ "React components")
[![next-intl](https://www.vectorlogo.zone/logos/next-intldev/next-intldev-ar21.svg)](https://next-intl.dev/ "i18n")
[![Next.js](https://www.vectorlogo.zone/logos/nextjs/nextjs-ar21.svg)](https://nextjs.com/ "React Framework")
[![Node.js](https://www.vectorlogo.zone/logos/nodejs/nodejs-ar21.svg)](https://nodejs.org/ "Application Server")
[![NodePing](https://www.vectorlogo.zone/logos/nodeping/nodeping-ar21.svg)](https://nodeping.com?rid=201109281250J5K3P "Uptime monitoring")
[![npm](https://www.vectorlogo.zone/logos/npmjs/npmjs-ar21.svg)](https://www.npmjs.com/ "JS Package Management")
[![react.js](https://www.vectorlogo.zone/logos/reactjs/reactjs-ar21.svg)](https://reactjs.org/ "UI Framework")
[![Twitter](https://www.vectorlogo.zone/logos/twitter/twitter-ar21.svg)](https://github.com/twitter/twemoji "favicon")
[![TypeScript](https://www.vectorlogo.zone/logos/typescriptlang/typescriptlang-ar21.svg)](https://www.typescriptlang.org/ "Programming Language")
[![VectorLogoZone](https://www.vectorlogo.zone/logos/vectorlogozone/vectorlogozone-ar21.svg)](https://www.vectorlogo.zone/ "Logos")

## To Do

- [ ] cleanup demo.xml
- [ ] structured logging
- [ ] handle html labels (optionally)
- [ ] open nodes based on `expansionState`
- [ ] parameter to open all nodes
- [ ] more demo options (from real sites)
- [ ] initial scroll based on `vertScrollState`
- [ ] "report an issue" in footer of debug dialog (link to GH issues)
- [ ] test/cleanup error pages
- [ ] better 404 page formatting
- [ ] customize initial light/dark mode (or maybe not?)
- [ ] customize initial language (or maybe not?)
