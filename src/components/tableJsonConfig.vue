<template>
  <div class="json-editor">
    <label>
      <textarea ref="textarea" />
    </label>
  </div>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/rubyblue.css'
// eslint-disable-next-line import/no-webpack-loader-syntax
require('script-loader!jsonlint')
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/lint/json-lint'

export default {
  name: 'JsonEditor',
  /* eslint-disable vue/require-prop-types */
  props: ['value', 'isConsistValue'],
  data () {
    return {
      jsonEditor: false
    }
  },
  watch: {
    value: function (thisValue) {
      const editorValue = this.jsonEditor.getValue()
      console.log('watch value' + editorValue)
      // console.
      if (thisValue !== editorValue) {
        this.jsonEditor.setValue(thisValue)
      }
    }
  },
  mounted () {
    this.jsonEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
      lineNumbers: true,
      mode: 'application/json',
      gutters: ['CodeMirror-lint-markers'],
      theme: 'rubyblue',
      scrollbarStyle: 'native',
      lint: true,
      height: 'auto'
    })
    this.jsonEditor.setSize('auto', '500px')

    this.jsonEditor.setValue(this.value)
    this.jsonEditor.on('change', cm => {
      this.$emit('changed', cm.getValue())
      this.$emit('input', cm.getValue())
    })
  },
  methods: {
    getValue () {
      return this.jsonEditor.getValue()
    }
  }
}
</script>

<style lang="scss" scoped>
.json-editor {
  height: 100%;
  position: relative;

  ::v-deep {
    .CodeMirror {
      height: auto;
      min-height: 300px;
      z-index: 1500;
    }

    .CodeMirror-scroll {
      min-height: 300px;
    }

    .cm-s-rubyblue span.cm-string {
      color: #F08047;
    }
  }
}
</style>
