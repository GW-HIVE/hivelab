# Making/Adding Content

- [Editing or Adding New Static Global Pages](#editing-or-adding-new-static-global-pages)
- [Editing or Adding to the Menu](#editing-or-adding-to-the-menu)

## Editing or Adding New Static Global Pages 
The files corresponding to static global pages are under /app/public/html/, and all you
need to do is edit or add new file. When you create a new file, make sure it is named
page.$pageId.html where $pageId is a one word ID for your page. For example, if you 
want to create a new page for GFKB, you can create page.gfkb.html and this page
will be accessible at https://hivelab.biochemistry.gwu.edu/gfkb 

Note that all the files for static pages should have the tag \<hivelabtag\> in their
first line. 

## Editing or Adding to the Menu
The menu is controlled by the JSON file /app/src/components/global/config.json, and 
one can edit this JSON file to add/edit to the menu structure.