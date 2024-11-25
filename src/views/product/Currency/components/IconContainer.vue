<script setup lang="ts">
import type { CurrencyTypes } from "@/api/currency";
import { Edit, Star, StarFilled } from "@element-plus/icons-vue";
import Icon from "./Icon.vue";
import { inject, onBeforeMount, ref, watch } from "vue";
import {
  EditCurrencyFunction,
  editCurrencyKey,
  StarChangeFunction,
  starChangeKey
} from "../CoreModules/types";
import pinyin from "pinyin";

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
const regionItem = ref(null);
watch(
  () => props.data,
  data => {
    console.log(data, "data");

    regionItem.value = reformatRegionItem(data);
  }
);

const getKeyPinyin = key => {
  const pinyinArray = pinyin(key, {
    style: pinyin.STYLE_NORMAL // 普通风格，不带声调
  });
  return pinyinArray[0][0]; // 获取第一个拼音字符
};

function reformatRegionItem(data: CurrencyTypes[]) {
  const res = {};
  data.forEach(item => {
    if (item.organization != "") {
      if (res[item.organization]) {
        res[item.organization].push(item); // 将当前 item 添加到对应的 organization 数组中
      } else {
        res[item.organization] = [item]; // 初始化为一个包含当前 item 的数组
      }
    } else {
      if (res["未分类"]) {
        res["未分类"].push(item);
      } else {
        res["未分类"] = [item];
      }
    }
  });
  Object.keys(res).forEach(org => {
    res[org].sort((a, b) => a.id - b.id); // 假设 id 是数字类型
  });
  const sortedKeys = Object.keys(res).sort((a, b) => {
    const pinyinA = getKeyPinyin(a);
    const pinyinB = getKeyPinyin(b);

    if (pinyinA < pinyinB) {
      return -1;
    }
    if (pinyinA > pinyinB) {
      return 1;
    }
    return 0;
  });

  const sortedObj = {};
  sortedKeys.forEach(key => {
    sortedObj[key] = res[key];
  });
  return sortedObj;
}
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
onBeforeMount(() => {
  regionItem.value = reformatRegionItem(props.data);
});
</script>

<template>
  <div v-for="(region, name) in regionItem" :key="region">
    <h3 style="margin-bottom: 6px">{{ name }}</h3>
    <el-row :gutter="20">
      <el-col
        v-for="item in region"
        :key="item.id"
        :xs="12"
        :sm="12"
        :md="12"
        :lg="6"
        :xl="4"
      >
        <div class="currency-container">
          <!-- {{ item.countryIcon }} -->
          <!-- <CN class="CN" /> -->
          <div class="svg-container">
            <Icon :name="item.countryIcon" />
          </div>
          <div class="content">
            <div style="width: 120px">
              <div class="name">{{ item.currencyName }}</div>
              <el-tooltip :content="item.descriptionCn" placement="top">
                <div class="des">{{ item.descriptionCn || "-" }}</div>
              </el-tooltip>
            </div>
            <div
              style="
                width: 120px;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
              "
            >
              <el-tooltip :content="item.country" placement="top">
                <div class="country">{{ item.country }}</div>
              </el-tooltip>

              <div class="cost">{{ item.cost }}</div>
            </div>
          </div>

          <div class="edit">
            <el-button
              type="primary"
              :icon="Edit"
              circle
              @click="() => handleEdit(item)"
            />
          </div>
          <div class="star">
            <el-button circle plain @click="() => handleStar(item)">
              <template #icon>
                <el-icon v-if="!props.stars[item.id]" :size="20"
                  ><Star
                /></el-icon>
                <el-icon v-else :size="20">
                  <StarFilled color="#ffd666" />
                </el-icon>
              </template>
            </el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.currency-container {
  // height: 200px;
  // width: 200px;
  display: flex;
  // overflow-x: hidden;
  flex-direction: column;
  // align-items: left;
  margin-bottom: 20px;
  box-shadow: var(--el-box-shadow-light);
  background-color: var(--el-bg-color);
  border-radius: 10px;
  padding: 12px;
  transition: 0.2s;
  position: relative;

  &:hover {
    box-shadow: 0px 1px 5px 0px rgba(95, 95, 95, 0.3);

    .edit {
      display: block;
    }
  }

  .svg-container {
    width: 100px;
    height: 70px;
    margin-left: -5px;
    box-shadow: var(--el-box-shadow-lighter);
    // background-color: white;
  }
  .content {
    display: flex;
    justify-content: space-between;
    flex: 1;
    align-items: flex-end;
    overflow: hidden;
  }
  .country {
    width: 100px; /* 设置宽度 */
    font-size: 16px; /* 字体大小 */
    direction: ltr; /* 文本方向从右到左 */
    white-space: nowrap; /* 不换行 */
    overflow: hidden; /* 隐藏溢出内容 */
    text-overflow: ellipsis; /* 溢出文本显示省略号 */
    text-align: right; /* 右对齐文本 */
  }
  .name,
  .des {
    max-width: calc(100% - 10px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowarp;
    margin-top: 6px;
  }

  .name {
    font-size: 16px;
    font-weight: 600;
  }

  .des {
    font-size: 13px;
    white-space: nowrap;
    width: 200px;
    text-overflow: ellipsis;
  }
  .cost {
    font-size: 18px;
    font-weight: 600;
  }

  .edit {
    display: none;
    position: absolute;
    top: -10px;
    right: 25px;
  }
  .star {
    /* display: none; */
    position: absolute;
    top: -10px;
    right: -10px;
  }
}
</style>
