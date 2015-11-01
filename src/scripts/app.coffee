
App = App or {}

App.init = ->

  $.notify.defaults
    className: 'success'

  App.codeRunner()
  App.posChooser()

  # download links
  $(document).on 'click', "a[data-download]", (e) ->
    return true unless $.compile
    url = $(@).attr 'href'
    name = $(@).attr('data-filename')
    $.compile.fetch('core', url).download('core', name)
    ga 'send', 'event', 'download', name
    e.preventDefault()
    return false

  $(document).on 'click', "a[data-minify-download]", (e) ->
    return true unless $.compile
    url = $(@).attr 'href'
    name = $(@).attr('data-filename')
    $.compile.
        error((msg) -> alert msg).
        fetch('core', url).
        run('uglify', { src: 'core', dest: 'core-min' }).
        download('core-min', name).
        get('core-min', -> ga 'send', 'event', 'download', name)
    e.preventDefault()
    return false

  mouseDemo = $ ".demo-mouse"
  $('.summary').hover ->
    mouseDemo.addClass "over"
  , ->
    mouseDemo.removeClass "over"

$ App.init
