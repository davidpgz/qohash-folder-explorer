<template>
  <div>
    <input id="autoComplete" tabindex="1" style="width: 100%" class="focus" />
  </div>
</template>

<script>
import autoComplete from '@tarekraafat/autocomplete.js';
import folderExplorer from '../apis/folderExplorer';
import '@tarekraafat/autocomplete.js/dist/css/autoComplete.css';

export default {
    name: 'AutoComplete',
    props: {
        value: {
            type: String,
            default: ''
        }
    },

    watch: {
        value(newValue) {
            const autoCompleteElement = document.querySelector('#autoComplete');
            if (autoCompleteElement){
                autoCompleteElement.value = newValue;
            }
        }
    },

    mounted() {
        new autoComplete({
            data: {
                src: async () => {
                    const query = document.querySelector('#autoComplete').value;
                    return await folderExplorer.getDirectoryChildDirectories({search: query});
                },
                cache: false
            },
            trigger: ['input', 'click'],
            sort: (a, b) => {
                if (a.match < b.match) return -1;
                if (a.match > b.match) return 1;
                return 0;
            },
            placeHolder: 'Type a directory path (ie: /usr/src/)...',
            selector: '#autoComplete',
            threshold: 0,
            debounce: 50,
            searchEngine: 'loose',
            resultsList: {
                render: true,
            },
            maxResults: 12,
            highlight: true,
            noResults: () => {
                const result = document.createElement('li');
                result.setAttribute('class', 'no_result');
                result.setAttribute('tabindex', '1');
                result.innerHTML = 'No Results';
                document.querySelector('#autoComplete_list').appendChild(result);
            },
            onSelection: feedback => {
                const selection=feedback.selection.value;
                document.querySelector('#autoComplete').value = selection;
                this.$emit('input', selection);
            }
        });
        document.querySelector('#autoComplete').value = this.value;
    },
};
</script>

<style>
#autoComplete {
  background-position: left 1.05rem center;
  height: 3rem;
  color: black;
  caret-color: #007bff;
  border-color: black;
  background-size: 1.5rem;
  background-image: url("../assets/search.svg");
}
#autoComplete:focus::selection {
  background-color: #007bff;
}
#autoComplete:focus,
#autoComplete:hover {
  background-position: left 1.05rem center;
  color: black;
  border-color: black;
  background-size: 1.8rem;
  background-image: url("../assets/search.svg");
}
#autoComplete:focus {
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 20px 5px;
}

#autoComplete_list {
  width: 100%;
  max-width: 1100px;
}
.autoComplete_result {
  border: 0;
  border-top: 0.05rem solid #e3e3e3;
  border-left: 0.05rem solid #e3e3e3;
  border-right: 0.05rem solid #e3e3e3;
  max-width: none;
  margin: 0 auto;
}
.autoComplete_result:last-child {
  border-bottom: 0.05rem solid #e3e3e3;
}
.autoComplete_result:hover {
  background-color: gainsboro;
  border: 0;
  border-top: 0.05rem solid #e3e3e3;
  border-left: 0.05rem solid #e3e3e3;
  border-right: 0.05rem solid #e3e3e3;
}
.autoComplete_result:focus {
  border: 0;
  border-left: 2px solid #e3e3e3;
  border-right: 2px solid #e3e3e3;
  background-color: gainsboro;
}
.autoComplete_selected {
  background-color: gainsboro;
}
.autoComplete_result:last-child:hover {
  border-bottom: 0.05rem solid #e3e3e3;
}
.autoComplete_highlighted {
  color: black;
}
</style>