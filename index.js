#!/usr/bin/env node

const archiver = require('archiver')
const fs = require('fs')
const path = require('path')

const BUILD_DIR = './build'
const CWD = process.cwd()
const PKG = require(path.resolve(CWD, './package.json'))

const output = fs.createWriteStream(path.resolve(CWD, BUILD_DIR, `${PKG.name}.zip`))
const archive = archiver('zip', {
  zlib: {
    level: 9
  }
})

output.on('close', () => {
  console.log(`${archive.pointer()} total bytes`)
  console.log('archiver has been finalized and the output file descriptor has closed.')
})

output.on('end', () => {
  console.log('Data has been drained')
})

archive.on('warning', (err) => {
  throw err
})

archive.on('error', (err) => {
  throw err
})

const files = ['grid.html', 'preview.png'].concat(['css', 'html', 'js', 'qext'].map((ext) => `${PKG.name}.${ext}`))
const wbfolder =
  files
    .map((name) => {
      archive.append(fs.createReadStream(path.resolve(CWD, name)), { name })

      return name
    })
    .join(';\n')

archiver.file(wbfolder, {
  name: 'wbfolder.wbl'
})

archive.pipe(output)
archive.finalize()
