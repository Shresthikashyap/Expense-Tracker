const DownloadedFile = require('../models/downloadedFile')

const getAllFiles = async (req, res, next) => {
    try {
        
        if (req.user.isPremium) {
            const allDownloads= await DownloadedFile.findAll({where:{userId:req.user.id}});
            const urls = allDownloads.map(download => download.url);
            console.log("all downloads====>>>",urls);

            res.status(200).json(urls);
        }
    }
    catch (err) {
    }
}

module.exports = {
    getAllFiles
}