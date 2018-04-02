let fs = require('fs');
let path = require('path');

function BuildManifestPlugin(params) {}

BuildManifestPlugin.prototype.apply = function (compiler) {
    compiler.plugin('emit', (compiler, callback) => {
        let manifest = JSON.stringify(compiler.getStats().toJson().assetsByChunkName)

        compiler.assets['manifest.json'] =  {
            source: function () {
                return manifest;
            },
            size: function () {
                return manifest.length;
            }
        }

        callback();
    });
};

BuildManifestPlugin.prototype.writeManifest = function (stats) {
    fs.writeFileSync(
        path.resolve('dist/manifest.json'),
        JSON.stringify(stats.toJson().assetsByChunkName)
    );
}

module.exports = BuildManifestPlugin;