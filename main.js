// Processus principal

const {app,BrowserWindow,ipcMain} = require('electron')
const path = require('path')

// Créer la fenêtre principale
function createWindow(){
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false, // Accès au API Node depuis le processus de rendu
            contextIsolation: true,
            sandbox:true,
            preload: path.join(__dirname, '/src/js/preload.js')
        }
    })

    // Charger index.html
    window.loadFile('src/pages/index.html')
}

// Attendre l'initialisation de l'application
app.whenReady().then( () => {
    console.log("Application initialisée")
    createWindow()

    app.on('activate', () => {
        if(BrowserWindow.getAllWindows().length === 0){
            createWindow()
        }
    })
})
// Ecouter sur le canal get-versions
ipcMain.handle('get-versions',()=> {
    return{
        electron: process.versions.electron,
        node:process.versions.node,
        chrome:process.versions.chrome
    }
})

// Fermer l'application si les fenêtres sont fermées
// Sur MacOS, les applications ne se ferment pas lorsqu'on ferme la dernière fenêtre
app.on('window-all-closed', () => {
    if(process.platform !== 'darwin'){  // darwin = MacOS
        app.quit()
    }
})