# Aqua+

The premiere useless local streaming application.

Created to test and tinker with uploads and media on the server and, and `preact` on the front-end.

As of splitting this repo off, the installation is broken/not complete and will require an update.

## Setup

Was originally from a repo that included various unrelated projects, so each piece will need to be set up individually. An enhancement would be to set up a full monorepo configuration.

Navigate into `/client` and `/server` and run `npm i` to install dependencies.

### Client-side

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# test the production build locally
npm run serve
```

### Server-side

```bash
node index.js
```

Additional requirements are needed for fluent-ffmpeg and other media operations

- `sudo apt-get install libvpx-dev`
