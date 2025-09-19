const multer = require("multer");
const path = require("path");
const fs = require("fs");

function createUploader(type, fieldName) {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const dir = path.join(__dirname, `../uploads/${type}`);

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            cb(null, dir);
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);

            if (type === "profiles") {
                cb(null, `${req.user.id}${ext}`);
            } else if (type === "projects") {
                cb(null, `$project_${req.params.project_id}_${Date.now()}${ext}`);
            } else {
                cb(null, `${Date.now()}${ext}`);
            }
        },
    });

    if (type === "projects") {
        return multer({ storage }).array(fieldName, 3);
    }

    return multer({ storage }).single(fieldName);
}

module.exports = { createUploader };
