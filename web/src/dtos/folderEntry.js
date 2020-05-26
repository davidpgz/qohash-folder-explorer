export default class FolderEntry {
    /**
     * @param {Object} entry
     * @param {String} entry.name
     * @param {Boolean} entry.isDirectory
     * @param {Boolean} entry.isSymbolicLink
     * @param {Number} entry.size
     * @param {Boolean} entry.hasPartialSize
     * @param {Date} entry.lastModifiedDate
     */
    constructor({name, isDirectory, isSymbolicLink, size, hasPartialSize, lastModifiedDate})
    {
        this.name = name;
        this.isDirectory = isDirectory;
        this.isSymbolicLink = isSymbolicLink;
        this.size = size;
        this.hasPartialSize = hasPartialSize;
        this.lastModifiedDate = lastModifiedDate;
    }
}