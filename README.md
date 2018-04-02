This template is based on [OptimizedHTML 4: Startup HTML template based on Gulp & Bootstrap 4](https://github.com/agragregra/OptimizedHTML-4).

### To install all the things:

* install the latest version of **Node.js**
* install **Git**, if it's not installed
* install **Bower** in npm globally `npm i -g bower`
* install **Gulp** in npm globally `npm i -g gulp`
* run `npm i` to install packages

Because of this template now is based on Bootstrap 4:

* install **jQuery** via **Bower** [watch how](https://jquery.com/download/#downloading-jquery-using-bower)
* install **Bootstrap 4** via **Bower** using command `bower install bootstrap4`
* install **Normalize CSS** via **Bower** using command `bower install normalize-css`

Note: to update packages in **package.json** run:

1. `npm i -g npm-check-updates`
2. `ncu -u` 

**OR if `ncu -u` didn't process well**

3. `ncu --loglevel verbose --packageFile package.json`

Now everything is done.

### Main tasks you can run:

* `gulp` (default task `gulp watch`): starts server and start watching your site and reload on file changes
* you can check all the tasks in **gulpfile.js**

### TODOS

* [x] Fonts processing
* [x] JS libs processing
