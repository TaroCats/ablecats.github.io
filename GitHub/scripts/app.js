const path = 'shared://GitHub/'
const host = "https://api.github.com/users";
if (!$file.exists(path)) $file.mkdir(path);

function userManeger(user, token, repos) {
  var db = $sqlite.open(`${path}Files.db`);
  db.query(`SELECT * FROM User`).error
    ? db.update(`CREATE TABLE User(user text, token text,repos text)`)
    : 0;
  var result = db.query(`SELECT * FROM User`).result;
  if (user && token) {
    var count = db.query(`SELECT count(*) FROM User`).result;
    count.next();
    if (count.get(0) >= 1) db.update("DELETE FROM User");
    db.update({
      sql: `INSERT INTO User values(?, ?, ?)`,
      args: [user, token, repos ? repos : ""]
    });
    count.close();
  } else {
    result.next();
    $delay(0.1, () => $sqlite.close(db));
    return result.values;
  }
}

class github {
  constructor() {
    this.file = userManeger();
  }

  log(d) {
    let date = new Date().toUTCString();
    let data = { logs: [`${date}: initialization logs...`] };

    if (!$file.exists("/log")) this.setLog(data);

    let log = JSON.parse($file.read("/log").string);

    d ? log.logs.unshift(`${date}: ${d}`) : 0;
    $("logs")
      ? $("logs").insert({
          indexPath: $indexPath(0, log.logs.lenght),
          value: `${date}: ${d}`
        })
      : 0;
    this.setLog(log);
  }

  url(P) {
    return `https://api.github.com/repos/${this.file.user}/${P}/contents`;
  }

  durl(P) {
    return `https://github.com/${this.file.user}/${P}/archive/master.zip`;
  }

  body(u, m, b) {
    return {
      url: u,
      body: b ? b : {},
      method: m ? m : "GET",
      header: {
        Authorization: "token " + this.file.token
      }
    };
  }

  folder(P) {
    let path = `Files/${P}`;
    $file.exists("Files") ? 0 : $file.mkdir("Files");
    let flag = $file.exists(path) ? 0 : $file.mkdir(path);
    flag ? this.log(`${P} mkdir...`) : 0;
  }

  setLog(data) {
    $file.write({
      data: $data({ string: JSON.stringify(data) }),
      path: "/log"
    });
  }

  setDATA(file) {
    $file.write({
      data: $data({ string: JSON.stringify(file) }),
      path: "/config"
    });
  }

  async check(P, F) {
    let data = await this.requets(
      `https://api.github.com/repos/${this.file.user}/${P}/contents/${
        F ? F : ""
      }`
    );
    return data;
  }

  async requets(u, m, b) {
    let res = await $http.request(this.body(u, m, b));
    return res.data;
  }

  async create(n, d, m, P) {
    let url = `${this.url(P)}/${n}`;
    let data = await this.requets(url, "PUT", {
      message: m,
      content: $text.base64Encode(d)
    });
    let flag = data.documentation_url ? false : true;
    if (!flag) {
      this.log(`${n} faild,try again at ${lay}s...`);
      $delay(lay, async () => {
        await this.create(n, d, m, P);
      });
    } else this.log(`${n} upload succese...`);
  }

  async upload(n, s, d, m, P) {
    let lay = 3;
    let url = `${this.url(P)}/${n}`;
    let data = await this.requets(url, "PUT", {
      sha: s,
      message: m,
      content: $text.base64Encode(d)
    });
    let flag = data.documentation_url ? false : true;
    if (!flag) {
      this.log(`${n} faild,try again at ${lay}s...`);
      $delay(lay, async () => {
        let cloud = await this.check(P);
        cloud.map(async x => {
          if (x.name == n) {
            await this.upload(n, x.sha, d, m, P);
          }
        });
      });
    } else this.log(`${n} upload succese...`);
  }

  async syncToPath(P) {
    let path = $file.list(`Files/${P}`);
    path.map(async x => {
      let p = `Files/${P}/${x}`;
      if ($file.isDirectory(p)) await this.syncToPath(`${P}/${x}`);
      else {
        let check = await this.SQLRead(p, $text.MD5($file.read(p)));
        if (check == "underfind") {
          this.log(`${x} Ready To Upload...`);
          await this.create(x, $file.read(p), "JSBox", P);
        } else if (check == true) {
          this.log(`${x} Ready To Upload...`);
          let cloud = await this.check(P);
          cloud.map(async y => {
            if (y.name == x)
              await this.upload(x, x.sha, $file.read(p), "JSBox", P);
          });
        } else this.log(`${x} Skip Upload...`);
      }
    });
  }

