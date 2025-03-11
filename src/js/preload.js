// Ce script sera exécuter avant le chargement de la page
// Accès au API Node et Electron

const {contextBridge,ipcRenderer} = require('electron')
contextBridge.exposeInMainWorld('versions',{
    // Fonction qui récupère les versions via IPC
    getVersions : () => ipcRenderer.invoke('get-versions')
})
contextBridge.exposeInMainWorld('todosAPI',{
    // Fonction qui récupère la liste des tâches via IPC
    getAll : () => ipcRenderer.invoke('todos:getAll')
})
console.log("Preload chargé avec succès !")