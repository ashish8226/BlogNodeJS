const multer=require('multer')
const path = require('path');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        console.log("in multer dest");
        let error = new Error("invalid mime type");
        if (isValid) {
            error = null;
        }
        console.log(__dirname);
        cb(error, path.join(__dirname, '../images'));
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        console.log(name);
        console.log("in multer file");
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
})
module.exports=multer({
    storage: storage
}).single("image")