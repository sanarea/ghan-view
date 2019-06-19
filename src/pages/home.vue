<!--
Home Vue.
-->
<template>
  <div id="pageDashboard">
    <v-container fluid grid-list-xl>
      <v-layout row wrap>
        <!-- mini statistic start -->
        <v-flex lg3 sm6 xs12>
          <mini-statistic icon="fa fa-cube" title="100+" sub-title="Block" color="light-blue"></mini-statistic>
        </v-flex>
        <v-flex lg3 sm6 xs12>
          <mini-statistic icon="fa fa-random" title="100+" sub-title="Tx" color="light-blue"></mini-statistic>
        </v-flex>
        <!-- <v-flex lg3 sm6 xs12>
        <mini-statistic icon="fa fa-address-book" title="100+" sub-title="Address" color="light-blue"></mini-statistic>
        </v-flex>-->
        <v-flex lg3 sm6 xs12>
          <mini-statistic icon="fa fa-download" title="100+" sub-title="Income" color="light-blue"></mini-statistic>
        </v-flex>
        <v-flex lg3 sm6 xs12>
          <mini-statistic icon="fa fa-upload" title="100+" sub-title="Outcome" color="light-blue"></mini-statistic>
        </v-flex>
      </v-layout>
      <v-layout>
        <!--  status text -->
        <v-flex lg12 sm12>
          <v-card>
            <v-card-title class="pb-0">
              <h4>Status</h4>
            </v-card-title>
            <v-card-text>{{cardText}}</v-card-text>
            <v-card-actions>
              <v-btn flat small>Link</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout>
        <!-- -->
        <v-flex lg7 sm12 xs12>
          <plain-table-siro></plain-table-siro>
        </v-flex>
        <v-flex lg5 sm12 xs12>
          <plain-table-siro></plain-table-siro>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import MiniStatistic from "@/components/widgets/statistic/MiniStatistic";
import Material from "vuetify/es5/util/colors";

import PlainTableSiro from "@/components/widgets/list/PlainTableSiro";
export default {
  components: {
    MiniStatistic,
    PlainTableSiro
  },
  data() {
    return {
      cardText: ""
    };
  }
};
</script>
