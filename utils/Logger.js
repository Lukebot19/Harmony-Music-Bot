const moment = require('moment');
const chalk = require('chalk');
// import chalk from "chalk"
const util = require('util');

module.exports = class Logger {
    static log(content, {color= "blue", tag = "Log"} = {}) {
        this.write(content, {color, tag});
    }

    static warn(content, {color = "orange", tag = "Warn"} = {}) {
        this.write(content, {color, tag});
    }

    static error(content, {color = "red", tag = "Error"} = {}) {
        this.write(content, {color, tag});
    }

    static write(content, {color = "grey", tag = "Log", error = false} = {}) {
        const timestamp = chalk.cyan(
            `[${moment().format("YYYY-MM-DD HH:mm:ss")}]:`
        );
        const levelTag = chalk.bold(`[${tag}]:`);
        const text = chalk[color](this.clean(content));
        const stream = error ? process.stderr : process.stdout;
        stream.write(`${timestamp} ${levelTag} ${text}\n`);
    }

    static clean(item) {
        if (typeof item === "string") return item;
        const cleaned = util.inspect(item, {depth: Infinity});
        return cleaned;
    }
};