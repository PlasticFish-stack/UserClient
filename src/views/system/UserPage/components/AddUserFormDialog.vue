<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { useUserTableStore } from "../CoreModules/store";
import { FieldValues, PlusColumn, PlusDialogForm } from "plus-pro-components";
import { FormRules } from "element-plus";
import { registerUser, updateUser } from "@/api/user";
import { successMes } from "@/utils/globalReqMes";

const userTableStore = useUserTableStore();

const form = ref<FieldValues>(null);

const visible = ref<boolean>(false);
const title = computed(() =>
  userTableStore.$state.state.type ? "编辑用户" : "新建用户"
);

const columns = ref<PlusColumn[]>([
  {
    label: "用户名",
    prop: "name",
    valueType: "copy",
    fieldProps: {
      disabled: userTableStore.$state.state.type
    }
  },
  {
    label: "用户昵称",
    prop: "nickname",
    valueType: "input"
  },
  {
    label: "用户密码",
    prop: "password",
    valueType: "input",
    hideInForm: userTableStore.$state.state.type,
    fieldProps: {
      type: "password",
      autocomplete: "new-password",
      disabled: userTableStore.$state.state.type
    }
  },
  {
    label: "用户头像",
    prop: "avatar",
    valueType: "img"
  },
  {
    label: "是否生效",
    prop: "status",
    valueType: "switch"
  }
]);

const rules = reactive<FormRules>({
  name: [
    {
      required: true,
      trigger: "blur",
      message: "请输入用户名称"
    }
  ],
  nickname: [
    {
      required: true,
      trigger: "blur",
      message: "请输入用户昵称"
    }
  ],
  password: [
    {
      required: true,
      trigger: "blur",
      message: "请输入用户密码"
    }
  ]
});

const handleCancel = () => {
  userTableStore.displayTarget(false);
  userTableStore.typeChange("edit");
  userTableStore.getUserPage();
};

const handleConfirm = async (values: any) => {
  const { id } = userTableStore.$state.state.rowData;
  const { id: fakeId, password, ...args } = values;
  if (userTableStore.$state.state.type) {
    const res = await updateUser({
      id,
      ...args
    });
    res.success &&
      successMes(typeof res.data === "string" ? res.data : "更新成功！");
    handleCancel();
  } else {
    const res = await registerUser({
      ...args,
      password
    });
    res.success &&
      successMes(typeof res.data === "string" ? res.data : "新增成功！");
    handleCancel();
  }
};

watch(
  () => userTableStore.$state.state.type,
  dialogType => {
    columns.value[0].fieldProps = {
      disabled: dialogType
    };
    columns.value[2].hideInForm = dialogType;
  }
);
watch(
  () => userTableStore.$state.state.userDialog,
  () => {
    visible.value = userTableStore.$state.state.userDialog;
  }
);

watch(
  () => userTableStore.$state.state.rowData,
  () => {
    const rowData = userTableStore.$state.state.rowData;
    if (rowData) {
      const { name, nickname, password, avatar, status } = rowData;
      const checkImgUrl = (avatar as string).indexOf("http") === 0;
      form.value = {
        name,
        nickname,
        password,
        avatar: checkImgUrl ? avatar : "",
        status
      };
    }
  }
);
</script>

<template>
  <PlusDialogForm
    v-model:visible="visible"
    v-model="form"
    style="border-radius: 8px"
    :form="{
      columns,
      rules,
      labelWidth: '100px',
      labelPosition: 'right'
    }"
    :dialog="{
      cancelText: '取消',
      confirmText: '确定'
    }"
    @cancel="handleCancel"
    @confirm="handleConfirm"
  >
    <template #dialog-header> {{ title }} </template>
    <template #plus-field-avatar="{ column }">
      <div class="avatar-container">
        <el-input
          v-model="column.modelValue"
          class="avatar-ipt"
          placeholder="请输入头像Url"
        />
        <div v-if="column.modelValue" class="avatar-warpper">
          <img class="user-avatar" :src="column.modelValue" alt="头像异常" />
        </div>
      </div>
    </template>
  </PlusDialogForm>
</template>

<style lang="scss" scoped>
.avatar-container {
  flex: 1;
  display: flex;
  align-items: center;

  .avatar-ipt {
    flex: 4;
  }
  .avatar-warpper {
    flex: 1;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-left: 10px;
    .user-avatar {
      width: 25px;
      height: 25px;
      border-radius: 50%;
    }
  }
}
</style>
