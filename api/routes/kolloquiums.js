const { Router } = require('express')

const router = Router()
var fs = require("fs")

function getDirectories(path) {
    return fs.readdirSync(path).filter(function (file) {
        return fs.statSync(path+'/'+file).isDirectory();
    });
}

fs.mkdir('Kolloquiums',function(err) {
    if (err.code === "EEXIST") {
        console.log('Kolloquiums Directory already existed')
    }
    else if (err.code != "EEXIST") {
        return console.error(err);
    }
    else {
        console.log("Directory created successfully!");
    }
});

// Get Kolloquiums
router.use('/getKolloquiums', (req, res) => {
    var directories = getDirectories('Kolloquiums')
    res.json({
        kolloquiums: directories
    });
})

// Delete Kolloquium
router.use('/deleteKolloquiums', (req, res) => {
    console.log(req)
    res.json({
        status: 'success'
    })
})

module.exports = router
