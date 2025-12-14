import renameOverwrite from 'rename-overwrite';

(() => {
  renameOverwrite(`dist`, `build`)
    .then(() => console.log(`Overwrote dist to build`)) // eslint-disable-line no-console
    .catch((err) => console.log(err)); // eslint-disable-line no-console
})();
