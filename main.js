// Processus principal

const {app,BrowserWindow} = require('electron')
const path = require('path')

// Créer la fenêtre principale
function createWindow(){
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false, // Accès au API Node depuis le processus de rendu
            contextIsolation: true,
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

// Fermer l'application si les fenêtres sont fermées
// Sur MacOS, les applications ne se ferment pas lorsqu'on ferme la dernière fenêtre
app.on('window-all-closed', () => {
    if(process.platform !== 'darwin'){  // darwin = MacOS
        app.quit()
    }
})