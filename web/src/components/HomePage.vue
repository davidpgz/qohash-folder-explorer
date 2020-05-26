<template>
  <b-container>
    <AutoComplete v-model="selectedFolder" />
    <div class="p-4 h4">
      <p>Total folder size: {{totalFolderSize}}</p>
      <p>Total folder entries: {{totalFolderEntries}}</p>
    </div>

    <b-pagination v-model="currentPage" :total-rows="folderEntries.length" :per-page="perPage"></b-pagination>
    <b-table
      hover
      :items="folderEntries"
      :fields="fields"
      :busy="loading"
      :per-page="perPage"
      :current-page="currentPage"
    >
      <template v-slot:cell(type)="data">
        <b-icon :icon="getIconEntryType(data.item)"></b-icon>
      </template>
      <template v-slot:cell(size)="data">{{getFormattedEntrySize(data.item)}}</template>
      <template v-slot:table-busy>
        <div class="text-center text-primary my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Loading...</strong>
        </div>
      </template>
    </b-table>
  </b-container>
</template>

<script>
import AutoComplete from './AutoComplete';
import folderBrowsing from '../apis/folderBrowsing';

export default {
    name: 'HomePage',
    components: {
        AutoComplete
    },

    props: {
        folder: {
            type: String,
            default: ''
        },
        page: {
            type: Number,
            default: 1
        }
    },

    data: () => ({
        loading: false,
        folderNames: [],
        folderContent: null,
        perPage: 50,
    }),

    mounted() {
        this.requestFolderContent();
    },

    watch: {
        folder() {
            this.requestFolderContent();
        }
    },

    computed: {
        currentPage: {
            get() {
                return this.page;
            },
            set(value) {
                if (value != this.page) {
                    this.$router.push({ name: 'search', params: { folder: this.selectedFolder, page: value } });
                }
            }
        },
        selectedFolder: {
            get() {
                return this.folder;
            },
            set(value) {
                if (value != this.folder) {
                    this.$router.push({ name: 'search', params: { folder: value, page: this.currentPage } });
                }
            }
        },

        folderEntries() {
            return this.folderContent != null ? this.folderContent.entries : [];
        },
        fields() {
            return ['type', 'size', 'lastModifiedDate', 'name'];
        },
        totalFolderSize() {
            if (this.folderContent != null){
                const formattedSize = this.getFormattedSize(this.folderContent.totalSize);
                return this.folderContent.hasPartialSize ? `>${formattedSize}` : formattedSize;
            }
            return 0;
        },
        totalFolderEntries() {
            return this.getFormattedSize(this.folderEntries.length);
        }
    },

    methods: {
        onSearchChange(search) {
            folderBrowsing
                .requestFolderContent({ search, maximumEntryCount: 10 })
                .then((result) => (this.folderNames = result));
        },
        requestFolderContent() {
            this.loading = true;

            folderBrowsing
                .getFolderContent({ path: this.selectedFolder })
                .then((folderContent) => this.folderContent = folderContent)
                .finally(() => this.loading = false);
        },
        onSelection(value) {
            this.selectedFolder = value;
        },
        getIconEntryType(entry) {
            return entry.isDirectory && entry.isSymbolicLink 
                ? 'folder-symlink' 
                : entry.isDirectory 
                    ? 'folder' 
                    : 'file-text';
        },
        getFormattedEntrySize(entry) {
            if (entry.size != null) {
                const formattedSize = this.getFormattedSize(entry.size);
                return entry.hasPartialSize ? `>${formattedSize}` : formattedSize;
            }
            return entry.size;
        },
        getFormattedSize(size) {
            const kilo = 1000;
            const mega = 1000000;
            const giga = 1000000000;

            if (size < kilo) {
                return size;
            }
            if (size < mega) {
                return `${(size / kilo).toFixed(1)}k`;
            }
            if (size < giga) {
                return `${(size / mega).toFixed(1)}M`;
            }
            return `${(size / giga).toFixed(1)}G`;
        }
    },
};
</script>

<style scoped>
.flex-column {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.flex-column > * {
  align-self: center;
  margin-block-end: 1rem;
}
</style>