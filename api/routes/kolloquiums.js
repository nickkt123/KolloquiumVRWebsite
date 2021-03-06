const { Router } = require('express')
var fs = require("fs");
var exec = require('child_process').exec;
var extract = require('extract-zip')
const router = Router();
const path = require('path');
const {resolve} = require("path");
const replace = require('replace-in-file');

const kolloquiumDirectory = '../Kolloquiums'
const engineDirectory = 'D:/UnrealEngine'
const packagedGame = 'D:/KolloquiumVR/PackagedGame'
const nDisplayLauncher = engineDirectory + '/Projects/KolloquiumVR/Scripts/launch.bat'

const engineINI =            engineDirectory + '/Projects/KolloquiumVR/Config/DefaultEngine.ini'
const editorINI =            engineDirectory + '/Projects/KolloquiumVR/Saved/Config/Windows/Editor.ini'
const templateLevel =        engineDirectory + '/Projects/KolloquiumVR/Content/Maps/TemplateLevel.umap'
const modDirectory =         engineDirectory + '/Projects/KolloquiumVR/Mods'                             
const pythonScript =         engineDirectory + '/Projects/KolloquiumVR/Scripts/ImportDatasmithCommandlet.py'
const kolloquiumVRuproject = engineDirectory + '/Projects/KolloquiumVR/KolloquiumVR.uproject'
const runUAT =               engineDirectory + '/Engine/Build/BatchFiles/RunUAT.bat'
const UE4EditorCMD =         engineDirectory + '/Engine/Binaries/Win64/UE4Editor-Cmd.exe'
const pakDirectory =         packagedGame + '/WindowsNoEditor/KolloquiumVR/Mods'
const kolloquiumVRexe =      packagedGame + '/WindowsNoEditor/KolloquiumVR.exe'


// Gets executed at server startup
fs.mkdir(kolloquiumDirectory,function(err) {
    if (err && err.code === "EEXIST") {
        console.log('Kolloquiums Directory already existed')
    }
    else if (err) {
        return console.error(err);
    }
    else {
        console.log("Directory created successfully");
    }
});


function getDirectories(path) {
    // check if directory exists
    if (fs.existsSync(path)) {
        return fs.readdirSync(path).filter(function (file) {
            return fs.statSync(path+'/'+file).isDirectory();
        });
    } else {
        console.log('Directory not found.');
        return []
    }
}

function isEmpty(checkString) {
    return (!checkString || checkString.trim().length == 0)
}

