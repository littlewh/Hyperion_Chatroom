<!-- 通讯录模块-->

<template>
  <a-collapse>
    <a-collapse-panel key="contact" header="联系人" v-if="visibleList.contact">

    </a-collapse-panel>
    <a-collapse-panel key="group" header="群组" v-if="visibleList.group">

    </a-collapse-panel>
  </a-collapse>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class Contact extends Vue {

  @Prop({
    type: Object,
    default: () => ({
      contact: true,
      group: true,
    }),
  })
  visibleList: Object;

}
</script>

