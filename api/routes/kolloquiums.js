const { Router } = require('express')

const router = Router()
var fs = require("fs")

function getDirectories(path) {
    return fs.readdirSync(path).filter(function (file) {
        return fs.statSync(path+'/'+file).isDirectory();
    });
}

// function removeDangerousSymbols(title) {
//     return title
// }

function removeDangerousSymbols(fname) {
    // https://stackoverflow.com/a/31976060
    // https://gist.github.com/doctaphred/d01d05291546186941e1b7ddc02034d3

    const fname_original = fname;

    // resolve multi-line, whitespace trimming
    fname = fname.split(/[\r\n]/).map(s => s.trim()).filter(s => s.length).join("  ");
    // forbidden characters
    // (after multi-line, because new-line-chars are themselves forbidden characters)
    fname = fname.replaceAll(/[<>.:"\/\\\|?*\x00-\x1F]/g, '');
    // advanced trim
    fname = fname.replace(/\.$/, "");
    // empty filename
    if (!fname.length) {
        fname = '_';
    }
    // forbidden filenames
    if (fname.match(/^(CON|PRN|AUX|NUL|COM1|COM2|COM3|COM4|COM5|COM6|COM7|COM8|COM9|LPT1|LPT2|LPT3|LPT4|LPT5|LPT6|LPT7|LPT8|LPT9)(\..+)?$/)) {
        fname = `_${fname}`;
    }
    
    return fname;
}

fs.mkdir('Kolloquiums',function(err) {
    if (err && err.code === "EEXIST") {
        console.log('Kolloquiums Directory already existed')
    }
    else if (err && err.code != "EEXIST") {
        return console.error(err);
    }
    else {
        console.log("Directory created successfully!");
    }
});

// Get Kolloquiums
router.use('/getKolloquiums', (req, res) => {
    var directories = getDirectories('Kolloquiums')
    return res.json({
        kolloquiums: directories
    });
})

// Delete Kolloquium
router.use('/deleteKolloquium', (req, res) => {
    console.log('deleting Kolloquium')
    let { title } = req.body
    if(!title || title.trim().length == 0) {
        console.error('Folder has no name')
        return res.json({
            status: 'error',
            message: 'Folder has no name'
        })
    }

    let safeTitle = removeDangerousSymbols(title)
    fs.rmdir("Kolloquiums/" + safeTitle, function(err) {
        if (err) {
           console.error(err);
           return res.json({
               status: 'error',
               message: err
           })
        }
     });
    return res.json({
        status: 'success',
        message: 'removed Kolloquium ' + safeTitle
    })
})

// Create Kolloquium
router.use('/createKolloquium', (req, res) => {
    console.log('creating Kolloquium')
    console.log(req.body)
    let { title } = req.body
    if( !title || title.trim().length == 0) {
        console.error('Title was empty')
        return res.json({
            status: 'error',
            message: 'Title was empty'
        })
    }
    let safeTitle = removeDangerousSymbols(title)
    fs.mkdir('Kolloquiums/' + safeTitle, function(err) {
        if (err && err.code === "EEXIST") {
            console.warn('Directory "' + safeTitle + '" already existed')
            return res.json({
                status: 'warning',
                message: 'Directory "' + safeTitle + '" already existed'
            })
        }
        else if (err && err.code != "EEXIST") {
            console.error(err);
            return res.json({
                status: 'error',
                message: err
            })
        }
        else {
            console.log('Directory "' + safeTitle + '" created successfully!');
            return res.json({
                status: 'success',
                message: 'Directory "' + safeTitle + '" created successfully!'
            })
        }
    });
})

// Rename Kolloquium
router.use('/renameKolloquium', (req, res) => {
    console.log('renaming Kolloquium')
    console.log(req.body);
    let { oldTitle, newTitle } = req.body
    if( !oldTitle || oldTitle.trim().length == 0 || !newTitle || newTitle.trim().length == 0) {
        console.error('at least one of the names was empty')
        return res.json({
            status: 'error',
            message: 'at least one of the names was empty'
        })
    }
    let oldSafeTitle = removeDangerousSymbols(oldTitle)
    let newSafeTitle = removeDangerousSymbols(newTitle)
    fs.rename('Kolloquiums/' + oldSafeTitle, 'Kolloquiums/' + newSafeTitle, (err) => {
        if(err) {
            console.error(err);
            return res.json({
                status: 'error',
                message: err
            })
        }
    
        console.log("Directory renamed successfully.");
    });
})

module.exports = router