function removeDangerousSymbols(fname) {
    // https://stackoverflow.com/a/31976060
    // https://gist.github.com/doctaphred/d01d05291546186941e1b7ddc02034d3
    // removed check for empty: if is empty, nothing should be done with the string by the other api functions 

    const fname_original = fname;

    // resolve multi-line, whitespace trimming
    fname = fname.split(/[\r\n]/).map(s => s.trim()).filter(s => s.length).join("  ");
    // forbidden characters
    // (after multi-line, because new-line-chars are themselves forbidden characters)
    fname = fname.replaceAll(/[<>.:"\/\\\|?*\x00-\x1F]/g, '');
    // advanced trim
    fname = fname.replace(/\.$/, "");

    // remove blank spaces because it breaks paths
    // TODO: Make it so blank spaces do not breka paths anymore
    fname = fname.replaceAll(' ', '_');

    // forbidden filenames
    if (fname.match(/^(CON|PRN|AUX|NUL|COM1|COM2|COM3|COM4|COM5|COM6|COM7|COM8|COM9|LPT1|LPT2|LPT3|LPT4|LPT5|LPT6|LPT7|LPT8|LPT9)(\..+)?$/)) {
        fname = `_${fname}`;
    }
    
    return fname;
}


// Get Kolloquiums
router.use('/getKolloquiums', (req, res) => {
    console.log('/getKolloquiums')
    var directories = getDirectories(kolloquiumDirectory)
    console.log('Kolloquiums: ' + directories)
    return res.json({
        kolloquiums: directories
    });
})


// Get Abgaben
router.use('/getAbgaben', (req, res) => {
    let { kolloquium } = req.body
    console.log("Get Abgaben from '" + kolloquium + "'")
    let safeKolloquium = removeDangerousSymbols(kolloquium)

    if(isEmpty(safeKolloquium)) {
        console.warn('Folder has no name')
        return res.json({
            success: false,
            message: 'Folder has no name'
        })
    }

    var directories = getDirectories(kolloquiumDirectory + '/' + safeKolloquium + '/Abgaben')
    return res.json({
        success: true,
        abgaben: directories
    });
})


// Delete Kolloquium
router.use('/deleteKolloquium', (req, res) => {
    let { title } = req.body
    let safeTitle = removeDangerousSymbols(title)
    console.log("Delete Kolloquium '" + title + "'")

    if(isEmpty(safeTitle)) {
        console.error('Folder has no name')
        return res.json({
            success: false,
            message: 'Folder has no name'
        })
    }

    let dirname = kolloquiumDirectory + '/' + safeTitle
    fs.readdir(dirname, function(err, files) {
        if (err) {
            console.error(err);
            return res.json({
                success: false,
                message: err
            })
        } else {
            if (!files.length) {
                // directory appears to be empty
                fs.rmdir(dirname, function(err) {
                    if (err) {
                        console.error(err);
                        return res.json({
                            success: false,
                            message: err
                        })
                    }
                    return res.json({
                        success: true,
                        message: 'removed Kolloquium ' + safeTitle
                    })
                });
            } else {
                // TODO: ask for confirmation to delete anyway
                console.log('Directory is not empty. TODO: Ask for confirmation to delete anyway')
                return res.json({
                    success: false,
                    message: 'Kolloquium ' + safeTitle + ' was not empty'
                })
            }
        }
    });
})

// Create Kolloquium
router.use('/createKolloquium', (req, res) => {
    let { title } = req.body
    console.log("Create Kolloquium '" + title + "'")
    let safeTitle = removeDangerousSymbols(title)

    if(isEmpty(safeTitle)) {
        console.error('Title was empty')
        return res.json({
            success: false,
            message: 'Title was empty'
        })
    }
    fs.mkdir(kolloquiumDirectory + '/' + safeTitle, function(err) {
        if (err && err.code === "EEXIST") {
            console.warn('Directory "' + safeTitle + '" already existed')
        }
        else if (err) {
            console.error(err);
            return res.json({
                success: false,
                message: err
            })
        }
        else {
            console.log('Directory "' + safeTitle + '" created successfully');
        }

        fs.mkdir(kolloquiumDirectory + '/' + safeTitle + '/Mods', function(err) {
            if (err && err.code === "EEXIST") {
                console.log('Mods Directory already existed')
            }
            else if (err) {
                return res.json({
                    success: false,
                    message: err
                })
            }
            else {
                console.log("Mods Directory created successfully");
            }
        });

        fs.mkdir(kolloquiumDirectory + '/' + safeTitle + '/Abgaben', function(err) {
            if (err && err.code === "EEXIST") {
                console.log('Abgaben Directory already existed')
            }
            else if (err) {
                return res.json({
                    success: false,
                    message: err
                })
            }
            else {
                console.log("Abgaben Directory created successfully");
            }
        });

        return res.json({
                success: true,
                message: 'Directory "' + safeTitle + '" created successfully'
            })
    });
})

// Rename Kolloquium
router.use('/renameKolloquium', (req, res) => {
    let { oldTitle, newTitle } = req.body
    console.log("Rename Kolloquium '" + oldTitle + "' to '" + newTitle + "'")
    let safeOldTitle = removeDangerousSymbols(oldTitle)
    let safeNewTitle = removeDangerousSymbols(newTitle)

    if(isEmpty(safeOldTitle) || isEmpty(safeNewTitle)) {
        console.error('at least one of the names was empty')
        return res.json({
            success: false,
            message: 'at least one of the names was empty'
        })
    }
    fs.rename(kolloquiumDirectory + '/' + safeOldTitle, kolloquiumDirectory + '/' + safeNewTitle, (err) => {
        if(err) {
            console.error(err);
            return res.json({
                success: false,
                message: err
            })
        }
    
        console.log("Directory renamed successfully");
    });
})


// Submit Abgabe
router.use('/submitAbgabe', (req, res) => {
    let { kolloquium, name, matrikelnummer, filename } = req.body
    console.log("Submit Abgabe '" + filename + "' to '" + kolloquium + "'")

    let safeMatrikelnummer = removeDangerousSymbols(matrikelnummer)
    let safeName = removeDangerousSymbols(name)
    let safeKolloquium = removeDangerousSymbols(kolloquium)

    if(!req.files) {
        console.log('No file uploaded')
        return res.send({
            status: false,
            message: 'No file uploaded'
        });
    }

    let zipfile = req.files.file;        

    if(isEmpty(safeKolloquium) || isEmpty(safeMatrikelnummer || isEmpty(safeName))) {
        console.error('Matrikelnummer, Name or Kolloquium was empty')
        return res.json({
            success: false,
            message: 'Matrikelnummer, Name or Kolloquium was empty'
        })
    }
    let datasmithAbgabeDirectory = path.join(kolloquiumDirectory, safeKolloquium, 'Abgaben', safeMatrikelnummer + '_' + safeName);
    fs.mkdir(datasmithAbgabeDirectory, function(err) {
        if (err && err.code === "EEXIST") {
            console.warn('Directory "' + datasmithAbgabeDirectory + '" already existed')
        }
        else if (err) {
            console.error(err);
            return res.json({
                success: false,
                message: err
            })
        }
        else {
            console.log('Directory "' + datasmithAbgabeDirectory + '" created successfully');
        }
        let zipPath = resolve(datasmithAbgabeDirectory + '/' + filename)
        zipfile.mv(zipPath);
        extract(zipPath, { dir: resolve(datasmithAbgabeDirectory) }, err => {
            if (err) {
                console.error(err);
                return res.json({
                    success: false,
                    message: err
                })
            }
        }).then(() => {
            console.log('saved file ' + filename)
        
            // Rename Mod folder to 'Abgabe_' + safeMatrikelnummer + '_' + safeName
            let mod_folder_name = 'Abgabe_' + safeMatrikelnummer + '_' + safeName
            let modDirectories = getDirectories(modDirectory);
            if(modDirectories.length == 0){
                console.log('no mod folders')
                return res.json({
                    success: false,
                    message: 'no mod folders'
                })
            }
            let newAbgabeDirectory = modDirectory + '/' + mod_folder_name
            fs.rename(modDirectory + '/' + modDirectories[0], newAbgabeDirectory, (err) => {
                if(err) {
                    console.error(err);
                    return res.json({
                        success: false,
                        message: err
                    })
                }
                // Rename Abgabe.uplugin same
                fs.readdir(newAbgabeDirectory, (err, files) => {
                    if(err) {
                        console.error(err);
                        return res.json({
                            success: false,
                            message: err
                        })
                    }
                    const upluginFiles = files.filter(file => {
                        return path.extname(file).toLowerCase() === '.uplugin';
                    });
                    if(upluginFiles.length == 0){
                        console.log('no uplugin files')
                        return res.json({
                            success: false,
                            message: 'no uplugin files'
                        })
                    }
                    fs.rename(newAbgabeDirectory + '/' + upluginFiles[0], newAbgabeDirectory + '/' + mod_folder_name + '.uplugin', (err) => {
                        if(err) {
                            console.error(err);
                            return res.json({
                                success: false,
                                message: err
                            })
                        }
                    })

                    console.log('changed name of mod folder and uplugin')
                    // Change the name of the mod and location of Datasmith file in the editor.init...
                    fs.readdir(datasmithAbgabeDirectory, (err, files) => {
                        if(err) {
                            console.error(err);
                            return res.json({
                                success: false,
                                message: err
                            })
                        }
                        const datasmithFiles = files.filter(file => {
                            return path.extname(file).toLowerCase() === '.udatasmith';
                        });
                        if(datasmithFiles.length == 0){
                            console.log('no datasmith files')
                            return res.json({
                                success: false,
                                message: 'no datasmith files'
                            })
                        }
                        const ModFolderRegex = new RegExp('ModFolder=.*', 'i');
                        const FilePathRegex = new RegExp('FilePath=.*', 'i');
                        const editorReplaceOptions = {
                            files: editorINI,
                            from: [ModFolderRegex, FilePathRegex],
                            to: ['ModFolder=' + mod_folder_name, 'FilePath=' + resolve(datasmithAbgabeDirectory + '/' + datasmithFiles[0])]
                        };
                        replace(editorReplaceOptions, (error, results) => {
                            if (error) {
                            return console.error('Error occurred:', error);
                            }
                            
                            let levelName = mod_folder_name + '_Level'
                            const startupMapRegex = new RegExp('EditorStartupMap=.*', 'i');
                            const engineReplaceOptions = {
                                files: engineINI,
                                from: startupMapRegex,
                                to: 'EditorStartupMap=/' + mod_folder_name + '/'+ levelName + '.' + levelName
                            };
                            replace(engineReplaceOptions, (error, results) => {
                                if (error) {
                                return console.error('Error occurred:', error);
                                }
                                
                                console.log('Replaced mod folder and file path in .ini files')

                                // Remove old content in Mod folder
                                fs.rmSync(path.join(newAbgabeDirectory, 'Content'), { recursive: true, force: true });
                                fs.mkdir(path.join(newAbgabeDirectory, 'Content'), function(err) {
                                    if (err) {
                                        console.error(err);
                                        return res.json({
                                            success: false,
                                            message: err
                                        })
                                    }
                                    fs.copyFile(templateLevel, path.join(newAbgabeDirectory, 'Content', levelName + '.umap'), function(err) {
                                        // Run the python script that starts the unreal engine with the editor utility...
                                        if (err) {
                                            console.error(err);
                                            return res.json({
                                                success: false,
                                                message: err
                                            })
                                        }

                                        exec(UE4EditorCMD + ' KolloquiumVR -ExecutePythonScript="' + pythonScript + '"',
                                        function (error, stdout, stderr) {
                                            if (!isEmpty(stderr)){
                                                console.log('stderr: ' + stderr);
                                                return res.json({
                                                    success: false,
                                                    message: stderr
                                                })
                                            }
                                            if (error !== null) {
                                                console.log('exec error: ' + error);
                                                return res.json({
                                                    success: false,
                                                    message: error
                                                })
                                            }
                                            console.log('Imported Datasmithfile successfully');
                                            // Run the automation script that packages the mod
                                            exec(runUAT + ' PackageUGC -Project=' + kolloquiumVRuproject + ' -PluginPath=' + modDirectory +'/' + mod_folder_name + '/' + mod_folder_name + '.uplugin -basedonreleaseversion=KolloquiumVR_v1 -StagingDirectory=' + resolve(path.join(kolloquiumDirectory, safeKolloquium, 'Mods')) + ' -nocompile',
                                            function (error, stdout, stderr) {
                                                if (!isEmpty(stderr)){
                                                    console.log('stderr: ' + stderr);
                                                    return res.json({
                                                        success: false,
                                                        message: stderr
                                                    })
                                                }
                                                if (error !== null) {
                                                    console.log('exec error: ' + error);
                                                    return res.json({
                                                        success: false,
                                                        message: error
                                                    })
                                                }
                                                console.log('Packaged UGC successfully');
                                                return res.json({
                                                    success: true,
                                                    message: 'Packaged UGC successfully'
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});


// activate Kolloquium
router.use('/activateKolloquium', (req, res) => {
    let { kolloquium } = req.body
    let safeKolloquium = removeDangerousSymbols(kolloquium)
    console.log('Activate ' + safeKolloquium)
    // Remove the contents of the mod folder and move the .pak folders to the mod folder 
    fs.rmSync(pakDirectory, { recursive: true, force: true });
    fs.mkdir(pakDirectory, function(err) {
        if (err) {
            console.error(err);
            return res.json({
                success: false,
                message: err
            })
        }
        let packagedModsPath = resolve(path.join(kolloquiumDirectory, safeKolloquium, 'Mods'))
        fs.readdir(packagedModsPath, (err, files) => {
            if(err) {
                console.error(err);
                return res.json({
                    success: false,
                    message: err
                })
            }
            const zipFiles = files.filter(file => {
                return path.extname(file).toLowerCase() === '.zip';
            })
            zipFiles.forEach(zipFile => {
                let abgabeName = path.parse(zipFile).name
                extract(path.join(packagedModsPath, zipFile), { dir: path.join(pakDirectory, abgabeName) }, err => {
                    if (err) {
                        console.error(err);
                        return res.json({
                            success: false,
                            message: err
                        })
                    }
                })
            })
            
            exec(nDisplayLauncher,
            function (error, stdout, stderr) {
                if (!isEmpty(stderr)){
                    console.log('stderr: ' + stderr);
                }
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
        })
    })
})


module.exports = router
