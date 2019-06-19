<template>
  <div id="pageTable">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12>
          <v-card>
            <v-toolbar card color="white">
              <v-flex xs2>
                <v-select
                  prepend-icon="search"
                  :items="headers"
                  v-model="search_field"
                  label="Select"
                  item-text="text"
                  item-value="value"
                  single-line
                ></v-select>
              </v-flex>
              <v-text-field
                flat
                solo
                placeholder="Type something"
                v-model="search"
                hide-details
                class="hidden-sm-and-down"
              ></v-text-field>

              <v-btn color="primary" dark class="mb-2" v-on:click="newPage()">New Item</v-btn>
            </v-toolbar>
            <v-divider></v-divider>
            <v-card-text class="pa-0">
              <v-data-table
                :headers="headers"
                :items="rows"
                :pagination.sync="pagination"
                :total-items="pagination.totalItems"
                hide-actions
                :loading="loading"
              >
                <template v-slot:items="props">
                  <template v-for="(val,index) in headers" class="clickable-row">
                    <template v-if="val.text  === 'Actions'">
                      <td class="justify-center">
                        <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                        <v-icon small @click="deleteItem(props.item)">delete</v-icon>
                      </td>
                    </template>
                    <template v-else>
                      <td>
                        <a
                          :style="{ cursor: 'pointer'}"
                          @click="goDetail(props.item,val,index)"
                        >{{props.item[val.value]}}</a>
                      </td>
                    </template>
                  </template>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
      <div class="text-xs-center">
        <v-pagination v-model="pagination.page" :length="pages" :total-visible="10" @input="goto"></v-pagination>
      </div>
    </v-container>
  </div>
</template>

<script>
import CrudApi from "@/api/crud.api";
import Consts from "@/config/consts";
const _ = require("lodash");
const { CRUD } = Consts.API;

export default {
  data: () => {
    return {
      dialog: false,
      pagination: { rowsPerPage: 10, totalPage: 1, page: 1 },

      search_field: "",
      search: "",
      loading: false,
      headers: [],
      rows: []
    };
  },

  computed: {
    pages() {
      if (
        this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      ) {
        console.log("pages" ,this.pagination);
        return 10;
      }

      return Math.ceil(
        this.pagination.totalItems / this.pagination.rowsPerPage
      );
    },
    objInfo() {
      return this.$store.getters["crud/objInfo"]();
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    $route(to, from) {
      if (
        to.name === from.name &&
        (to.params && to.params.objNm !== this.objNm)
      ) {
        this.initialize();
      }
    },
    objInfo(objInfo, b) {
      console.log("watch objInfo", objInfo);
      // this.objInfo = objInfo;
      this.makeHeader(objInfo);
    }
  },
  beforeCreate: () => {},

  created() {
    console.log("Created...");
    console.log("table params", this.$route.params);
    this.initialize();
  },

  methods: {
    newPage() {
      this.$router.push({
        name: "components/new",
        params: {
          objNm: this.objNm
        }
      });
    },
    goDetail(row, col, col_index) {
      this.$router.push({
        name: "components/detail",
        params: {
          objNm: this.objNm,
          objKey: row[this.objInfo.keys[0]]
        }
      });
      console.log("detail..... ", col_index, row);
    },

    _makeHeader(fields) {
      console.log("make Header...");
      let headers = [];
      headers = _.filter(fields, item => {
        if (item.hide || item.detail) return;
        return item;
      });
      // headers.push({ text: "Actions", value: "name", sortable: false });
      this.headers = headers;
      this.search_field = headers.length > 0 ? headers[0].value : "";
    },
    /**
     * header
     */
    makeHeader(info) {
      if (info) {
        return this._makeHeader(info.fields);
      }
    },
    /**
     * new ,edit form...
     */
    makeInput() {},

    makeTable() {
      let info = this.$store.getters["crud/objInfo"]();
      this.makeHeader(info);
      CrudApi[CRUD.COUNT]({ objNm: this.objNm }).then(result => {
        this.pagination.totalItems = result.data.count;
      });
      CrudApi[CRUD.LIST]({ objNm: this.objNm }).then(data => {
        this.rows = data.data;
      });
    },
    initialize() {
      this.objNm = this.$route.params.objNm;
      this.pagination.page = this.$route.params.page
        ? Number(this.$route.params.page)
        : 1;
      // this.headers = [];
      
      this.rows = [];
      this.$store.dispatch("crud/objInfo", this.objNm);
      console.log(this.pagination);
      this.makeTable();

      this.goto(this.pagination.page);
    },

    goto(page) {
      this.$route.params.page = page;
      this.$router.push({
        name: "components/tables",
        params: this.$route.params
      });
      this.$route.params.page = page;
      if (this.loading) return;
      this.pagination.page = page;
      this.loading = true;
      

      CrudApi[CRUD.LIST]({
        objNm: this.objNm,
        perpage: this.pagination.rowsPerPage,
        page: page - 1
      })
        .then(data => {
          this.pagination.page = page;
          this.currentPage = page;
          this.rows = data.data;
          this.loading = false;
        })
        .catch(e => {
          this.pop(e.message, "error");
          this.loading = false;
        });
    },
    /**
     * TODO
     */
    pop(message, title) {
      alert(message);
    },
    editItem(item) {
      // this.editedIndex = this.desserts.indexOf(item);
      // this.editedItem = Object.assign({}, item);
      // this.dialog = true;
    },

    deleteItem(item) {
      // const index = this.desserts.indexOf(item);
      // confirm("Are you sure you want to delete this item?") &&
      //   this.desserts.splice(index, 1);
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        this.desserts.push(this.editedItem);
      }
      this.close();
    }
  }
};
</script>
