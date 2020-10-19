const STATUS_OK = 200;
const HEADER_LAST_MODIFIED = 'Last-Modified';
const HEADER_IF_MODIFIED_SINCE = 'If-Modified-Since';
const STATUS_NOT_MODIFIED = 304;

function handleIfModifiedSince(req,res,lastModified) {
    if(req.get(HEADER_IF_MODIFIED_SINCE)) {
        if(req.get(HEADER_IF_MODIFIED_SINCE) === lastModified) {
            res.sendStatus(STATUS_NOT_MODIFIED);
            let err=new Error();
            err.status = STATUS_NOT_MODIFIED;
            throw err;
        }
    }
}

module.exports = {
    STATUS_OK : STATUS_OK,
    HEADER_LAST_MODIFIED : HEADER_LAST_MODIFIED,
    HEADER_IF_MODIFIED_SINCE : HEADER_IF_MODIFIED_SINCE,
    STATUS_NOT_MODIFIED : STATUS_NOT_MODIFIED,
    handleIfModifiedSince : handleIfModifiedSince
}