const { Router } = require('express')


const router = Router()
var fs = require("fs")
const kolloquiumDirectory = 'Kolloquiums'

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

    // forbidden filenames
    if (fname.match(/^(CON|PRN|AUX|NUL|COM1|COM2|COM3|COM4|COM5|COM6|COM7|COM8|COM9|LPT1|LPT2|LPT3|LPT4|LPT5|LPT6|LPT7|LPT8|LPT9)(\..+)?$/)) {
        fname = `_${fname}`;
    }
    
    return fname;
}

fs.mkdir(kolloquiumDirectory,function(err) {
    if (err && err.code === "EEXIST") {
        console.log('Kolloquiums Directory already existed')
    }
    else if (err) {
        return console.error(err);
    }
    else {
        console.log("Directory created successfully!");
    }
});

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

    var directories = getDirectories(kolloquiumDirectory + '/' + safeKolloquium)
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
            return res.json({
                success: true,
                message: 'Directory "' + safeTitle + '" already existed'
            })
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
            return res.json({
                success: true,
                message: 'Directory "' + safeTitle + '" created successfully'
            })
        }
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

    let file = req.files.file;        

    if(isEmpty(safeKolloquium) || isEmpty(safeMatrikelnummer || isEmpty(safeName))) {
        console.error('Matrikelnummer, Name or Kolloquium was empty')
        return res.json({
            success: false,
            message: 'Matrikelnummer, Name or Kolloquium was empty'
        })
    }
    let directory = kolloquiumDirectory + '/' + safeKolloquium + '/' + safeMatrikelnummer + '_' + safeName;
    fs.mkdir(directory, function(err) {
        if (err && err.code === "EEXIST") {
            console.warn('Directory "' + directory + '" already existed')
        }
        else if (err) {
            console.error(err);
            return res.json({
                success: false,
                message: err
            })
        }
        else {
            console.log('Directory "' + directory + '" created successfully');
        }
        file.mv(directory + '/' + filename);
        console.log('saved file ' + filename)
    })
})



module.exports = router
