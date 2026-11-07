# Sharing design without account

_Started 2026-10-03 16:49 UTC_

---

## User

Can I share this design with someone without a Claude account and what will it open in if I share a link?

## Assistant

Yes. The easiest way is a standalone HTML file:

- I can package the design into one self-contained `.html` file with all data, fonts and scripts included.
- You send the file however you like (email, Slack, Drive). The recipient opens it in any web browser (Chrome, Safari, Firefox, Edge). They don't need a Claude account, and it works offline.

About links:
- I can also make a public link to that file. It opens in the recipient's browser with no login, but it expires after about an hour, so it's for quick previews, not long-term sharing.
- Sharing the project itself is different: the recipient needs an account with access to view it.

Should I create the standalone file of "The Lineage Atlas" for you to download?

## User

I want to share in signal so whatever way best works give me a version to share .

## Assistant

_[tool: read_skill_prompt]_

_[tool: read_file]_

_[tool: grep]_

_[tool: run_script]_

_[tool: super_inline_html]_

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: delete_file]_

_[tool: present_fs_item_for_download]_

Download the file above (743 KB) and send it in Signal as an attachment.

- **On a computer:** the recipient double-clicks it and it opens in their browser.
- **On a phone:** Signal's built-in preview may not run the map. They should tap Share → "Save to Files" (or Download on Android), then open the file in Safari or Chrome.

## User

From iOS files  it loads all the is vidisal files, lets make this as easy as possible to share on mobile

## User

I'm getting the feeling thatThis doesn't work every time I download it into the iOS files it's just like a bunch of different files as opposed to a standalone HTML file there's no way that's convenient to share to someone through a messaging app like signal

## Assistant

You're right. On iOS, an HTML file sent as an attachment opens in a preview that often doesn't run the interactive map, so it can look broken or like loose pieces. A file attachment won't be reliably easy on phones.

The easiest option on mobile is a **permanent web link**: you paste it in Signal, they tap it, and it opens in Safari. I can't host a permanent link myself (mine expire after about an hour), but you can in about 2 minutes for free:

1. On a computer, download `The Lineage Atlas.html` from the card above.
2. Go to **app.netlify.com/drop** and create a free account (without one, the site is deleted after an hour).
3. Drag the file onto the page. You'll get a link like `something.netlify.app`.
4. Paste that link into Signal.

Netlify serves `index.html` at the main address, so if the link opens a blank page, rename the file to `index.html` and drag it in again.

Want me to make an `index.html` copy now so it's ready to drop in?

## User

We can’t share the Claude design permalink version?

## Assistant

No, not without an account. The project's own link only opens for people signed in with access to this project. Anyone else hits a login page.

For a link that anyone can tap in Signal with no login, you'll need a free host like Netlify Drop. I can make that `index.html` copy so it's ready to drop in.

