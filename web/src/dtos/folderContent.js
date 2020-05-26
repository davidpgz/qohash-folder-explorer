export default class FolderContent {
    /**
     * 
     * @param {Object} content
     * @param {Number} content.totalSize
     * @param {Boolean} content.hasPartialSize
     * @param {FolderEntry[]} content.entries
     */
    constructor({totalSize, hasPartialSize, entries }){
        this.totalSize = totalSize;
        this.hasPartialSize = hasPartialSize;
        this.entries = entries;
    }
}