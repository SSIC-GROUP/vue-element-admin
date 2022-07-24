<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <div class="postInfo-container">
              <el-row>
                <el-col :span="24">
                  <el-form-item label-width="100px" label="phone" class="postInfo-container-item" prop="phone">
                    <el-input v-model="postForm.phone" />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="postInfo-container">
              <el-row>
                <el-col :span="12">
                  <el-form-item label-width="100px" label="userName" class="postInfo-container-item">
                    <el-input v-model="postForm.userName" />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="postInfo-container">
              <el-row>
                <el-col :span="24">
                  <el-form-item label-width="100px" label="pwdDefault" class="postInfo-container-item">
                    <el-switch v-model="postForm.defaultPwd" @change="switchPwd">use default</el-switch>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-row v-show="!postForm.defaultPwd">
          <el-col :span="24">
            <div class="postInfo-container">
              <el-row>
                <el-col :span="24">
                  <el-form-item label-width="100px" label="password" class="postInfo-container-item" prop="pwd">
                    <el-input v-model="postForm.pwd" type="password" />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-row v-show="!postForm.defaultPwd">
          <el-col :span="24">
            <div class="postInfo-container">
              <el-row>
                <el-col :span="24">
                  <el-form-item label-width="100px" label="confirmPwd" class="postInfo-container-item" prop="confirmPwd">
                    <el-input v-model="postForm.confirmPwd" type="password" />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button type="primary" @click="draftForm">Create</el-button>
          <el-button>Cancel</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { validPhone, validPwd } from '@/utils/validate'
import { fetchArticle } from '@/api/article'
import { searchUser } from '@/api/remote-search'

const defaultForm = {
  defaultPwd: '', // 文章题目
  phone: '', // 文章内容
  userName: '', // 文章内容
  pwd: '', // 文章摘要
  confirmPwd: '', // 文章外链
  image_uri: '', // 文章图片
  id: undefined
}

export default {
  name: 'UserDetail',
  components: { },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + ' not be null',
          type: 'error'
        })
        callback(new Error(rule.field + ' not be null'))
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        phone: [{ required: true, pattern: validPhone, message: 'please input correct phone', trigger: 'blur', validator: validateRequire }],
        pwd: [{ required: true, pattern: validPwd, message: 'please input correct password', trigger: 'blur' }],
        confirmPwd: [{ required: true, pattern: validPwd, message: 'please input correct password', trigger: 'blur' }]
      },
      tempRoute: {}
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.content_short.length
    },
    displayTime: {
      get() {
        return (+new Date(this.postForm.display_time))
      },
      set(val) {
        this.postForm.display_time = new Date(val)
      }
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      fetchArticle(id).then(response => {
        this.postForm = response.data

        // just for test
        this.postForm.title += `   Article Id:${this.postForm.id}`
        this.postForm.content_short += `   Article Id:${this.postForm.id}`

        // set tagsview title
        this.setTagsViewTitle()

        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = 'Edit User'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = 'Edit User'
      document.title = `${title} - ${this.postForm.id}`
    },
    submitForm() {
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$notify({
            title: '成功',
            message: '发布文章成功',
            type: 'success',
            duration: 2000
          })
          this.postForm.status = 'published'
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    switchPwd() {
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
    },
    draftForm() {
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      this.postForm.status = 'draft'
    },
    getRemoteUserList(query) {
      searchUser(query).then(response => {
        if (!response.data.items) return
        this.userListOptions = response.data.items.map(v => v.name)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }
}

</style>
