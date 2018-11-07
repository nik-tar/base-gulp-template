This template is based on [OptimizedHTML 4: Startup HTML template based on Gulp & Bootstrap 4](https://github.com/agragregra/OptimizedHTML-4).

### To install all the things:

* install the latest version of **Node.js**
* install **Git**, if it's not installed
* install **Bower** in npm globally [like here](https://bower.io/#install-bower)
* install **Gulp** in npm globally [like here](https://gulpjs.com/docs/en/getting-started/quick-start)
* run `npm i` to install packages

Note: to update packages in **package.json** run:

1. `npm i -g npm-check-updates`
2. `ncu -u`

**OR if `ncu -u` didn't process well**

3. `ncu --loglevel verbose --packageFile package.json`

Now everything is done.

### Main tasks you can run:

* `gulp` (default task `gulp watch`): starts server and start watching your site and reload on file changes
* you can check all the tasks in **gulpfile.js**
