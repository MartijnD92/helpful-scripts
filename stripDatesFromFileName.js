/**********************
 * Node JS script to strip part (e.g. a date) from file names in current folder with Regex pattern.
 ***********************/

const fs = require('fs')
const path = require('path')
const scriptName = path.basename(__filename)

const partToStrip = /^[\d-]+_/g
const files = fs.readdirSync('./')

let existingFiles = 0
files.forEach((file) => {
  if (file === scriptName) return

  if (file.search(partToStrip) === -1) {
    console.log(`${file} does not match given pattern.`)
    return
  }

  let newFile = file.replace(partToStrip, '')
    ? file.replace(partToStrip, '')
    : file

  console.log('before: ', newFile)
  const newFileExt = path.extname(newFile)
  const newFileBase = path.basename(newFile, newFileExt)
  fs.exists(newFile, (exists) => {
    if (exists) {
      existingFiles++
      newFile = `${newFileBase}-${existingFiles}${newFileExt}`
    }
  })
  console.log('after: ', newFile)

  fs.stat(file, (error, stats) => {
    if (error) {
      console.error(`Error defining ${file}.`, error)
      return
    }

    if (stats.isDirectory()) {
      console.log(`${file} is a directory.`)
      return
    }

    fs.rename(file, newFile, (error) => {
      if (error) {
        console.error('File renaming error.', error)
      } else {
        console.log(`Renamed file from ${file} to ${newFile}.`)
      }
    })
  })
})
