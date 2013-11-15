module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // minify the javascript
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dist: {
        files: {
            'dist/js/ACRestUpload.min.js': 'src/js/ACRestUpload.js',
            'dist/js/ACRestUploadFallbackForm.min.js': 'src/js/ACRestUploadFallbackForm.js'
        }
      }
    },
    // check for errors
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    // copy the css over
    copy: {
      main: {
        files: [
          {expand: true, src: ['src/css/*'], dest: 'dist/css/', filter: 'isFile', flatten:true}, // copy all css files over
          {src:['src/js/json3.min.js'], dest:'dist/js/json3.min.js', flatten:true}
        ]
      }
    },
    // make a zipfile with the contents of dist
    compress: {
      main: {
        options: {
          archive: './package/staticresources/<%= pkg.name %>.zip'
        },
        files: [
          {src: ['**/*'], cwd:'dist/',expand:true}, // includes files in path
        ]
      }
    }

  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Load the plugin to copy files
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Load js hint, detects issues with the javascript
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Load compress for creating the zip file
  grunt.loadNpmTasks('grunt-contrib-compress');

  // Default task(s).
  grunt.registerTask('default', ['uglify','copy', 'compress']);

  // Testing Tasks
  grunt.registerTask('test', ['jshint']);  

};