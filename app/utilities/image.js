async function validateImage(data) {
    const contentType = await FileType.fromBuffer(data.img); // get the mimetype of the buffer (in this case its gonna be jpg but can be png or w/e)
    res.type(contentType.mime); // not always needed most modern browsers including chrome will understand it is an img without this
    res.end(img.img);
}

module.exports = { validateImage }