<script setup lang="ts">
import type { CurrencyTypes } from "@/api/currency";
import { Edit, Star, StarFilled } from "@element-plus/icons-vue";
import Icon from "./Icon.vue";
import { inject } from "vue";
import {
  EditCurrencyFunction,
  editCurrencyKey,
  StarChangeFunction,
  starChangeKey
} from "../CoreModules/types";

type Props = {
  data: CurrencyTypes[];
  stars: {
    [key: string]: boolean;
  };
};

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  stars: () => ({})
});

const editCurrency = inject(editCurrencyKey) as
  | EditCurrencyFunction
  | undefined;
const starChange = inject(starChangeKey) as StarChangeFunction | undefined;

const handleEdit = row => {
  editCurrency && editCurrency(row);
};

const handleStar = row => {
  starChange && starChange(row);
};
</script>

<template>
  <el-row :gutter="20">
    <el-col
      v-for="item in props.data"
      :key="item.id"
      :span="3"
      :xs="8"
      :sm="6"
      :md="4"
      :lg="3"
      :xl="2"
    >
      <div class="currency-container">
        <!-- {{ item.countryIcon }} -->
        <!-- <CN class="CN" /> -->
        <div class="svg-container">
          <Icon :name="item.countryIcon" />
        </div>

        <div class="name">{{ item.currencyName }}</div>
        <div class="des">{{ item.descriptionCn || "-" }}</div>

        <div class="edit">
          <el-button
            type="primary"
            :icon="Edit"
            circle
            @click="() => handleEdit(item)"
          />
        </div>
        <div class="star">
          <el-button circle type="info" @click="() => handleStar(item)">
            <template #icon>
              <el-icon v-if="!props.stars[item.id]" :size="20"
                ><Star
              /></el-icon>
              <el-icon v-else :size="20"><StarFilled color="yellow" /></el-icon>
            </template>
          </el-button>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.currency-container {
  height: 175px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  border: 2px solid rgba(204, 204, 204, 0.8);
  border-radius: 10px;
  padding: 20px;
  transition: 0.2s;
  position: relative;

  &:hover {
    box-shadow: 0px 7px 30px 0px rgba(100, 100, 111, 0.4);

    .edit {
      display: block;
    }
  }

  .svg-container {
    width: 100px;
    height: 70px;
  }

  .name,
  .des {
    max-width: calc(100% - 10px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowarp;
    margin-top: 10px;
  }

  .name {
    font-size: 16px;
    color: #0d0d0d;
  }

  .des {
    font-size: 14px;
    color: #2f2c2c;
  }

  .edit {
    display: none;
    position: absolute;
    top: -10px;
    right: -10px;
  }
  .star {
    /* display: none; */
    position: absolute;
    top: 5px;
    left: 5px;
  }
}
</style>
