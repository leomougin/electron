// Processus principal

const {app,BrowserWindow,ipcMain,Menu} = require('electron')
const path = require('path')
const mysql = require('mysql2/promise')
// Fenêtre principal
let window

// Configuration de la connexion à la base de données
const dbConfig =
    {
        host:'localhost',
        port:3306,
        user:'root',
        password:'',
        database: 'db_todos',
        connectionLimit: 10, // Le nombre maximal de connexion simultanées
        waitForConnection:true,
        queueLimit:0
    }
// Créer le pool de connexion
const pool = mysql.createPool(dbConfig)

// Tester la connexion
async function testConnexion()
{
    try {
       // Demander une connexion au pool
       const connexion = await pool.getConnection()
        console.log("Connexion avec la base de donnée établie")
        connexion.release() // Rend la connexion disponnible

    }catch (error)
    {
      console.error('Erreur de connexion à la base de donnée !')
    }
}
testConnexion()

async function getAllTodos()
{
    try{
        const resultat = await pool.query('SELECT * FROM todos ORDER BY created_at DESC')

    }catch(error){
        console.error('Erreur lors de la récupération des tâches !')
    }
}

// Ecouter sur le canal "todos:getAll"
ipcMain.handle('todos:getAll',()=> {
    // Récupérer la liste des tâches dans la base de données avec la librairie MySQL
})

// Créer la fenêtre principale
function createWindow(){
    window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false, // Accès au API Node depuis le processus de rendu
            contextIsolation: true,
            sandbox:true,
            preload: path.join(__dirname, '/src/js/preload.js')
        }
    })
    // Création du menu
    createMenu()
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

// Fonction permettant de créer un menu personnalisé
function createMenu() {
    // Créet un tableau qui va représenter le menu -> modèle
    const template =
        [
            {
                label:'App',
                submenu:
                    [
                        {
                            label:'Version',
                            click: () =>window.loadFile('src/pages/index.html')
                        },
                        {
                          type:'separator'
                        },
                        {
                            label:'Quitter',
                            accelerator:process.platform === 'darwin' ? 'Cmd+Q':'Ctrl+Q',
                            click:()=>app.quit()
                        }
                ]
            },
            {
                label: 'Tâches',
                submenu:
                [
                    {
                        label:'Liste',
                        click: () =>window.loadFile('src/pages/listeTache.html')
                    },
                    {
                        type:'separator'
                    },
                    {
                        label:'Ajouter',
                        click: () =>window.loadFile('src/pages/ajouterTache.html')
                    }
                ]
            }
        ]

    // Créer le menu à partir du modèle
    const menu = Menu.buildFromTemplate(template)
    // Définir le menu comme menu de l'application
    Menu.setApplicationMenu(menu)
}
// Fermer l'application si les fenêtres sont fermées
// Sur MacOS, les applications ne se ferment pas lorsqu'on ferme la dernière fenêtre
app.on('window-all-closed', () => {
    if(process.platform !== 'darwin'){  // darwin = MacOS
        app.quit()
    }
})