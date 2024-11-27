export const resetReactiveState = (reactiveState, initialState) => {
  Object.keys(reactiveState).forEach(key => {
    if (initialState.hasOwnProperty(key)) {
      reactiveState[key] = initialState[key];
    }
  });
};

export const getKeyParams = (data, keys: string[] = []) => {
  return Object.keys(data).reduce((pre, key) => {
    return keys.includes(key)
      ? {
          ...pre,
          [key]: data[key]
        }
      : pre;
  }, {});
};

/**
 * 初始化处理 产品类别、品牌基础数据
 */
// 递归读取名称
export const recursionCategory = list => {
  return list.reduce((pre, cur) => {
    pre = {
      ...pre,
      [cur.id]: cur
    };
    if (cur.children) {
      return {
        ...pre,
        ...recursionCategory(cur.children)
      };
    }
    return pre;
  }, {});
};
export const recursionCategoryAddOptions = list => {
  return list.reduce((pre, cur) => {
    pre = [
      ...pre,
      {
        ...cur,
        label: cur.name,
        value: cur.id,
        children: recursionCategoryAddOptions(cur.children || [])
      }
    ];
    return pre;
  }, []);
};

// 递归抽取数组同一项
export const recursionAryData = (data: any[]) => {
  try {
    const keys = Object.keys(data[0]).reduce((pre, key) => {
      return {
        ...pre,
        [key]: []
      };
    }, {});

    for (let i = 0; i < data.length; i++) {
      const item = data[i];

      Object.keys(item).forEach(k => {
        if (item[k]) {
          keys[k].push(item[k]);
        }
      });
    }

    return keys;
  } catch (e) {
    return {};
  }
};
