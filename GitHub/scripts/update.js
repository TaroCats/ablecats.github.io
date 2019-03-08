async function checkVersion() {
    let res = await $http.get("https://ablecats.github.io/Releases/GitHubVersion");
    return res.data
}

async function update() {
    let res = await checkVersion();
    if ($file.exists("Version")) {
        let fileData = $file.read("Version");
        if (fileData.string) {
            let file = JSON.parse(fileData.string);
            console.log(file.md5);
            console.log(res.data);
            console.log(`New Update Check : ${file.md5 != res.data}`);
            if (file.md5 != res.data) foundNewVer();
        }
    }
    else writeMD5(res.data)
}

function writeMD5(text) {
    $file.write({
        data: $data({ "string": JSON.stringify({ "md5": text }, null, 2) }),
        path: "Version"
    })
}

function foundNewVer() {
    $ui.alert({
        title: "Update New Version",
        message: "AbleCats",
        actions: [{
            title: "Yes",
            handler: () => {
                $http.download({
                    url: "https://raw.githubusercontent.com/AbleCats/ablecats.github.io/master/Releases/GitHub.box",
                    handler: function (resp) {
                        $addin.save({
                            name: $addin.current.name,
                            data: resp.data,
                            handler: function (success) {
                                $device.taptic(2);
                                if (success) $file.delete("Version");
                                $ui.alert({
                                    title: "Success",
                                    actions: [{
                                        title: "OK",
                                        handler: () => {
                                            $addin.restart();
                                        }
                                    }]
                                });
                            }
                        })
                    }
                });

            }
        },
        {
            title: "No",
            handler: () => {

            }
        }]
    })
}

module.exports = {
    update: update,
};