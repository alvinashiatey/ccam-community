const nunjucks = require("nunjucks");
import { Application } from 'express'

function setUpNunjucks(app: Application) {
    const env = nunjucks.configure("views", {
        autoescape: true,
        express: app,
    });

    // register custom helper
    env.addFilter("shorten", function (str, count) {
        return str.slice(0, count || 5);
    });
    // ... your other filters here
}

export default setUpNunjucks;