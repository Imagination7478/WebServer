module.exports = (lat, lon) => {
    const regexp = /^-?\d+\.?\d+$/
    return regexp.test(lat) && regexp.test(lon)
}