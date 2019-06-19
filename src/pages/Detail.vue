<template>
  <div id="pageTable">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg12>
          <v-card>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex
                    xs12
                    sm12
                    md12
                    v-for="(item,index) in objInfo.fields"
                    v-bind:key="index"
                    :class="item.class"
                  >
                    <template v-if="!item.hide">
                      <template v-if="$route.meta.detail=='view' || item.readonly">
                        <v-textarea
                          v-if="item.type=='textarea' || item.type=='json'"
                          v-model="editedItem[item.value]"
                          :label="item.text"
                          readonly
                        ></v-textarea>
                        <v-text-field
                          v-else
                          v-model="editedItem[item.value]"
                          :label="item.text"
                          readonly
                        ></v-text-field>
                      </template>
                      <template v-else>
                        <v-textarea
                           v-if="item.type=='textarea' || item.type=='json'"
                          v-model="editedItem[item.value]"
                          :label="item.text"
                        ></v-textarea>
                        <v-text-field v-else v-model="editedItem[item.value]" :label="item.text"></v-text-field>
                      </template>
                    </template>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>

            <v-card-actions v-if="$route.meta.detail=='edit'">
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="close">Go Back</v-btn>
              <v-btn
                v-if="!(objInfo.deny&&objInfo.deny.edit) "
                color="blue darken-1"
                flat
                @click="close"
              >Cancel</v-btn>
              <v-btn
                v-if="!(objInfo.deny&&objInfo.deny.edit) "
                color="blue darken-1"
                flat
                @click="save"
              >Save</v-btn>
            </v-card-actions>
            <v-card-actions v-if="$route.meta.detail=='new'">
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="close">Go Back</v-btn>
              <v-btn
                v-if="!(objInfo.deny&&objInfo.deny.new) "
                color="blue darken-1"
                flat
                @click="close"
              >Cancel</v-btn>
              <v-btn
                v-if="!(objInfo.deny&&objInfo.deny.new) "
                color="blue darken-1"
                flat
                @click="save"
              >Save</v-btn>
            </v-card-actions>
            <v-card-actions v-if="$route.meta.detail=='view'">
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="close">Go Back</v-btn>
              <v-btn
                v-if="!(objInfo.deny&&objInfo.deny.edit) "
                color="blue darken-1"
                flat
                @click="edit"
              >Edit</v-btn>
              <v-btn
                v-if="!(objInfo.deny&&objInfo.deny.delete) "
                color="blue darken-1"
                flat
                @click="remove"
              >Delete</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import CrudApi from "@/api/crud.api";
import Consts from "@/config/consts";
const { CRUD } = Consts.API;
import Util from "@/util";

const _ = require("lodash");

export default {
  data: () => {
    return {
      title: "",
      loading: false,
      loadingMsg: "Processing",
      headers: [],
      rows: []
    };
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    editedItem() {
      return this.$store.getters["crud/objDetail"]();
    },
    objInfo() {
      return this.$store.getters["crud/objInfo"]();
    }
  },

  watch: {},
  beforeCreate: () => {},

  created() {
    this.objNm = this.$route.params.objNm;
    this.key = this.$route.params.objKey;
    {
      this.$store.dispatch("crud/objInfo", this.objNm);

      if (this.$route.meta.detail == "new") {
        this.$store.dispatch("crud/newObj", this.objNm);
      } else {
        this.$store.dispatch("crud/selectOne", {
          objNm: this.objNm,
          keys: { uid: this.key }
        });
      }
    }
    this.initialize();
  },

  methods: {
    /**
     * header
     */
    makeHeader() {},
    /**
     * new ,edit form...
     */
    makeInput() {
      // let info = this.$store.info[this.objNm];
      // this.info = info;
      // this.editedItem = {};
      // let detailObj = this.$store.detailObj;
      // _.each(info.fields, item => {
      //   if (this.$route.meta.detail == "new")
      //     this.editedItem[item.value] = undefined;
      //   else this.editedItem[item.value] = detailObj[item.value];
      // });
    },

    initialize() {
      this.makeInput();
    },
    remove() {},
    edit() {
      // loader.hide();
      this.$router.push({
        name: "components/edit",
        params: this.$route.params
      });
    },
    close() {
      this.$router.go(-1);
    },

    save() {
      let loader = Util.blockUi();
      let sendObj = {
        obj: this.editedItem,
        objNm: this.objNm,
        keys: { uid: this.key }
      };
      if (this.$route.meta.detail == "new") {
        CrudApi[CRUD.CREATE](sendObj).then(result => {
          console.log("result", result);
          loader.hide();
        });
      } else {
        CrudApi[CRUD.UPDATE](sendObj).then(result => {
          console.log("result", result);
          loader.hide();
        });
      }
    }
  }
};
</script>
