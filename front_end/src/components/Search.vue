<!-- 搜索框-->
<template>
  <div class="search">
    <div class="search-select">
      <a-select
        show-search
        size="small"
        placeholder="搜索聊天组"
        :default-active-first-option="false"
        :show-arrow="false"
        :filter-option="false"
        :not-found-content="null"
      >
        <a-icon slot="suffixIcon" type="search" />
      </a-select>

      <!-- ➕ 下拉菜单-->
      <a-dropdown class="search-dropdown">
        <a-icon type="plus-square" class="search-dropdown-button" />
      <!--        悬浮触发-->
        <a-menu slot="overlay">
          <a-menu-item>
            <div @click="() => (visibleAddGroup = !visibleAddGroup)">创建群</div>
          </a-menu-item>
          <a-menu-item>
            <div @click="() => (visibleJoinGroup = !visibleJoinGroup)">加入群</div>
          </a-menu-item>
          <a-menu-item>
            <div @click="() => (visibleAddFriend = !visibleAddFriend)">添加好友</div>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>

    <!--    modal模态弹框-->
    <a-modal v-model="visibleAddGroup" footer="" title="创建群聊">
      <div style="display: flex">
        <a-input v-model="groupName" placeholder="请输入群名字"></a-input>
        <a-button :loadig="loading" type="primary">确定</a-button>
      </div>
    </a-modal>
    <a-modal v-model="visibleJoinGroup" footer="" title="加入群组">
      <div style="display: flex" v-if="visibleJoinGroup">
        <a-select
          show-search
          placeholder="请输入群名字"
          style="width: 90%"
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          :not-found-content="null"
        >
        </a-select>
        <a-button  type="primary" :loading="loading">加入群</a-button>
      </div>
    </a-modal>
    <a-modal v-model="visibleAddFriend" footer="" title="添加好友">
      <div style="display: flex" v-if="visibleAddFriend">
        <a-select
          show-search
          placeholder="请输入用户名"
          style="width: 90%"
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          :not-found-content="null"
        >
        </a-select>
        <a-button type="primary" :loading="loading">添加好友</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

const chatModule = namespace('chat');
const appModule = namespace('app');

@Component
export default class Search extends Vue {

  visibleAddGroup: boolean = false;

  visibleJoinGroup: boolean = false;

  visibleAddFriend: boolean = false;

  groupName: string = '';

  groupId: string = '';

}
</script>
<style lang="scss" scoped>
@import '@/styles/theme';

.search {
  background: $room-bg-color;
  position: relative;
  height: 60px;
  padding: 10px;
  display: flex;
  align-items: center;
  .search-select {
    width: 80%;
    .ant-select {
      width: 100%;
    }
  }
  .search-dropdown {
    position: absolute;
    right: 15px;
    top: 13px;
    font-size: 20px;
    padding: 0;
    cursor: pointer;
    line-height: 40px;
    color: gray;
    transition: 0.2s all linear;
    border-radius: 4px;
    &:hover {
      color: $primary-color;
    }
  }
}
</style>