  async zip(u, n) {
    let lay = 3;

    this.log(`${n} start download...`);
    let res = await $http.download({
      url: u,
      showsProgress: false
    });
    let flag = await $archiver.unzip({
      file: res.data,
      dest: `/Files/${n}/`
    });

    if (flag) {
      let zipd = `Files/${n}/${n}-master`;
      let temp = $file.list(zipd);
      temp.map(x => {
        $file.move({
          src: `Files/${n}/${n}-master/${x}`,
          dst: `Files/${n}/${x}`
        });
      });
      $file.delete(zipd);
      await this.mapFolder(`Files/${n}`);
      this.log(`${n}.zip download succese...`);
    } else {
      this.log(`${n} faild,try again at ${lay}s...`);
      $delay(lay, async () => {
        await this.zip(u, n);
      });
    }
  }

  async syncToCloud(P) {
    await this.zip(this.durl(P), P);
  }

  async tokenCheck(handler) {
    handler();
    if(!this.file.user) return false;
    let data = await this.requets(`${host}/${this.file.user}`);
    let flag = data.login == this.file.user ? true : false;
    this.log(`${this.file.user} login ${flag ? "succese" : "faled"}`);

    return flag;
  }

  async reposCheck() {
    let res = [];

    let data = await this.requets(`${`${host}/${this.file.user}`}/repos`);
    data.map(x => res.push(x.name));
    return res;
  }

  async folderCheck() {
    let res = await this.reposCheck();

    let set = new Set(res);
    let data = $file.list("Files");
    return data.filter(v => !set.has(v));
  }

  async mapFolder(rp) {
    let root = $file.list(rp);
    root.map(x => {
      let path = `${rp}/${x}`;
      if ($file.isDirectory(path)) this.mapFolder(path);
      else this.SQLWrite(path, $text.MD5($file.read(path)));
    });
  }

  async pathName(path) {
    let a = new Array();
    a = path.split("/");
    return a[1];
  }

  async SQLRead(path, MD5) {
    let temp;
    let name = await this.pathName(path);
    var db = $sqlite.open(`${path}Files.db`);
    var result = db.query({
      sql: `SELECT * FROM ${name} WHERE path=?`,
      args: [path]
    }).result;
    if (!result) return "underfind";
    result.next();

    temp = result.values.md5;
    $sqlite.close(db);

    if (temp == MD5) return false;
    else return true;
  }

  async SQLWrite(path, MD5) {
    let name = await this.pathName(path);
    var db = $sqlite.open(`${path}Files.db`);
    db.query(`SELECT * FROM ${name.toString()}`).error
      ? db.update(`CREATE TABLE ${name}(path text, md5 text)`)
      : 0;

    var count = db.query(`SELECT count(*) FROM ${name}`).result;
    var result = db.query(`SELECT * FROM ${name}`).result;
    count.next();
    if (count.get(0) < 1) {
      db.update({
        sql: `INSERT INTO ${name} values(?, ?)`,
        args: [path, MD5]
      });
    } else {
      let pc = db.query({
        sql: `SELECT count(*) FROM ${name} WHERE path=?`,
        args: [path]
      }).result;

      pc.next();
      if (pc.get(0) < 1) {
        db.update({
          sql: `INSERT INTO ${name} values(?, ?)`,
          args: [path, MD5]
        });
      } else {
        db.update({
          sql: `UPDATE ${name} SET md5=? WHERE path=?`,
          args: [MD5, path]
        });
      }
      pc.close();
    }
    count.close();
    result.close();
    $sqlite.close(db);
  }

  async CheckFolder() {
    var data = [];
    var files = $file.list("Files");
    var sqLite = $sqlite.open(`${path}Files.db`);

    let text = sqLite.query(`SELECT name FROM sqlite_master`).result;
    while (text.next()) {
      let value = text.values;
      if (value && value.name != "User") {
        data.push(value.name);
      }
    }

    var filesSet = new Set(files);
    var sqldifference = data.filter(v => !filesSet.has(v));

    if (sqldifference.length) {
      sqldifference.map(v => {
        sqLite.update(`DROP TABLE ${v}`);
      });
    }

    sqLite.close();
  }

  async creatRepos(body) {
    let res = await this.requets(
      "https://api.github.com/user/repos",
      "POST",
      body
    );
    return res;
  }
}
module.exports = {
  git: github,
  user: userManeger
};
