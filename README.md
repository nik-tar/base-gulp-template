### To install all the things:

* install the latest version of **Node.js**
* install **Git**, if it's not installed
* install **Bower** in npm globally `npm i -g bower`
* install **Gulp** in npm globally `npm i -g gulp`
* run `npm i` to install packages
* run `bower install` to install plugins from **bower.json**

Note: to update packages in **package.json** run:

1. `npm i -g npm-check-updates`
2. `ncu -u` 

**OR if `ncu -u` didn't worked well**

3. `ncu --loglevel verbose --packageFile package.json`

Now everything is done.

### Main tasks you can run:

* `gulp` (default task `gulp watch`): starts server and start watching your site and reload on file changes
* `gulp build`: cleans `/dist/` directory and compiles code
* you can check all the tasks in **gulpfile.js**

### TODOS

* [ ] Fonts processing
* [ ] JS libs processing
