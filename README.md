# RELEASES
This is the Repo for the AbleCats release resource

## GitHub [下载脚本](http://t.cn/E9XJMaX)

## There is more to come...  

## JSBOX For VSCode Fixed

### Path
```
os	path 
windows	%USERPROFILE%\.vscode\extensions\out\extension.js
macOS	~/.vscode/extensions/out/extension.js
Linux	~/.vscode/extensions/out/extension.js
```
### Code
```
if (directory != directoryRoot) {
        // Sync as package
        if (!fs.existsSync(path.join(directory, '..', 'Releases'))) {
            fs.mkdirSync(path.join(directory, '..', 'Releases'));
        }
        var name = path.basename(directory);
        var target = path.resolve(directory, '..', 'Releases', `${name}.box`);

        require('zip-folder')(directory, target, error => {
            if (error) {
                showError(error);
            }
            else {
                syncFile(target);
                var crypto = require("crypto");
                var buffer = fs.readFileSync(target);
                var fsHash = crypto.createHash('md5');

                fsHash.update(buffer);
                var md5 = fsHash.digest('hex');
                fs.writeFile(path.resolve(directory, '..', 'Releases', `${name}Version`), JSON.stringify({ "data": md5 }), function (err) {});
            }
        });
}
```
