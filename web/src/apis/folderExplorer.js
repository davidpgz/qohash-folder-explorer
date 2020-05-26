import Axios from 'axios';
import FolderContent from '../dtos/folderContent';

export default {
    /**
     * 
     * @param {Object} request
     * @param {String} request.search
     * @returns {Promise<String[]>} - Directories within the requested path directory.
     */
    getDirectoryChildDirectories({ search }) {
        return Axios.get(`/search/?path=${search}`, {baseURL: 'http://localhost:3000/'})
            .then((response) => response.data.directories)
            .catch(error => console.log(error));
    },
    /**
     * 
     * @param {Object} request 
     * @param {String} request.path
     * @return {Promise<FolderContent>}
     */
    getDirectoryContent({ path }) {
        return Axios.get(`/?path=${path}`, {baseURL: 'http://localhost:3000/'})
            .then((response) => new FolderContent(response.data))
            .catch(error => console.log(error));
    },
};
