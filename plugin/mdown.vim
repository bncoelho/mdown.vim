function! s:initCommands()
  command! -buffer Mpreview call s:staticPreview()
  command! -buffer Mpreviewlive call s:livePreview()
  command! -buffer Mpreviewoff call s:clearLiveAutoCommands()
endfunction

function! s:clearLiveAutoCommands()
  au! CursorHold,CursorHoldI,CursorMoved,CursorMovedI <buffer>
  au! CursorHold,BufWrite,InsertLeave <buffer>
  au! BufWrite,InsertLeave <buffer>
endfunction

function! s:staticPreview()
  call g:MdownPreview()
  call s:clearLiveAutoCommands()
  au! BufWrite,InsertLeave <buffer> call g:MdownReload()
endfunction

function! s:livePreview()
  call g:MdownPreview()
  au! CursorHold,CursorHoldI,CursorMoved,CursorMovedI <buffer> call g:MdownReload()
  au! CursorHold,BufWrite,InsertLeave <buffer> call g:MdownReload()
  au! BufWrite,InsertLeave <buffer> call g:MdownReload()
endfunction

autocmd! FileType markdown call s:initCommands()
