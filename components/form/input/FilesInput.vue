<template>
  <div>
    <div>
      <div class="file_input_costume d-flex flex-wrap position-relative">
        <template v-if="previews.length > 0">
          <div
            class="file__preview me-3 mb-3"
            v-for="(preview, i) in previews"
            :key="i"
          >
            <el-image :src="preview.url" fit="cover" />
            <div class="file_control">
              <i
                class="el-icon-delete"
                @click="$emit('delete-file-preview', i)"
              ></i>
            </div>
          </div>
        </template>

        <el-card shadow class="file_input">
          <b-form-file
            id="images"
            placeholder="Choose a file or drop it here..."
            drop-placeholder="Drop file here..."
            accept=".jpg, .png, .jpeg"
            @change="$emit('change', $event)"
            :multiple="true"
          ></b-form-file>
          <i class="el-icon-plus"></i>
        </el-card>
      </div>
    </div>

    <section class="file_input_costume">
      <div v-if="(images && images.length > 0) || trashImage.length > 0">
        <div class="line"></div>
        <strong>Images actuelle : </strong>
        <div class="d-flex flex-wrap position-relative">
          <div
            class="file__preview me-3 mb-3"
            v-for="(image, i) in images"
            :key="i"
          >
            <el-image :src="image.url" fit="cover" />
            <div class="file_control">
              <i
                class="el-icon-delete"
                @click="$emit('delete-current-file', image)"
              ></i>
            </div>
          </div>
        </div>

        <el-button
          v-if="trashImage.length > 0"
          type="danger"
          @click="$emit('restore-images')"
          icon="el-icon-refresh-left"
        >
          Restaurer</el-button
        >
      </div>
    </section>
  </div>
</template>
<script>
export default {
  props: {
    previews: {
      type: Array,
      required: true,
    },
    images: {
      type: Array,
      required: false,
      default: null,
    },
    trashImage: {
      required: false,
      default: () => {
        return []
      },
    },
  },
}
</script>
<style lang="scss" scoped>
.file_input_costume {
  .file_input {
    position: relative;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    width: 100px;
    height: 100px;

    .el-card__body {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    i {
      font-size: 24px;
    }

    input,
    label {
      position: absolute;
      cursor: pointer;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 100%;
      z-index: 10;
      opacity: 0;
    }
  }

  .file__preview {
    width: 100px;
    height: 100px;
    position: relative;
    border-radius: 6px;

    .el-image {
      height: 100%;
      width: 100%;
    }

    img {
      width: 100%;
      height: 100%;
      border-radius: 6px;
      object-fit: cover;
    }

    .file_control {
      display: flex;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 6px;
      align-items: center;
      justify-content: center;

      i {
        display: none;
        font-size: 18px;
        cursor: pointer;
        color: white;
      }

      &:hover {
        background: rgba(0, 0, 0, 0.5);

        i {
          display: block;
        }
      }
    }
  }
}
</style>
