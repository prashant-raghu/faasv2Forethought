const jimp = require('jimp');
const path = require('path');

exports.minify = (req, res, next) => {
    try {
        const promises = [];
        for (let i = 0; i < req.dir.length; i++) {
            const file = req.dir[i];
            if (file.type.split('/')[0] === 'image') {
                req.dir[i].min = file.name + '.min.jpg';
                const p = () => {
                    return _jimp(file);
                };
                promises.push(p());
            }
        }
        Promise.all(promises)
            .then(() => next())
            .catch((err) => {
                console.error(err);
                next()
            });
    } catch (e) {
        console.error(e);
        next();
    }
};

async function _jimp(file) {
    const img = await jimp.read(path.join(__dirname, '../uploads', file.fullName));
    return img
        // .scaleToFit(256, 256)
        .quality(10)
        .write(path.join(__dirname, '../uploads', file.name + '.min.jpg'));
}
