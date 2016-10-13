let g:mdown_theme = get(g:, 'mdown_theme', "Avenue")

function! s:initCommands()
  command! -buffer Mpreview call s:staticPreview()
  command! -buffer Mpreviewlive call s:livePreview()
  command! -buffer Mpreviewoff call s:clearLiveAutoCommands()
  command! -nargs=1 Mdowntheme call s:changeTheme(<f-args>)
endfunction

function! s:changeTheme(theme)
  let g:mdown_theme=a:theme
  call g:MdownReload(g:mdown_theme)
endfunction

function! s:clearLiveAutoCommands()
  au! CursorHold,CursorHoldI,CursorMoved,CursorMovedI <buffer>
  au! CursorHold,BufWrite,InsertLeave <buffer>
  au! BufWrite,InsertLeave <buffer>
endfunction

function! s:staticPreview()
  call g:MdownPreview(g:mdown_theme)
  call s:clearLiveAutoCommands()
  au! BufWrite,InsertLeave <buffer> call g:MdownReload()
endfunction

function! s:livePreview()
  call g:MdownPreview(g:mdown_theme)
  au! CursorHold,CursorHoldI,CursorMoved,CursorMovedI <buffer> call g:MdownReload()
  au! CursorHold,BufWrite,InsertLeave <buffer> call g:MdownReload()
endfunction

autocmd! FileType markdown call s:initCommands()
