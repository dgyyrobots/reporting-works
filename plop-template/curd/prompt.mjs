<<<<<<< HEAD
const notEmpty = (name) => {
  return (v) => {
    if (!v || v.trim === '') return `${name}为必填项`
    else return true
  }
}

export default {
  description: '创建curd',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: '请输入view名称，然后点击回车',
      validate: notEmpty('name'),
    },
  ],
  actions: () => {
    ///const pathCaseName = '{{ pathCase name }}'
    const properCaseName = '{{ properCase name }}'
    const camelCaseName = '{{ camelCase name }}'
    return [
      {
        type: 'add',
        path: `src/views/goods/${properCaseName}.vue`,
        templateFile: './plop-template/curd/index.hbs',
      },
      {
        type: 'add',
        path: `src/views/goods/vabAutoComponents/${properCaseName}Edit.vue`,
        templateFile: './plop-template/curd/edit.hbs',
      },
      {
        type: 'add',
        path: `mock/controller/${camelCaseName}.ts`,
        templateFile: './plop-template/curd/mock.hbs',
      },
      {
        type: 'add',
        path: `src/api/${camelCaseName}.ts`,
        templateFile: './plop-template/curd/api.hbs',
      },
    ]
  },
}
=======
const notEmpty = (name) => {
  return (v) => {
    if (!v || v.trim === '') return `${name}为必填项`
    else return true
  }
}

export default {
  description: '创建curd',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: '请输入view名称，然后点击回车',
      validate: notEmpty('name'),
    },
  ],
  actions: () => {
    ///const pathCaseName = '{{ pathCase name }}'
    const properCaseName = '{{ properCase name }}'
    const camelCaseName = '{{ camelCase name }}'
    return [
      {
        type: 'add',
        path: `src/views/goods/${properCaseName}.vue`,
        templateFile: './plop-template/curd/index.hbs',
      },
      {
        type: 'add',
        path: `src/views/goods/vabAutoComponents/${properCaseName}Edit.vue`,
        templateFile: './plop-template/curd/edit.hbs',
      },
      {
        type: 'add',
        path: `mock/controller/${camelCaseName}.ts`,
        templateFile: './plop-template/curd/mock.hbs',
      },
      {
        type: 'add',
        path: `src/api/${camelCaseName}.ts`,
        templateFile: './plop-template/curd/api.hbs',
      },
    ]
  },
}
>>>>>>> c9b2a8adc967d14a9f2577414c8fcccde1704016
