const fs = require("fs-extra")
const { exec } = require("child_process")
const file = ".env"
const debug = false

var isDev = process.argv[2] === "dev"

function execShellCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(error)
        reject(error)
      }
      if (stdout) {
        resolve(stdout.replace(/(\r\n|\n|\r)/gm, "")) //remove all line breaks
      } else {
        reject(stderr)
      }
    })
  })
}

function prepareDestination() {
  return new Promise((resolve, reject) => {
    fs.pathExists(file).then((exists) => {
      if (exists) {
        fs.remove(file, (err) => {
          if (err) {
            console.error(`error removing existing ${file} file`)
            reject(err)
          } else {
            debug && console.log(`removed existing ${file} file`)
            resolve(true)
          }
        })
      } else {
        debug && console.log(`${file} file does not exist`)
        resolve(true)
      }
    })
  }).catch((err) => {
    console.error(`error removing existing ${file} file`)
    reject(err)
  })
}

function writeFile() {
  return new Promise((resolve, reject) => {
    debug && console.log(`writing ${file} file`)
    execShellCommand("git rev-list --count HEAD")
      .then((headCount) => {
        execShellCommand("git describe --tags --exact-match --abbrev=0 || echo dev")
          .then((description) => {
            execShellCommand("git rev-parse HEAD ")
            .then((latestCommit) => {
            execShellCommand("git rev-list --tags --max-count=1")
            .then((prodCommit) => {
            const latest = latestCommit === prodCommit
            debug && console.log({ headCount, description })
            fs.outputFile(
              file,
              [
                "SKIP_PREFLIGHT_CHECK=true",
                "NODE_ENV=production",
                `REACT_APP_GIT_NUM=${headCount}`,
                `REACT_APP_GIT_SHA=${description}`,
                `REACT_APP_LATEST_LAMP=${latest}`,
                isDev ? "BROWSER=none" : "CI=false",
              ].join("\r\n")
            )
              .then(() => resolve(true))
              .catch((err) => {
                console.error(`error writing ${file} file`)
                reject(err)
              })
              .catch((err) => {
                reject(err)
              })
          })
          .catch((err) => resolve(err))
      })
      .catch((err) => {
        resolve(err)
      })
  }).catch((err) => reject(err))
}).catch((err) => reject(err))
}).catch((err) => reject(err))
}

prepareDestination()
  .then((success) => {
    if (success) {
      writeFile()
        .then(() => {
          console.log(`${file} file built successfully`)
          process.exit(0) // Success
        })
        .catch((err) => {
          console.error(`error building ${file} file`)
          process.exit(1) // Failure
        })
    } else {
      console.error(`${file} file preparation failed`)
      process.exit(1) // Failure
    }
  })
  .catch((err) => {
    console.error(`${file} file preparation failed`)
    console.error(err)
    process.exit(1) // Failure
  })