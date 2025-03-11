// Ce script sera exécuter avant le chargement de la page
// Accès au API Node et Electron

const {contextBridge} = require('electron')
contextBridge.exposeInMainWorld('versions',{
    electron: process.versions.electron,
    node:process.versions.node,
    chrome:process.versions.chrome
})

console.log("Preload chargé avec succès !")