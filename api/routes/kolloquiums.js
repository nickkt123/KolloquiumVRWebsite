const { Router } = require('express')

const router = Router()
var fs = require("fs")

function getDirectories(path) {
    return fs.readdirSync(path).filter(function (file) {
        return fs.statSync(path+'/'+file).isDirectory();
    });
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
    if(title == '') {
        console.error('Folder has no name')
        return res.json({
            status: 'error',
            message: 'Folder has no name'
        })
    }
    fs.rmdir("Kolloquiums/" + title, function(err) {
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
        message: 'removed Kolloquium ' + title
    })
})

// Create Kolloquium
router.use('/createKolloquium', (req, res) => {
    console.log('creating Kolloquium')
    console.log(req.body)
    let { title } = req.body
    fs.mkdir('Kolloquiums/' + title,function(err) {
        if (err && err.code === "EEXIST") {
            console.warn('Directory "' + title + '" already existed')
            return res.json({
                status: 'warning',
                message: 'Directory "' + title + '" already existed'
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
            console.log('Directory "' + title + '" created successfully!');
            return res.json({
                status: 'success',
                message: 'Directory "' + title + '" created successfully!'
            })
        }
    });
})

// Rename Kolloquium
router.use('/renameKolloquium', (req, res) => {
    console.log('renaming Kolloquium')
    console.log(req.body);
    let { oldTitle, newTitle } = req.body
    if( oldTitle == '' || newTitle == '') {
        console.error('at least one of the names was empty')
        return res.json({
            status: 'error',
            message: 'at least one of the names was empty'
        })
    }
    fs.rename('Kolloquiums/' + oldTitle, 'Kolloquiums/' + newTitle, (err) => {
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
