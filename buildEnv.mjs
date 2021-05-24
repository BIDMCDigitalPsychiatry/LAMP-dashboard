import fs from "fs-extra"
import { exec } from "child_process"
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

async function prepareDestination() {
  try {
    const exists = await fs.pathExists(file)
    if (exists) {
      fs.remove(file, (err) => {
        if (err) {
          console.error(`error removing existing ${file} file`)
          console.error(err)
          return false
        } else {
          debug && console.log(`removed existing ${file} file`)
          return true
        }
      })
    } else {
      debug && console.log(`${file} file does not exist`)
      return true
    }
  } catch (err) {
    console.error(`error removing existing ${file} file`)
    return false
  }
  return true
}

async function writeFile() {
  debug && console.log(`writing ${file} file`)

  const headCount = await execShellCommand("git rev-list --count HEAD")
  const description = await execShellCommand("git describe --tags --exact-match --abbrev=0 || echo dev")
  debug && console.log({ headCount, description })
  try {
    await fs.outputFile(
      file,
      [
        "SKIP_PREFLIGHT_CHECK=true",
        isDev ? "BROWSER=none" : "CI=false",
        "NODE_ENV=production",
        `REACT_APP_GIT_NUM=${headCount}`,
        `REACT_APP_GIT_SHA=${description}`,
      ].join("\r\n")
    )
  } catch (err) {
    console.error(`error writing ${file} file`)
    console.error(err)
    return false
  }
  debug && console.log(`successfully created ${file} file`)
  return true
}

if (await prepareDestination()) {
  if (await writeFile()) {
    console.log(`${file} file built successfully`)
    process.exit(0)
  } else {
    console.error(`error building ${file} file`)
  }
} else {
  console.error(`${file} file preparation failed`)
}

process.exit(1)
